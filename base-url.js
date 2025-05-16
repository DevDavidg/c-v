export const getBaseUrl = () => {
  // In development, use an empty string
  if (process.env.NODE_ENV === "development") {
    return "";
  }

  // In production, use a hardcoded path for GitHub Pages
  return "/c-v/";
};
