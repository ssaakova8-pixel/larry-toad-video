/* ===== звук v7: надёжный запуск на iPhone, эффекты, музыка по сюжету, голоса рассказчика и героев =====
   Почему раньше было тихо: iOS включает звук только по касанию (touchend/click, а не pointerdown) и глушит WebAudio, пока стоит
   «беззвучный» переключатель. Здесь: (1) разблокировка по всем событиям касания, пока контекст не станет running;
   (2) «тихий» <audio> и navigator.audioSession='playback' — звук идёт даже с выключенным звонком; (3) видимая подсказка и проверка звука. */
var AC=null,AM=null,GM=null,GS=null,GV=null,GAMB=null,audioOK=false,wantMus='',musCur='',musL=null,AUD={st:'none',touches:0,el:null,tried:0,tick:0,fails:0};
var MUS=window.MUS||{},MUSB={},MUSW={},MUSU=[],VOICE=window.VOICE||{};
/* звук лежит в странице «спящими» блоками (<script type=text/plain id=D_...>) и берётся только когда нужен — телефону не надо держать всё в памяти */
function mdat(id,inl){if(inl&&inl.length>8)return inl;var e=document.getElementById('D_'+id);return e?e.textContent:''}
function audioState(){return!AC?'none':AC.state}
function audioHold(){return!!(AC&&AC.state==='running')}
/* тихий звук, который держит звуковую сессию iOS в режиме «воспроизведение» (иначе переключатель звонка глушит игру) */
function silentWavUrl(){try{var sr=8000,n=sr,b=new ArrayBuffer(44+n*2),v=new DataView(b),i;function s(o,t){for(var j=0;j<t.length;j++)v.setUint8(o+j,t.charCodeAt(j))}
 s(0,'RIFF');v.setUint32(4,36+n*2,true);s(8,'WAVE');s(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);s(36,'data');v.setUint32(40,n*2,true);
 for(i=0;i<n;i++)v.setInt16(44+i*2,(i%2)?1:-1,true);return URL.createObjectURL(new Blob([b],{type:'audio/wav'}))}catch(e){return null}}
function silentPlay(){try{if(!AUD.el){var u=silentWavUrl();if(!u)return;var a=document.createElement('audio');a.src=u;a.loop=true;a.setAttribute('playsinline','');a.setAttribute('webkit-playsinline','');a.preload='auto';a.volume=1;a.style.display='none';document.body.appendChild(a);AUD.el=a}
 var p=AUD.el.play();if(p&&p.catch)p.catch(function(){})}catch(e){}}
function audioBuild(){if(AC)return true;
 try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return false;AC=new C({latencyHint:'interactive'})}catch(e){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e2){AC=null;return false}}
 AM=AC.createGain();AM.gain.value=.9;var cp=AC.createDynamicsCompressor();cp.threshold.value=-14;cp.knee.value=18;cp.ratio.value=3;cp.attack.value=.01;cp.release.value=.25;
 AM.connect(cp);cp.connect(AC.destination);
 GM=AC.createGain();GS=AC.createGain();GV=AC.createGain();GAMB=AC.createGain();GM.connect(AM);GS.connect(AM);GV.connect(AM);GAMB.connect(AM);audioVol();
 AC.onstatechange=function(){audioSync()};return true}
function audioSync(){var on=audioHold();if(on&&!audioOK){audioOK=true;atlasLoad();if(wantMus)music(wantMus,{force:true})}else if(!on&&audioOK){audioOK=false}}
/* вызывается из жестов пользователя (touchend / pointerup / click / keydown) */
function audioUnlock(){AUD.touches++;
 try{if(navigator.audioSession&&navigator.audioSession.type!=='playback')navigator.audioSession.type='playback'}catch(e){}
 if(!audioBuild())return;
 silentPlay();
 try{if(AC.state!=='running'){var p=AC.resume();if(p&&p.then)p.then(audioSync,function(){AUD.fails++})}}catch(e){}
 try{var b=AC.createBuffer(1,1,22050),s=AC.createBufferSource();s.buffer=b;s.connect(AC.destination);s.start(0)}catch(e){}
 audioSync()}
