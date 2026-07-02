const inputAno = document.getElementById("ano");
const errorMsg = document.getElementById("error-msg");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const feriadosGrid = document.getElementById("feriados-grid");

// Set current year as default
inputAno.value = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
  fetchFeriados(inputAno.value);
});

inputAno.addEventListener("change", (e) => {
  const ano = e.target.value;
  if (ano && ano.length === 4) {
    fetchFeriados(ano);
  }
});

async function fetchFeriados(ano) {
  errorMsg.classList.add("hidden");
  results.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();
    renderGrid(data);
    results.classList.remove("hidden");
  } catch (err) {
    errorMsg.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function renderGrid(data) {
  feriadosGrid.innerHTML = "";
  
  data.forEach(item => {
    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const [y, m, d] = item.date.split("-");
    const formattedDate = `${d}/${m}/${y}`;
    
    const card = document.createElement("div");
    card.className = "card-cotacao";
    card.innerHTML = `
      <div class="card-header" style="justify-content: flex-start; gap: 8px;">
        <i class="ph ph-calendar-star" style="color: var(--secondary); font-size: 18px;"></i>
        <span class="card-title" style="color: var(--text-main); font-size: 15px;">${formattedDate}</span>
      </div>
      <div class="card-body">
        <span style="font-size: 16px; font-weight: 700; color: var(--primary);">${item.name}</span>
      </div>
    `;
    feriadosGrid.appendChild(card);
  });
}
