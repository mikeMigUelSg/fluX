import { API_BASE_URL } from './config.js';

document.addEventListener("DOMContentLoaded", () => {
  scanDevices();
});

window.scanDevices = async function () {
  const container = document.querySelector(".power-container");
  container.innerHTML = `
    <h2><i class="fas fa-bolt"></i> Power Rank</h2>
    <div class="section-title">📱 A carregar dispositivos...</div>
  `;

  try {

    // Obter UUID real do dispositivo ou usar por defeito
    let localUUID = "default-emulator-uuid"; // valor fallback
    try {
      const idInfo = await window.Capacitor.Plugins.Device.getId();
      if (idInfo && idInfo.uuid) {
        localUUID = idInfo.uuid;
      } else {
        console.warn("⚠️ UUID real não disponível, a usar UUID por defeito.");
      }
      console.log('UUID usado:', localUUID);
    } catch (err) {
      console.warn('⚠️ Erro ao obter UUID, a usar UUID por defeito.', err);
      // Continua com UUID por defeito
    }

    // 2. Obtem info do utilizador e dispositivos
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Autenticação necessária");

    const res = await fetch(`${API_BASE_URL}/api/get-user`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Erro ao buscar utilizador");

    const user = await res.json();
    const devices = user.devices || [];

    // 3. Limpa container
    container.innerHTML = `
      <h2><i class="fas fa-bolt"></i> Power Rank</h2>
      <div class="section-title">📱 Dispositivos ativos</div>
    `;

    // 4. Renderiza cada dispositivo
    devices.forEach((device) => {
      const isCurrent = device.uuid === localUUID;
      const score = Math.min(Math.max(device.ranking || 0, 0), 100);
      const level = score > 80 ? "Lendário" : score > 60 ? "Avançado" : "Básico";
      const dicas = {
        "Básico": "Considera atualizar o teu dispositivo para melhor desempenho.",
        "Avançado": "O teu dispositivo é bom! Mantém-no limpo e atualizado.",
        "Lendário": "Tens uma máquina de guerra! Pronto para tudo."
      };

      const perAccelerator = 33.33;
      const maxAccelerators = Math.floor(score / perAccelerator);
      const progressToNext = ((score % perAccelerator)).toFixed(1);
      const activeAccelerators = device.activeAccelerators || 0;
      const estimatedProfit = (activeAccelerators * 2).toFixed(2); 

      const accLabels = [0, 1, 2, 3].map(i => {
        const status =
          i === activeAccelerators
            ? "active available"
            : i <= maxAccelerators
              ? "available"
              : "locked";
        return `<span class="${status}">${i}</span>`;
      }).join("");

      const deviceCard = `
        <div class="section device-section">
          <div class="device-header">
            <div class="device-label">${device.model || "Dispositivo desconhecido"}</div>
            ${isCurrent ? `<div class="device-tag">✔ Atual</div>` : ""}
          </div>

          <div class="gauge-wrapper">
            <div class="gauge">
              <svg viewBox="0 0 36 36">
                <path fill="none" stroke="#333" stroke-width="3.8"
                  d="M18 2.0845 a15.9155 15.9155 0 1 1 0 31.831" />
                <path fill="none" stroke="#00ff99" stroke-width="3.8" stroke-linecap="round"
                  stroke-dasharray="${score}, 100"
                  d="M18 2.0845 a15.9155 15.9155 0 1 1 0 31.831" />
                <text x="18" y="20.35" fill="#00ff99" font-size="4" text-anchor="middle">${score}%</text>
              </svg>
            </div>
            <div class="acc-labels">${accLabels}</div>
          </div>

          <hr class="divider" />
          <div class="rank-level centered">Nível ${level}</div>
          <div class="tip centered">${dicas[level]}</div>

          <hr class="divider" />
          <div class="tip centered">
            Cada ${perAccelerator}% de rank dá-te direito a 1 acelerador.<br>
            Com ${score}% podes adquirir até ${maxAccelerators} e estás a ${progressToNext}% do próximo.
          </div>

          <hr class="divider" />
          <div class="tip centered">${activeAccelerators} acelerador(es) em uso</div>
          <hr class="divider" />
          <div class="tip centered">≈ €${estimatedProfit}/dia</div>
        </div>
      `;

      container.insertAdjacentHTML("beforeend", deviceCard);
    });

    // Footer
    container.insertAdjacentHTML("beforeend", `
      <div class="add-more">
        Podes adicionar mais dispositivos ao teu perfil. Para isso faz login de um novo dispositivo.
      </div>
      <div id="bottom-bar-placeholder"></div>
    `);

  } catch (e) {
    console.error("Erro ao carregar dispositivos:", e);
    document.querySelector(".power-container").innerHTML = `
      <h2><i class="fas fa-bolt"></i> Power Rank</h2>
      <p style="color:red;">❌ Erro ao carregar os dispositivos.</p>
    `;
  }
};
