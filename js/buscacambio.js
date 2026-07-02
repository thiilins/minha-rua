const selectMoeda = document.querySelector("#moeda");
const inputData = document.querySelector("#data_cotacao");
const btnBuscar = document.querySelector("#btn-buscar");
const loadingSpinner = document.querySelector("#loading");
const errorMsg = document.querySelector("#error-msg");
const resultsContainer = document.querySelector("#results");
const dashboardCards = document.querySelector("#dashboard-cards");

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
  // Set today's date as default
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  inputData.value = `${yyyy}-${mm}-${dd}`;

  await fetchMoedas();
});

const fetchMoedas = async () => {
  try {
    const response = await fetch("https://brasilapi.com.br/api/cambio/v1/moedas");
    if (!response.ok) throw new Error("Erro ao carregar moedas");
    const moedas = await response.json();
    
    selectMoeda.innerHTML = '';
    
    // Put USD and EUR at the top if possible, or just list all
    moedas.forEach(m => {
      const option = document.createElement("option");
      option.value = m.simbolo;
      option.textContent = `${m.simbolo} - ${m.nome}`;
      selectMoeda.appendChild(option);
    });
    
    // Default select USD if exists
    if(Array.from(selectMoeda.options).some(opt => opt.value === 'USD')) {
      selectMoeda.value = 'USD';
    }
  } catch(err) {
    selectMoeda.innerHTML = '<option disabled>Erro ao carregar moedas</option>';
  }
};

btnBuscar.addEventListener("click", () => {
  const moeda = selectMoeda.value;
  const dataCotacao = inputData.value; // YYYY-MM-DD
  
  if(moeda && dataCotacao) {
    const dataFormatada = dataCotacao.split('-').join('-'); // format is already YYYY-MM-DD or MM-DD-YYYY depending on API. BrasilAPI uses MM-DD-YYYY for some endpoints, let's check. 
    // Wait, the API example used: /cotacao/USD/2025-02-13. So YYYY-MM-DD is correct!
    fetchCotacoes(moeda, dataCotacao);
  }
});

const formatMoney = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatTime = (dateString) => {
  // dateString is like "2025-02-13 10:04:26.424"
  const parts = dateString.split(' ');
  if(parts.length > 1) {
    return parts[1].substring(0, 8); // "10:04:26"
  }
  return dateString;
};

const fetchCotacoes = async (moeda, data) => {
  const URL_TO_FETCH = `https://brasilapi.com.br/api/cambio/v1/cotacao/${moeda}/${data}`;

  // UI Loading State
  loadingSpinner.classList.remove("hidden");
  errorMsg.classList.add("hidden");
  resultsContainer.classList.add("hidden");
  dashboardCards.innerHTML = '';
  
  try {
    const response = await fetch(URL_TO_FETCH, { method: "GET" });
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Muitas consultas. Aguarde um momento e tente novamente.');
      }
      throw new Error('Cotação não encontrada para esta data (Pode ser um fim de semana ou feriado).');
    }

    const json = await response.json();
    
    if(!json.cotacoes || json.cotacoes.length === 0) {
      throw new Error('Nenhum boletim encontrado para esta data.');
    }

    // Render Cards
    json.cotacoes.forEach(cotacao => {
      const card = document.createElement("div");
      card.className = "card-cotacao";
      
      let icon = "ph-trend-up";
      if(cotacao.tipo_boletim.includes("FECHAMENTO")) icon = "ph-flag-checkered";
      else if(cotacao.tipo_boletim.includes("ABERTURA")) icon = "ph-door-open";
      
      card.innerHTML = `
        <div class="card-header">
          <span class="card-title">${cotacao.tipo_boletim}</span>
          <span class="card-time"><i class="ph ph-clock"></i> ${formatTime(cotacao.data_hora_cotacao)}</span>
        </div>
        <div class="card-body">
          <div class="card-value-group">
            <span class="card-label">Compra</span>
            <span class="card-value value-compra">${formatMoney(cotacao.cotacao_compra)}</span>
          </div>
          <div class="card-value-group" style="text-align: right;">
            <span class="card-label">Venda</span>
            <span class="card-value value-venda">${formatMoney(cotacao.cotacao_venda)}</span>
          </div>
        </div>
      `;
      dashboardCards.appendChild(card);
    });

    // Show results
    resultsContainer.classList.remove("hidden");

  } catch (err) {
    console.error("Erro ao buscar cotação:", err);
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  } finally {
    loadingSpinner.classList.add("hidden");
  }
};
