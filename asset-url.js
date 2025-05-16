export const getAssetUrl = (assetPath) => {
  const baseUrl = getBaseUrl();
  const normalizedPath = assetPath.startsWith("/")
    ? assetPath.slice(1)
    : assetPath;

  return `${baseUrl}${normalizedPath}`;
};
