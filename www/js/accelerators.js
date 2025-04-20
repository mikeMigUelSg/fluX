import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.accelerator-cards');

  try {
    const response = await fetch(`${API_BASE_URL}/api/get-accel-info`);
    const accelerators = await response.json();

    container.innerHTML = '';

    accelerators.forEach(acc => {
      const card = document.createElement('div');
      card.className = 'accelerator-card';

      card.innerHTML = `
        <h3>${acc.name} <span class="level">${acc.levelRange}</span></h3>
        <div class="text-image-row">
          <div class="text-content">
            <p><strong>Prices:</strong> ${acc.price.toFixed(2)} USDT</p>
            <p><strong>Deadlines:</strong> ${acc.deadlineDays} Days</p>
            <p><strong>Daily training hours:</strong> ${acc.dailyTrainingHours} H</p>
            <p><strong>Daily earnings:</strong> ${acc.dailyEarnings.toFixed(2)} USDT</p>
            <p><strong>Total earnings:</strong> ${acc.totalEarnings.toFixed(2)} USDT</p>
            <p><strong>Total yield:</strong> ${acc.totalYieldPercent}%</p>
            <p><strong>Maximum purchase:</strong> ${acc.maxPurchase}</p>
          </div>
          <div class="image-content">
            <img src="${acc.image}" alt="${acc.name} Image" />
          </div>
        </div>
        <button class="buy-btn">Buy Now</button>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao carregar aceleradores:', error);
    container.innerHTML = '<p>Erro ao carregar aceleradores.</p>';
  }
});
