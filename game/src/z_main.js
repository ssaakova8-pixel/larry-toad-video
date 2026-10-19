/* ===== запуск ===== */
(function boot(){load();if(typeof idbLoadMeta==='function')idbLoadMeta();rs();window.addEventListener('resize',rs);window.addEventListener('orientationchange',function(){setTimeout(rs,200)});
 var h=location.hash.replace('#','');
 var start=function(){requestAnimationFrame(frame);
  var m=/^race(\d+)$/.exec(h);if(m){setScene('run',{mode:'race',river:+m[1]});return}
  m=/^story(\d+)$/.exec(h);if(m){setScene('run',{mode:'story',ch:+m[1],replay:true});return}
  m=/^chain(\d+)$/.exec(h);if(m){sv.cmp=+m[1];setScene('title');chainPlay(+m[1]);return}
  m=/^night(\d*)$/.exec(h);if(m){setScene('run',{mode:'endless',night:+m[1]||1});return}
  m=/^puz(\d+)\.(\d+)$/.exec(h);if(m){setScene('puz',{ch:+m[1],pg:+m[2],ctx:'book'});return}
  m=/^scene=(\w+)$/.exec(h);if(m){setScene('story',{id:m[1],ch:0});return}
  m=/^part(\d)$/.exec(h);if(m){setScene('part',{ch:+m[1]});return}
  if(h==='end'){setScene('end',{});return}
  if(h==='pbook'){setScene('pbook');return}
  if(h==='map'){setScene('map');return}
  if(SC.title){setScene('title');return}
  setScene('run',{mode:'race',river:0})};
 var fontsReady=document.fonts&&document.fonts.load?Promise.all([document.fonts.load('500 20px Lora'),document.fonts.load('italic 500 20px Lora'),document.fonts.load('700 20px Inter'),document.fonts.load('600 20px Inter')]):Promise.resolve();
 var done=false;function go1(){if(done)return;done=true;start()}fontsReady.then(go1,go1);setTimeout(go1,1500)})();
