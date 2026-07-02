// DOM Elements - Preco
const inputFipe = document.getElementById("fipe");
const errorMsg = document.getElementById("error-msg");
const resultsPreco = document.getElementById("results-preco");
const precoCards = document.getElementById("preco-cards");
const precoTitle = document.getElementById("preco-title");

// DOM Elements - Explorador
const selectTipo = document.getElementById("tipo");
const selectMarca = document.getElementById("marca");
const loadingExplorador = document.getElementById("loading-explorador");
const resultsModelos = document.getElementById("results-modelos");
const modelosChips = document.getElementById("modelos-chips");

// --- Consulta Direta ---
inputFipe.addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "");
  // Format as 000000-0
  if (val.length > 6) {
    val = val.substring(0, 6) + "-" + val.substring(6, 7);
  }
  e.target.value = val;

  if (val.length === 8) {
    fetchPreco(val);
  } else {
    resultsPreco.classList.add("hidden");
    errorMsg.classList.add("hidden");
  }
});

async function fetchPreco(codigoFipe) {
  errorMsg.classList.add("hidden");
  
  try {
    const response = await fetch(`https://brasilapi.com.br/api/fipe/preco/v1/${codigoFipe}`);
    if (!response.ok) throw new Error("FIPE não encontrada");
    
    const data = await response.json();
    renderPrecos(data);
  } catch (error) {
    resultsPreco.classList.add("hidden");
    errorMsg.textContent = "Veículo não encontrado ou erro na API.";
    errorMsg.classList.remove("hidden");
  }
}

function renderPrecos(data) {
  precoCards.innerHTML = "";
  if (!data || data.length === 0) return;

  precoTitle.textContent = `${data[0].marca} ${data[0].modelo} - Variações`;

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card-cotacao";
    
    card.innerHTML = `
      <div class="card-header">
        <span class="card-title">${item.anoModelo} • ${item.combustivel}</span>
        <span class="card-time"><i class="ph ph-calendar"></i> Ref: ${item.mesReferencia}</span>
      </div>
      <div class="card-body">
        <div class="card-value-group">
          <span class="card-label">Valor (FIPE)</span>
          <span class="card-value value-venda">${item.valor}</span>
        </div>
      </div>
    `;
    precoCards.appendChild(card);
  });

  resultsPreco.classList.remove("hidden");
}

// --- Explorador ---
selectTipo.addEventListener("change", async (e) => {
  const tipo = e.target.value;
  if (!tipo) return;

  selectMarca.innerHTML = `<option value="" disabled selected>Carregando...</option>`;
  selectMarca.disabled = true;
  resultsModelos.classList.add("hidden");
  
  try {
    const response = await fetch(`https://brasilapi.com.br/api/fipe/marcas/v1/${tipo}`);
    const marcas = await response.json();
    
    selectMarca.innerHTML = `<option value="" disabled selected>Selecione uma marca</option>`;
    marcas.forEach(marca => {
      const option = document.createElement("option");
      option.value = marca.valor;
      option.textContent = marca.nome;
      selectMarca.appendChild(option);
    });
    selectMarca.disabled = false;
  } catch (err) {
    selectMarca.innerHTML = `<option value="" disabled selected>Erro ao carregar</option>`;
  }
});

selectMarca.addEventListener("change", async (e) => {
  const tipo = selectTipo.value;
  const codigoMarca = e.target.value;
  if (!tipo || !codigoMarca) return;

  resultsModelos.classList.add("hidden");
  loadingExplorador.classList.remove("hidden");
  modelosChips.innerHTML = "";

  try {
    const response = await fetch(`https://brasilapi.com.br/api/fipe/veiculos/v1/${tipo}/${codigoMarca}`);
    const modelos = await response.json();
    
    modelos.forEach(mod => {
      const chip = document.createElement("div");
      chip.className = "chip host";
      chip.innerHTML = `<i class="ph ph-car-profile"></i> ${mod.modelo}`;
      modelosChips.appendChild(chip);
    });
    
    resultsModelos.classList.remove("hidden");
  } catch (err) {
    // silently fail
  } finally {
    loadingExplorador.classList.add("hidden");
  }
});
