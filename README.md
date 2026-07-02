<div align="center" id="top">
  <img src="./.github/assets/cover.png" alt="Minha Rua - Multi-Ferramentas Brasil API" width="100%" />

  <br><br>

  <h3>
    <a href="https://tl-minha-rua.surge.sh/" target="_blank">📺 Demo (v1)</a>
    <span> | </span>
    <a href="https://tl-minha-rua-v2.surge.sh/" target="_blank">🚀 Preview (v2)</a>
  </h3>

  <p align="center">
    Um super canivete suíço de consultas públicas brasileiras. Rápido, direto e com design de primeira linha.
  </p>

  <p align="center">
    <img alt="Versão" src="https://img.shields.io/badge/Versão-2.0.0-FF5858?style=for-the-badge&logo=appveyor">
    <img alt="Principal linguagem" src="https://img.shields.io/github/languages/top/thiilins/minha-rua?style=for-the-badge&color=FF5858">
    <img alt="Tamanho" src="https://img.shields.io/github/repo-size/thiilins/minha-rua?style=for-the-badge&color=FF5858">
    <img alt="Licença" src="https://img.shields.io/github/license/thiilins/minha-rua?style=for-the-badge&color=FF5858">
  </p>
</div>

<br>

<p align="center">
  <a href="#dart-sobre-o-projeto">Sobre</a> &nbsp;|&nbsp;
  <a href="#sparkles-funcionalidades-principais">Funcionalidades</a> &nbsp;|&nbsp;
  <a href="#art-uiux-e-layout">UI/UX</a> &nbsp;|&nbsp;
  <a href="#rocket-tecnologias-utilizadas">Tecnologias</a> &nbsp;|&nbsp;
  <a href="#zap-como-executar">Como Executar</a> &nbsp;|&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

<br>

## :dart: Sobre o Projeto

O **Minha Rua (v2)** não é apenas um buscador de CEPs. Ele evoluiu para se tornar um poderoso utilitário web (SaaS) que concentra múltiplas consultas vitais para o mercado brasileiro em uma única plataforma.

Totalmente integrado à **[Brasil API](https://brasilapi.com.br/)**, o projeto fornece dados abertos e essenciais de forma relâmpago, sem complicações, CAPTCHAs ou formulários imensos. Tudo embalado em uma interface esteticamente agradável e responsiva.

---

## :sparkles: Funcionalidades Principais

Aqui estão os 4 pilares de consulta disponíveis hoje na plataforma:

### 1. 📍 Busca Avançada de CEP
Digite o CEP e o sistema retorna instantaneamente o **Logradouro, Bairro, Cidade e Estado (UF)**. Tudo utilizando um recurso de preenchimento inteligente (sem precisar clicar em botão de busca, o fetch ocorre assim que o 8º dígito é inserido).

### 2. 🏢 Busca Detalhada de CNPJ
Módulo completo para análise empresarial. Basta inserir o CNPJ e a tela exibirá:
- **Identificação:** Razão Social e Nome Fantasia.
- **Situação Cadastral:** Ativa, Inativa, etc.
- **Operação:** Atividade Principal (CNAE) e Natureza Jurídica.
- **Contato:** Telefone perfeitamente mascarado e Endereço Completo formatado em linha.

### 3. 🌐 Consulta de Domínios (.br)
Empreendedores ou desenvolvedores querendo registrar uma nova marca?
- Verifica em tempo real o status (`Registrado` ou `Disponível`) junto ao Registro.br.
- Caso registrado, lista os **Servidores DNS (Hosts)** e a **Data de Expiração**.
- O diferencial: a aplicação sugere proativamente **extensões alternativas disponíveis** (ex: `.app.br`, `.net.br`, etc) em formato de tags/chips elegantes.

### 4. 💵 Dashboard de Câmbio Financeiro
Para fechar o pacote, um painel financeiro para acompanhar variações monetárias diárias.
- Lista completa e atualizada de moedas estrangeiras disponíveis para cotação no Brasil.
- Calendário inteligente com bloqueio de datas futuras.
- **Interface em Grade (Grid):** Exibição das cotações na forma de **Cartões (Cards)**, separando os valores exatos de **Compra e Venda** em cada um dos boletins do dia (Abertura, Intermediários e Fechamento PTAX).

---

## :art: UI/UX e Layout

O projeto orgulha-se de fugir do estigma de "ferramenta pública com cara de sistema dos anos 2000".

- **Modern SaaS Layout:** Em vez de usar "telinhas de widget" no centro da tela, a aplicação adota um padrão de arquitetura expansível de até **800px** de largura, permitindo que a vasta quantidade de dados das APIs seja perfeitamente distribuída através de CSS Grid e Flexbox.
- **Design Tropical & Glassmorphism:** O projeto utiliza gradientes quentes inspirados no verão brasileiro com caixas translúcidas, sombras suaves, bordas fortemente arredondadas e micro-animações, entregando uma aparência fluida e premium.
- **Mobile-First Real:** O código CSS foi escrito tendo o smartphone como alvo número 1. Campos se empilham em telas pequenas e se expandem lado a lado harmoniosamente em telas grandes.

---

## :rocket: Tecnologias Utilizadas

A aplicação foi criada para ser performática e livre de grandes *frameworks* inchados. A stack escolhida foi puramente nativa:

- **[HTML5 Semântico](https://developer.mozilla.org/pt-BR/docs/Web/HTML)** (Divisão multi-page estratégica para melhor SEO)
- **[CSS3 Vanilla](https://developer.mozilla.org/pt-BR/docs/Web/CSS)** (Uso intenso de Variáveis CSS nativas, Flexbox e Grid Layout)
- **[JavaScript (ES6+)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)** (Modular, `async/await`, Fetch API nativa)
- **[Phosphor Icons](https://phosphoricons.com/)** (Biblioteca vetorial fluida de ícones)
- **[Google Fonts - Outfit](https://fonts.google.com/specimen/Outfit)** (Tipografia super limpa e moderna)

---

## :zap: Como Executar

Por ser um projeto completamente Client-side (Front-end Vanilla), rodar a aplicação em sua máquina é extremamente simples. Não há etapa de *build*.

**Pré-requisitos:** Nenhum além do Git instalado.

```bash
# 1. Clone o repositório
$ git clone https://github.com/thiilins/minha-rua

# 2. Acesse a pasta
$ cd minha-rua

# 3. Abra no VSCode (Opcional, mas recomendado)
$ code .
```

A partir daqui, você pode simplesmente dar dois cliques no arquivo `index.html` ou utilizar extensões como o **Live Server** no VSCode para emular um servidor web local.

Para publicar via Surge de forma relâmpago:
```bash
$ npx surge . my-custom-domain.surge.sh
```

---

## :memo: Licença

Este projeto está sob licença MIT. Pode copiar, clonar, bifurcar, aprender e comercializar. Veja o arquivo [LICENSE](LICENSE.md) para detalhes formais.

<br>

<p align="center">
  Feito com :heart: e dedicação por <a href="https://github.com/thiilins" target="_blank">Thiago Lins</a>
</p>

<p align="center">
  <a href="#top">Voltar para o topo ⬆️</a>
</p>
