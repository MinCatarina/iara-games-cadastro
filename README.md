# Iara Games — Cadastro de desenvolvedor (React + API ViaCEP)

Última área da plataforma Iara Games: um formulário de cadastro para desenvolvedores que querem divulgar seus jogos. Ao digitar o **CEP**, a aplicação consulta a API pública **ViaCEP** e preenche automaticamente endereço, bairro, cidade e UF.

## Como a API funciona

- API: [ViaCEP](https://viacep.com.br) 
- Requisição: `GET https://viacep.com.br/ws/{cep}/json/`
- CEP existente: retorna `{ cep, logradouro, bairro, localidade, uf, ... }`
- CEP válido, mas inexistente: retorna `{ "erro": true }`
- A consulta dispara sozinha quando o usuário completa os 8 dígitos.

Tratamento de estados: carregando (spinner), sucesso (endereço + região do Brasil), CEP não encontrado.

## Funcionalidades

- Consulta de CEP via API com preenchimento automático e foco no próximo campo
- Máscaras de CEP e telefone
- Validação em tempo real, com mensagens de erro/sucesso por campo
- Região do Brasil identificada pela UF
- Tela de confirmação com resumo do cadastro
- Layout responsivo e acessível

## Deploy
https://iara-games-cadastro.netlify.app