['touchend','pointerup','click','keydown','mouseup'].forEach(function(ev){window.addEventListener(ev,function(){if(!audioHold()||!AUD.el||AUD.el.paused)audioUnlock()},{capture:true,passive:true})});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&AC&&AC.state!=='running'){try{AC.resume()}catch(e){}}if(document.hidden&&AC){}});
window.addEventListener('pageshow',function(){if(AC&&AC.state!=='running'){try{AC.resume()}catch(e){}}});
function audioVol(){if(!AC)return;var s=sv.set;GM.gain.value=Math.pow(s.mu,1.6)*.9*(musDuck||1);GS.gain.value=Math.pow(s.fx,1.5)*.9;GV.gain.value=Math.pow(s.vo,1.2)*1.25;GAMB.gain.value=Math.pow(s.fx,1.5)*.5}
var musDuck=1;
function tone(f,d,type,v,o){if(!AC||!audioOK)return;o=o||{};var t0=AC.currentTime+(o.at||0),os=AC.createOscillator(),gn=AC.createGain();os.type=type||'sine';os.frequency.setValueAtTime(f,t0);if(o.to)os.frequency.exponentialRampToValueAtTime(Math.max(20,o.to),t0+d);
 var a=o.a||.008;gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(v,t0+a);gn.gain.exponentialRampToValueAtTime(.0008,t0+d);os.connect(gn);gn.connect(o.dest||GS);os.start(t0);os.stop(t0+d+.05);
 if(o.vib){var l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=o.vib;lg.gain.value=f*.012;l.connect(lg);lg.connect(os.frequency);l.start(t0);l.stop(t0+d+.05)}}
var _nb=null;function noiseBuf(){if(_nb)return _nb;var n=AC.sampleRate*2,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0),i;for(i=0;i<n;i++)d[i]=Math.random()*2-1;return _nb=b}
function noise(d,v,o){if(!AC||!audioOK)return;o=o||{};var t0=AC.currentTime+(o.at||0),s=AC.createBufferSource();s.buffer=noiseBuf();var f=AC.createBiquadFilter();f.type=o.ft||'bandpass';f.frequency.setValueAtTime(o.f||1000,t0);if(o.to)f.frequency.exponentialRampToValueAtTime(Math.max(40,o.to),t0+d);f.Q.value=o.q||1;
 var gn=AC.createGain();gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(v,t0+(o.a||.01));gn.gain.exponentialRampToValueAtTime(.0008,t0+d);s.connect(f);f.connect(gn);gn.connect(o.dest||GS);s.start(t0,Math.random());s.stop(t0+d+.05)}
function bell(f,v,o){o=o||{};f=Math.min(f,1100);tone(f,.9,'sine',v*.8,o);tone(f*2,.5,'sine',v*.18,o)}   /* v8: запасной звук, пока не загружен атлас — только мягкий синус, без звона */
var PENT=[0,2,4,7,9,12,14,16,19,21,24];
/* ---- атлас звуков событий (готовые сэмплы, склеены в один файл) ---- */
var SFXM=window.SFXM||{},SFXBUF=null,atlasState=0;
function atlasDecode(b64,cb){try{var bin=atob(b64),n=bin.length,u=new Uint8Array(n);for(var i=0;i<n;i++)u[i]=bin.charCodeAt(i);AC.decodeAudioData(u.buffer,cb,function(){})}catch(e){}}
function atlasLoad(){if(atlasState||!AC)return;atlasState=1;var d=mdat('sfx',window.SFXB64);if(d)atlasDecode(d,function(b){SFXBUF=b})}
function playAt(buf,m,gain,dest,rate,at){var s=AC.createBufferSource();s.buffer=buf;if(rate)s.playbackRate.value=rate;var g2=AC.createGain();g2.gain.value=gain;s.connect(g2);g2.connect(dest);var off=Math.max(0,m[0]-.02);s.start(AC.currentTime+(at||0),off,m[1]+.08)}
var SFXG={land:1,ui:.95,back:.95,tick:.9,page:.9,nope:.95,fire0:1.1,fire1:1.1,fire2:1.1,fire3:1.1,fire4:1.1,fire5:1.1,fire6:1.1,fire7:1.1,fire8:1.1,fire9:1.1};
function sfx(n,a){if(!AC||!audioOK)return;var key=n==='fire'?'fire'+Math.max(0,Math.min(9,(a|0))):n;
 if(SFXBUF&&SFXM[key]){playAt(SFXBUF,SFXM[key],SFXG[key]||1,GS,1);return}
 sfxSynth(n,a)}
