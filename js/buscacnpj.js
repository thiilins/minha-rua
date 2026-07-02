const inputCnpj = document.querySelector("#cnpj");
const inputRazaoSocial = document.querySelector("#razao_social");
const inputNomeFantasia = document.querySelector("#nome_fantasia");
const inputSituacao = document.querySelector("#situacao");
const inputAtividade = document.querySelector("#atividade");
const inputNatureza = document.querySelector("#natureza");
const inputTelefone = document.querySelector("#telefone");
const inputEndereco = document.querySelector("#endereco");

const loadingSpinner = document.querySelector("#loading");
const errorMsg = document.querySelector("#error-msg");
const resultsContainer = document.querySelector("#results");

// Format CNPJ: XX.XXX.XXX/XXXX-XX
const formatCNPJ = (value) => {
  return value
    .replace(/\D/g, '') // remove all non-digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substr(0, 18); // limit to 18 characters
};

inputCnpj.addEventListener("input", (e) => {
  e.target.value = formatCNPJ(e.target.value);
  
  // Hide errors and results if user starts typing again
  if (e.target.value.length < 18) {
    errorMsg.classList.add("hidden");
    inputCnpj.parentElement.style.borderColor = "";
  }

  // When input is fully typed (14 digits + 4 special chars = 18)
  if (e.target.value.length === 18) {
    fetchCnpjInfo(e.target.value);
  }
});

const fetchCnpjInfo = async (cnpj) => {
  const cleanCnpj = cnpj.replace(/\D/g, '');
  const URL_TO_FETCH = `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`;

  // UI Loading State
  loadingSpinner.classList.remove("hidden");
  errorMsg.classList.add("hidden");
  resultsContainer.classList.add("hidden");
  inputCnpj.parentElement.style.borderColor = "";
  
  try {
    const response = await fetch(URL_TO_FETCH, { method: "GET" });
    
    if (!response.ok) {
      throw new Error('CNPJ não encontrado ou inválido');
    }

    const data = await response.json();
    
    // Populate fields
    inputRazaoSocial.value = data.razao_social || 'Não informada';
    inputNomeFantasia.value = data.nome_fantasia || 'Não informada';
    inputSituacao.value = data.descricao_situacao_cadastral || 'Não informada';
    inputAtividade.value = data.cnae_fiscal_descricao || 'Não informada';
    inputNatureza.value = data.natureza_juridica || 'Não informada';
    
    // Telefone formating
    let phone = 'Não informado';
    if (data.ddd_telefone_1) {
      // Ex: 1123851939 -> (11) 2385-1939
      const str = data.ddd_telefone_1.replace(/\D/g, '');
      if(str.length === 10) phone = `(${str.slice(0,2)}) ${str.slice(2,6)}-${str.slice(6)}`;
      else if(str.length === 11) phone = `(${str.slice(0,2)}) ${str.slice(2,7)}-${str.slice(7)}`;
      else phone = data.ddd_telefone_1;
    }
    inputTelefone.value = phone;

    // Address combination
    const street = data.descricao_tipo_de_logradouro ? `${data.descricao_tipo_de_logradouro} ${data.logradouro}` : data.logradouro;
    const number = data.numero || 'S/N';
    const complement = data.complemento ? ` - ${data.complemento}` : '';
    const neighborhood = data.bairro || '';
    const cityState = `${data.municipio} - ${data.uf}`;
    
    inputEndereco.value = `${street}, ${number}${complement}, ${neighborhood}, ${cityState}`;

    // Show results
    resultsContainer.classList.remove("hidden");
    inputCnpj.parentElement.style.borderColor = "var(--success)"; 

  } catch (err) {
    console.error("Erro ao buscar o CNPJ:", err);
    errorMsg.classList.remove("hidden");
    inputCnpj.parentElement.style.borderColor = "var(--error)";
    
    // Clear results
    inputRazaoSocial.value = '';
    inputNomeFantasia.value = '';
    inputSituacao.value = '';
    inputAtividade.value = '';
    inputNatureza.value = '';
    inputTelefone.value = '';
    inputEndereco.value = '';
  } finally {
    loadingSpinner.classList.add("hidden");
  }
};
