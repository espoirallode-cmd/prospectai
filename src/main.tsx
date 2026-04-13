import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Error logging for debugging white screen
window.onerror = function(message, source, lineno, colno, error) {
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100%';
  errorDiv.style.background = 'red';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '20px';
  errorDiv.style.zIndex = '9999';
  errorDiv.innerText = `L'application a planté ! Erreur: ${message}\nLigne: ${lineno}\nFichier: ${source}`;
  document.body.appendChild(errorDiv);
  return false;
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  document.body.innerHTML = '<div style="color:red;padding:20px;">ERREUR CRITIQUE: Element #root introuvable dans le HTML !</div>';
} else {
  createRoot(rootElement).render(<App />);
}
