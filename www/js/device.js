import { API_BASE_URL } from './config.js';


document.addEventListener("DOMContentLoaded", async () => {
  const scanBtn = document.getElementById("scanBtn");
  const loading = document.getElementById("loading");
  const deviceContainer = document.getElementById("device-container");
  const goHomeBtn = document.getElementById("goHome");

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Token não encontrado. Autentica-te primeiro.");
    return;
  }

  // Garantir execução apenas em Android/iOS nativos
  if (window.Capacitor.getPlatform() === 'web') {
    scanBtn.classList.add("hidden");
    alert('Por favor, executa esta app num dispositivo Android ou iOS para obter o UUID real.');
    return;
  }

  scanBtn.classList.add("hidden");
  goHomeBtn.classList.remove("hidden");

// Obter UUID real do dispositivo ou usar por defeito
let currentUuid = "default-emulator-uuid"; // valor fallback
try {
  const idInfo = await window.Capacitor.Plugins.Device.getId();
  if (idInfo && idInfo.uuid) {
    currentUuid = idInfo.uuid;
  } else {
    console.warn("⚠️ UUID real não disponível, a usar UUID por defeito.");
  }
  console.log('UUID usado:', currentUuid);
} catch (err) {
  console.warn('⚠️ Erro ao obter UUID, a usar UUID por defeito.', err);
  // Continua com UUID por defeito
}


  try {
    loading.classList.remove("hidden");

    const response = await fetch(`${API_BASE_URL}/api/get-user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Erro ao buscar utilizador");

    const userInfo = await response.json();
    const devices = userInfo.devices || [];

    deviceContainer.innerHTML = "";
    let existsCurrent = false;

    devices.forEach(dev => {
      if (dev.uuid === currentUuid) existsCurrent = true;

      const card = document.createElement("div");
      card.className = "device-card";
      card.innerHTML = `
        <div class="device-header">
          <h3>${dev.model}</h3>
          <small>UUID: ${dev.uuid}</small>
        </div>
        <div class="device-stats">
          <p><strong>CPU:</strong> ${dev.cpuCores} núcleos</p>
          <p><strong>RAM:</strong> ${dev.ramGB} GB</p>
          <p><strong>OS:</strong> ${dev.os} ${dev.osVersion}</p>
          <p><strong>Ranking:</strong> ${dev.ranking}/100</p>
        </div>
      `;
      deviceContainer.appendChild(card);
    });

    if (!existsCurrent) scanBtn.classList.remove("hidden");
  } catch (err) {
    console.error("Erro ao carregar devices:", err);
    scanBtn.classList.remove("hidden");
    alert("Erro ao obter informações do utilizador.");
  } finally {
    loading.classList.add("hidden");
  }

  scanBtn.addEventListener("click", async () => {
    scanBtn.classList.add("hidden");
    loading.classList.remove("hidden");

    try {
      const uuid = currentUuid; // Usar o UUID real obtido anteriormente
      const deviceInfo = await window.Capacitor.Plugins.Device.getInfo();
      const manufacturer = deviceInfo.manufacturer || "Desconhecido";
      const model = deviceInfo.model || "Desconhecido";
      const platform = deviceInfo.platform;
      const osVersion = deviceInfo.osVersion || "N/A";
      const cpu = navigator.hardwareConcurrency || 4;
      const ram = navigator.deviceMemory || 2;
      const score = calcularRanking(cpu, ram, model);

      const deviceStats = {
        uuid,
        model: `${manufacturer} ${model}`,
        cpuCores: cpu,
        ramGB: ram,
        os: platform,
        osVersion,
        ranking: score,
        available: true
      };

      const response = await fetch(`${API_BASE_URL}/api/device-stats`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(deviceStats)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao guardar dados.");

      alert("✅ Novo dispositivo guardado com sucesso!");
      location.reload();
    } catch (err) {
      console.error("Erro no scan:", err);
      scanBtn.classList.remove("hidden");
      alert(err.message || "Erro ao obter informações do dispositivo.");
    } finally {
      loading.classList.add("hidden");
    }
  });

  function calcularRanking(cpu, ram, model) {
    let score = 0;
    score += Math.min(cpu * 10, 30);
    score += Math.min(ram * 10, 30);
    if (/S23|S24|iPhone\s1[2-5]/i.test(model)) score += 30;
    else if (/Redmi Note|Galaxy A/i.test(model)) score += 15;
    else score += 5;
    return Math.min(score, 100);
  }
});