var chargeOsc=null,chargeGain=null;
function sfxSynth(n,a){if(!AC||!audioOK)return;a=a||0;
 switch(n){
 case'ui':tone(740,.07,'sine',.11,{to:560});break;
 case'back':tone(520,.09,'sine',.1,{to:360});break;
 case'jump':tone(330,.2,'sine',.13,{to:760});noise(.18,.07,{f:900,to:2600,q:.8});break;
 case'land':tone(150,.16,'sine',.22,{to:80});noise(.14,.1,{f:500,to:200,q:.7});break;
 case'perfect':tone(150,.16,'sine',.2,{to:80});bell(880,.11);bell(1320,.07,{at:.07});break;
 case'splash':noise(.5,.2,{f:1400,to:300,q:.6,a:.02});noise(.3,.12,{f:600,to:200,at:.05,ft:'lowpass'});tone(220,.3,'sine',.08,{to:90});break;
 case'fire':{var k=PENT[Math.min(10,a|0)];bell(784*Math.pow(2,k/12),.1);break}
 case'hit':tone(180,.3,'triangle',.28,{to:60});noise(.2,.18,{f:700,to:200});break;
 case'slash':noise(.16,.12,{f:700,to:2400,q:.8,ft:'bandpass'});break;
 case'parry':bell(880,.16);bell(1100,.1,{at:.05});break;
 case'kill':tone(420,.14,'triangle',.14,{to:140});noise(.12,.1,{f:1200,to:300});break;
 case'bell':bell(660,.18);break;
 case'boom':tone(92,1.5,'sine',.5,{to:70,vib:5,a:.25});tone(184,1.2,'sine',.15,{a:.3,vib:5});break;
 case'dawn':[0,4,7,12,16,19,24].forEach(function(s,i){bell(523*Math.pow(2,s/12),.14,{at:i*.11})});break;
 case'perk':[0,7,12].forEach(function(s,i){bell(660*Math.pow(2,s/12),.12,{at:i*.07})});break;
 case'win':[0,4,7,12,7,12,16].forEach(function(s,i){bell(523*Math.pow(2,s/12),.15,{at:i*.13})});break;
 case'fail':[7,4,0].forEach(function(s,i){tone(330*Math.pow(2,s/12),.5,'triangle',.14,{at:i*.18,to:300*Math.pow(2,s/12)})});break;
 case'swim':for(var i=0;i<7;i++){noise(.26,.17,{f:900,to:260,q:.7,a:.02,at:i*.3,ft:'bandpass'});noise(.2,.09,{f:400,to:150,ft:'lowpass',at:i*.3+.07});tone(95,.18,'sine',.1,{at:i*.3,to:60})}break;
 case'gallop':for(var j=0;j<6;j++){tone(90,.12,'sine',.22,{at:j*.18,to:60});tone(70,.1,'sine',.18,{at:j*.18+.09,to:50})}break;
 case'zap':tone(780,.2,'triangle',.07,{to:300});break;
 case'tele':tone(520,.12,'sine',.07,{to:520});tone(520,.12,'sine',.07,{at:.16});break;
 case'buy':bell(988,.14);bell(1480,.1,{at:.08});break;
 case'nope':tone(200,.18,'triangle',.14,{to:140});break;
 case'wing':noise(.1,.05,{f:300,q:2});break
 case'snort':noise(.22,.2,{f:380,to:220,q:.7,ft:'lowpass',a:.03});tone(110,.18,'sawtooth',.06,{to:80});noise(.18,.14,{f:420,to:260,ft:'lowpass',at:.26,a:.03});break
 case'cog':tone(900,.03,'sine',.03);break
 case'page':noise(.07,.05,{f:2600,q:1.2});tone(520,.06,'sine',.04,{to:420});break}}
