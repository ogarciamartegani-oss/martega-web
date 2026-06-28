import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found">
      <span>404</span>
      <h1>Esta zona aún<br />no está construida.</h1>
      <Link className="button button--primary" to="/">Volver al inicio</Link>
    </section>
  )
}
