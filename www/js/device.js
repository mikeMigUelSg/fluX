document.addEventListener("DOMContentLoaded", () => {
    const scanBtn = document.getElementById("scanBtn");
    const loading = document.getElementById("loading");
    const info = document.getElementById("device-info");
    const confirmBtn = document.getElementById("confirm");
  
    const modelField = document.getElementById("model");
    const cpuField = document.getElementById("cpu");
    const ramField = document.getElementById("ram");
    const androidField = document.getElementById("android");
    const rankingField = document.getElementById("ranking");
  
    let deviceStats = {};
  
    scanBtn.addEventListener("click", async () => {
        scanBtn.classList.add("hidden");
        loading.classList.remove("hidden");
      
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const { Device } = window.Capacitor.Plugins;
          const deviceInfo = await Device.getInfo();
      
          const model = deviceInfo.model || "Desconhecido";
          const platform = deviceInfo.platform;
          const osVersion = deviceInfo.osVersion || "N/A";
          const manufacturer = deviceInfo.manufacturer || "Desconhecido";
      
          const cpu = navigator.hardwareConcurrency || 4;
          const ram = navigator.deviceMemory || 2;
      
          modelField.textContent = `${manufacturer} | ${model}`; 
          cpuField.textContent = `${cpu} núcleos`;
          ramField.textContent = `${ram} GB`;
          androidField.textContent = osVersion;
      
          let score = 0;
          score += Math.min(cpu * 10, 30);
          score += Math.min(ram * 10, 30);
      
          if (/S23|S24|iPhone\s1[2-5]/i.test(model)) score += 30;
          else if (/Redmi Note|Galaxy A/i.test(model)) score += 15;
          else score += 5;
      
          score = Math.min(score, 100);
          rankingField.textContent = score;
      
          // ← Só guardamos localmente nesta fase
          deviceStats = {
            model: `${manufacturer} ${model}`,
            cpuCores: cpu,
            ramGB: ram,
            os: platform,
            osVersion,
            ranking: score,
            available: true
          };
      
          loading.classList.add("hidden");
          info.classList.remove("hidden");
          confirmBtn.classList.remove("hidden");
      
        } catch (err) {
          console.error("Erro no scan:", err);
          loading.classList.add("hidden");
          scanBtn.classList.remove("hidden");
          alert("Erro ao obter informações do dispositivo.");
        }
      });

      confirmBtn.addEventListener("click", async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("Token não encontrado. Autentica-te primeiro.");
      
          const response = await fetch("https://localhost:4000/api/device-stats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ deviceStats })
          });
      
          const result = await response.json();
      
          if (!response.ok) {
            throw new Error(result.error || "Erro ao guardar dados.");
          }
      
          alert("✅ Estatísticas guardadas com sucesso!");
          console.log("📡 Dados enviados:", result.message);
          
        } catch (err) {
          console.error("Erro ao guardar no backend:", err);
          alert(err.message || "Erro ao guardar as estatísticas.");
        }
      });
      
      
  });
  