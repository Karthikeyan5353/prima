export const getDisplayPrice = (product) => product?.salePrice || product?.price || 0;

export const getDiscountPercent = (product) => {
  if (!product?.salePrice || !product?.price || product.salePrice >= product.price) {
    return 0;
  }

  return Math.round(((product.price - product.salePrice) / product.price) * 100);
};