function chargeStart(){if(!AC||!audioOK||chargeOsc)return;chargeOsc=AC.createOscillator();chargeGain=AC.createGain();chargeOsc.type='sine';chargeOsc.frequency.value=280;chargeGain.gain.value=0;chargeOsc.connect(chargeGain);chargeGain.connect(GS);chargeOsc.start();chargeGain.gain.linearRampToValueAtTime(.07,AC.currentTime+.05)}
function chargeSet(c){if(chargeOsc)chargeOsc.frequency.setTargetAtTime(280+c*520,AC.currentTime,.03)}
function chargeStop(){if(!chargeOsc)return;var o=chargeOsc,gn=chargeGain;chargeOsc=null;gn.gain.cancelScheduledValues(AC.currentTime);gn.gain.setTargetAtTime(0,AC.currentTime,.03);o.stop(AC.currentTime+.15)}
/* ---- амбиент ---- */
var ambN=null,ambWant=null;
function ambient(kind){ambWant=kind;if(!AC||!audioOK)return;if(ambN){try{ambN.s.stop()}catch(e){}ambN=null}if(!kind)return;
 var s=AC.createBufferSource();s.buffer=noiseBuf();s.loop=true;var f=AC.createBiquadFilter(),gn=AC.createGain();var lf=AC.createOscillator(),lg=AC.createGain();
 f.type='lowpass';f.frequency.value=kind==='wind'?600:420;gn.gain.value=kind==='wind'?.04:.03;lf.frequency.value=kind==='wind'?.18:.12;lg.gain.value=kind==='wind'?.03:.015;lf.connect(lg);lg.connect(gn.gain);s.connect(f);f.connect(gn);gn.connect(GAMB);s.start();lf.start();ambN={s:s,l:lf}}
/* ---- музыка: длинные треки по ходу сюжета (mp3 base64 в MUS), ленивое декодирование, плавные переходы ---- */
var MVOL={m_boss:1,m_boss2:1,m_dawn:1};      /* подстройка громкости отдельных треков */
var MONCE={};                                  /* все треки идут по кругу */
function decodeMus(name,cb){var b=MUSB[name];if(b&&b!=='pending'){touchMus(name);cb(b);return}
 if(b==='pending'){(MUSW[name]=MUSW[name]||[]).push(cb);return}if(!MUS[name])return;
 MUSB[name]='pending';MUSW[name]=[cb];
 try{var bin=atob(mdat('m_'+name,MUS[name])),n=bin.length,ab=new Uint8Array(n);for(var i=0;i<n;i++)ab[i]=bin.charCodeAt(i);
  AC.decodeAudioData(ab.buffer,function(buf){MUSB[name]=buf;touchMus(name);var w=MUSW[name]||[];MUSW[name]=null;w.forEach(function(f){f(buf)})},function(){MUSB[name]=null;MUSW[name]=null})}catch(e){MUSB[name]=null}}
function touchMus(name){var i=MUSU.indexOf(name);if(i>=0)MUSU.splice(i,1);MUSU.push(name);
 while(MUSU.length>2){var old=MUSU.shift();if(old===musCur||old===wantMus){MUSU.push(old);if(MUSU.length<=2)break;continue}MUSB[old]=null}}
