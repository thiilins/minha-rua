const inputCodigo = document.getElementById("codigo");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("error-msg");
const results = document.getElementById("results");
const timeline = document.getElementById("timeline");

// Link&Track Public API Token
const API_URL = "https://api.linketrack.com/track/json?user=teste&token=1abcd00b2731640e886fb41a8a9671ad1434c599dbaa0a0de9a5aa619f29a83f&codigo=";

inputCodigo.addEventListener("input", (e) => {
  e.target.value = e.target.value.toUpperCase();
  if (e.target.value.length === 13) {
    fetchRastreio(e.target.value);
  } else {
    results.classList.add("hidden");
    errorMsg.classList.add("hidden");
  }
});

async function fetchRastreio(codigo) {
  results.classList.add("hidden");
  errorMsg.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const response = await fetch(API_URL + codigo);
    if (!response.ok) throw new Error("Não foi possível rastrear este código.");
    
    const data = await response.json();
    
    if (!data.eventos || data.eventos.length === 0) {
      throw new Error("Objeto não encontrado na base de dados dos Correios.");
    }
    
    renderTimeline(data.eventos);
  } catch (err) {
    loading.classList.add("hidden");
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
}

function renderTimeline(eventos) {
  loading.classList.add("hidden");
  timeline.innerHTML = "";

  eventos.forEach((ev, index) => {
    const eventCard = document.createElement("div");
    eventCard.className = `timeline-event ${index === 0 ? "latest" : ""}`;
    
    let subStatusHtml = "";
    if (ev.subStatus && ev.subStatus.length > 0 && ev.subStatus[0] !== "") {
      subStatusHtml = `<div class="event-sub">${ev.subStatus.join("<br>")}</div>`;
    }

    eventCard.innerHTML = `
      <div class="event-date">
        <i class="ph ph-calendar"></i> ${ev.data} às ${ev.hora}
      </div>
      <div class="event-status">${ev.status}</div>
      <div class="event-local">
        <i class="ph ph-map-pin"></i> ${ev.local}
      </div>
      ${subStatusHtml}
    `;

    timeline.appendChild(eventCard);
  });

  results.classList.remove("hidden");
}
