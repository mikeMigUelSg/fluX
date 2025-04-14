document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".app-container");

    // Estimar valores médios para Android
    const topInset = 24;    // status bar (pode variar)
    const bottomInset = 15; // barra de navegação (pode variar)

    container.style.paddingTop = `${topInset}px`;
    container.style.paddingBottom = `${bottomInset}px`;
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {
        window.Capacitor.Plugins.SplashScreen.hide();
      }
      
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  });
  