function curve(up){var a=new Float32Array(48);for(var i=0;i<48;i++){var x=i/47;a[i]=up?x:1-x}return a}   /* линейно: хвост и начало петли — один и тот же звук, сумма должна быть ровно 1 */
var CV_UP=null,CV_DN=null;
var MFALL={m_prolog:'m_menu',m_sad:'m_menu',m_dawn:'m_menu',m_boss2:'m_boss',m_puz:'m_menu',m_camp:'m_menu',m_race:'m_ch1',m_night:'m_ch2'};
function music(name,o){o=o||{};if(name&&!MUS[name]&&MFALL[name])name=MFALL[name];wantMus=name;if(!AC||!audioOK||!name)return;if(musCur===name&&!o.force)return;if(!MUS[name]){return}
 decodeMus(name,function(b){if(wantMus!==name)return;if(musCur===name&&!o.force)return;startLoop(name,b,o)})}
function startLoop(name,b,o){if(!CV_UP){CV_UP=curve(true);CV_DN=curve(false)}stopLoop(o.fade||1.4);var gn=AC.createGain(),v=(MVOL[name]==null?1:MVOL[name]);gn.gain.value=0;gn.connect(GM);gn.gain.linearRampToValueAtTime(v,AC.currentTime+(o.fade||1.8));
 var once=!!MONCE[name];var L={name:name,gn:gn,srcs:[],tm:0,dur:b.duration,xf:Math.min(1.2,b.duration*.03),once:once};musL=L;musCur=name;loopSched(L,b,AC.currentTime+.05,true)}
function loopSched(L,b,when,first){if(musL!==L||!AC)return;var s=AC.createBufferSource();s.buffer=b;var g2=AC.createGain();s.connect(g2);g2.connect(L.gn);var xf=L.xf,endT=when+b.duration;
 if(first)g2.gain.setValueAtTime(1,when);else g2.gain.setValueCurveAtTime(CV_UP,when,xf);
 if(L.once){g2.gain.setValueAtTime(1,Math.max(when,endT-4));g2.gain.linearRampToValueAtTime(0,endT)}else g2.gain.setValueCurveAtTime(CV_DN,endT-xf,xf);
 s.start(when);s.stop(endT+.05);L.srcs.push(s);if(L.srcs.length>3)L.srcs.shift();
 if(L.once)return;
 var nw=endT-xf;L.tm=setTimeout(function(){loopSched(L,b,nw,false)},Math.max(100,(nw-AC.currentTime-2)*1000))}
function stopLoop(fade){var L=musL;if(!L)return;musL=null;musCur='';clearTimeout(L.tm);var t=AC.currentTime;try{L.gn.gain.cancelScheduledValues(t);L.gn.gain.setValueAtTime(L.gn.gain.value,t);L.gn.gain.linearRampToValueAtTime(0,t+fade)}catch(e){}
 setTimeout(function(){L.srcs.forEach(function(s){try{s.stop()}catch(e){}});try{L.gn.disconnect()}catch(e){}},fade*1000+150)}
function fadeMusic(){if(AC)stopLoop(1.2);wantMus=''}
/* музыка тише, пока говорит голос */
function duckMusic(on){musDuck=on?.34:1;if(!AC||!GM)return;GM.gain.cancelScheduledValues(AC.currentTime);GM.gain.setTargetAtTime(Math.pow(sv.set.mu,1.6)*.9*musDuck,AC.currentTime,.14)}
/* ---- голоса: рассказчик и герои (готовые дорожки VOICE[ключ]=[длительность, mp3 base64]) ---- */
var VOB={},VOBU=[],voiceNode=null,voiceTok=0,voiceEndCb=null,voiceBusyT=0;
function voiceDur(w,t){var k=vkey(w,t),u=UVOICE[k];if(u)return u.dur;var v=VOICE[k];return v?v[0]:0}
function voiceHas(w,t){var k=vkey(w,t);return!!(UVOICE[k]||VOICE[k])}
/* твоя запись из Студии: достаём, чистим звукорежиссёром и кладём в кэш */
function uvDecode(k,ok,bad){var u=UVOICE[k];if(!u||!u.raw){bad();return}
 try{AC.decodeAudioData(u.raw.slice(0),function(buf){engineerBuf(buf,function(b){if(b)ok(b);else bad()})},function(){bad()})}catch(e){bad()}}
