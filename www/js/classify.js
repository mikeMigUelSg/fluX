let progresso = 0;
let totalImagens = 5;
let imagemAtual = 1;
let concluido = false;

function carregarImagem() {
    const imgElemento = document.getElementById('taskImage');
    imgElemento.src = `https://picsum.photos/seed/${Date.now()}/400/200`;
}

function enviarClassificacao() {
    if (concluido) {
        irParaHome();
        return;
    }

    const classificacao = document.getElementById('classificacao').value.trim();

    if (classificacao === "") {
        alert("Por favor, escreve o que vês na imagem!");
        return;
    }

    console.log(`Imagem ${imagemAtual}, Classificação: ${classificacao}`);
    document.getElementById('classificacao').value = "";

    progresso = Math.floor((imagemAtual / totalImagens) * 100);
    document.getElementById('progressBar').style.width = `${progresso}%`;
    document.getElementById('status').innerText = `Progresso: ${progresso}%`;

    imagemAtual++;

    if (imagemAtual <= totalImagens) {
        carregarImagem();
    } else {
        document.getElementById('status').innerText = "✅ Tarefa concluída! Obrigado pela tua contribuição.";
        const botao = document.querySelector('button');
        botao.innerText = "Home";
        botao.style.backgroundColor = "#175A32"; // verde escuro
        concluido = true;
    }
}

function irParaHome() {
    window.location.href = "index.html"; // Substitui pelo path real da tua home
}

document.addEventListener('DOMContentLoaded', carregarImagem);
