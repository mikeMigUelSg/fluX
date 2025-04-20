import { API_BASE_URL } from './config.js';

document.addEventListener("DOMContentLoaded", async () => {
    const scanBtn = document.getElementById("scanBtn");
    const loading = document.getElementById("loading");
    const info = document.getElementById("device-info");
    const confirmBtn = document.getElementById("confirm");

    const modelField = document.getElementById("model");
    const cpuField = document.getElementById("cpu");
    const ramField = document.getElementById("ram");
    const androidField = document.getElementById("android");
    const rankingField = document.getElementById("ranking");
    const goHomeBtn = document.getElementById("goHome");

    let deviceStats = {};

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Token não encontrado. Autentica-te primeiro.");
        return;
    }

    scanBtn.classList.add("hidden");
    goHomeBtn.classList.remove("hidden");
    try {
        loading.classList.remove("hidden");
        const response = await fetch(`${API_BASE_URL}/api/get-user`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Erro ao buscar utilizador");

        const userInfo = await response.json();
        const stats = userInfo.deviceStats;

        if (stats && stats.available) {
            console.log("Device stats já disponíveis, a preencher...");
            deviceStats = stats;

            modelField.textContent = stats.model;
            cpuField.textContent = `${stats.cpuCores} núcleos`;
            ramField.textContent = `${stats.ramGB} GB`;
            androidField.textContent = stats.osVersion;
            rankingField.textContent = stats.ranking;

            info.classList.remove("hidden");
            confirmBtn.classList.add("hidden"); 
            goHomeBtn.classList.remove("hidden");
        } else {
            console.log("Device stats não disponíveis, mostrar botão de scan...");
            scanBtn.classList.remove("hidden");
        }
    } catch (err) {
        console.error("Erro ao carregar device stats:", err);
        scanBtn.classList.remove("hidden");
        alert("Erro ao obter informações do utilizador.");
    } finally {
        loading.classList.add("hidden");
    }

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

            const score = calcularRanking(cpu, ram, model);

            modelField.textContent = `${manufacturer} | ${model}`;
            cpuField.textContent = `${cpu} núcleos`;
            ramField.textContent = `${ram} GB`;
            androidField.textContent = osVersion;
            rankingField.textContent = score;

            deviceStats = {
                model: `${manufacturer} ${model}`,
                cpuCores: cpu,
                ramGB: ram,
                os: platform,
                osVersion,
                ranking: score,
                available: true
            };

            info.classList.remove("hidden");
            confirmBtn.classList.remove("hidden");
            goHomeBtn.classList.add("hidden");

        } catch (err) {
            console.error("Erro no scan:", err);
            scanBtn.classList.remove("hidden");
            alert("Erro ao obter informações do dispositivo.");
        } finally {
            loading.classList.add("hidden");
        }
    });

    confirmBtn.addEventListener("click", async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token não encontrado. Autentica-te primeiro.");

            const response = await fetch(`${API_BASE_URL}/api/device-stats`, {
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
            confirmBtn.classList.add("hidden");

        } catch (err) {
            console.error("Erro ao guardar no backend:", err);
            alert(err.message || "Erro ao guardar as estatísticas.");
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
