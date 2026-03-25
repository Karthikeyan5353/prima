export const getImageUrl = (path) => {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${import.meta.env.VITE_API_URL}/uploads/${path}`;
};
