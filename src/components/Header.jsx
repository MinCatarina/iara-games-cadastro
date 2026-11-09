export default function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <a className="brand" href="./" aria-label="Iara Games - Cadastro de desenvolvedor">
          <img src="./images/logo-iara-games.svg" alt="" width="40" height="40" />
          <span>Iara Games</span>
        </a>
        <a className="btn btn--ghost" href="https://mincatarina.github.io/Iara-Games/">
          Voltar para o site
        </a>
      </div>
    </header>
  );
}
