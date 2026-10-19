/* ===== p3: сцена забега — игровой цикл с фиксированным шагом, ввод, переходы ===== */
function runMusic(){var T=['m_ch1','m_ch2','m_ch3','m_ch4','m_ch5'];return S.mode==='story'?T[S.land]:S.mode==='race'?'m_race':'m_night'}
function runSeed(cfg){if(cfg.seed!=null)return cfg.seed;if(cfg.mode==='story')return 5100+cfg.ch*37;if(cfg.mode==='race')return(cfg.custom?cfg.custom.seed:RIVERS[cfg.river].seed);return(Date.now()&0x7fffffff)^0x5a5a}
function runStart(cfg){
 var sc={mode:cfg.mode,seed:runSeed(cfg),up:cfg.mode==='race'?UP0:sv.up};
 if(cfg.mode==='story'){sc.ch=cfg.ch;sc.assist=Math.min(3,((sv.tries[cfg.ch]|0)>>1))}else if(cfg.mode==='race'){sc.river=cfg.custom?null:cfg.river;if(cfg.custom)sc.custom=cfg.custom}else sc.night=cfg.night||1;
 S=newSim(sc);newView(S);V.cfg=cfg;V.hold=false;V.pid=-1;V.penFlash=0;V.delta=null;
 if(S.mode==='race')ghostInit(cfg);
 sv.runs++;
 ambient(S.mode==='story'&&(S.land===1||S.land===4)?'wind':'water');music(runMusic());duckMusic(false);
 if(S.mode==='endless')V.banner=3.2;
 if(S.mode==='story'&&cfg.chain==null&&!cfg.again){setTimeout(function(){if(V&&S&&V.cfg===cfg){V.narT=-99;var tx=STAGEI[cfg.ch];if(tx&&sv.set.nar&&(DEBUG||(audioHold()&&voiceHas('nar',tx)))){V.narT=V.t;say('nar',tx,4.2)}}},900)}
 else if(S.mode==='race'){setTimeout(function(){if(V&&S&&V.cfg===cfg)narSay('raceStart')},1100)}}

/* ---------- призрак: вторая симуляция по записи нажатий ---------- */
function ghostRec(cfg){var id=cfg.river;if(id==null)return null;var g0=cfg.ghost;if(g0===null)return null;if(g0===undefined)g0=defaultGhost(id);if(!g0)return null;
 if(g0.kind==='me'){var r=sv.race[id];if(r&&r.rec&&r.rec.length)return{rec:r.rec,name:'Твой рекорд'}}
 else if(g0.kind==='bot'){var gh=GH[id]&&GH[id][g0.i];if(gh&&gh.rec)return{rec:gh.rec,name:gh.n}}
 else if(g0.kind==='friend'){var f=sv.codes&&sv.codes[id]&&sv.codes[id][g0.i];if(f&&f.rec)return{rec:f.rec,name:f.n}}
 return null}
function ghostInit(cfg){V.ghost=null;var gr=ghostRec(cfg);if(!gr)return;
 var tg=newSim(S.cfg),arr={},i=0,guard=0,rec=gr.rec;
 while(tg.phase==='play'&&guard++<120*400){while(i<rec.length&&rec[i]===tg.tick){simInput(tg,INPN[rec[i+1]]);i+=2}simStep(tg);if(tg.F.mode==='sit'&&arr[tg.F.pi]==null)arr[tg.F.pi]=tg.clock+tg.pen}
 if(tg.phase!=='win'){return}
 var mx=S.pads.length;for(var k=mx;k>=0;k--)if(arr[k]==null)arr[k]=arr[k+1];
 V.ghost={S:newSim(S.cfg),rec:rec,i:0,name:gr.name,arr:arr,total:tg.finishT}}
function ghostMark(j){var G=V&&V.ghost;if(!G||j==null||!S.started)return;var a=G.arr[j];if(a!=null)V.delta=(S.clock+S.pen)-a}
function ghostStep(){var G=V.ghost;if(!G||!S.started)return;var gs=G.S;while(G.i<G.rec.length&&G.rec[G.i]===gs.tick){simInput(gs,INPN[G.rec[G.i+1]]);G.i+=2}if(gs.phase==='play')simStep(gs);gs.ev.length=0}

