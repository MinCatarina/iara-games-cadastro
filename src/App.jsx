import { useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Field from "./components/Field";
import SuccessCard from "./components/SuccessCard";
import useCep from "./hooks/useCep";
import { maskCep, maskPhone, onlyDigits } from "./utils/masks";
import { genres, validateAll } from "./utils/validators";
import { regionByUf } from "./utils/regions";

const emptyForm = {
  nome: "", email: "", telefone: "",
  cep: "", logradouro: "", bairro: "", cidade: "", uf: "", numero: "", complemento: "",
  jogo: "", genero: "", descricao: "",
};

export default function App() {
  const [values, setValues] = useState(emptyForm);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const cep = useCep();
  const logradouroRef = useRef(null);
  const numeroRef = useRef(null);

  const errors = useMemo(() => validateAll(values), [values]);

  const set = (field, value) => setValues((prev) => ({ ...prev, [field]: value }));
  const touch = (field) => setTouched((prev) => ({ ...prev, [field]: true }));
  // Só mostra erro depois que o usuário passou pelo campo.
  const errorOf = (field) => (touched[field] ? errors[field] : "");
  const isValid = (field) => touched[field] && !errors[field];

  const handleChange = (field, mask) => (e) => set(field, mask ? mask(e.target.value) : e.target.value);
  const handleBlur = (field) => () => touch(field);

  // ---- Integração com a API ViaCEP ----
  const handleCepChange = async (e) => {
    const masked = maskCep(e.target.value);
    setValues((prev) => ({ ...prev, cep: masked, ...(onlyDigits(masked).length < 8 ? { logradouro: "", bairro: "", cidade: "", uf: "" } : {}) }));

    if (onlyDigits(masked).length < 8) {
      cep.reset();
      return;
    }

    const address = await cep.lookup(masked); // dispara a consulta ao completar 8 dígitos
    if (address) {
      setValues((prev) => ({ ...prev, ...address }));
      touch("cep");
      // leva o usuário direto ao próximo campo que falta preencher
      setTimeout(() => (address.logradouro ? numeroRef : logradouroRef).current?.focus(), 0);
    } else {
      setValues((prev) => ({ ...prev, logradouro: "", bairro: "", cidade: "", uf: "" }));
      touch("cep");
    }
  };

  const cepMessage = () => {
    if (cep.status === "loading") return { hint: "Buscando endereço..." };
    if (cep.status === "error") return { error: cep.error };
    if (cep.status === "success" && values.cidade) {
      return { hint: `Endereço encontrado: ${values.cidade}/${values.uf} · região ${regionByUf(values.uf)}`, valid: true };
    }
    return { error: errorOf("cep"), hint: "Digite o CEP e preenchemos o endereço para você." };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(emptyForm).map((f) => [f, true])));
    const firstError = Object.entries(errors).find(([, msg]) => msg);
    if (firstError) {
      document.getElementById(firstError[0])?.focus();
      return;
    }
    setSubmitted(values);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNew = () => {
    setValues(emptyForm);
    setTouched({});
    setSubmitted(null);
    cep.reset();
  };

  const cepInfo = cepMessage();

  return (
    <>
      <Header />
      <main className="container main">
        <section className="intro">
          <h1>Cadastro de desenvolvedor</h1>
          <p>
            Quer divulgar seu jogo na Iara Games? Preencha os dados abaixo. O endereço é completado
            automaticamente a partir do seu CEP.
          </p>
        </section>

        {submitted ? (
          <SuccessCard data={submitted} onNew={handleNew} />
        ) : (
          <form className="form" onSubmit={handleSubmit} noValidate>
            <fieldset className="group">
              <legend>1. Quem é você</legend>
              <div className="row">
                <Field id="nome" label="Desenvolvedor ou estúdio" placeholder="Ex.: Estúdio Boto Cor-de-Rosa"
                  value={values.nome} onChange={handleChange("nome")} onBlur={handleBlur("nome")}
                  error={errorOf("nome")} valid={isValid("nome")} autoComplete="organization" />
                <Field id="email" label="E-mail" type="email" placeholder="voce@email.com"
                  value={values.email} onChange={handleChange("email")} onBlur={handleBlur("email")}
                  error={errorOf("email")} valid={isValid("email")} autoComplete="email" />
              </div>
              <Field id="telefone" label="Telefone" type="tel" placeholder="(11) 98765-4321" inputMode="numeric"
                value={values.telefone} onChange={handleChange("telefone", maskPhone)} onBlur={handleBlur("telefone")}
                error={errorOf("telefone")} valid={isValid("telefone")} autoComplete="tel" />
            </fieldset>

            <fieldset className="group">
              <legend>2. Onde você está</legend>
              <div className="row row--cep">
                <Field id="cep" label="CEP" placeholder="00000-000" inputMode="numeric" maxLength={9}
                  value={values.cep} onChange={handleCepChange} onBlur={handleBlur("cep")}
                  error={cepInfo.error} hint={cepInfo.hint} valid={cepInfo.valid} autoComplete="postal-code" />
                <div className="status" aria-live="polite">
                  {cep.status === "loading" && <span className="spinner" aria-label="Consultando CEP" />}
                </div>
              </div>

              <div className="row">
                <Field id="logradouro" label="Endereço" ref={logradouroRef}
                  value={values.logradouro} onChange={handleChange("logradouro")} onBlur={handleBlur("logradouro")}
                  error={errorOf("logradouro")} valid={isValid("logradouro")} autoComplete="address-line1" />
                <Field id="bairro" label="Bairro"
                  value={values.bairro} onChange={handleChange("bairro")} onBlur={handleBlur("bairro")}
                  error={errorOf("bairro")} valid={isValid("bairro")} />
              </div>

              <div className="row row--3">
                <Field id="cidade" label="Cidade" value={values.cidade} readOnly placeholder="Preenchida pelo CEP" />
                <Field id="uf" label="UF" value={values.uf} readOnly placeholder="—" />
                <Field id="numero" label="Número" ref={numeroRef}
                  value={values.numero} onChange={handleChange("numero")} onBlur={handleBlur("numero")}
                  error={errorOf("numero")} valid={isValid("numero")} />
              </div>
              <Field id="complemento" label="Complemento (opcional)" placeholder="Apto, bloco, sala..."
                value={values.complemento} onChange={handleChange("complemento")} />
            </fieldset>

            <fieldset className="group">
              <legend>3. Seu jogo</legend>
              <div className="row">
                <Field id="jogo" label="Nome do jogo"
                  value={values.jogo} onChange={handleChange("jogo")} onBlur={handleBlur("jogo")}
                  error={errorOf("jogo")} valid={isValid("jogo")} />
                <Field id="genero" as="select" label="Gênero" options={genres} placeholder="Selecione"
                  value={values.genero} onChange={handleChange("genero")} onBlur={handleBlur("genero")}
                  error={errorOf("genero")} valid={isValid("genero")} />
              </div>
              <Field id="descricao" as="textarea" rows={4} label="Descrição do jogo"
                placeholder="Conte em poucas linhas do que o jogo trata e o que o conecta ao Brasil."
                value={values.descricao} onChange={handleChange("descricao")} onBlur={handleBlur("descricao")}
                error={errorOf("descricao")} valid={isValid("descricao")}
                hint={`${values.descricao.trim().length} caracteres`} />
            </fieldset>

            <button type="submit" className="btn btn--primary btn--block">Enviar cadastro</button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
