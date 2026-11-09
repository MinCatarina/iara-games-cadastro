// Região do Brasil a partir da sigla do estado (UF).
const regions = {
  Norte: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  Nordeste: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"],
  Sudeste: ["ES", "MG", "RJ", "SP"],
  Sul: ["PR", "RS", "SC"],
};

export const regionByUf = (uf) =>
  Object.entries(regions).find(([, ufs]) => ufs.includes(uf))?.[0] ?? "";
