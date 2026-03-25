export const getImageUrl = (path) => {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `http://localhost:4000/uploads/${path}`;
};
