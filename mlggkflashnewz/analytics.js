(function () {
  'use strict';
  var ID='G-R2X574NR4N', KEY='mlggk-analytics-consent-v1', enabled=false, loaded=false, lastSection='';
  var data=JSON.parse(document.getElementById('FLASH_DATA').textContent);
  var edition=data.coveredFrom||data.editionDate;
  var choice=null;
  try{var saved=JSON.parse(localStorage.getItem(KEY));if(saved&&Date.now()-saved.time<15552000000)choice=saved.value;}catch(e){}
  window.dataLayer=window.dataLayer||[];
  function tag(){window.dataLayer.push(arguments);}
  function section(){var el=document.querySelector('.view:not([hidden])');return el?el.id.replace('view-',''):'home';}
  function event(name,params){if(!enabled)return;tag('event',name,Object.assign({send_to:ID,edition:edition,section:section()},params||{}));}
  function sectionView(){var current=section();if(enabled&&current!==lastSection){lastSection=current;event('section_view');}}
  function enable(){
    enabled=true;window['ga-disable-'+ID]=false;
    if(!loaded){
      loaded=true;
      tag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
      tag('consent','update',{analytics_storage:'granted'});
      tag('js',new Date());
      // GA handles document pageviews; section_view measures the newsletter router separately.
      var config={allow_google_signals:false,allow_ad_personalization_signals:false,cookie_path:'/mlggkflashnewz/',cookie_expires:15552000};
      if(new URLSearchParams(location.search).get('s')==='m')Object.assign(config,{campaign_source:'m',campaign_medium:'internal',campaign_name:'flashnewz_'+edition.replace(/-/g,'_'),campaign_content:'management_share'});
      tag('config',ID,config);
      var script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+ID;document.head.appendChild(script);
    }
    sectionView();
  }
  function save(value){try{localStorage.setItem(KEY,JSON.stringify({value:value,time:Date.now()}));}catch(e){}choice=value;}
  var panel=document.createElement('section');panel.className='analytics-consent';panel.hidden=choice!==null;
  panel.setAttribute('aria-label','Nastavenie analytiky');
  panel.innerHTML='<strong>Pomôžeš nám zlepšiť Flash Newz?</strong><p>So súhlasom použijeme Google Analytics na meranie návštev, otvorených sekcií a kliknutí. Google môže ukladať analytické cookies. Bez súhlasu sa analytika nenačíta; obsah funguje rovnako. Voľbu môžeš kedykoľvek zmeniť.</p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">Ako Google používa údaje ↗</a><div><button type="button" data-consent="yes">Povoliť analytiku</button><button type="button" data-consent="no">Bez analytiky</button></div>';
  document.body.appendChild(panel);
  var settings=document.createElement('button');settings.type='button';settings.className='analytics-settings';settings.textContent='Nastavenie analytiky';settings.onclick=function(){panel.hidden=!panel.hidden;if(!panel.hidden)panel.querySelector('button').focus();};var footer=document.createElement('footer');footer.className='analytics-footer';footer.appendChild(settings);document.body.appendChild(footer);
  panel.addEventListener('click',function(e){var b=e.target.closest('[data-consent]');if(!b)return;var accept=b.dataset.consent==='yes';save(accept);panel.hidden=true;
    if(accept){if(!enabled)enable();}else{
      enabled=false;window['ga-disable-'+ID]=true;
      // Reload unloads the tag completely; no denied-mode requests are sent.
      document.cookie.split(';').forEach(function(part){var name=part.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))return;['/mlggkflashnewz/'].forEach(function(path){['',location.hostname,'.'+location.hostname].forEach(function(domain){document.cookie=name+'=; Max-Age=0; path='+path+(domain?'; domain='+domain:'');});});});
      if(loaded)location.reload();
    }
  });
  if(choice===true)enable();
  var observer=new MutationObserver(sectionView);document.querySelectorAll('.view').forEach(function(v){observer.observe(v,{attributes:true,attributeFilter:['hidden']});});
  function context(el){var card=el.closest('article,.card,.scard,.event-card,.pencil-work');var heading=card&&card.querySelector('h3,h2,.headline,.sname');return {content_title:heading?heading.textContent.trim().slice(0,100):'',content_id:el.dataset.videoId||''};}
  document.addEventListener('click',function(e){
    var video=e.target.closest('[data-video-id]');if(video){event('video_play_request',Object.assign(context(video),{video_id:video.dataset.videoId}));return;}
    var link=e.target.closest('.view a[href]');if(!link)return;var url;try{url=new URL(link.href);}catch(err){return;}
    if(!/^https?:$/.test(url.protocol)||url.origin===location.origin)return;
    // Do not forward arbitrary query parameters or personal identifiers.
    event('article_open',Object.assign(context(link),{link_domain:url.hostname,link_url:url.origin+url.pathname}));
  },true);
  document.addEventListener('playing',function(e){if(e.target.tagName==='VIDEO')event('video_start',context(e.target));},true);
})();
