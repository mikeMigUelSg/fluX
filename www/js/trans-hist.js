document.addEventListener("DOMContentLoaded", function () {
    const transactionList = document.getElementById("transactionList");
  
    const transacoes = [
      { data: "2025-04-12", descricao: "Task - Classificação de Imagens", valor: "+0.015 USDT" },
      { data: "2025-04-11", descricao: "Task - reCAPTCHA", valor: "+0.01 USDT" },
      { data: "2025-04-10", descricao: "Bônus de Entrada", valor: "+0.05 USDT" },
    ];
  
    if (transacoes.length === 0) {
      transactionList.innerHTML = '<p style="text-align:center;color:#aaa;">Nenhuma transação registrada ainda.</p>';
    } else {
      transacoes.forEach((tx) => {
        const div = document.createElement("div");
        div.className = "transaction-item";
        div.innerHTML = `
          <div class="transaction-info">
            <div class="transaction-date">${tx.data}</div>
            <div class="transaction-desc">${tx.descricao}</div>
          </div>
          <div class="transaction-amount">${tx.valor}</div>
        `;
        transactionList.appendChild(div);
      });
    }
  });
  