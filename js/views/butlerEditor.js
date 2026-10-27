// 집사 꾸미기 창 (모달)
import { api } from '../backend.js';
import { butlerSVG, randomLook, DEFAULT_LOOK, BUTLER_PARTS } from '../butler.js';
import { esc, $, toast } from '../util.js';
import { partsEditorHTML, bindPartsTabs, readParts, writeParts } from './partsEditor.js';

/** 내 집사 꾸미기 창을 엽니다. 저장하면 onSaved() 호출 */
export async function openButlerEditor({ onSaved } = {}) {
  const butler = await api.ensureButler(randomLook());
  const look = { ...DEFAULT_LOOK, ...butler.look };

  const dialog = document.createElement('dialog');
  dialog.className = 'modal';
  dialog.innerHTML = `
    <form method="dialog" class="butler-editor">
      <header class="modal-head">
        <h2>🧑 내 집사 꾸미기</h2>
        <button class="btn small ghost" value="cancel" aria-label="닫기">✕</button>
      </header>
      <div class="butler-editor-body">
        <div class="butler-preview"><div id="be-preview">${butlerSVG(look)}</div>
          <button type="button" class="btn small" id="be-random">🎲 랜덤</button></div>
        <div class="butler-options">
          <label>집사 이름<input name="name" value="${esc(butler.name)}" maxlength="20" required autofocus></label>
          <div class="parts-editor">${partsEditorHTML(BUTLER_PARTS, look)}</div>
        </div>
      </div>
      <footer class="form-actions">
        <button class="btn" value="cancel">취소</button>
        <button class="btn primary" value="save" id="be-save">저장</button>
      </footer>
    </form>`;
  document.body.append(dialog);

  const form = $('form', dialog);
  const read = () => ({ name: form.elements.name.value.trim(), look: readParts(form, BUTLER_PARTS) });
  const preview = () => { $('#be-preview', dialog).innerHTML = butlerSVG(read().look); };
  form.addEventListener('input', preview);
  bindPartsTabs($('.parts-editor', dialog));
  $('#be-random', dialog).addEventListener('click', () => {
    writeParts(form, BUTLER_PARTS, randomLook());
    preview();
  });

  $('#be-save', dialog).addEventListener('click', async (e) => {
    e.preventDefault();
    const data = read();
    if (!data.name) { form.elements.name.focus(); return; }
    e.target.disabled = true;
    try {
      await api.updateButler(data);
      toast('집사를 꾸몄어요!');
      dialog.close();
      onSaved?.(data);
    } catch (err) {
      toast('저장하지 못했어요: ' + err.message);
      e.target.disabled = false;
    }
  });
  dialog.addEventListener('close', () => dialog.remove());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); }); // 바깥 클릭으로 닫기
  dialog.showModal();
}
