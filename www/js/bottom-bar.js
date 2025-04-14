document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("bottom-bar.html");
    const html = await res.text();
  
    const placeholder = document.getElementById("bottom-bar-placeholder") || document.body;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    placeholder.appendChild(wrapper);
  
    let currentPage = location.pathname.split("/").pop() || "index.html";

  
    const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  
    navItems.forEach(item => {
      const target = item.getAttribute("data-target");
  
      // Marca como ativo se corresponder à página atual
      if (target === currentPage) {
        item.classList.add("active");
      }
  
      // Ao clicar, muda o .active e redireciona
      item.addEventListener("click", () => {
        navItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
  
        if (target && target !== "#") {
          window.location.href = target;
        }
      });
    });
  });
  