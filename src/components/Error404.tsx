import { Link } from 'react-router-dom';

export default function Error404() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '20px',
      fontFamily: '"Poppins", "Segoe UI", sans-serif',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Icono de Tarjeta Roja Interactiva */}
      <div style={{
        width: '100px',
        height: '140px',
        backgroundColor: '#ff4d4f',
        borderRadius: '8px',
        boxShadow: '0 10px 20px rgba(255, 77, 79, 0.3)',
        marginBottom: '30px',
        transform: 'rotate(-10deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ fontSize: '40px' }}>⚠️</span>
      </div>

      {/* Textos Informativos */}
      <h1 style={{ fontSize: '64px', color: '#1a1a1a', margin: '0 0 10px 0', fontWeight: '800' }}>404</h1>
      <h2 style={{ fontSize: '24px', color: '#ff4d4f', margin: '0 0 15px 0' }}>¡Fuera de juego! Página no encontrada</h2>
      <p style={{ fontSize: '16px', color: '#666', maxWidth: '450px', lineHeight: '1.6', marginBottom: '35px' }}>
        La jugada salió mal. La cancha o sección que estás intentando buscar no existe, fue movida o el partido ya terminó.
      </p>

      {/* Botón de Retorno */}
      <Link 
        to="/" 
        style={{
          padding: '14px 28px',
          backgroundColor: '#2e7d32',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '30px',
          fontWeight: '600',
          fontSize: '16px',
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1b5e20'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2e7d32'}
      >
        Volver al Inicio ⚽
      </Link>
    </div>
  );
}
