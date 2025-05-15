export const getBaseUrl = () => {
  // In development, use an empty string
  if (process.env.NODE_ENV === "development") {
    return "";
  }

  // In production, use the appropriate base path for GitHub Pages
  // This assumes the PUBLIC_PATH is correctly set during the build
  return process.env.PUBLIC_PATH || "/c-v/";
};
