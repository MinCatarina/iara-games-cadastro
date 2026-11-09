import { useCallback, useRef, useState } from "react";
import { fetchAddressByCep } from "../services/viaCep";

// Controla o estado da consulta: idle | loading | success | error.
export default function useCep() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const controller = useRef(null);

  const lookup = useCallback(async (cep) => {
    controller.current?.abort(); // cancela consulta anterior ainda em andamento
    controller.current = new AbortController();
    setStatus("loading");
    setError("");
    try {
      const address = await fetchAddressByCep(cep, controller.current.signal);
      setStatus("success");
      return address;
    } catch (err) {
      if (err.name === "AbortError") return null;
      setStatus("error");
      setError(err.message);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    controller.current?.abort();
    setStatus("idle");
    setError("");
  }, []);

  return { status, error, lookup, reset };
}
