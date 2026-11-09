import { regionByUf } from "../utils/regions";

export default function SuccessCard({ data, onNew }) {
  const region = regionByUf(data.uf);

  return (
    <section className="success" role="status" aria-live="polite">
      <div className="success__icon" aria-hidden="true">✓</div>
      <h2>Cadastro recebido!</h2>
      <p className="success__lead">
        Obrigado, <strong>{data.nome}</strong>! Nossa equipe vai analisar o jogo{" "}
        <strong>{data.jogo}</strong> e entrar em contato pelo e-mail informado.
      </p>

      <dl className="summary">
        <div><dt>E-mail</dt><dd>{data.email}</dd></div>
        <div><dt>Telefone</dt><dd>{data.telefone}</dd></div>
        <div>
          <dt>Endereço</dt>
          <dd>
            {data.logradouro}, {data.numero}
            {data.complemento ? ` – ${data.complemento}` : ""}
            <br />
            {data.bairro} · {data.cidade}/{data.uf} · CEP {data.cep}
          </dd>
        </div>
        <div><dt>Região</dt><dd>{region || "—"}</dd></div>
        <div><dt>Gênero do jogo</dt><dd>{data.genero}</dd></div>
      </dl>

      <button type="button" className="btn btn--primary" onClick={onNew}>
        Fazer novo cadastro
      </button>
    </section>
  );
}
