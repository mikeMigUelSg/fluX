import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = form.elements[0].value.trim();
      const password = form.elements[1].value;
  
      const payload = { email, password };
  
      try {
        
        const response = await fetch(`${API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        const data = await response.json();
  
        if (response.ok) {
          localStorage.setItem('token', data.token);
          window.location.href = "index.html";
        } else {
          alert(`❌ Erro: ${data.error || 'Credenciais inválidas.'}`);
        }
      } catch (err) {
        console.error("Erro ao comunicar com o servidor:", err);
        alert("❌ Erro de rede ou servidor: " + err.message);
      }
    });
  });
  