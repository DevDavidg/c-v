import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #4a6cf7;
    --secondary-color: #ff6b6b;
    --accent-color: #bb6bd9;
    --background-light: #f8fafc;
    --background-dark: #0f172a;
    --text-light: #64748b;
    --text-dark: #1e293b;
    --card-light: #ffffff;
    --card-dark: #1e293b;
    --card-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
    --transition-slow: 0.5s ease;
    --transition-normal: 0.3s ease;
    --transition-fast: 0.2s ease;
    --border-radius: 12px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 48px;
    --font-primary: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    --font-heading: 'Montserrat', 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: var(--spacing-xl);
  }

  body {
    font-family: var(--font-primary);
    background-color: var(--background-light);
    color: var(--text-dark);
    line-height: 1.6;
    transition: background-color var(--transition-normal), color var(--transition-normal);
    overflow-x: hidden;
  }

  body.dark-mode {
    background-color: var(--background-dark);
    color: white;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
  }

  p {
    margin-bottom: var(--spacing-md);
  }

  /* Scroll bar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--accent-color);
  }

  /* Loading spinner */
  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s ease-in-out infinite;
    margin-bottom: var(--spacing-md);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Error message */
  .error-message {
    color: var(--secondary-color);
    background-color: rgba(255, 107, 107, 0.1);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    border-left: 4px solid var(--secondary-color);
    margin: var(--spacing-md);
  }

  /* SVG item styling */
  .animated-svg-item {
    margin-bottom: var(--spacing-xl);
    transition: opacity var(--transition-slow), transform var(--transition-slow);
  }

  .svg-title {
    font-size: 1.8rem;
    margin-bottom: var(--spacing-sm);
    color: var(--primary-color);
    text-align: center;
  }

  .svg-description {
    color: var(--text-light);
    text-align: center;
    max-width: 600px;
    margin: 0 auto var(--spacing-lg);
    font-size: 1rem;
  }

  body.dark-mode .svg-description {
    color: rgba(255, 255, 255, 0.8);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    :root {
      --spacing-xl: 32px;
    }

    .svg-title {
      font-size: 1.5rem;
    }

    .svg-description {
      font-size: 0.9rem;
    }
  }

  /* Animation keyframes */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export default GlobalStyle;

