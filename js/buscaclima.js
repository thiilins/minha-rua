const inputCidade = document.getElementById("cidade");
const btnBuscar = document.getElementById("btn-buscar");
const btnGps = document.getElementById("btn-gps");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("error-msg");
const citySelector = document.getElementById("city-selector");
const cityChips = document.getElementById("city-chips");
const weatherResults = document.getElementById("weather-results");

// Helper para formatar data ISO "YYYY-MM-DD" para "DD/MM"
function formatData(dataIso) {
  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}`;
}

function getDayName(dataIso) {
  const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  // getDay() em JS: 0 é Domingo. Precisamos lidar com timezone.
  const data = new Date(dataIso + "T12:00:00Z");
  return dias[data.getDay() === 0 ? 6 : data.getDay() - 1] || "Dia";
}

// Mapa de ícones baseados na sigla do CPTEC
const conditionIcons = {
  ec: "ph-cloud-rain", // Encoberto com Chuvas Isoladas
  ci: "ph-cloud-rain", // Chuvas Isoladas
  c:  "ph-cloud-rain", // Chuva
  in: "ph-cloud-fog",  // Instável
  pp: "ph-cloud-rain", // Poss. de Pancadas de Chuva
  cm: "ph-cloud-rain", // Chuva pela Manhã
  cn: "ph-cloud-rain", // Chuva a Noite
  pt: "ph-cloud-rain", // Pancadas de Chuva a Tarde
  pm: "ph-cloud-rain", // Pancadas de Chuva pela Manhã
  np: "ph-cloud-rain", // Nublado e Pancadas de Chuva
  pc: "ph-cloud-rain", // Pancadas de Chuva
  pn: "ph-cloud-sun",  // Parcialmente Nublado
  cv: "ph-cloud-rain", // Chuvisco
  ch: "ph-cloud-rain", // Chuvoso
  t:  "ph-cloud-lightning", // Tempestade
  ps: "ph-sun", // Predomínio de Sol
  e:  "ph-cloud", // Encoberto
  n:  "ph-cloud", // Nublado
  cl: "ph-sun", // Céu Claro
  nd: "ph-cloud", // Não Definido
};

function getIcon(sigla) {
  return conditionIcons[sigla] || "ph-cloud-sun";
}

btnBuscar.addEventListener("click", () => searchCities(inputCidade.value));
inputCidade.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchCities(e.target.value);
});

// GPS Reverse Geocoding
btnGps.addEventListener("click", () => {
  if (!navigator.geolocation) {
    errorMsg.textContent = "Geolocalização não suportada no seu navegador.";
    errorMsg.classList.remove("hidden");
    return;
  }

  weatherResults.classList.add("hidden");
  citySelector.classList.add("hidden");
  errorMsg.classList.add("hidden");
  loading.classList.remove("hidden");

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!res.ok) throw new Error("Falha na API de localização.");
        const data = await res.json();
        
        const city = data.address.city || data.address.town || data.address.village;
        if (!city) throw new Error("Não foi possível identificar a cidade exata.");
        
        inputCidade.value = city;
        searchCities(city);
      } catch (err) {
        loading.classList.add("hidden");
        errorMsg.textContent = "Erro ao buscar a cidade pela localização.";
        errorMsg.classList.remove("hidden");
      }
    },
    (err) => {
      loading.classList.add("hidden");
      errorMsg.textContent = "Permissão de localização negada ou indisponível.";
      errorMsg.classList.remove("hidden");
    }
  );
});

async function searchCities(query) {
  if (!query.trim()) return;
  
  weatherResults.classList.add("hidden");
  citySelector.classList.add("hidden");
  errorMsg.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cptec/v1/cidade/${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      if(response.status === 404) throw new Error("Cidade não encontrada.");
      throw new Error("Erro na API.");
    }
    
    const cidades = await response.json();
    
    if (cidades.length === 1) {
      fetchWeather(cidades[0]);
    } else {
      // Show chips
      cityChips.innerHTML = "";
      cidades.forEach(cid => {
        const chip = document.createElement("div");
        chip.className = "chip host";
        chip.innerHTML = `<i class="ph ph-map-pin"></i> ${cid.nome} - ${cid.estado}`;
        chip.onclick = () => fetchWeather(cid);
        cityChips.appendChild(chip);
      });
      loading.classList.add("hidden");
      citySelector.classList.remove("hidden");
    }
  } catch (err) {
    loading.classList.add("hidden");
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
}

async function fetchWeather(cidadeData) {
  citySelector.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cptec/v1/clima/previsao/${cidadeData.id}`);
    if (!response.ok) throw new Error("Erro ao buscar previsão para esta cidade.");
    
    const climaData = await response.json();
    renderWeather(cidadeData, climaData);
  } catch (err) {
    loading.classList.add("hidden");
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
}

function renderWeather(cidadeInfo, climaInfo) {
  loading.classList.add("hidden");
  
  const hoje = climaInfo.clima[0];
  const proximos = climaInfo.clima.slice(1);

  let html = `
    <div class="weather-today">
      <div class="city-name">${cidadeInfo.nome} - ${cidadeInfo.estado}</div>
      <div class="weather-date">Hoje, ${formatData(hoje.data)}</div>
      
      <div class="weather-main">
        <i class="ph ${getIcon(hoje.condicao)} weather-icon-huge"></i>
        <div class="weather-temp-huge">
          ${hoje.max}<span>°C</span>
        </div>
      </div>
      
      <div class="weather-desc">${hoje.condicao_desc}</div>
      
      <div class="weather-details">
        <div class="w-detail">
          <i class="ph ph-arrow-down" style="color: #48dbfb;"></i>
          <span>Mínima</span>
          <strong>${hoje.min}°C</strong>
        </div>
        <div class="w-detail">
          <i class="ph ph-arrow-up" style="color: #ff6b6b;"></i>
          <span>Máxima</span>
          <strong>${hoje.max}°C</strong>
        </div>
        <div class="w-detail">
          <i class="ph ph-sun-horizon" style="color: #feca57;"></i>
          <span>Índice UV</span>
          <strong>${hoje.indice_uv}</strong>
        </div>
      </div>
    </div>
  `;

  if (proximos.length > 0) {
    html += `<div class="forecast-grid">`;
    proximos.forEach(d => {
      const dataObj = new Date(d.data + "T12:00:00Z");
      const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' });

      html += `
        <div class="forecast-card">
          <div class="f-date">${diaSemana}, ${formatData(d.data)}</div>
          <i class="ph ${getIcon(d.condicao)} f-icon"></i>
          <div style="font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 12px; height: 32px; display: flex; align-items: center; justify-content: center;">
            ${d.condicao_desc}
          </div>
          <div class="f-temps">
            <span class="f-min">${d.min}°</span>
            <span class="f-max">${d.max}°</span>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }

  weatherResults.innerHTML = html;
  weatherResults.classList.remove("hidden");
}
