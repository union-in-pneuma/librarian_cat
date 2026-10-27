// 집사 꾸미기 창 (모달)
import { api } from '../backend.js';
import { butlerSVG, randomLook, SKINS, HAIR_COLORS, HAIR_STYLES, OUTFITS } from '../butler.js';
import { esc, $, toast } from '../util.js';

const swatches = (name, items, cur, render) => `<div class="swatches">${items.map((it) => `
  <label class="swatch" title="${esc(it.label)}"><input type="radio" name="${name}" value="${it.id}" ${it.id === cur ? 'checked' : ''}>${render(it)}</label>`).join('')}</div>`;
const dot = (it) => `<span class="dot" style="background:${it.color}"></span><small>${esc(it.label)}</small>`;
const chip = (it) => `<span class="chip">${esc(it.label)}</span>`;

/** 내 집사 꾸미기 창을 엽니다. 저장하면 onSaved() 호출 */
export async function openButlerEditor({ onSaved } = {}) {
  const butler = await api.ensureButler(randomLook());
  const look = { ...randomLook(), ...butler.look };

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
          <fieldset><legend>피부</legend>${swatches('skin', SKINS, look.skin, dot)}</fieldset>
          <fieldset><legend>머리색</legend>${swatches('hairColor', HAIR_COLORS, look.hairColor, dot)}</fieldset>
          <fieldset><legend>머리 모양</legend>${swatches('hairStyle', HAIR_STYLES, look.hairStyle, chip)}</fieldset>
          <fieldset><legend>옷</legend>${swatches('outfit', OUTFITS, look.outfit, dot)}</fieldset>
        </div>
      </div>
      <footer class="form-actions">
        <button class="btn" value="cancel">취소</button>
        <button class="btn primary" value="save" id="be-save">저장</button>
      </footer>
    </form>`;
  document.body.append(dialog);

  const form = $('form', dialog);
  const read = () => {
    const fd = new FormData(form);
    return { name: fd.get('name').trim(), look: Object.fromEntries(['skin', 'hairColor', 'hairStyle', 'outfit'].map((k) => [k, fd.get(k)])) };
  };
  const preview = () => { $('#be-preview', dialog).innerHTML = butlerSVG(read().look); };
  form.addEventListener('input', preview);
  $('#be-random', dialog).addEventListener('click', () => {
    const r = randomLook();
    for (const [k, v] of Object.entries(r)) form.querySelector(`[name=${k}][value=${v}]`).checked = true;
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
