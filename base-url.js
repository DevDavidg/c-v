export const getBaseUrl = () => {
  // In development, use an empty string
  if (process.env.NODE_ENV === "development") {
    return "";
  }

  // In production, use the exact path for GitHub Pages
  // This must match the repository name
  return "/c-v/";
};
