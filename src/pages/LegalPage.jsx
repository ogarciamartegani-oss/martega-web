export default function LegalPage({ kicker, title, updated, children }) {
  return (
    <article className="legal-page">
      <header>
        <p className="eyebrow"><span /> {kicker}</p>
        <h1>{title}</h1>
        <p>Última actualización: {updated}</p>
      </header>
      <div className="legal-content">{children}</div>
    </article>
  )
}
