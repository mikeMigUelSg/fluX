// main.js - Enhanced version
document.addEventListener("DOMContentLoaded", function() {
  // Apply safe area insets for mobile devices
  applyMobileInsets();
  
  // Initialize UI components
  initializeGauges();
  initializeAnimations();
  
  // Handle device capabilities
  setupDeviceCapabilities();
  
  // Hide splash screen if Capacitor is available
  hideSplashScreen();
});

/**
 * Apply safe area insets for mobile devices (especially for iPhones with notches)
 */
function applyMobileInsets() {
  const container = document.querySelector(".app-container");
  if (!container) return;

  // Get insets from environment variables or use default values
  const topInset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top')) || 24;
  const bottomInset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom')) || 15;

  container.style.paddingTop = `${topInset}px`;
  container.style.paddingBottom = `${bottomInset}px`;
  
  // Add CSS variables for safe areas
  document.documentElement.style.setProperty('--safe-area-top', `${topInset}px`);
  document.documentElement.style.setProperty('--safe-area-bottom', `${bottomInset}px`);
}

/**
 * Initialize and animate gauge elements
 */
function initializeGauges() {
  // Function to set gauge progress
  window.setGaugeProgress = function(selector, percentage) {
    const gaugeElement = document.querySelector(selector);
    if (!gaugeElement) return;
    
    const progressPath = gaugeElement.querySelector('.progress');
    const textElement = gaugeElement.querySelector('.gauge-text');
    
    if (progressPath && textElement) {
      // Animate the progress
      progressPath.style.strokeDasharray = `${percentage}, 100`;
      
      // Set the text content
      textElement.textContent = `${Math.round(percentage)}%`;
      
      // Add a subtle animation effect
      gaugeElement.classList.add('updated');
      setTimeout(() => {
        gaugeElement.classList.remove('updated');
      }, 1000);
    }
  };
  
  // Set initial gauge values (can be updated later via API)
  const randomProgress = Math.floor(Math.random() * 60) + 10; // Between 10% and 70%
  setGaugeProgress('.gauge svg', randomProgress);
  
  // Update user level based on progress
  const levelElement = document.querySelector('.level-text');
  if (levelElement) {
    const level = Math.floor(randomProgress / 25) + 1;
    const langKey = window.i18n ? 'level' : 'Nível';
    const levelText = window.i18n ? window.i18n.translateText('level') : 'Nível';
    levelElement.innerHTML = `${levelText} ${level}`;
  }
  
  // Set training progress bar
  const progressBar = document.querySelector('.progress-bar .fill');
  if (progressBar) {
    const dailyProgress = Math.min(Math.floor(Math.random() * 65) + 5, 100);
    progressBar.style.width = `${dailyProgress}%`;
  }
}

/**
 * Add subtle animations to UI elements
 */
function initializeAnimations() {
  // Animate cards on scroll
  const cards = document.querySelectorAll('.card, .accelerator-card, .device-card, .balance-card');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
      card.style.opacity = "0";
      observer.observe(card);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    cards.forEach(card => card.classList.add('fade-in'));
  }
  
  // Add hover effect to buttons
  const buttons = document.querySelectorAll('button, .btn, .back-btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.classList.add('hover-effect');
    });
    button.addEventListener('mouseleave', () => {
      button.classList.remove('hover-effect');
    });
  });
  
  // Add ripple effect on click
  const rippleElements = document.querySelectorAll('button, .btn, .card, .nav-item, .balance-card');
  rippleElements.forEach(element => {
    element.addEventListener('click', createRipple);
  });
}

/**
 * Create ripple effect on click
 */
function createRipple(event) {
  const button = event.currentTarget;
  
  // Don't add ripple if element has disabled attribute
  if (button.hasAttribute('disabled')) return;
  
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  // Position the ripple
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
  circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
  circle.classList.add('ripple');
  
  // Remove existing ripples
  const ripple = button.querySelector('.ripple');
  if (ripple) {
    ripple.remove();
  }
  
  // Add the ripple
  button.appendChild(circle);
  
  // Remove the ripple after animation
  setTimeout(() => {
    circle.remove();
  }, 600);
}

/**
 * Setup device-specific capabilities
 */
