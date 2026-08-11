/**
 * PWA Core & Utility Scripts - Buana Studios Product Framework
 */

// 1. Splash Screen Auto-dismiss
window.addEventListener('load', function() {
    const splash = document.getElementById('pwa-splash');
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => { splash.style.display = 'none'; }, 400);
        }, 300);
    }
});

// 2. Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => {
                // console.log('SW Registered:', reg.scope);
            })
            .catch(err => {
                console.warn('SW Registration failed:', err);
            });
    });
}

// 3. PWA Auto Install Prompt Logic
let deferredPrompt;
const installPopup = document.getElementById('pwa-install-popup');
const installBtn = document.getElementById('pwa-install-btn');
const dismissBtn = document.getElementById('pwa-dismiss-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (localStorage.getItem('pwa_dismissed') !== 'true' && installPopup) {
        installPopup.style.display = 'flex';
    }
});

window.addEventListener('appinstalled', () => {
    if (installPopup) installPopup.style.display = 'none';
    deferredPrompt = null;
    console.log('PWA installed successfully');
});

if (installBtn && dismissBtn) {
    installBtn.addEventListener('click', async () => {
        if (installPopup) installPopup.style.display = 'none';
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
        }
    });

    dismissBtn.addEventListener('click', () => {
        if (installPopup) installPopup.style.display = 'none';
        localStorage.setItem('pwa_dismissed', 'true');
    });
}

// 4. Live Clock Function
function updateLiveTimeGlobal() {
    const timeElements = document.querySelectorAll('#liveDateTime, .liveDateTime');
    if (timeElements.length === 0) return;

    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const day = days[now.getDay()];
    const date = String(now.getDate()).padStart(2, '0');
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const formattedStr = `${day}, ${date} ${month} ${year} &nbsp;|&nbsp; <strong>${hours}:${minutes}:${seconds}</strong>`;

    timeElements.forEach(el => {
        el.innerHTML = formattedStr;
    });
}

setInterval(updateLiveTimeGlobal, 1000);
document.addEventListener('DOMContentLoaded', updateLiveTimeGlobal);

// 5. Prevent double post back on refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
