document.addEventListener("DOMContentLoaded", function () {
    const teamList = document.getElementById("teamList");
  
    // Exemplo de membros da equipa (poderia vir de uma API ou localStorage)
    const membros = []; // Pode popular com nomes: ["João Silva", "Maria Costa"]
  
    if (membros.length === 0) {
      teamList.innerHTML = '<div class="no-members">Nenhum membro ainda entrou com o teu código.</div>';
    } else {
      membros.forEach((nome) => {
        const div = document.createElement("div");
        div.classList.add("member");
        div.textContent = nome;
        teamList.appendChild(div);
      });
    }
  });
  