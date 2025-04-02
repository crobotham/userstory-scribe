
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Let's add comprehensive debug logging to confirm main.tsx is executing
console.log("Main.tsx executing - initializing application");

// Add global error handler to log and display errors
window.addEventListener('error', (event) => {
  console.error("Global error caught:", {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// Ensure we have a valid root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Could not find root element. Make sure there is a div with id 'root' in index.html");
  throw new Error("Root element not found");
}

// Create root with proper error boundaries
try {
  // Wrap the rendering in a try-catch to handle any errors during initial render
  const root = createRoot(rootElement);
  
  root.render(<App />);
  console.log("Application rendered successfully");
} catch (error) {
  console.error("Error rendering application:", error);
  
  // Attempt to render a fallback UI if the main app fails
  try {
    const fallbackEl = document.createElement('div');
    fallbackEl.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Something went wrong</h2>
        <p>The application failed to start. Please check the console for details.</p>
      </div>
    `;
    rootElement.appendChild(fallbackEl);
  } catch (fallbackError) {
    console.error("Even the fallback UI failed:", fallbackError);
  }
}
