/* GPU Mastery — course-wide search (overlay + inline). Uses window.GM_INDEX (search-data.js). */
(function () {
  function tok(q){ return (q||'').toLowerCase().split(/[^a-z0-9+]+/).filter(Boolean).map(function(t){return t.replace(/s$/,'');}); }
  function idfMap(index, qtokens){ var N=index.length, m={};
    qtokens.forEach(function(t){ if(m[t])return; var df=0; for(var i=0;i<N;i++) if(index[i].text.indexOf(t)>=0) df++; m[t]=Math.log(1+N/(1+df)); }); return m; }
  function rank(index, query){
    var qt = tok(query); if(!qt.length) return [];
    var qp = (query||'').toLowerCase().trim(); var idf = idfMap(index, qt); var res=[];
    for(var i=0;i<index.length;i++){ var e=index[i]; var t=e.title.toLowerCase(), h=e.heads.join(' ').toLowerCase(), x=e.text; var s=0, hits=0;
      for(var j=0;j<qt.length;j++){ var w=idf[qt[j]]||1;
        if(t.indexOf(qt[j])>=0){ s+=8*w; hits++; } else if(h.indexOf(qt[j])>=0){ s+=4*w; hits++; } else if(x.indexOf(qt[j])>=0){ s+=2*w; hits++; } }
      if(hits===0) continue;
      s += hits/qt.length * 3;                                  // coverage bonus
      if(qp.length>2){ if(t.indexOf(qp)>=0) s+=16; else if(x.indexOf(qp)>=0) s+=6; }
      if(e.kind==='core' || e.kind==='hub') s*=1.04;            // slight core/hub lift for summaries
      res.push({ e:e, s:s });
    }
    res.sort(function(a,b){ return b.s-a.s; });
    return res.slice(0,10).map(function(r){ return r.e; });
  }
  window.GMSearch = { rank: rank, tok: tok };

  if (typeof document === 'undefined') return;   // node: expose logic only

  var GM = window.GM || { assetBase:'assets/', rootBase:'' };
  var loaded=false, loading=false, overlay=null, input=null, list=null, sel=-1, results=[];
  function root(){ return (window.GM&&window.GM.rootBase)||''; }

  function loadIndex(cb){ if(loaded){cb();return;} if(loading){ var t=setInterval(function(){ if(loaded){clearInterval(t);cb();} },40); return; }
    loading=true; var s=document.createElement('script'); s.src=GM.assetBase+'search-data.js';
    s.onload=function(){ loaded=true; cb(); }; s.onerror=function(){ loaded=true; cb(); }; document.head.appendChild(s); }

  function render(q){
    results = (window.GM_INDEX ? rank(window.GM_INDEX, q) : []); sel = results.length?0:-1;
    if(!q.trim()){ list.innerHTML='<div class="gm-sr-hint">Type to search all 84 lessons, labs, and hubs…</div>'; return; }
    if(!results.length){ list.innerHTML='<div class="gm-sr-hint">No matches for “'+esc(q)+'”. Try a concept: coalescing, roofline, occupancy, PBR, wavefront…</div>'; return; }
    list.innerHTML = results.map(function(e,i){ return '<a class="gm-sr'+(i===sel?' on':'')+'" href="'+root()+e.url+'" data-i="'+i+'">'+
      '<span class="gm-sr-k">'+esc(e.group)+(e.num?' · '+esc(e.num):'')+'</span>'+
      '<span class="gm-sr-t">'+esc(e.title)+'</span>'+
      '<span class="gm-sr-s">'+esc((e.summary||'').slice(0,120))+'</span></a>'; }).join('');
    [].forEach.call(list.querySelectorAll('.gm-sr'), function(a){ a.addEventListener('mousemove', function(){ setSel(+a.getAttribute('data-i')); }); });
  }
  function setSel(i){ sel=i; [].forEach.call(list.querySelectorAll('.gm-sr'), function(a,j){ a.classList.toggle('on', j===sel); }); var on=list.querySelector('.gm-sr.on'); if(on&&on.scrollIntoView) on.scrollIntoView({block:'nearest'}); }
  function go(){ var on=results[sel]; if(on) location.href=root()+on.url; }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  function buildOverlay(){
    overlay=document.createElement('div'); overlay.className='gm-search-ov'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-label','Search the course'); overlay.hidden=true;
    overlay.innerHTML='<div class="gm-search-box"><input type="search" class="gm-search-in" placeholder="Search the course…  (press / )" aria-label="Search" autocomplete="off" spellcheck="false"><div class="gm-search-list" role="listbox"></div><div class="gm-search-foot">↑↓ navigate · ↵ open · esc close</div></div>';
    document.body.appendChild(overlay);
    input=overlay.querySelector('.gm-search-in'); list=overlay.querySelector('.gm-search-list');
    overlay.addEventListener('click', function(e){ if(e.target===overlay) close(); });
    input.addEventListener('input', function(){ render(input.value); });
    input.addEventListener('keydown', function(e){
      if(e.key==='ArrowDown'){ e.preventDefault(); if(results.length) setSel((sel+1)%results.length); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); if(results.length) setSel((sel-1+results.length)%results.length); }
      else if(e.key==='Enter'){ e.preventDefault(); go(); }
      else if(e.key==='Escape'){ close(); } });
  }
  function open(){ if(!overlay) buildOverlay(); overlay.hidden=false; document.body.style.overflow='hidden';
    loadIndex(function(){ render(input.value); }); setTimeout(function(){ input.focus(); render(input.value); }, 20); }
  function close(){ if(overlay){ overlay.hidden=true; document.body.style.overflow=''; } }
  window.GMSearch.open = open;

  function injectNavButton(){ var nav=document.querySelector('nav .inner'); if(!nav || nav.querySelector('.gm-search-btn')) return true;
    var b=document.createElement('button'); b.className='gm-search-btn'; b.type='button'; b.setAttribute('aria-label','Search the course');
    b.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg><span>Search</span><kbd>/</kbd>';
    b.addEventListener('click', open);
    var credit=nav.querySelector('.gm-credit'); if(credit) nav.insertBefore(b, credit); else nav.appendChild(b); return true; }
  function retryBtn(n){ if(!injectNavButton() && n>0) setTimeout(function(){retryBtn(n-1);},120); }

  function inlineMode(){ var host=document.getElementById('gm-search-inline'); if(!host) return;
    host.innerHTML='<input type="search" class="gm-search-in" placeholder="Search the course…" aria-label="Search" autocomplete="off"><div class="gm-search-list" role="listbox"></div>';
    input=host.querySelector('.gm-search-in'); list=host.querySelector('.gm-search-list');
    input.addEventListener('input', function(){ render(input.value); });
    input.addEventListener('keydown', function(e){ if(e.key==='ArrowDown'){e.preventDefault(); if(results.length) setSel((sel+1)%results.length);} else if(e.key==='ArrowUp'){e.preventDefault(); if(results.length) setSel((sel-1+results.length)%results.length);} else if(e.key==='Enter'){e.preventDefault(); go();} });
    loadIndex(function(){ render(input.value); input.focus(); }); }

  function key(e){ if(e.defaultPrevented) return; var tag=(e.target.tagName||'').toLowerCase();
    if((e.key==='/'||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')) && tag!=='input' && tag!=='textarea' && !e.target.isContentEditable){ e.preventDefault(); open(); } }

  function boot(){ retryBtn(25); inlineMode(); document.addEventListener('keydown', key); }
  if(document.readyState!=='loading') boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
