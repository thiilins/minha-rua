const searchInput = document.getElementById("search-pix");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const pixGrid = document.getElementById("pix-grid");
const countLabel = document.getElementById("count-label");

let allParticipants = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("https://brasilapi.com.br/api/pix/v1/participants");
    if (!res.ok) throw new Error("Erro API");
    allParticipants = await res.json();
    
    searchInput.disabled = false;
    loading.classList.add("hidden");
    results.classList.remove("hidden");
    
    renderGrid(allParticipants);
  } catch (err) {
    loading.classList.add("hidden");
    countLabel.textContent = "Erro ao carregar lista.";
    results.classList.remove("hidden");
  }
});

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allParticipants.filter(p => 
    (p.nome && p.nome.toLowerCase().includes(query)) || 
    (p.nome_reduzido && p.nome_reduzido.toLowerCase().includes(query))
  );
  renderGrid(filtered);
});

function renderGrid(data) {
  pixGrid.innerHTML = "";
  countLabel.textContent = `${data.length} instituições encontradas`;
  
  // Render max 100 for performance
  const limit = Math.min(data.length, 100);
  
  for(let i = 0; i < limit; i++) {
    const item = data[i];
    const card = document.createElement("div");
    card.className = "card-cotacao";
    card.innerHTML = `
      <div class="card-header">
        <span class="card-title" style="color: var(--primary);"><i class="ph ph-bank"></i> ISPB: ${item.ispb}</span>
      </div>
      <div class="card-body" style="flex-direction: column; gap: 8px;">
        <span style="font-size: 15px; font-weight: 800;">${item.nome_reduzido}</span>
        <span style="font-size: 12px; color: var(--text-muted);">${item.nome}</span>
      </div>
    `;
    pixGrid.appendChild(card);
  }

  if (data.length > limit) {
    const more = document.createElement("div");
    more.style.padding = "16px";
    more.style.gridColumn = "1 / -1";
    more.style.textAlign = "center";
    more.style.color = "var(--text-muted)";
    more.textContent = `+ ${data.length - limit} instituições ocultas (Refine a busca)`;
    pixGrid.appendChild(more);
  }
}
