import { onlyDigits } from "./masks";

export const genres = [
  "Ação", "Aventura", "Corrida", "Estratégia", "Metroidvania", "Mistério",
  "Plataformas", "Puzzle", "RPG", "Roguelike", "Terror", "Tiro", "Outro",
];

// Cada função devolve a mensagem de erro, ou "" quando o campo está correto.
export const validators = {
  nome: (v) => {
    const t = v.trim();
    if (!t) return "Digite o nome do desenvolvedor ou estúdio.";
    if (t.length < 3) return "O nome precisa ter pelo menos 3 caracteres.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Digite seu e-mail.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Digite um e-mail válido (ex: nome@email.com).";
  },
  telefone: (v) => {
    if (!v.trim()) return "Digite seu telefone.";
    return onlyDigits(v).length === 11 ? "" : "Telefone inválido. Digite o DDD + 9 dígitos.";
  },
  cep: (v, values) => {
    if (onlyDigits(v).length !== 8) return "Digite um CEP com 8 números.";
    if (!values.cidade) return "Aguarde a consulta do CEP ou confira se o número está correto.";
    return "";
  },
  logradouro: (v) => (v.trim() ? "" : "Digite o endereço (rua/avenida)."),
  bairro: (v) => (v.trim() ? "" : "Digite o bairro."),
  numero: (v) => (v.trim() ? "" : "Digite o número (ou S/N)."),
  jogo: (v) => (v.trim().length >= 2 ? "" : "Digite o nome do jogo."),
  genero: (v) => (v ? "" : "Selecione o gênero do jogo."),
  descricao: (v) => {
    const t = v.trim();
    if (!t) return "Descreva brevemente o seu jogo.";
    return t.length >= 20 ? "" : `Escreva pelo menos 20 caracteres (faltam ${20 - t.length}).`;
  },
};

export const validateAll = (values) =>
  Object.fromEntries(
    Object.entries(validators).map(([field, fn]) => [field, fn(values[field] ?? "", values)])
  );
