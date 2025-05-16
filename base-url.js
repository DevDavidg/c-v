export const getBaseUrl = () => {
  // Use the PUBLIC_PATH environment variable if available
  if (typeof process.env.PUBLIC_PATH === "string") {
    return process.env.PUBLIC_PATH;
  }

  // In development, use an empty string
  if (process.env.NODE_ENV === "development") {
    return "";
  }

  // Default fallback for production (GitHub Pages)
  return "/c-v/";
};
