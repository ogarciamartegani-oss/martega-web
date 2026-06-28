import { Link } from 'react-router-dom'

export default function Brand({ inverse = false }) {
  return (
    <Link className={`brand ${inverse ? 'brand--inverse' : ''}`} to="/" aria-label="Martega, inicio">
      {inverse ? (
        <>
          <span className="brand__word">MARTE<span>GA</span></span>
          <span className="brand__descriptor">Instalaciones y mantenimiento</span>
        </>
      ) : (
        <img
          src="/logo.jpeg"
          alt="Martega · Instalaciones y Mantenimiento de Edificios"
          className="brand__logo-img"
          width="160"
          height="44"
        />
      )}
    </Link>
  )
}
