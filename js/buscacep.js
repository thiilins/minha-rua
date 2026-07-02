const inputCep = document.querySelector("#cep");
const inputRua = document.querySelector("#rua");
const inputCidade = document.querySelector("#cidade");
const inputBairro = document.querySelector("#bairro");
const inputUF = document.querySelector("#UF");
const loadingSpinner = document.querySelector("#loading");
const errorMsg = document.querySelector("#cep-error");
const resultsContainer = document.querySelector("#results");

// Format CEP: XXXXX-XXX
const formatCEP = (value) => {
  return value
    .replace(/\D/g, '') // remove all non-digits
    .replace(/(\d{5})(\d)/, '$1-$2') // format as 00000-000
    .substr(0, 9); // limit to 9 characters
};

inputCep.addEventListener("input", (e) => {
  e.target.value = formatCEP(e.target.value);
  
  // Hide errors and results if user starts typing again
  if (e.target.value.length < 9) {
    errorMsg.classList.add("hidden");
    inputCep.parentElement.style.borderColor = "";
  }

  // When input is fully typed
  if (e.target.value.length === 9) {
    fetchAddress(e.target.value);
  }
});

const fetchAddress = async (cep) => {
  const cleanCep = cep.replace(/\D/g, '');
  const URL_TO_FETCH = `https://brasilapi.com.br/api/cep/v2/${cleanCep}`;

  // UI Loading State
  loadingSpinner.classList.remove("hidden");
  errorMsg.classList.add("hidden");
  resultsContainer.classList.add("hidden");
  inputCep.parentElement.style.borderColor = "";
  
  try {
    const response = await fetch(URL_TO_FETCH, { method: "GET" });
    
    if (!response.ok) {
      throw new Error('CEP não encontrado');
    }

    const data = await response.json();
    
    // Populate fields
    inputRua.value = data.street || '';
    inputBairro.value = data.neighborhood || '';
    inputCidade.value = data.city || '';
    inputUF.value = data.state || '';

    // Show results
    resultsContainer.classList.remove("hidden");
    inputCep.parentElement.style.borderColor = "#00d2ff"; // success color (tertiary)

  } catch (err) {
    console.error("Erro ao buscar o CEP:", err);
    errorMsg.classList.remove("hidden");
    inputCep.parentElement.style.borderColor = "var(--error)";
    
    // Clear results
    inputRua.value = '';
    inputBairro.value = '';
    inputCidade.value = '';
    inputUF.value = '';
  } finally {
    loadingSpinner.classList.add("hidden");
  }
};
