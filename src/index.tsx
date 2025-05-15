import { h, render } from "preact";
import App from "./App";
import { getBaseUrl } from "../base-url";

// Set up a global variable for the base URL
(window as any).__BASE_URL__ = getBaseUrl();

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app");
  if (root) {
    render(<App baseUrl={(window as any).__BASE_URL__} />, root);
  }
});
