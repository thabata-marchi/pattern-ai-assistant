import { appState } from '../application/app-state.js';
import { initTensorFlow } from '../infrastructure/tfjs-service.js';
import { ptBR } from '../i18n/pt-br.js';

export async function bootstrapTensorFlow() {
  if (typeof tf === 'undefined') return;
  try {
    await initTensorFlow(tf);
    appState.tfjsReady = true;
    document.getElementById('tfjsDotRec')?.classList.add('ready');
    document.getElementById('tfjsDotDet')?.classList.add('ready');
    const sRec = document.getElementById('tfjsStatusRec');
    const sDet = document.getElementById('tfjsStatusDet');
    if (sRec) sRec.textContent = ptBR.tfjs.ready;
    if (sDet) sDet.textContent = ptBR.tfjs.ready;
  } catch {
    ['Rec', 'Det'].forEach((s) => {
      const el = document.getElementById(`tfjsStatus${s}`);
      if (el) el.textContent = ptBR.tfjs.unavailable;
    });
  }
}
