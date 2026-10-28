const list=document.getElementById('list');
function clean(s){return s.replace(/\s*\(RT[^)]*\)/g,'').replace(/\s*\(site dedus din email\)/gi,'').replace(/^(Chat Olark\s+)?\d{1,2}\.\d{1,2}(\.\d{2,4})?:\s*/gm,'').replace(/;\s*rezolvat\b\.?/gi,'').replace(/[ \t]+$/gm,'')}
function makeCard(after){
 const c=document.createElement('div');c.className='card';
 c.innerHTML='<div class="row bar"><button data-a="copy">Copiaza</button><button data-a="diac">Fara diacritice</button><button data-a="ws">Curata spatii</button><button data-a="desc">Curata descrierea</button><button data-a="clr">Goleste</button><button data-a="dup">Duplica editor</button><button data-a="del">Sterge editor</button></div><textarea spellcheck="false" placeholder="Scrie sau lipeste textul aici..."></textarea><div class="row foot"><span class="cnt"></span><span class="msg" aria-live="polite"></span></div>';
 const t=c.querySelector('textarea'),cnt=c.querySelector('.cnt'),msg=c.querySelector('.msg');
 const say=m=>{msg.textContent=m;setTimeout(()=>{if(msg.textContent===m)msg.textContent=''},1800)};
 const upd=()=>{const v=t.value;const w=v.trim()?v.trim().split(/\s+/).length:0;cnt.textContent=v.length+' car. · '+w+' cuv. · '+(v?v.split('\n').length:0)+' rd.'};
 t.addEventListener('input',upd);
 c.querySelector('.bar').addEventListener('click',async e=>{
  const a=e.target.dataset&&e.target.dataset.a;if(!a)return;
  if(a==='copy'){if(!t.value){say('Nimic de copiat');return}
   try{await navigator.clipboard.writeText(t.value);say('Copiat')}
   catch(x){t.select();let ok=false;try{ok=document.execCommand('copy')}catch(y){}say(ok?'Copiat':'Nu s-a putut copia')}}
  else if(a==='diac'){t.value=t.value.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ș|ş/g,'s').replace(/Ș|Ş/g,'S').replace(/ț|ţ/g,'t').replace(/Ț|Ţ/g,'T');upd();say('Diacritice scoase')}
  else if(a==='ws'){t.value=t.value.split('\n').map(l=>l.replace(/[ \t]+$/,'').replace(/ {2,}/g,' ')).join('\n').replace(/\n{3,}/g,'\n\n').trim();upd();say('Spatii curatate')}
  else if(a==='desc'){const s=t.selectionStart,f=t.selectionEnd,sel=s!==f;t.value=sel?t.value.slice(0,s)+clean(t.value.slice(s,f))+t.value.slice(f):clean(t.value);upd();say(sel?'Selectia curatata':'Descrieri curatate')}
  else if(a==='clr'){t.value='';upd();t.focus();say('Golit')}
  else if(a==='dup'){const n=makeCard(c);n.querySelector('textarea').focus()}
  else if(a==='del'){if(list.children.length>1){c.remove()}else{t.value='';upd();say('Ultimul editor ramane, golit')}}
 });
 if(after)after.after(c);else list.appendChild(c);
 upd();return c;
}
const first=makeCard();first.querySelector('textarea').focus();
// Aplicatie instalata (PWA): fisierele deschise cu 'Open with' ajung in editor
if('launchQueue' in window){
 launchQueue.setConsumer(async p=>{
  for(const h of p.files){
   const txt=await (await h.getFile()).text();
   let t=[...list.querySelectorAll('textarea')].find(x=>!x.value);
   if(!t){t=makeCard().querySelector('textarea')}
   t.value=txt;t.dispatchEvent(new Event('input'));
  }
 });
}
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}
