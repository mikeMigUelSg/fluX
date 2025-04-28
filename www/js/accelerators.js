// Enhanced accelerators.js with animations and language support
import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.accelerator-cards');
  
  // Show loading indicator
  showLoading(container);

  try {
    // Fetch accelerators data
    const response = await fetch(`${API_BASE_URL}/api/get-accel-info`);
    const accelerators = await response.json();

    // Clear container
    container.innerHTML = '';

    // Process and display each accelerator
    accelerators.forEach((acc, index) => {
      // Create accelerator card with animation delay
      const card = document.createElement('div');
      card.className = 'accelerator-card';
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
      
      // Format price and other values
      const price = acc.price.toFixed(2);
      const dailyEarnings = acc.dailyEarnings.toFixed(2);
      const totalEarnings = acc.totalEarnings.toFixed(2);
      
      // Get translations if available
      const i18n = window.i18n || {
        translateText: key => {
          // Default translation map if i18n not available
          const defaultMap = {
            'deadlines': 'Prazos',
            'daily_training': 'Horas de treino diárias',
            'daily_earnings': 'Ganhos diários',
            'total_earnings': 'Ganhos totais',
            'total_yield': 'Rendimento total',
            'max_purchase': 'Compra máxima',
            'buy_now': 'Comprar Agora',
            'days': 'Dias'
          };
          return defaultMap[key] || key;
        }
      };

      // Build card HTML with translations
      card.innerHTML = `
        <h3>${acc.name} <span class="level">${acc.levelRange}</span></h3>
        <div class="text-image-row">
          <div class="text-content">
            <p><strong>Prices:</strong> ${price} USDT</p>
            <p><strong>${i18n.translateText('deadlines')}:</strong> ${acc.deadlineDays} ${i18n.translateText('days')}</p>
            <p><strong>${i18n.translateText('daily_training')}:</strong> ${acc.dailyTrainingHours} H</p>
            <p><strong>${i18n.translateText('daily_earnings')}:</strong> ${dailyEarnings} USDT</p>
            <p><strong>${i18n.translateText('total_earnings')}:</strong> ${totalEarnings} USDT</p>
            <p><strong>${i18n.translateText('total_yield')}:</strong> ${acc.totalYieldPercent}%</p>
            <p><strong>${i18n.translateText('max_purchase')}:</strong> ${acc.maxPurchase}</p>
          </div>
          <div class="image-content">
            <img src="${acc.image}" alt="${acc.name} Image" loading="lazy" />
          </div>
        </div>
        <button class="buy-btn" data-i18n="buy_now">${i18n.translateText('buy_now')}</button>
      `;

      // Add card to container
      container.appendChild(card);
      
      // Add click handler to buy button
      card.querySelector('.buy-btn').addEventListener('click', event => {
        handleBuyButtonClick(event, acc);
      });
      
      // Trigger animation after a small delay
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    });
    
    // Add observer for lazy loading and animations
    setupIntersectionObserver();
    
  } catch (error) {
    console.error('Error loading accelerators:', error);
    showErrorMessage(container, error);
  }
});

/**
 * Show loading indicator
 */
function showLoading(container) {
  container.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p data-i18n="loading">${window.i18n ? window.i18n.translateText('loading') : 'Loading...'}</p>
    </div>
  `;
  
  // Add loading spinner styles
  if (!document.getElementById('loading-styles')) {
    const style = document.createElement('style');
    style.id = 'loading-styles';
    style.textContent = `
      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
      }
      
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 255, 153, 0.2);
        border-radius: 50%;
        border-top-color: #00ff99;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Show error message
 */
function showErrorMessage(container, error) {
  container.innerHTML = `
    <div class="error-container">
      <i class="fas fa-exclamation-triangle"></i>
      <p data-i18n="error_loading">${window.i18n ? window.i18n.translateText('error_loading') : 'Error loading accelerators.'}</p>
      <button class="retry-btn" onclick="location.reload()">
        <i class="fas fa-redo"></i> 
        ${window.i18n ? window.i18n.translateText('retry') : 'Retry'}
      </button>
    </div>
  `;
  
  // Add error styles
  if (!document.getElementById('error-styles')) {
    const style = document.createElement('style');
    style.id = 'error-styles';
    style.textContent = `
      .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
        background: rgba(255, 0, 0, 0.05);
        border-radius: 12px;
        border: 1px solid rgba(255, 0, 0, 0.1);
      }
      
      .error-container i {
        font-size: 32px;
        color: #ff5252;
        margin-bottom: 15px;
      }
      
      .retry-btn {
        margin-top: 20px;
        background-color: #27AE60;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      
      .retry-btn:hover {
        background-color: #229954;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Handle buy button click
 */
async function handleBuyButtonClick(event, accelerator) {
  const button = event.currentTarget;
  
  // Show loading state
  button.disabled = true;
  button.innerHTML = `
    <span class="spinner-small"></span>
    ${window.i18n ? window.i18n.translateText('processing') : 'Processing...'}
  `;
  
  // Add spinner styles if not already added
  if (!document.getElementById('button-spinner-styles')) {
    const style = document.createElement('style');
    style.id = 'button-spinner-styles';
    style.textContent = `
      .spinner-small {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        border-top-color: rgba(0, 0, 0, 0.8);
        animation: spin 1s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }

  try {
    // Get device UUID
    let localUUID = await getDeviceUUID();

    // Get auth token
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error(window.i18n ? window.i18n.translateText('auth_required') : 'Authentication required');
    }
    
    // Send payment request to API
    const res = await fetch(`${API_BASE_URL}/api/get-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        idAcelerador: accelerator.id,
        uuid: localUUID
      })
    });
    
    // Check response
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to process payment');
    }
    
    // Get invoice URL
    const { invoice_url } = await res.json();
    
    // Show confirmation before redirecting
    showConfirmationDialog(invoice_url, accelerator);
    
  } catch (error) {
    console.error('Payment error:', error);
    
    // Show error message on button
    button.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      ${error.message || 'Error'}
    `;
    
    // Reset button after delay
    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = window.i18n ? window.i18n.translateText('buy_now') : 'Buy Now';
    }, 3000);
  }
}

