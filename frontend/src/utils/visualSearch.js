import { getImageUrl } from "./media";

const signatureCache = new Map();
const HASH_SIZE = 16;
const HISTOGRAM_BINS = 4;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const createCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const drawCenterCrop = (image, size = HASH_SIZE) => {
  const canvas = createCanvas(size, size);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const minSide = Math.min(image.naturalWidth || image.width, image.naturalHeight || image.height);
  const sourceX = ((image.naturalWidth || image.width) - minSide) / 2;
  const sourceY = ((image.naturalHeight || image.height) - minSide) / 2;

  context.drawImage(image, sourceX, sourceY, minSide, minSide, 0, 0, size, size);
  return context.getImageData(0, 0, size, size);
};

const getGrayPixels = (data) => {
  const grayscale = [];
  for (let index = 0; index < data.length; index += 4) {
    grayscale.push((data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114) / 255);
  }
  return grayscale;
};

const buildAverageHash = (grayscale) => {
  const average = grayscale.reduce((sum, value) => sum + value, 0) / (grayscale.length || 1);
  return grayscale.map((value) => (value >= average ? 1 : 0));
};

const buildDifferenceHash = (grayscale, size = HASH_SIZE) => {
  const bits = [];
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size - 1; column += 1) {
      const current = grayscale[row * size + column];
      const next = grayscale[row * size + column + 1];
      bits.push(next >= current ? 1 : 0);
    }
  }
  return bits;
};

const buildHistogram = (data) => {
  const histogram = new Array(HISTOGRAM_BINS ** 3).fill(0);
  const totalPixels = data.length / 4 || 1;

  for (let index = 0; index < data.length; index += 4) {
    const redBin = Math.min(HISTOGRAM_BINS - 1, Math.floor((data[index] / 256) * HISTOGRAM_BINS));
    const greenBin = Math.min(HISTOGRAM_BINS - 1, Math.floor((data[index + 1] / 256) * HISTOGRAM_BINS));
    const blueBin = Math.min(HISTOGRAM_BINS - 1, Math.floor((data[index + 2] / 256) * HISTOGRAM_BINS));
    const bucket = redBin * HISTOGRAM_BINS * HISTOGRAM_BINS + greenBin * HISTOGRAM_BINS + blueBin;
    histogram[bucket] += 1;
  }

  return histogram.map((count) => count / totalPixels);
};

const buildEdgeProfile = (grayscale, size = HASH_SIZE) => {
  const profile = [];
  for (let row = 0; row < size - 1; row += 1) {
    for (let column = 0; column < size - 1; column += 1) {
      const current = grayscale[row * size + column];
      const right = grayscale[row * size + column + 1];
      const below = grayscale[(row + 1) * size + column];
      profile.push(Math.abs(current - right) + Math.abs(current - below));
    }
  }

  const max = Math.max(...profile, 1);
  return profile.map((value) => value / max);
};

const buildSignature = (image) => {
  const { data } = drawCenterCrop(image, HASH_SIZE);
  const grayscale = getGrayPixels(data);

  return {
    averageHash: buildAverageHash(grayscale),
    differenceHash: buildDifferenceHash(grayscale),
    histogram: buildHistogram(data),
    edgeProfile: buildEdgeProfile(grayscale),
  };
};

const compareBitArrays = (left, right) => {
  const total = Math.min(left.length, right.length) || 1;
  let same = 0;

  for (let index = 0; index < total; index += 1) {
    if (left[index] === right[index]) {
      same += 1;
    }
  }

  return same / total;
};

const compareVectors = (left, right) => {
  const total = Math.min(left.length, right.length) || 1;
  let distance = 0;

  for (let index = 0; index < total; index += 1) {
    distance += (left[index] - right[index]) ** 2;
  }

  return 1 - Math.min(1, Math.sqrt(distance / total));
};

const calculateSimilarity = (left, right) => {
  const averageHashScore = compareBitArrays(left.averageHash, right.averageHash);
  const differenceHashScore = compareBitArrays(left.differenceHash, right.differenceHash);
  const histogramScore = compareVectors(left.histogram, right.histogram);
  const edgeScore = compareVectors(left.edgeProfile, right.edgeProfile);

  return {
    score:
      averageHashScore * 0.28 +
      differenceHashScore * 0.34 +
      histogramScore * 0.24 +
      edgeScore * 0.14,
    averageHashScore,
    differenceHashScore,
    histogramScore,
    edgeScore,
  };
};

export const getFileSignature = async (file) => {
  const dataUrl = await fileToDataUrl(file);
  const image = await loadImage(dataUrl);
  return buildSignature(image);
};

export const getProductSignature = async (product) => {
  const cacheKey = `${product._id}:${product.image}`;
  if (signatureCache.has(cacheKey)) {
    return signatureCache.get(cacheKey);
  }

  try {
    const image = await loadImage(getImageUrl(product.image));
    const signature = buildSignature(image);
    signatureCache.set(cacheKey, signature);
    return signature;
  } catch (error) {
    return null;
  }
};

export const findVisualMatches = async (file, products) => {
  const targetSignature = await getFileSignature(file);

  const ranked = (
    await Promise.all(
      products
        .filter((product) => product.image)
        .map(async (product) => {
          const productSignature = await getProductSignature(product);
          if (!productSignature) {
            return null;
          }

          const similarity = calculateSimilarity(targetSignature, productSignature);

          return {
            product,
            ...similarity,
          };
        })
    )
  )
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);

  const topScore = ranked[0]?.score || 0;
  const topMatch = ranked[0];
  const secondScore = ranked[1]?.score || 0;

  const isConfidentTopMatch =
    topMatch &&
    topMatch.score >= 0.72 &&
    topMatch.differenceHashScore >= 0.68 &&
    topMatch.averageHashScore >= 0.66 &&
    (topMatch.histogramScore >= 0.62 || topMatch.edgeScore >= 0.6);

  const hasReasonableSeparation = topScore - secondScore >= 0.03 || topScore >= 0.8;

  if (!isConfidentTopMatch || !hasReasonableSeparation) {
    return [];
  }

  const adaptiveThreshold = Math.max(0.68, topScore - 0.08);
  return ranked
    .filter(
      (item) =>
        item.score >= adaptiveThreshold &&
        item.differenceHashScore >= 0.62 &&
        item.averageHashScore >= 0.6
    )
    .slice(0, 8);
};
