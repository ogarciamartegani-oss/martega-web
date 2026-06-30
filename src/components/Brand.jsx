import { Link } from 'react-router-dom'

export default function Brand({ inverse = false }) {
  return (
    <Link className={`brand ${inverse ? 'brand--inverse' : ''}`} to="/" aria-label="Martega, inicio">
      <img
        src="/logo.jpeg"
        alt="Martega · Instalaciones y Mantenimiento de Edificios"
        className="brand__logo-img"
        width="160"
        height="44"
      />
    </Link>
  )
}
