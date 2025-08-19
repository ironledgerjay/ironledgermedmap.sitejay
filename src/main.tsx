import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './api/payments.ts' // Initialize mock API for development

createRoot(document.getElementById("root")!).render(<App />);
