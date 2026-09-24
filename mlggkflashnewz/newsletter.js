(function () {
  'use strict';
  var small = window.matchMedia('(max-width:1100px)');
  var bank=JSON.parse(document.getElementById('ASSET_BANK').textContent);
  // A shuffled cycle gives every visitor the same picks for a Bratislava week.
  var localDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Bratislava',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  var week=Math.floor((Date.parse(localDate+'T00:00:00Z')-Date.UTC(2026,0,5))/604800000);
  function weeklyPortal(selector,pools,seed){
    var choices=pools.reduce(function(all,pool){return all.concat(bank.unitGifs[pool]||[]);},[]);
    for(var i=choices.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;var j=seed%(i+1),swap=choices[i];choices[i]=choices[j];choices[j]=swap;}
    var img=document.querySelector(selector);if(!img||!choices.length)return;
    var src=choices[((week%choices.length)+choices.length)%choices.length];
    img.onerror=function(){this.onerror=null;this.src=src;};
    img.src=src.replace('assets/','assets/mobile/');
  }
  weeklyPortal('.bb-svet .portal-gif',['steal'],91827);
  weeklyPortal('.bb-doma .portal-gif',['yellow','cyan','blue','social'],41359);
  var previous={};
  function shuffled(pool){
    var all=(bank.unitGifs[pool]||[]).slice();
    for(var i=all.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),tmp=all[i];all[i]=all[j];all[j]=tmp;}
    if(all.length>3 && previous[pool] && all.slice(0,3).every(function(src){return previous[pool].indexOf(src)!==-1;})){
      var fresh=all.findIndex(function(src){return previous[pool].indexOf(src)===-1;});
      var first=all[0];all[0]=all[fresh];all[fresh]=first;
    }
    previous[pool]=all.slice(0,3);return all;
  }
  function mobileStickers() {
    document.querySelectorAll('.view[hidden] .mobile-gifs').forEach(function(strip){strip.remove();});
    if (!small.matches) return;
    document.querySelectorAll('.view:not([hidden]) [data-pool]').forEach(function (section) {
      if (section.querySelector('.mobile-gifs')) return;
      var pool=section.dataset.pool, gifs=shuffled(pool);
      if (!gifs.length) return;
      var cards=section.querySelectorAll(':scope > .card, :scope > .scard');
      var anchors = cards.length ? [cards[0]] : [section.firstElementChild];
      if(cards.length > 3) anchors.push(cards[3]);
      anchors.forEach(function(anchor,index){
        var strip=document.createElement('div');strip.className='mobile-gifs';strip.setAttribute('aria-hidden','true');
        for(var n=0;n<Math.min(3,gifs.length);n++){
          var src=gifs[(index*3+n)%gifs.length];
          var img=document.createElement('img');img.alt='';img.width=100;img.height=80;img.decoding='async';
          img.onerror=function(){this.onerror=null;this.src=this.dataset.original;};
          img.dataset.original=src;img.src=src.replace('assets/','assets/mobile/');strip.appendChild(img);
        }
        if(anchor) anchor.before(strip); else section.appendChild(strip);
      });
    });
  }
  var observer=new MutationObserver(mobileStickers);
  document.querySelectorAll('.view').forEach(function(view){observer.observe(view,{attributes:true,attributeFilter:['hidden']});});
  small.addEventListener('change',mobileStickers);mobileStickers();
  function quietMusic(){window.dispatchEvent(new Event('newsletter:video'));}
  document.addEventListener('click',function(event){
    var button=event.target.closest('[data-video-id]');if(!button)return;
    var id=button.dataset.videoId;if(!/^[\w-]{11}$/.test(id))return;
    var frame=document.createElement('iframe');frame.className='cardmedia';
    frame.title=button.getAttribute('aria-label');frame.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
    frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;
    frame.referrerPolicy='strict-origin-when-cross-origin';button.parentElement.classList.add('playing');button.replaceWith(frame);
    setTimeout(quietMusic,0);
  });
  document.addEventListener('play',function(event){if(event.target.tagName==='VIDEO')quietMusic();},true);
})();
