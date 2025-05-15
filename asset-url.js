import { getBaseUrl } from "./base-url";

export const getAssetUrl = (assetPath) => {
  const normalizedPath = assetPath.startsWith("/")
    ? assetPath
    : `/${assetPath}`;

  return `${getBaseUrl()}${normalizedPath.replace(/^\//, "")}`;
};