/**
 * Show confirmation dialog before redirecting to payment
 */
function showConfirmationDialog(paymentUrl, accelerator) {
  // Create modal dialog
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  
  const i18n = window.i18n || {
    translateText: key => key
  };
  
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h3>${i18n.translateText('confirm_purchase')}</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <p>${i18n.translateText('about_to_purchase')} <strong>${accelerator.name}</strong> ${i18n.translateText('for')} <strong>${accelerator.price.toFixed(2)} USDT</strong>.</p>
        <p>${i18n.translateText('redirected_payment')}</p>
        <div class="accelerator-preview">
          <img src="${accelerator.image}" alt="${accelerator.name}" />
          <div>
            <p><strong>${accelerator.name}</strong></p>
            <p>${i18n.translateText('daily_earnings')}: ${accelerator.dailyEarnings.toFixed(2)} USDT</p>
            <p>${i18n.translateText('total_earnings')}: ${accelerator.totalEarnings.toFixed(2)} USDT</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-cancel">${i18n.translateText('cancel')}</button>
        <button class="modal-confirm">${i18n.translateText('proceed')}</button>
      </div>
    </div>
  `;
  
  // Add modal styles
  if (!document.getElementById('modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(5px);
        animation: fadeIn 0.3s ease;
      }
      
      .modal-container {
        background: #121212;
        width: 90%;
        max-width: 400px;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        transform: translateY(20px);
        animation: slideUp 0.3s ease forwards;
        border: 1px solid rgba(0, 255, 153, 0.2);
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .modal-header h3 {
        margin: 0;
        color: #00ff99;
      }
      
      .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        color: #999;
        cursor: pointer;
      }
      
      .modal-body {
        padding: 20px;
      }
      
      .accelerator-preview {
        display: flex;
        align-items: center;
        margin-top: 15px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
      }
      
      .accelerator-preview img {
        width: 70px;
        height: auto;
        margin-right: 15px;
      }
      
      .accelerator-preview p {
        margin: 5px 0;
      }
      
      .modal-footer {
        display: flex;
        justify-content: flex-end;
        padding: 15px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .modal-cancel {
        background: rgba(255, 255, 255, 0.1);
        color: #ccc;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        margin-right: 10px;
        cursor: pointer;
      }
      
      .modal-confirm {
        background: #00ff99;
        color: black;
        border: none;
        padding: 10px 15px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to DOM
  document.body.appendChild(modal);
  
  // Handle close
  modal.querySelector('.modal-close').addEventListener('click', () => {
    closeModal(modal);
    
    // Reset all buy buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.disabled = false;
      btn.innerHTML = window.i18n ? window.i18n.translateText('buy_now') : 'Buy Now';
    });
  });
  
  // Handle cancel
  modal.querySelector('.modal-cancel').addEventListener('click', () => {
    closeModal(modal);
    
    // Reset all buy buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.disabled = false;
      btn.innerHTML = window.i18n ? window.i18n.translateText('buy_now') : 'Buy Now';
    });
  });
  
  // Handle confirm
  modal.querySelector('.modal-confirm').addEventListener('click', () => {
    // Close modal
    closeModal(modal);
    
    // Redirect to payment
    window.location.href = paymentUrl;
  });
}

/**
 * Close modal with animation
 */
function closeModal(modal) {
  modal.style.opacity = '0';
  modal.querySelector('.modal-container').style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    document.body.removeChild(modal);
  }, 300);
}

/**
 * Get device UUID using Capacitor or fallback to default
 */
async function getDeviceUUID() {
  let localUUID = "default-emulator-uuid"; // Default fallback
  
  try {
    // Check if Capacitor is available
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Device) {
      const idInfo = await window.Capacitor.Plugins.Device.getId();
      if (idInfo && idInfo.uuid) {
        localUUID = idInfo.uuid;
      }
    }
    console.log('UUID used:', localUUID);
  } catch (err) {
    console.warn('⚠️ Error getting UUID, using default.', err);
  }
  
  return localUUID;
}

/**
 * Setup intersection observer for lazy loading and animations
 */
function setupIntersectionObserver() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate when visible
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all cards
    document.querySelectorAll('.accelerator-card').forEach(card => {
      observer.observe(card);
    });
  }
}