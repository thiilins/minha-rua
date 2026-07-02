const searchInput = document.getElementById("search-bank");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const banksGrid = document.getElementById("banks-grid");
const countLabel = document.getElementById("count-label");

let allBanks = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("https://brasilapi.com.br/api/banks/v1");
    if (!res.ok) throw new Error("Erro API");
    allBanks = await res.json();
    
    // Some banks don't have code, filter them if needed or just display
    
    searchInput.disabled = false;
    loading.classList.add("hidden");
    results.classList.remove("hidden");
    
    renderGrid(allBanks);
  } catch (err) {
    loading.classList.add("hidden");
    countLabel.textContent = "Erro ao carregar bancos.";
    results.classList.remove("hidden");
  }
});

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allBanks.filter(b => 
    (b.name && b.name.toLowerCase().includes(query)) || 
    (b.fullName && b.fullName.toLowerCase().includes(query)) ||
    (b.code && String(b.code).includes(query))
  );
  renderGrid(filtered);
});

function renderGrid(data) {
  banksGrid.innerHTML = "";
  countLabel.textContent = `${data.length} bancos encontrados`;
  
  // Render max 100 for performance
  const limit = Math.min(data.length, 100);
  
  for(let i = 0; i < limit; i++) {
    const item = data[i];
    const code = item.code ? String(item.code).padStart(3, '0') : "N/A";
    
    const card = document.createElement("div");
    card.className = "card-cotacao";
    card.innerHTML = `
      <div class="card-header">
        <span class="card-title" style="color: var(--primary);"><i class="ph ph-hash"></i> COMPE: ${code}</span>
        <span class="card-time" style="font-size: 11px;">ISPB: ${item.ispb || "N/A"}</span>
      </div>
      <div class="card-body" style="flex-direction: column; gap: 8px;">
        <span style="font-size: 16px; font-weight: 800; color: var(--text-main);">${item.name || item.fullName}</span>
        <span style="font-size: 12px; color: var(--text-muted);">${item.fullName}</span>
      </div>
    `;
    banksGrid.appendChild(card);
  }
}
