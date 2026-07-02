const inputDominio = document.querySelector("#dominio");
const inputFqdn = document.querySelector("#fqdn");
const inputStatus = document.querySelector("#status");
const inputExpires = document.querySelector("#expires");
const inputHosts = document.querySelector("#hosts");
const inputSuggestions = document.querySelector("#suggestions");
const groupSuggestions = document.querySelector("#group-suggestions");

const loadingSpinner = document.querySelector("#loading");
const errorMsg = document.querySelector("#error-msg");
const resultsContainer = document.querySelector("#results");

// Simple debounce function to wait until user stops typing
let timeoutId;
inputDominio.addEventListener("input", (e) => {
  const domain = e.target.value.toLowerCase().trim();
  e.target.value = domain; // Force lowercase

  errorMsg.classList.add("hidden");
  inputDominio.parentElement.style.borderColor = "";

  clearTimeout(timeoutId);

  // If user typed something and it has a .br
  if (domain.length > 3 && domain.includes('.br')) {
    timeoutId = setTimeout(() => {
      fetchDomainInfo(domain);
    }, 800); // Wait 800ms after user stops typing
  }
});

// Allow search on enter key as well
inputDominio.addEventListener("keydown", (e) => {
  if (e.key === 'Enter') {
    clearTimeout(timeoutId);
    const domain = e.target.value.toLowerCase().trim();
    if (domain) fetchDomainInfo(domain);
  }
});

const fetchDomainInfo = async (domain) => {
  const URL_TO_FETCH = `https://brasilapi.com.br/api/registrobr/v1/${domain}`;

  // UI Loading State
  loadingSpinner.classList.remove("hidden");
  errorMsg.classList.add("hidden");
  resultsContainer.classList.add("hidden");
  inputDominio.parentElement.style.borderColor = "";
  
  try {
    const response = await fetch(URL_TO_FETCH, { method: "GET" });
    
    if (!response.ok && response.status !== 404 && response.status !== 400) {
      if (response.status === 429) {
        throw new Error('Muitas consultas. Aguarde um momento e tente novamente.');
      }
      throw new Error('Erro na busca do domínio.');
    }

    const data = await response.json();
    
    // In some cases, 404 means available. Let's check status
    let statusTexto = data.status || 'AVAILABLE';
    if(statusTexto === 'REGISTERED') statusTexto = 'Registrado';
    else if(statusTexto === 'AVAILABLE') statusTexto = 'Disponível';
    
    inputFqdn.value = data.fqdn || domain;
    inputStatus.value = statusTexto;

    if(data.status === 'REGISTERED') {
      inputDominio.parentElement.style.borderColor = "var(--error)"; // Registered = Red/Taken
      inputStatus.style.color = "var(--error)";
      
      // Date formatting
      if (data['expires-at']) {
        const date = new Date(data['expires-at']);
        inputExpires.value = date.toLocaleDateString('pt-BR');
      } else {
        inputExpires.value = 'Não informada';
      }

      inputHosts.value = data.hosts ? data.hosts.join(', ') : 'Não informado';
      
      // Hide suggestions if registered and no suggestions
      if(data.suggestions && data.suggestions.length > 0) {
        groupSuggestions.classList.remove("hidden");
        const domainBase = data.fqdn.split('.')[0];
        inputSuggestions.value = data.suggestions.slice(0, 5).map(ext => `${domainBase}.${ext}`).join(', ') + '...';
      } else {
        groupSuggestions.classList.add("hidden");
      }

    } else {
      // Available
      inputDominio.parentElement.style.borderColor = "var(--success)"; // Available = Green
      inputStatus.style.color = "var(--success)";
      inputExpires.value = '-';
      inputHosts.value = '-';
      groupSuggestions.classList.add("hidden");
    }

    // Show results
    resultsContainer.classList.remove("hidden");

  } catch (err) {
    console.error("Erro ao buscar o Domínio:", err);
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
    inputDominio.parentElement.style.borderColor = "var(--error)";
  } finally {
    loadingSpinner.classList.add("hidden");
  }
};
