import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nova versão da PetCare 360 disponível.');
  },
  onOfflineReady() {
    console.log('PetCare 360 pronta para funcionar offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
