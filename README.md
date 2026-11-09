# Iara Games — Cadastro de desenvolvedor (React + API ViaCEP)

Última área da plataforma Iara Games: um formulário de cadastro para desenvolvedores que querem divulgar seus jogos. Ao digitar o **CEP**, a aplicação consulta a API pública **ViaCEP** e preenche automaticamente endereço, bairro, cidade e UF.

## Como a API funciona

- API: [ViaCEP](https://viacep.com.br) (gratuita, sem chave de acesso, com CORS liberado)
- Requisição: `GET https://viacep.com.br/ws/{cep}/json/`
- CEP existente: retorna `{ cep, logradouro, bairro, localidade, uf, ... }`
- CEP válido, mas inexistente: retorna `{ "erro": true }`
- A consulta dispara sozinha quando o usuário completa os 8 dígitos. Uma consulta anterior em andamento é cancelada com `AbortController`.

Tratamento de estados: carregando (spinner), sucesso (endereço + região do Brasil), CEP não encontrado, serviço indisponível (erro HTTP) e falha de rede.

## Funcionalidades

- Consulta de CEP via API com preenchimento automático e foco no próximo campo
- Máscaras de CEP e telefone
- Validação em tempo real, com mensagens de erro/sucesso por campo
- Região do Brasil identificada pela UF
- Tela de confirmação com resumo do cadastro
- Layout responsivo e acessível (rótulos, `aria-invalid`, `aria-describedby`, `aria-live`)

## Estrutura

```
src/
├── main.jsx, App.jsx
├── components/    Header, Footer, Field, SuccessCard
├── hooks/         useCep.js        (estado da consulta: idle/loading/success/error)
├── services/      viaCep.js        (chamada à API e tratamento de erros)
├── utils/         masks.js, validators.js, regions.js
└── styles/        global.css
```

## Como rodar

Requer [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # gera a pasta dist/
```

## Deploy

Vercel, Netlify ou Render: importe o repositório (comando `npm run build`, pasta `dist`). O `vite.config.js` usa `base: "./"`, então o build funciona em qualquer hospedagem.
