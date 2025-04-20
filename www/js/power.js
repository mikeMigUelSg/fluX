import { API_BASE_URL } from './config.js';

document.addEventListener("DOMContentLoaded", () => {
  scanDevice();
});

window.scanDevice = async function () {
  const deviceNameEl = document.getElementById("deviceName");
  const container = document.getElementById("gaugeContainer");
  const label = document.getElementById("rankLabel");
  const tip = document.getElementById("improveTip");
  const accelInfo = document.getElementById("acceleratorInfo");
  const activeAccEl = document.getElementById("activeAccelerators");
  const profitEl = document.getElementById("profitEstimate");

  // Loading state
  deviceNameEl.textContent = "🔍 A carregar informações do dispositivo...";
  container.innerHTML = "";

  try {
    // 1) Obtém info local
    const { Device } = window.Capacitor.Plugins;
    const info = await Device.getInfo();
    const model = info.model || "Desconhecido";
    deviceNameEl.textContent = model;

    // 2) Busca rank e aceleradores ativos na API
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Autenticação necessária");
    const res = await fetch(
      `${API_BASE_URL}/api/get-user`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );
    if (!res.ok) {
      const errorText = await res.text(); // pode conter info útil do backend
      throw new Error(`Erro na resposta: ${res.status} - ${errorText}`);
    }
    const json = await res.json();
    const ranking = json.deviceStats.ranking || 0;
    // espera receber { ranking: number, activeAccelerators: number }
    const score = Math.min(Math.max(ranking, 0), 100);
    const activeAccelerators = json.activeAccelerators || 0;

    // 3) Calcula quantos aceleradores compráveis e progresso
    const perAccelerator = 33.33;
    const maxAccelerators = Math.floor(score / perAccelerator);
    const progressToNext = ((score % perAccelerator)).toFixed(1);
    console.log(
      `Rank: ${ranking}, Aceleradores ativos: ${activeAccelerators}, ` +
      `Máx. aceleradores: ${maxAccelerators}, Progresso: ${progressToNext}`
    );
    // ** Novo: destaca o indicador correto **
    const labelSpans = document.querySelectorAll('.acc-labels span');
    labelSpans.forEach((span, idx) => {
      span.classList.remove('active', 'available', 'locked');
    
      if (idx === activeAccelerators) {
        span.classList.add('available', 'active'); // o próximo a ativar
      } else if (idx <= maxAccelerators) {
        span.classList.add('available');
      } else {
        span.classList.add('locked');
      }
    });
    

    // 4) Gera gauge com o score
    container.innerHTML = `
      <svg viewBox="0 0 36 36">
        <path
          fill="none"
          stroke="#333"
          stroke-width="3.8"
          d="M18 2.0845
             a15.9155 15.9155 0 1 1 0 31.831"
        />
        <path
          fill="none"
          stroke="#00ff99"
          stroke-width="3.8"
          stroke-linecap="round"
          stroke-dasharray="${score}, 100"
          d="M18 2.0845
             a15.9155 15.9155 0 1 1 0 31.831"
        />
        <text
          x="18"
          y="20.35"
          fill="#00ff99"
          font-size="4"
          text-anchor="middle"
        >${score}%</text>
      </svg>
    `;

    // 5) Label e dicas
    const level = score > 80
      ? "Lendário"
      : score > 60
        ? "Avançado"
        : "Básico";
    const dicas = {
      "Básico": "Considera atualizar o teu dispositivo para melhor desempenho.",
      "Avançado": "O teu dispositivo é bom! Mantém-no limpo e atualizado.",
      "Lendário": "Tens uma máquina de guerra! Pronto para tudo."
    };
    label.textContent = `Nível ${level}`;
    tip.textContent = dicas[level];

    // 6) Explicação dos aceleradores
    accelInfo.textContent =
      `Cada ${perAccelerator}% de rank dá-te direito a 1 acelerador. ` +
      `Com ${score}% podes adquirir até ${maxAccelerators} acelerador(es) ` +
      `e estás a ${progressToNext}% do próximo.`;

    // 7) Preenche secção de ativos e estima o profit
    activeAccEl.textContent = `${activeAccelerators} em uso`;
    // Exemplo de cálculo de lucro: €2 por acelerador × horas por dia (24h)
    const lucroPorAccelPorDia = 2;
    const estimatedProfit = (activeAccelerators * lucroPorAccelPorDia).toFixed(2);
    profitEl.textContent =
      `≈ €${estimatedProfit} por dia com ${activeAccelerators} acelerador(es).`;


  } catch (e) {
    container.innerHTML = "❌ Erro ao obter dados.";
    deviceNameEl.textContent = "Erro";
    console.error(e);
  }
};
