// Enhanced bottom-bar.js with animations and language support
document.addEventListener("DOMContentLoaded", async () => {
  // Load bottom bar HTML
  const res = await fetch("bottom-bar.html");
  const html = await res.text();

  // Insert into placeholder
  const placeholder = document.getElementById("bottom-bar-placeholder");
  if (placeholder) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    placeholder.appendChild(wrapper);
    
    // Initialize bottom bar
    initializeBottomBar();
  } else {
    console.warn("Bottom bar placeholder not found");
  }
});

/**
 * Initialize bottom bar functionality
 */
function initializeBottomBar() {
  // Get current page
  let currentPage = location.pathname.split("/").pop() || "index.html";
  
  // Get all nav items
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  
  // Add translations to bottom bar items
  translateBottomBar();
  
  // Mark active item based on current page
  navItems.forEach(item => {
    const target = item.getAttribute("data-target");
    
    // Mark as active if matches current page
    if (target === currentPage) {
      item.classList.add("active");
      animateActiveIcon(item);
    }
    
    // Add click event
    item.addEventListener("click", () => {
      // Don't navigate if already on that page
      if (target === currentPage) return;
      
      // Remove active class from all items
      navItems.forEach(i => i.classList.remove("active"));
      
      // Add active class to clicked item
      item.classList.add("active");
      
      // Animate icon
      animateActiveIcon(item);
      
      // Navigate if target is specified
      if (target && target !== "#") {
        // Add page transition animation
        document.body.classList.add('page-transition-out');
        
        // Navigate after animation
        setTimeout(() => {
          window.location.href = target;
        }, 300);
      }
    });
  });
}

/**
 * Apply translations to bottom bar items
 */
function translateBottomBar() {
  // Skip if translations are not available
  if (!window.i18n) return;
  
  // Map of data-target to translation keys
  const translationMap = {
    'index.html': 'home',
    'tasks.html': 'tasks',
    'accelerators.html': 'upgrade',
    'power.html': 'power',
    'profile.html': 'profile'
  };
  
  // Apply translations
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  navItems.forEach(item => {
    const target = item.getAttribute("data-target");
    const translationKey = translationMap[target];
    
    if (translationKey) {
      const span = item.querySelector('span');
      if (span) {
        span.setAttribute('data-i18n', translationKey);
        span.textContent = window.i18n.translateText(translationKey);
      }
    }
  });
}

/**
 * Animate the active icon with a subtle effect
 */
function animateActiveIcon(item) {
  const icon = item.querySelector('.icon');
  if (!icon) return;
  
  // Add and remove animation class
  icon.classList.add('icon-pulse');
  setTimeout(() => {
    icon.classList.remove('icon-pulse');
  }, 700);
}

// Add page transition styles
const style = document.createElement('style');
style.textContent = `
  /* Page transitions */
  body {
    opacity: 0;
    animation: fadeInPage 0.3s ease-out forwards;
  }
  
  /* Bottom bar animations */
  .icon-pulse {
    animation: iconPulse 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .page-transition-out {
    animation: fadeOutPage 0.3s ease-in forwards;
  }
  
  @keyframes fadeInPage {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeOutPage {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); }
  }
  
  @keyframes iconPulse {
    0% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-15px) scale(1.1); }
    100% { transform: translateY(-10px) scale(1); }
  }
  
  /* Bottom bar accessibility improvements */
  .nav-item {
    position: relative;
  }
  
  .nav-item::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: var(--primary-color);
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
  
  .nav-item.active::after {
    width: 40%;
  }
  
  .nav-item .icon {
    position: relative;
  }
  
  .nav-item.active .icon::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    z-index: -1;
    animation: glowPulse 2s infinite;
  }
  
  @keyframes glowPulse {
    0% { box-shadow: 0 0 0 0 rgba(0, 255, 153, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(0, 255, 153, 0); }
    100% { box-shadow: 0 0 0 0 rgba(0, 255, 153, 0); }
  }
  
  @media (prefers-reduced-motion) {
    /* Disable animations for users who prefer reduced motion */
    .icon-pulse, .page-transition-out, body {
      animation: none;
    }
    .nav-item.active .icon::before {
      animation: none;
      box-shadow: 0 0 5px 0 rgba(0, 255, 153, 0.7);
    }
  }
`;
document.head.appendChild(style);