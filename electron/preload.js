const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppName: () => ipcRenderer.invoke('get-app-name'),
  platform: process.platform,
  isElectron: true,
  // Notification APIs
  showNotification: (data) => ipcRenderer.invoke('show-notification', data),
  clearNotifications: (serviceId) => ipcRenderer.invoke('clear-notifications', serviceId),
  // Service management APIs
  reloadService: (serviceId) => ipcRenderer.invoke('reload-service', serviceId),
  toggleService: (serviceId, enabled) => ipcRenderer.invoke('toggle-service', serviceId, enabled),
  toggleServiceNotifications: (serviceId, enabled) => ipcRenderer.invoke('toggle-service-notifications', serviceId, enabled),
  // Event listeners
  onSwitchToService: (callback) => ipcRenderer.on('switch-to-service', callback),
  onReloadService: (callback) => ipcRenderer.on('reload-service', callback),
  onToggleService: (callback) => ipcRenderer.on('toggle-service', callback),
  onToggleServiceNotifications: (callback) => ipcRenderer.on('toggle-service-notifications', callback),
  onSendReply: (callback) => ipcRenderer.on('send-reply', callback),
  // Store APIs
  store: {
    get: (key) => {
      console.log('🔍 Preload Store GET:', key);
      return ipcRenderer.invoke('store-get', key);
    },
    set: (key, value) => {
      console.log('💾 Preload Store SET:', key, value);
      return ipcRenderer.invoke('store-set', key, value);
    },
    delete: (key) => {
      console.log('🗑️ Preload Store DELETE:', key);
      return ipcRenderer.invoke('store-delete', key);
    },
    clear: () => {
      console.log('🧹 Preload Store CLEAR');
      return ipcRenderer.invoke('store-clear');
    }
  }
});

// Suppress console warnings for development
if (process.env.NODE_ENV === 'development') {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args.join(' ');
    // Filter out known harmless warnings
    if (
      message.includes('Unknown event handler property') ||
      message.includes('onBeforeUnload') ||
      message.includes('onUnload') ||
      message.includes('chunk-')
    ) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}

// Handle webview events properly
window.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Preload: DOM Content Loaded');
  
  // Enhanced webview initialization
  setTimeout(() => {
    const webviews = document.querySelectorAll('webview');
    console.log('Found webviews:', webviews.length);
    
    webviews.forEach(webview => {
      console.log('Configuring webview:', webview);
      
      const partition = webview.getAttribute('partition') || 'persist:whatsapp';
      console.log('Webview partition:', partition);
      
      // Set proper source
      if (!webview.src || webview.src === '' || !webview.src.includes('web.whatsapp.com')) {
        webview.src = 'https://web.whatsapp.com/';
      }
      
      // Enhanced styling
      webview.style.width = '100%';
      webview.style.height = '100%';
      webview.style.border = 'none';
      webview.style.outline = 'none';
      webview.style.display = 'flex';
      webview.style.flex = '1';
      webview.style.background = 'white';
      
      // Set proper attributes
      webview.setAttribute('useragent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      webview.setAttribute('partition', partition);
      webview.setAttribute('allowpopups', 'true');
      webview.setAttribute('disablewebsecurity', 'true');
      webview.setAttribute('webpreferences', 'contextIsolation=false,nodeIntegration=false,webSecurity=false,allowRunningInsecureContent=true');
    });
  }, 500);
  
  // Enhanced mutation observer for dynamic webviews
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const webviews = document.querySelectorAll('webview');
        webviews.forEach(webview => {
          const partition = webview.getAttribute('partition') || 'persist:whatsapp';
          
          // Enhanced styling and configuration
          webview.style.width = '100%';
          webview.style.height = '100%';
          webview.style.border = 'none';
          webview.style.outline = 'none';
          webview.style.display = 'flex';
          webview.style.flex = '1';
          webview.style.background = 'white';
          
          // Ensure proper source
          if (!webview.src || webview.src === '' || !webview.src.includes('web.whatsapp.com')) {
            webview.src = 'https://web.whatsapp.com/';
          }
          
          // Set enhanced attributes
          webview.setAttribute('useragent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          webview.setAttribute('partition', partition);
          webview.setAttribute('allowpopups', 'true');
          webview.setAttribute('disablewebsecurity', 'true');
          webview.setAttribute('webpreferences', 'contextIsolation=false,nodeIntegration=false,webSecurity=false,allowRunningInsecureContent=true');
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});