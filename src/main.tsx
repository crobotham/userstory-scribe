
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Let's add some debug logging to confirm main.tsx is executing
console.log("Main.tsx executing - initializing application");

createRoot(document.getElementById("root")!).render(<App />);