function setupDeviceCapabilities() {
  // Check if running in Capacitor/native environment
  const isNative = window.Capacitor && window.Capacitor.isNative;
  
  // Add class to body to enable platform-specific styles
  if (isNative) {
    document.body.classList.add('native-app');
    
    // Add platform-specific class
    const platform = window.Capacitor.getPlatform();
    document.body.classList.add(`platform-${platform}`);
    
    // Listen for back button on Android
    if (platform === 'android' && window.Capacitor.Plugins.App) {
      window.Capacitor.Plugins.App.addListener('backButton', handleBackButton);
    }
  } else {
    document.body.classList.add('web-app');
  }
  
  // Add theme detection
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(darkModeQuery.matches);
    
    // Listen for changes in color scheme
    darkModeQuery.addEventListener('change', e => setColorScheme(e.matches));
  }
}

/**
 * Handle back button press on Android
 */
function handleBackButton() {
  // Get current page
  const currentPage = location.pathname.split("/").pop() || "index.html";
  
  if (currentPage === "index.html") {
    // If on main page, show exit confirmation
    if (window.Capacitor.Plugins.Dialog) {
      window.Capacitor.Plugins.Dialog.confirm({
        title: window.i18n ? window.i18n.translateText('exit_title') : 'Exit App',
        message: window.i18n ? window.i18n.translateText('exit_message') : 'Are you sure you want to exit?',
        okButtonTitle: window.i18n ? window.i18n.translateText('yes') : 'Yes',
        cancelButtonTitle: window.i18n ? window.i18n.translateText('no') : 'No'
      }).then(result => {
        if (result.value) {
          window.Capacitor.Plugins.App.exitApp();
        }
      });
    } else {
      // Fallback if Dialog plugin not available
      if (confirm(window.i18n ? window.i18n.translateText('exit_message') : 'Are you sure you want to exit?')) {
        window.Capacitor.Plugins.App.exitApp();
      }
    }
  } else {
    // Go back to previous page
    window.history.back();
  }
}

/**
 * Set color scheme based on system preference
 */
function setColorScheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
}

/**
 * Hide splash screen if Capacitor is available
 */
function hideSplashScreen() {
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {
    window.Capacitor.Plugins.SplashScreen.hide();
  }
}

/**
 * Initialize app data with dynamic content
 * This function would normally fetch data from an API
 */
function initializeAppData() {
  // Simulate fetching user data
  const userData = {
    balance: 0.01,
    dailyProfit: 0.00,
    totalProfit: 0.01,
    level: 1,
    progressPercent: 37,
    trainingProgress: 45
  };
  
  // Update UI with user data
  updateUserInterface(userData);
}

/**
 * Update UI elements with user data
 */
function updateUserInterface(userData) {
  // Update balance
  const balanceElement = document.querySelector('.card strong');
  if (balanceElement) {
    balanceElement.textContent = `${userData.balance.toFixed(2)} USDT`;
  }
  
  // Update daily profit
  const dailyProfitElement = document.querySelector('.yield-row div:first-child strong');
  if (dailyProfitElement) {
    dailyProfitElement.textContent = `+${userData.dailyProfit.toFixed(2)}USDT`;
  }
  
  // Update total profit
  const totalProfitElement = document.querySelector('.yield-row div:last-child strong');
  if (totalProfitElement) {
    totalProfitElement.textContent = `+${userData.totalProfit.toFixed(2)}USDT`;
  }
  
  // Update gauge progress
  setGaugeProgress('.gauge svg', userData.progressPercent);
  
  // Update level
  const levelElement = document.querySelector('.level-text');
  if (levelElement) {
    const levelText = window.i18n ? window.i18n.translateText('level') : 'Nível';
    levelElement.innerHTML = `${levelText} ${userData.level}`;
  }
  
  // Update training progress
  const progressBar = document.querySelector('.progress-bar .fill');
  if (progressBar) {
    progressBar.style.width = `${userData.trainingProgress}%`;
  }
}

// Add custom CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .hover-effect {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .updated {
    animation: pulse 0.5s ease-in-out;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  @media (prefers-reduced-motion) {
    .ripple, .hover-effect, .updated, .fade-in {
      animation: none;
      transform: none;
      transition: none;
    }
  }
`;
document.head.appendChild(style);

// Initialize app data
initializeAppData();