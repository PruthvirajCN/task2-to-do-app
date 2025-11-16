// script.js — ToDo app logic (vanilla JS)

const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('list');
const cards = document.getElementById('cards');
const remaining = document.getElementById('remaining');
const total = document.getElementById('total');
const clearAll = document.getElementById('clearAll');
const emptyNotice = document.getElementById('emptyNotice');
const floatingAdd = document.getElementById('floatingAdd');

let items = JSON.parse(localStorage.getItem('neontodo_v1') || '[]');

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }
function save(){ localStorage.setItem('neontodo_v1', JSON.stringify(items)); }

function render(){
  list.innerHTML = '';
  cards.innerHTML = '';
  emptyNotice.style.display = items.length === 0 ? 'block' : 'none';

  items.forEach((it, idx) => {
    // sidebar row
    const row = document.createElement('div'); row.className = 'row';
    const left = document.createElement('div'); left.style.display='flex'; left.style.alignItems='center'; left.style.gap='10px';

    const chk = document.createElement('input'); chk.type='checkbox'; chk.checked = it.done; chk.style.width='18px'; chk.style.height='18px'; chk.style.borderRadius='5px';
    chk.addEventListener('change', ()=>{ toggleDone(it.id) });

    const txt = document.createElement('div'); txt.className='text'; txt.title = it.text; txt.textContent = it.text;
    if(it.done){ txt.classList.add('done') }
    left.appendChild(chk); left.appendChild(txt);

    const right = document.createElement('div');
    const del = document.createElement('button'); del.className='btn-icon'; del.title='Delete';
    del.innerHTML = `<svg width=14 height=14 viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M19 6l-1 14c0 1-1 2-2 2H8c-1 0-2-1-2-2L5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    del.addEventListener('click', ()=>{ removeItem(it.id) });
    right.appendChild(del);

    row.appendChild(left); row.appendChild(right);
    list.appendChild(row);

    // card
    const card = document.createElement('article'); card.className = 'card';
    const accent = ['accent-1','accent-2','accent-3','accent-4'][idx % 4];
    card.classList.add(accent);

    const h = document.createElement('h3'); h.className='title'; h.textContent = it.text; if(it.done){ h.classList.add('done') }
    const m = document.createElement('div'); m.className='meta'; m.textContent = new Date(it.created).toLocaleString();

    const actions = document.createElement('div'); actions.className='actions';
    const toggle = document.createElement('button'); toggle.className='btn-icon'; toggle.title='Toggle done';
    toggle.innerHTML = it.done ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#021124" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#021124" stroke-width="1.6"/></svg>';
    toggle.addEventListener('click', ()=>{ toggleDone(it.id) });

    const delCard = document.createElement('button'); delCard.className='btn-icon'; delCard.title='Delete';
    delCard.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18" stroke="#021124" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="#021124" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    delCard.addEventListener('click', ()=>{ removeItem(it.id) });

    actions.appendChild(toggle); actions.appendChild(delCard);

    card.appendChild(h); card.appendChild(m); card.appendChild(actions);
    cards.appendChild(card);
  });

  const remainingCount = items.filter(i => !i.done).length;
  remaining.textContent = remainingCount + ' remaining';
  total.textContent = items.length + ' tasks';
}

function addItem(text){
  if(!text || !text.trim()) return;
  const n = { id: uid(), text: text.trim(), done:false, created: Date.now() };
  items.unshift(n); save(); render();
}

function removeItem(id){ items = items.filter(i => i.id !== id); save(); render(); }
function toggleDone(id){ items = items.map(i => i.id === id ? {...i, done: !i.done} : i); save(); render(); }

// events
addBtn.addEventListener('click', () => { addItem(input.value); input.value=''; input.focus(); });
input.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ addItem(input.value); input.value=''; } });
floatingAdd.addEventListener('click', () => { input.focus(); window.scrollTo({top:0,behavior:'smooth'}) });

clearAll.addEventListener('click', () => {
  if(!items.length) return;
  if(confirm('Clear all tasks?')) { items = []; save(); render(); }
});

// initial demo items if empty
if(items.length === 0){
  items = [
    {id:uid(), text:'Call supplier about new handcrafted pots', done:false, created:Date.now()-1000*60*60*24},
    {id:uid(), text:'Photograph product batch for listing', done:false, created:Date.now()-1000*60*60*12},
    {id:uid(), text:'Pack order #3245', done:true, created:Date.now()-1000*60*60*6},
  ];
  save();
}

render();
