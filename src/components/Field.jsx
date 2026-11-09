import { forwardRef } from "react";

/**
 * Campo de formulário genérico: rótulo + controle + mensagem.
 * `as` define o controle: "input" (padrão), "textarea" ou "select".
 * A mensagem de erro só aparece quando `error` é informado
 * (o App só repassa o erro de campos já tocados).
 */
const Field = forwardRef(function Field(
  { id, label, as = "input", error, hint, valid, options = [], placeholder, ...rest },
  ref
) {
  const Control = as;
  const messageId = error ? `${id}-erro` : hint ? `${id}-hint` : undefined;
  const state = error ? "is-invalid" : valid ? "is-valid" : "";

  const controlProps = {
    id,
    name: id,
    ref,
    className: `control ${state}`,
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": messageId,
    ...rest,
  };

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {as === "select" ? (
        <select {...controlProps}>
          <option value="">{placeholder || "Selecione"}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <Control {...controlProps} placeholder={placeholder} />
      )}
      {error ? (
        <p id={`${id}-erro`} className="msg msg--erro">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className={`msg ${valid ? "msg--ok" : ""}`}>{hint}</p>
      ) : null}
    </div>
  );
});

export default Field;
