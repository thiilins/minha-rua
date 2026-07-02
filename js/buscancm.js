const inputSearch = document.getElementById("search-ncm");
const btnBuscar = document.getElementById("btn-buscar");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("error-msg");
const results = document.getElementById("results");
const ncmGrid = document.getElementById("ncm-grid");
const countLabel = document.getElementById("count-label");

function formatData(dataIso) {
  if (!dataIso) return "N/D";
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

btnBuscar.addEventListener("click", () => fetchNcm(inputSearch.value));
inputSearch.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchNcm(e.target.value);
});

async function fetchNcm(query) {
  if (!query.trim()) return;

  results.classList.add("hidden");
  errorMsg.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const response = await fetch(`https://brasilapi.com.br/api/ncm/v1?search=${encodeURIComponent(query)}`);
    
    if (response.status === 404) {
      throw new Error("Nenhum NCM encontrado para esta busca.");
    }
    if (!response.ok) {
      throw new Error("Erro de conexão com a BrasilAPI.");
    }
    
    const data = await response.json();
    renderNcm(data);
  } catch (err) {
    loading.classList.add("hidden");
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
}

function renderNcm(ncms) {
  loading.classList.add("hidden");
  ncmGrid.innerHTML = "";

  if (ncms.length === 0) {
    errorMsg.textContent = "Nenhum NCM encontrado.";
    errorMsg.classList.remove("hidden");
    return;
  }

  countLabel.textContent = `${ncms.length} resultados encontrados`;

  // Limit to 50 results to not blow up the DOM
  const toRender = ncms.slice(0, 50);

  toRender.forEach(ncm => {
    const card = document.createElement("div");
    card.className = "ncm-card";
    
    card.innerHTML = `
      <div class="ncm-code">
        <i class="ph ph-barcode"></i> ${ncm.codigo}
      </div>
      <div class="ncm-desc">${ncm.descricao}</div>
      <div class="ncm-dates">
        <span><i class="ph ph-calendar-plus"></i> Início: ${formatData(ncm.data_inicio)}</span>
        <span><i class="ph ph-calendar-x"></i> Fim: ${formatData(ncm.data_fim)}</span>
      </div>
    `;

    ncmGrid.appendChild(card);
  });

  results.classList.remove("hidden");
}
