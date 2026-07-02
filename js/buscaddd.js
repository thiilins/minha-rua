const inputDDD = document.getElementById("ddd");
const errorMsg = document.getElementById("error-msg");
const loading = document.getElementById("loading");
const results = document.getElementById("results");

const inputEstado = document.getElementById("estado");
const cidadesChips = document.getElementById("cidades-chips");

inputDDD.addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "");
  e.target.value = val;

  if (val.length === 2) {
    fetchDDD(val);
  } else {
    results.classList.add("hidden");
    errorMsg.classList.add("hidden");
  }
});

async function fetchDDD(ddd) {
  errorMsg.classList.add("hidden");
  results.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const res = await fetch(`https://brasilapi.com.br/api/ddd/v1/${ddd}`);
    if (!res.ok) throw new Error("DDD not found");
    const data = await res.json();
    populate(data);
    results.classList.remove("hidden");
  } catch (err) {
    errorMsg.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function populate(data) {
  inputEstado.value = data.state || "Estado desconhecido";
  cidadesChips.innerHTML = "";

  if (data.cities && data.cities.length > 0) {
    data.cities.forEach(cidade => {
      const chip = document.createElement("div");
      chip.className = "chip host";
      chip.textContent = cidade;
      cidadesChips.appendChild(chip);
    });
  } else {
    cidadesChips.innerHTML = "<span style='color: var(--text-muted); font-size: 13px;'>Nenhuma cidade encontrada</span>";
  }
}