/* ---------- ввод ---------- */
function canInput(){return S&&!V.paused&&V.pk==null&&!V.failUI&&S.phase!=='win'&&S.phase!=='fail'&&S.phase!=='dawn'&&S.phase!=='perk'}
function holdStart(){if(!canInput()||V.hold)return;V.hold=true;V.holdAt=performance.now();simInput(S,'down');if(S.mode==='race')sv.seen.rjump=1}
function holdEnd(){if(!S||!V.hold)return;V.hold=false;chargeStop();var held=performance.now()-V.holdAt;
 if((sv.set.sc|0)===1&&held<JUMP.tapT*1000){simInput(S,'cancel');simInput(S,'strike');sv.seen.strike=1;return}
 simInput(S,'up');sv.seen.jump=1}
function doStrike(){if(!canInput())return;simInput(S,'strike');sv.seen.strike=1}
function doDash(){if(!canInput())return;simInput(S,'dash')}

/* ---------- шаг цикла ---------- */
function stepAll(){simStep(S);if(V.ghost)ghostStep()}
function runUpdate(dt){if(!S)return;
 if(V.paused){return}
 var sdt=dt;if(V.hs>0&&S.mode!=='race'){V.hs-=dt;sdt=dt*.15}
 if(S.phase==='perk')sdt=0;
 V.acc+=sdt;var n=0;while(V.acc>=DT&&n<14){stepAll();V.acc-=DT;n++}if(n>=14)V.acc=0;
 drainEvents();viewTick(dt);camUpdate(dt);updateParts(dt);
 var F=S.F;if(V.hold&&F.mode==='sit'&&F.stuck<=0&&canInput()){chargeStart();chargeSet(F.c)}else if(chargeOsc)chargeStop();
 if(S.phase==='dawn'||S.phase==='perk')V.dawnT+=dt;else V.dawnT=0;
 var ph=S.phase;
 if(ph==='fail'&&S.phT>.9&&!V.failUI){V.failUI=true;V.hold=false;chargeStop();
  if(S.mode==='story'){var tn=sv.tries[S.ch]=(sv.tries[S.ch]|0)+1,as=Math.min(3,tn>>1);V.assistUp=0;if(as>(S.cfg.assist|0)){S.cfg.assist=as;S.maxP=maxPetals(S);V.assistUp=as}save()}}
 if(ph==='win'){if(S.mode==='race'&&S.phT>1.5&&!V.done){V.done=true;raceDone()}else if(S.mode==='story'&&!S.cs.boss&&S.phT>2.2&&!V.done){V.done=true;runDone()}}
 if(ph==='dawn'&&S.phT>2.4&&!V.pk){V.pk=perkChoices(S);S.phase='perk';sfx('perk')}}
function choosePerk(k){pickPerk(S,k);sfx('buy');V.pk=null;V.banner=3.2;V.dawnT=0;V.palI=runPal(S);V.bg=null;V.said={};music(runMusic());V.hold=false}

/* ---------- выходы ---------- */
function runQuit(){chargeStop();voiceStop();V.paused=false;save();if(S.mode==='story')go(V.cfg&&V.cfg.chain!=null?'title':'map');else if(S.mode==='race')go('rivers');else nightEnd()}
function runDone(){if(V.fin)return;V.fin=true;var cs=sv.cs,ch=S.ch,pct=S.fireTot?S.fireN/S.fireTot:1,stars=1+(S.noHurt&&!S.falls?1:0)+(pct>=.8?1:0);sv.fire+=S.fire;sv.firetot+=S.fire;delete sv.tries[ch];
 var first=cs[ch]<0;cs[ch]=Math.max(cs[ch],stars);save();storyAfter(ch,{stars:stars,pct:pct,fire:S.fire,first:first,chain:V.cfg.chain})}
