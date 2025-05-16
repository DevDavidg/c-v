const fs = require("fs");
const path = require("path");

// Ensure dist directory exists
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist", { recursive: true });
}

// Create the 404.html file with GitHub Pages SPA routing script
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Page Not Found</title>
  <script>
    // Single Page Apps for GitHub Pages
    // MIT License
    // https://github.com/rafgraph/spa-github-pages
    var pathSegmentsToKeep = 1; // Keep the first segment ("/c-v/")
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
  <h1>Page Not Found</h1>
  <p>Redirecting to home page...</p>
</body>
</html>`;

fs.writeFileSync(path.join("dist", "404.html"), html);
console.log("Created 404.html for GitHub Pages SPA routing");

// Create .nojekyll file to disable Jekyll processing
fs.writeFileSync(path.join("dist", ".nojekyll"), "");
console.log("Created .nojekyll file to disable Jekyll processing");
