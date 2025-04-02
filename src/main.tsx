
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

// Let's add some debug logging to confirm main.tsx is executing
console.log("Main.tsx executing - initializing application");

// Add error handler to catch rendering errors
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  
  try {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log("App successfully rendered");
  } catch (error) {
    console.error("Error rendering the application:", error);
  }
}
