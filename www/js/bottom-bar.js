// Simple, reliable bottom bar initialization
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load the bottom bar HTML
    const response = await fetch("bottom-bar.html");
    if (!response.ok) throw new Error("Failed to load bottom bar");
    
    const html = await response.text();
    const placeholder = document.getElementById("bottom-bar-placeholder");
    
    if (placeholder) {
      placeholder.innerHTML = html;
      initializeBottomBar();
    }
  } catch (error) {
    console.error("Error loading bottom bar:", error);
    // Fallback: create bottom bar directly if fetch fails
    createFallbackBottomBar();
  }
});

// Initialize bottom bar functionality
function initializeBottomBar() {
  // Get current page
  const currentPage = location.pathname.split("/").pop() || "index.html";
  
  // Get all navigation items
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  
  // Apply active state to current page
  navItems.forEach(item => {
    const targetPage = item.getAttribute("data-target");
    
    // Mark as active if matches current page
    if (targetPage === currentPage) {
      item.classList.add("active");
    }
    
    // Add click handler
    item.addEventListener("click", () => {
      // Navigate to target page
      if (targetPage && targetPage !== "#" && targetPage !== currentPage) {
        window.location.href = targetPage;
      }
    });
  });
  
  // Apply translations if available
  applyTranslations();
}

// Apply translations to nav items if i18n is available
function applyTranslations() {
  if (!window.i18n) return;
  
  const translationMap = {
    'index.html': 'home',
    'tasks.html': 'tasks',
    'accelerators.html': 'upgrade',
    'power.html': 'power',
    'profile.html': 'profile'
  };
  
  document.querySelectorAll(".nav-item").forEach(item => {
    const target = item.getAttribute("data-target");
    const key = translationMap[target];
    
    if (key) {
      const span = item.querySelector("span");
      if (span) {
        span.setAttribute("data-i18n", key);
        span.textContent = window.i18n.translateText(key);
      }
    }
  });
}

// Create bottom bar directly in case fetch fails
function createFallbackBottomBar() {
  const placeholder = document.getElementById("bottom-bar-placeholder");
  if (!placeholder) return;
  
  const currentPage = location.pathname.split("/").pop() || "index.html";
  const items = [
    { target: "tasks.html", icon: "fa-tasks", label: "Task" },
    { target: "accelerators.html", icon: "fa-bolt", label: "Upgrade" },
    { target: "index.html", icon: "fa-home", label: "Home" },
    { target: "power.html", icon: "fa-battery-three-quarters", label: "Power" },
    { target: "profile.html", icon: "fa-user", label: "Profile" }
  ];
  
  const nav = document.createElement("nav");
  nav.className = "bottom-nav";
  
  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "nav-item";
    if (item.target === currentPage) div.classList.add("active");
    div.setAttribute("data-target", item.target);
    
    div.innerHTML = `
      <div class="icon-container">
        <i class="fas ${item.icon}"></i>
      </div>
      <span>${item.label}</span>
    `;
    
    div.addEventListener("click", () => {
      if (item.target !== currentPage) {
        window.location.href = item.target;
      }
    });
    
    nav.appendChild(div);
  });
  
  placeholder.appendChild(nav);
  applyTranslations();
}