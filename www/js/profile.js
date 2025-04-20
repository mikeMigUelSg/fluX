import { API_BASE_URL } from './config.js';

document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado. Autentica-te primeiro.");
  
    try {
        const response = await fetch(`${API_BASE_URL}/api/get-user`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
      console.log(response);
      if (!response.ok) throw new Error("Erro ao buscar utilizador");
  
      const user = await response.json();
  
      // Preencher o UID
      document.querySelector('.uid-label span').textContent = user._id;
  
      // Preencher total de ativos
      const totalAtivos = user.balance?.toFixed(3) ?? '0.000';
      document.querySelector('.total-value').textContent = `${totalAtivos} USDT`;
  
      // Preencher valores individuais
      document.querySelectorAll('.balance-card').forEach(card => {
        const label = card.querySelector('.label').textContent.trim().toLowerCase();
        let value = 0;
  
        switch (label) {
          case 'tarefas':
            value = user.earnings?.fromTasks ?? 0;
            break;
          case 'processamento':
            value = user.earnings?.fromCompute ?? 0;
            break;
          case 'equipa':
            value = user.earnings?.fromTeam ?? 0; 
            break;
        }
  
        card.querySelector('.value').textContent = `₮ ${value.toFixed(2)}`;
      });
  
    } catch (err) {
      console.error("Erro ao carregar perfil:", err.message);
    }
  });
  