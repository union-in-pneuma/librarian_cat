// 고양이·집사 공용 꾸미기 편집기: 항목 정의(parts)로 탭 + 색상/칩 선택지를 만듭니다.
// part: { group, key, label, type: 'color'|'chip', multi?, items: [{ id, label, color?, swatch? }] }
import { esc, $$ } from '../util.js';

function option(part, it, checked) {
  const input = `<input type="${part.multi ? 'checkbox' : 'radio'}" name="${part.key}" value="${it.id}" ${checked ? 'checked' : ''}>`;
  const face = part.type === 'color'
    ? `<span class="dot" style="background:${it.swatch || it.color}"></span><small>${esc(it.label)}</small>`
    : `<span class="chip">${esc(it.label)}</span>`;
  return `<label class="swatch" title="${esc(it.label)}">${input}${face}</label>`;
}

export function partsEditorHTML(parts, value) {
  const groups = [...new Set(parts.map((p) => p.group))];
  const isOn = (p, id) => (p.multi ? (value[p.key] || []).includes(id) : value[p.key] === id);
  return `<div class="parts-tabs" role="tablist">${groups.map((g, k) =>
    `<button type="button" role="tab" class="parts-tab ${k ? '' : 'active'}" data-group="${esc(g)}">${esc(g)}</button>`).join('')}</div>
    ${groups.map((g, k) => `<div class="parts-group" data-group="${esc(g)}" ${k ? 'hidden' : ''}>
      ${parts.filter((p) => p.group === g).map((p) => `<fieldset><legend>${esc(p.label)}</legend>
        <div class="swatches">${p.items.map((it) => option(p, it, isOn(p, it.id))).join('')}</div></fieldset>`).join('')}
    </div>`).join('')}`;
}

export function bindPartsTabs(root) {
  root.querySelector('.parts-tabs')?.addEventListener('click', (e) => {
    const tab = e.target.closest('.parts-tab');
    if (!tab) return;
    $$('.parts-tab', root).forEach((t) => t.classList.toggle('active', t === tab));
    $$('.parts-group', root).forEach((g) => { g.hidden = g.dataset.group !== tab.dataset.group; });
  });
}

export function readParts(form, parts) {
  const fd = new FormData(form);
  return Object.fromEntries(parts.map((p) => [p.key, p.multi ? fd.getAll(p.key) : fd.get(p.key)]));
}

export function writeParts(form, parts, value) {
  for (const p of parts) {
    $$(`[name="${p.key}"]`, form).forEach((el) => {
      el.checked = p.multi ? (value[p.key] || []).includes(el.value) : value[p.key] === el.value;
    });
  }
}
