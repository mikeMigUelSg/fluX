import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.register-form');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const name = form.elements[0].value.trim();
      const email = form.elements[1].value.trim();
      const password = form.elements[2].value;
      const inviteCode = form.elements[3].value.trim();
  
      const payload = { name, email, password, inviteCode };
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("✅ Conta criada com sucesso!");
          window.location.href = "login.html";
        } else {
          alert(`❌ Erro: ${data.error || 'Não foi possível registar.'}`);
        }
      } catch (err) {
        console.error("Erro ao comunicar com o servidor:", err);
        alert("❌ Erro de rede ou servidor.");
      }
    });
  });
  