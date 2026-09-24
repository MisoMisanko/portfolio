(function () {
  'use strict';
  var small = window.matchMedia('(max-width:1100px)');
  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)');
  var choices = {yellow:[1,3,4],cyan:[1,2,3],blue:[1,2,4],social:[2,8,9],steal:[2,11,35]};
  function mobileStickers() {
    document.querySelectorAll('.portal-gif').forEach(function(img){img.src=img.getAttribute('src').replace(/\.(gif|png)$/,reduced.matches?'.png':'.gif');});
    if (!small.matches) return;
    document.querySelectorAll('.view:not([hidden]) [data-pool]').forEach(function (section) {
      if (section.querySelector('.mobile-gifs')) return;
      var pool=section.dataset.pool, ids=choices[pool];
      if (!ids) return;
      var cards=section.querySelectorAll(':scope > .card, :scope > .scard');
      var anchors = cards.length ? [cards[0]] : [section.firstElementChild];
      if(cards.length > 3) anchors.push(cards[3]);
      anchors.forEach(function(anchor,index){
        var strip=document.createElement('div');strip.className='mobile-gifs';strip.setAttribute('aria-hidden','true');
        ids.forEach(function(n){
          var img=document.createElement('img');img.alt='';img.width=100;img.height=80;img.loading='lazy';img.decoding='async';
          img.src='assets/mobile/'+pool+'_'+String(n).padStart(2,'0')+(reduced.matches?'.png':'.gif');strip.appendChild(img);
        });
        if(anchor) anchor.before(strip); else section.appendChild(strip);
      });
    });
  }
  var observer=new MutationObserver(mobileStickers);
  document.querySelectorAll('.view').forEach(function(view){observer.observe(view,{attributes:true,attributeFilter:['hidden']});});
  small.addEventListener('change',mobileStickers);reduced.addEventListener('change',mobileStickers);mobileStickers();
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
