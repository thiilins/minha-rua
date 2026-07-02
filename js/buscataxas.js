const loading = document.getElementById("loading");
const errorMsg = document.getElementById("error-msg");
const taxasGrid = document.getElementById("taxas-grid");

// Icons based on indicator name
const indicatorIcons = {
  "Selic": "ph-chart-line-up",
  "CDI": "ph-bank",
  "IPCA": "ph-shopping-cart"
};

async function fetchTaxas() {
  try {
    const response = await fetch("https://brasilapi.com.br/api/taxas/v1");
    if (!response.ok) throw new Error("Falha ao carregar as taxas.");
    const data = await response.json();
    renderTaxas(data);
  } catch (err) {
    loading.classList.add("hidden");
    errorMsg.textContent = "Erro de conexão com a BrasilAPI. Tente novamente mais tarde.";
    errorMsg.classList.remove("hidden");
  }
}

function renderTaxas(data) {
  loading.classList.add("hidden");
  taxasGrid.innerHTML = "";

  data.forEach(taxa => {
    // Determine icon
    let iconClass = "ph-trend-up";
    for (const [key, icon] of Object.entries(indicatorIcons)) {
      if (taxa.nome.toUpperCase().includes(key)) {
        iconClass = icon;
        break;
      }
    }

    const card = document.createElement("div");
    card.className = "taxa-card";
    
    // Format value
    const formattedValue = taxa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    card.innerHTML = `
      <div class="taxa-icon">
        <i class="ph ${iconClass}"></i>
      </div>
      <div class="taxa-name">${taxa.nome}</div>
      <div class="taxa-value">${formattedValue}<span>%</span></div>
    `;

    taxasGrid.appendChild(card);
  });

  taxasGrid.classList.remove("hidden");
}

// Fetch on load
document.addEventListener("DOMContentLoaded", fetchTaxas);
