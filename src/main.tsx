import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // <-- Sin extensión .tsx para que TypeScript no falle
import './index.css'
import { CarritoProvider } from './context/CarritoContext'

// Inicialización limpia y tipada nativamente asegurando el tipado del DOM
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CarritoProvider>
    <App />
    </CarritoProvider>
  </React.StrictMode>,
)
