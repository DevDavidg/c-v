export const getBaseUrl = () => {
  // In development, use an empty string
  if (process.env.NODE_ENV === "development") {
    return "";
  }

  // In production, use the path from the environment
  return process.env.PUBLIC_PATH || "/";
};
