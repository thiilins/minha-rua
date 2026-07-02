const inputCnpj = document.querySelector("#cnpj");
const inputRazaoSocial = document.querySelector("#razao_social");
const inputNomeFantasia = document.querySelector("#nome_fantasia");
const inputSituacao = document.querySelector("#situacao");
const inputCidade = document.querySelector("#cidade");
const inputUF = document.querySelector("#uf");

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
    inputCidade.value = data.municipio || 'Não informada';
    inputUF.value = data.uf || '';

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
    inputCidade.value = '';
    inputUF.value = '';
  } finally {
    loadingSpinner.classList.add("hidden");
  }
};