function nightEnd(){if(V.endDone)return;V.endDone=true;var night=S.night,pads=S.score,fire=S.fire;sv.fire+=fire;sv.firetot+=fire;var newB=night>sv.nb;if(newB)sv.nb=night;if(pads>sv.pb)sv.pb=pads;var pg=bookUnlock(night);
 var daily=V.cfg&&V.cfg.daily;if(daily){var dk=dayNum();if(sv.dayKey!==dk){sv.dayKey=dk;sv.dayBest=0;if(sv.lastDay===dk-1)sv.streak++;else sv.streak=1;sv.lastDay=dk}if(night>sv.dayBest)sv.dayBest=night}
 save();go('result',{mode:daily?'daily':'night',night:night,pads:pads,fire:fire,newBest:newB,page:pg,kills:S.kills,parries:S.parries})}
function dayNum(){return Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/86400000)}
function raceDone(){var id=S.cfg.river,t=S.finishT,rec=sv.race[id]=sv.race[id]||{},par=RIVERS[id].par,m=medalOf(par,t),prev=rec.best||null,nb=!prev||t<prev;
 if(nb){rec.best=t;rec.rec=S.rec.slice();rec.pen=S.pen;rec.falls=S.falls;rec.perf=S.perfects}rec.medal=Math.max(rec.medal||0,m);rec.runs=(rec.runs||0)+1;sv.fire+=S.fire;save();
 go('rresult',{river:id,t:t,m:m,newBest:nb,prev:prev,falls:S.falls,pen:S.pen,perf:S.perfects,combo:S.bestCombo,rec:S.rec.slice(),seed:S.seed,ghost:V.ghost?{name:V.ghost.name,t:V.ghost.total}:null})}

/* ---------- сцена ---------- */
function runDraw(){HS=H>=W*1.05?1.2:1.0;worldDraw();hudDraw();if(S.phase!=='win')drawBubble();bannerDraw();
 if((S.mode!=='endless'||S.night===1)&&S.phase!=='win'&&S.phase!=='fail'&&S.phase!=='dawn'&&S.phase!=='perk')introCard();coachDraw();
 if(S.phase==='win'&&S.mode==='story')winDraw();
 if(S.phase==='dawn'||S.phase==='perk')dawnDraw();
 if(V.failUI)failDraw();
 if(V.paused)pauseDraw();
 if(DEBUG){txt('t='+S.tick+' x='+S.F.x.toFixed(2)+' '+S.F.mode+' ph='+S.phase+' c='+S.F.c.toFixed(2)+' falls='+S.falls,SAFE.l+8,H-8,12,'#fff',{fam:FU,w:600,sh:'#000'})}}
SC.run={
 enter:function(cfg){runStart(cfg)},
 leave:function(){chargeStop();ambient(null);U=UB;S=S},
 resize:function(){if(V)V.bg=null},
 hide:function(){if(S&&!V.paused&&S.phase!=='fail'&&S.phase!=='win')runPause(true)},
 update:function(dt){runUpdate(dt)},
 draw:function(){runDraw()},
 down:function(p){if(!canInput()||V.hold)return;p.hold=true;V.pid=p.id;V.btnHold=false;holdStart()},
 up:function(p){if(p.hold&&V.hold&&V.pid===p.id&&!V.btnHold)holdEnd()},
 key:function(e,dn){if(!S)return false;var k=e.code;
  if(k==='Space'||k==='ArrowUp'||k==='ArrowRight'){if(dn&&!e.repeat){if(!V.paused)holdStart()}else if(!dn)holdEnd();return true}
  if((k==='KeyX'||k==='KeyZ'||k==='Enter')&&dn&&!e.repeat){doStrike();return true}
  if((k==='KeyP'||k==='ShiftLeft'||k==='KeyC')&&dn){doDash();return true}
  if(k==='Escape'&&dn){runPause(!V.paused);return true}
  if(k==='KeyR'&&dn&&S.mode==='race'){runStart(V.cfg);return true}return false}};
