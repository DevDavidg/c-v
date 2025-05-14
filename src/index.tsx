import { h, render } from "preact";
import App from "./App";

// Simple render approach
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app");
  if (root) {
    render(<App />, root);
  }
});
