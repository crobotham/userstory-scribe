
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Let's add some debug logging to confirm main.tsx is executing
console.log("Main.tsx executing - initializing application");

// Ensure we have a valid root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Could not find root element. Make sure there is a div with id 'root' in index.html");
  throw new Error("Root element not found");
}

// Create root with proper error boundaries
try {
  createRoot(rootElement).render(<App />);
  console.log("Application rendered successfully");
} catch (error) {
  console.error("Error rendering application:", error);
}
