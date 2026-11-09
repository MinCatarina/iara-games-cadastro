/**
 * Serviço que consulta a API pública ViaCEP (https://viacep.com.br).
 * Endpoint: GET https://viacep.com.br/ws/{cep}/json/
 * - CEP existente: devolve { cep, logradouro, bairro, localidade, uf, ... }
 * - CEP válido, mas inexistente: devolve { erro: true }
 */
const BASE_URL = "https://viacep.com.br/ws";

export class CepError extends Error {
  constructor(type, message) {
    super(message);
    this.type = type; // "invalid" | "notfound" | "network"
  }
}

export async function fetchAddressByCep(cep, signal) {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) {
    throw new CepError("invalid", "Digite um CEP com 8 números.");
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}/${digits}/json/`, { signal });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new CepError("network", "Não foi possível consultar o CEP. Verifique sua conexão e tente de novo.");
  }

  if (!response.ok) {
    throw new CepError("network", "O serviço de CEP está indisponível no momento. Tente novamente em instantes.");
  }

  const data = await response.json();
  if (data.erro) {
    throw new CepError("notfound", "CEP não encontrado. Confira os números digitados.");
  }

  return {
    logradouro: data.logradouro || "",
    bairro: data.bairro || "",
    cidade: data.localidade || "",
    uf: data.uf || "",
  };
}