function getVBuf(k,cb,syn){var ck=syn?k+'~':k,b=VOB[ck];if(b&&b!=='pending'){cb(b);return}if(b==='pending'){(VOB[ck+'_w']=VOB[ck+'_w']||[]).push(cb);return}
 VOB[ck]='pending';VOB[ck+'_w']=[cb];
 var ok=function(buf){VOB[ck]=buf;VOBU.push(ck);while(VOBU.length>16){delete VOB[VOBU.shift()]}var w=VOB[ck+'_w']||[];delete VOB[ck+'_w'];w.forEach(function(f){f(buf)})},bad=function(){delete VOB[ck];delete VOB[ck+'_w']};
 if(!syn&&UVOICE[k]){uvDecode(k,ok,bad);return}
 try{var bin=atob(mdat('v_'+k,VOICE[k][1])),n=bin.length,a8=new Uint8Array(n);for(var i=0;i<n;i++)a8[i]=bin.charCodeAt(i);AC.decodeAudioData(a8.buffer,ok,bad)}catch(e){bad()}}
function voicePre(w,t){if(!AC||!audioOK)return;var k=vkey(w,t);if((UVOICE[k]||VOICE[k])&&!VOB[k])getVBuf(k,function(){})}
/* играет реплику; возвращает её длительность в секундах (0 — озвучки нет или звук выключен). cb вызывается, когда голос договорил.
   Если в Студии есть твоя запись — играет она. */
function voicePlay(w,t,cb){if(w==='por'){sfx('snort');return 0}return voicePlayK(vkey(w,t),cb)}
function voicePlayK(k,cb,syn){if(!AC||!audioOK||sv.set.vo<=0)return 0;var u=syn?null:UVOICE[k],v=VOICE[k];if(!u&&!v)return 0;var dur=u?u.dur:v[0];
 voiceStop();var tok=voiceTok;voiceEndCb=cb||null;voiceBusyT=AC.currentTime+dur+.5;
 getVBuf(k,function(b){if(tok!==voiceTok)return;var s=AC.createBufferSource();s.buffer=b;var gn=AC.createGain();s.connect(gn);gn.connect(GV);s.start();voiceNode={s:s,gn:gn,k:k};duckMusic(true);
  s.onended=function(){if(voiceNode&&voiceNode.s===s){voiceNode=null;duckMusic(false);var f=voiceEndCb;voiceEndCb=null;voiceBusyT=0;if(f&&tok===voiceTok)f()}}},syn);
 return dur}
function voiceBusy(){return!!voiceNode||(AC&&voiceBusyT>AC.currentTime)}
function voiceStop(){voiceTok++;voiceEndCb=null;voiceBusyT=0;if(voiceNode){var n=voiceNode;voiceNode=null;try{n.gn.gain.setTargetAtTime(0,AC.currentTime,.02);n.s.stop(AC.currentTime+.12)}catch(e){}duckMusic(false)}}
function voiceSay(w,t){return voicePlay(w,t)}
function blip(){}function babble(){return 0}
/* проверка звука для настроек: короткий колокольчик и фраза рассказчика */
function soundTest(){audioUnlock();setTimeout(function(){if(audioHold()){bell(784,.2);bell(1175,.14,{at:.12});var d=voicePlay('nar','Если ты слышишь этот голос, звук работает.');if(!d)toast('Голос не найден в файле','#ffcf8a')}else toast('Звук ещё закрыт: коснись экрана и попробуй снова','#ffcf8a')},120)}
