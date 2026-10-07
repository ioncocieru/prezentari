(function(){
const B=document.body,KEY=B.dataset.page,KIND=B.dataset.kind,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const V=['var(--ac)','var(--ac2)','var(--ac3)','var(--fg)'];
function face(s){let r=s*9301+49297;const R=()=>(r=(r*9301+49297)%233280)/233280,q=()=>V[Math.floor(R()*3)];return '<svg viewBox="0 0 200 200"><rect width="200" height="200" fill="'+q()+'" opacity=".25"/><path d="M40 200 Q100 120 160 200Z" fill="'+q()+'"/><ellipse cx="100" cy="88" rx="44" ry="56" fill="#fff" stroke="#2b2724" stroke-width="3"/><path d="M100 32 A44 56 0 0 1 100 144Z" fill="'+q()+'" opacity=".6"/><path d="M52 70 Q100 '+(10+R()*30)+' 148 70 L148 52 Q100 '+R()*20+' 52 52Z" fill="#2b2724"/><circle cx="82" cy="86" r="5"/><circle cx="118" cy="86" r="5"/><path d="M100 90 L92 116 L108 116Z" fill="none" stroke="#2b2724" stroke-width="3"/><path d="M84 132 Q100 140 116 132" fill="none" stroke="#2b2724" stroke-width="3"/></svg>'}
function art(sd){let r=sd*9301+49297;const R=()=>(r=(r*9301+49297)%233280)/233280;let h='';for(let k=0;k<16;k++){const x=R()*300,y=R()*300,w=40+R()*140,q=V[Math.floor(R()*4)],o=.25+R()*.6,t=Math.floor(R()*3);h+=t==0?'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+w*(.4+R())+'" fill="'+q+'" opacity="'+o+'" transform="rotate('+(R()*40-20)+' '+x+' '+y+')"/>':t==1?'<polygon points="'+x+','+y+' '+(x+w)+','+(y+R()*60)+' '+(x+R()*w)+','+(y+w)+'" fill="'+q+'" opacity="'+o+'"/>':'<circle cx="'+(x+w/2)+'" cy="'+(y+w/2)+'" r="'+w/2.4+'" fill="none" stroke="'+q+'" stroke-width="'+(2+R()*5)+'" opacity="'+(o+.2)+'"/>'}return '<svg class="art" viewBox="0 0 400 400">'+h+'</svg>'}
function imgs(){$$('.im').forEach(d=>{const f=d.dataset.img,s=+d.dataset.seed,i=new Image();i.alt='';i.onerror=()=>{d.innerHTML=face(s)};i.src='/poze/'+encodeURI(f);d.appendChild(i)});
$$('.cv').forEach(d=>{const i=new Image();i.alt='';i.onerror=()=>{d.innerHTML=art(+d.dataset.seed)};i.src='/poze/'+encodeURI(d.dataset.img);d.appendChild(i)})}
let SRV=false,PW=sessionStorage.getItem('pw')||'';
const els=()=>$$('[data-e]');
const api=(m,b)=>fetch('/api/content'+(m==='GET'?'?page='+encodeURIComponent(KEY):''),{method:m,headers:{'Content-Type':'application/json'},body:b?JSON.stringify(b):undefined});
async function init(){els().forEach(e=>{e.dataset.d=e.textContent});let o={};
try{const r=await api('GET');if(r.ok){o=(await r.json()).data||{};SRV=true}}catch(e){}
if(!SRV)try{o=JSON.parse(localStorage.getItem('ov:'+KEY)||'{}')}catch(e){}
els().forEach(e=>{if(o[e.dataset.e]!=null)e.textContent=o[e.dataset.e]});
imgs();chrome();KIND==='test'?quiz():pres()}
function edit(on){B.classList.toggle('edit',on);els().forEach(e=>e.contentEditable=on)}
function chrome(){B.insertAdjacentHTML('beforeend','<button class="btn p" id="lk" style="position:fixed;top:10px;right:10px;z-index:9">✎ Editează</button><div id="tb"><b>✎ Mod editare</b><span>Modifică textele cu contur punctat, apoi salvează.</span><button class="btn p" id="sv">💾 Salvează pe site</button><button class="btn" id="rs">Resetează la original</button><button class="btn" id="ex">Ieși</button></div>');
$('#lk').onclick=async()=>{const p=prompt('Parola:');if(!p)return;try{const r=await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'check',password:p})});if(r.ok){PW=p;sessionStorage.setItem('pw',p);location.reload()}else alert('Parolă greșită')}catch(e){alert('Nu pot verifica parola (funcția /api nu rulează).')}};
$('#ex').onclick=()=>{sessionStorage.removeItem('pw');location.reload()};
$('#sv').onclick=()=>save(false);$('#rs').onclick=()=>{if(confirm('Revii la textul original al paginii?'))save(true)};
if(PW){$('#lk').style.display='none';edit(true)}}
async function save(reset){const m={};if(!reset)els().forEach(e=>{if(e.textContent!==e.dataset.d)m[e.dataset.e]=e.textContent});
try{const r=await api('POST',{password:PW,page:KEY,data:m});if(r.ok){localStorage.removeItem('ov:'+KEY);alert(reset?'Revenit la original.':'Salvat pe site. Toți vizitatorii văd modificările.');if(reset)location.reload();return}if(r.status===401){alert('Parolă greșită');return}}catch(e){}
localStorage.setItem('ov:'+KEY,JSON.stringify(m));alert('Stocarea Vercel nu e configurată, deci s-a salvat doar în acest browser (vezi CITESTE-ma.txt).');if(reset){localStorage.removeItem('ov:'+KEY);location.reload()}}
function pres(){const X=$$('.s');let i=0;B.insertAdjacentHTML('beforeend','<nav><button id="p">‹</button><span id="cn"></span><button id="n">›</button></nav>');
const go=k=>{i=Math.max(0,Math.min(X.length-1,k));X.forEach((s,j)=>s.classList.toggle('on',j===i));$('#cn').textContent=(i+1)+' / '+X.length};
$('#p').onclick=()=>go(i-1);$('#n').onclick=()=>go(i+1);addEventListener('keydown',e=>{if(e.target.isContentEditable)return;if(['ArrowRight',' '].includes(e.key))go(i+1);if(e.key=='ArrowLeft')go(i-1)});go(0)}
function quiz(){const T=s=>document.querySelector('[data-e="'+s+'"]').textContent.trim(),m=$('#qz'),name=B.dataset.name;
const Q=$$('.qb').map((b,k)=>({q:T('q'+k+'t'),o:[0,1,2,3].map(j=>T('q'+k+'o'+j)),c:(parseInt(T('q'+k+'c'))||1)-1,x:T('q'+k+'x'),s:T('q'+k+'s')}));
let i=0,s=0,W=[];const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const st=()=>{m.innerHTML='<div class="qz"><span class="k">Test · '+esc(name)+'</span><h2>Cât de bine cunoști '+esc(name.toLowerCase())+'?</h2><p>'+Q.length+' întrebări, o singură variantă corectă. La final afli rezultatul.</p><button class="btn p" id="go">Începe testul</button> <a href="/'+B.dataset.pres+'">← prezentarea</a></div>';$('#go').onclick=()=>{i=0;s=0;W=[];sh()}};
const sh=()=>{const q=Q[i];m.innerHTML='<div class="qz"><span class="k">Întrebarea '+(i+1)+' din '+Q.length+'</span><div class="bar"><i style="width:'+i/Q.length*100+'%"></i></div><h3 style="font-size:1.3rem">'+esc(q.q)+'</h3><div id="o"></div><div class="ex" id="e"></div><div id="nx"></div></div>';
q.o.forEach((t,j)=>{const b=document.createElement('button');b.className='o';b.textContent=t;b.onclick=()=>{const r=j===q.c;if(r)s++;else W.push(q.s);$$('.o').forEach((x,y)=>{x.disabled=true;if(y===q.c)x.classList.add('ok')});if(!r)b.classList.add('no');$('#e').textContent=(r?'Corect. ':'Greșit. ')+q.x;$('#nx').innerHTML='<button class="btn p">'+(i+1<Q.length?'Următoarea':'Vezi rezultatul')+'</button>';$('#nx').firstChild.onclick=()=>{i++;i<Q.length?sh():en()}};$('#o').appendChild(b)})};
const en=()=>{const p=Math.round(s/Q.length*100),e=p>=90?'🏆 Excelent! Ai înțeles foarte bine tema.':p>=70?'👍 Foarte bine! Mai ai câteva detalii de aprofundat.':p>=50?'📚 Bine, dar mai ai lacune. Aprofundează independent subiectele de mai jos.':'🔁 Mai ai de lucru. Studiază independent subiectele de mai jos și încearcă din nou.';
m.innerHTML='<div class="qz"><span class="k">Rezultat</span><h1 style="color:var(--ac)">'+s+'/'+Q.length+'</h1><h2>'+p+'%</h2><p>'+e+'</p>'+(W.length?'<div class="ex"><b>Ce mai ai de studiat independent:</b><ul>'+[...new Set(W)].map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>':'')+'<button class="btn p" id="r">Reia testul</button> <a href="/">Alte curente</a></div>';$('#r').onclick=st};st()}
init()})();
