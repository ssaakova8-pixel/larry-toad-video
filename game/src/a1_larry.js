/* ===== Ларри Тоут: лягушонок-оруженосец ===== */
var LC={sk:'#7fd24a',sk2:'#3fa33f',sk3:'#1f6b34',bel:'#f3f0b0',bel2:'#d9d37f',steel:'#cfd9e6',steel2:'#8497ae',steel3:'#4b5b73',red:'#d83a44',red2:'#962136',gold:'#ffd04a',ol:'#16301c',tg:'#ee6f8a'};
/* o: sq(0..1 присел), st(0..1 вытянулся), tilt(рад), bl(моргание), mouth(0 закрыт,1 улыбка,2 «о»,3 широко), lid(0..1), tilt2 (брови), lx,ly взгляд,
   tongue(0..1), tang(угол языка), sw(угол меча, null=в ножнах), t(время), fear(0..1), lamp(0..1 яркость искры), cape(фаза), face(-1 влево) */
function drawLarry(g,x,y,s,o){o=o||{};var t=o.t||0,sq=o.sq||0,st=o.st||0,lw=.045,f=o.face||1,breathe=Math.sin(t*2.2)*.012*(1-sq);
 g.save();g.translate(x,y);g.scale(s*f,s);
 if(o.tilt)g.rotate(o.tilt);
 g.scale(1+sq*.16-st*.10,1-sq*.26+st*.18+breathe);
 var ol=LC.ol,fear=o.fear||0;
 /* плащ */
 var cp=o.cape==null?t*3:o.cape,cw=Math.sin(cp)*.07,cw2=Math.sin(cp+1.3)*.08,air=st>0?.35:0;
 g.beginPath();sp(g,[[-.10,-1.12],[-.42,-1.00],[-.78-air,-.72+cw2],[-1.02-air*1.4,-.34+cw],[-.78-air,-.10+cw2*.5],[-.48,-.40],[-.12,-.62],[.02,-.9]],true,.9);
 g.fillStyle=LG(g,-1,-1,0,-.2,[0,LC.red,1,LC.red2]);g.fill();g.strokeStyle=sh(LC.red2,-.4);g.lineWidth=lw;g.lineJoin='round';g.stroke();
 g.beginPath();sp(g,[[-.12,-1.0],[-.5,-.8],[-.9-air,-.38+cw]],false,.9);g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=.03;g.stroke();
 /* дальняя задняя лапа */
 var ex=st; // вытянутые лапы в прыжке
 g.beginPath();ell(g,-.44,-.34,.30,.2,-.4-ex*.5);fs(g,sh(LC.sk2,-.15),ol,lw);
 limb(g,-.55,-.28,.09,-.78-ex*.35,-.12+ex*.12,.07,sh(LC.sk2,-.15),ol,lw);
 /* стопа дальней лапы */
 if(!ex){g.beginPath();sp(g,[[-.18,-.04],[.22,-.06],[.44,-.02],[.34,.0],[-.2,.0]],true);fs(g,sh(LC.sk2,-.1),ol,lw)}
 /* туловище */
 g.beginPath();sp(g,[[-.55,-.45],[-.6,-.85],[-.3,-1.12],[.22,-1.16],[.56,-.9],[.58,-.52],[.34,-.22],[-.2,-.2]],true,1);
 g.fillStyle=RG(g,.1,-1.0,.05,1.1,[0,LC.sk,.55,LC.sk2,1,LC.sk3]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.lineJoin='round';g.stroke();
 /* живот */
 g.beginPath();sp(g,[[.18,-.98],[.44,-.86],[.5,-.58],[.34,-.34],[.1,-.38],[.02,-.7]],true,1);g.fillStyle=RG(g,.3,-.7,.02,.5,[0,LC.bel,1,LC.bel2]);g.fill();
 /* пятнышки на спине */
 g.fillStyle='rgba(20,90,40,.35)';ell(g,-.28,-.92,.09,.06,.3);g.fill();ell(g,-.12,-1.04,.06,.045,.2);g.fill();ell(g,-.38,-.7,.07,.05,.5);g.fill();
 /* латы: нагрудник */
 g.beginPath();sp(g,[[.04,-1.06],[.40,-1.02],[.54,-.78],[.46,-.52],[.18,-.5],[.02,-.74]],true,1);
 g.fillStyle=LG(g,.0,-1.1,.5,-.5,[0,'#f2f7ff',.35,LC.steel,1,LC.steel2]);g.fill();g.strokeStyle=sh(LC.steel3,-.2);g.lineWidth=lw;g.stroke();
 g.beginPath();g.moveTo(.1,-.98);g.quadraticCurveTo(.2,-.8,.14,-.58);g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=.04;g.lineCap='round';g.stroke();
 /* ремень */
 g.beginPath();g.moveTo(.03,-.48);g.quadraticCurveTo(.26,-.42,.5,-.52);g.strokeStyle='#6b3f1d';g.lineWidth=.07;g.stroke();
 g.beginPath();g.arc(.26,-.45,.045,0,TAU);g.fillStyle=LC.gold;g.fill();
 /* искра-фонарик на груди */
 var la=o.lamp==null?1:o.lamp,fl=1+Math.sin(t*9)*.08;
 g.beginPath();g.moveTo(.14,-1.04);g.quadraticCurveTo(.26,-.92,.3,-.72);g.strokeStyle='#6b3f1d';g.lineWidth=.025;g.stroke();
 g.beginPath();sp(g,[[.27,-.72],[.35,-.70],[.37,-.6],[.31,-.54],[.25,-.6]],true);g.fillStyle=RG(g,.31,-.62,0,.12,[0,'#fffbe0',.5,'#ffd25a',1,'#e08a1a']);fs(g,g.fillStyle,sh('#a05a10',-.2),.02);
 g.fillStyle='#7a4a1a';g.fillRect(.285,-.76,.05,.045);
 if(la>0)glow(g,.31,-.63,.42*fl*la,'#ffd25a',.4*la);
 /* передняя нога (бедро ближнее) */
 g.beginPath();sp(g,[[-.62,-.3],[-.5,-.62],[-.2,-.7],[.02,-.5],[.0,-.22],[-.3,-.1],[-.55,-.14]],true,1);
 g.fillStyle=RG(g,-.3,-.55,.03,.7,[0,LC.sk,.6,LC.sk2,1,LC.sk3]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 g.beginPath();g.moveTo(-.55,-.5);g.quadraticCurveTo(-.3,-.66,-.08,-.52);g.strokeStyle='rgba(220,255,170,.5)';g.lineWidth=.04;g.stroke();
 /* голень+стопа ближней лапы */
 if(!ex){g.beginPath();sp(g,[[-.34,-.08],[.12,-.1],[.38,-.14],[.58,-.06],[.66,.0],[.4,.03],[-.1,.03]],true);g.fillStyle=LG(g,0,-.15,0,.04,[0,LC.sk2,1,LC.sk3]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
  /* перепонки/пальцы */
  g.strokeStyle='rgba(20,70,35,.6)';g.lineWidth=.025;for(var k=0;k<3;k++){g.beginPath();g.moveTo(.2+k*.1,-.1+k*.015);g.lineTo(.62-k*.02,-.01);g.stroke()}
 }else{
  limb(g,-.5,-.35,.12,-.95-ex*.1,-.05+ex*.1,.07,LC.sk2,ol,lw);
  g.beginPath();sp(g,[[-.95,-.12],[-1.2,-.02],[-1.3,.1],[-1.12,.08],[-.95,.0]],true);fs(g,LC.sk3,ol,lw);
 }
 /* рука ближняя */
 var swa=o.sw,ax=.34,ay=-.88;
 if(swa!=null){ // замах мечом
  var hx=ax+Math.cos(swa)*.34,hy=ay+Math.sin(swa)*.34;
  limb(g,ax,ay,.085,hx,hy,.065,LC.sk,ol,lw);
  /* меч */
  g.save();g.translate(hx,hy);g.rotate(swa);
  g.beginPath();g.rect(-.04,-.05,.12,.1);fs(g,'#6b3f1d',ol,.03);
  g.beginPath();g.moveTo(.0,-.14);g.lineTo(.0,.14);g.strokeStyle=LC.gold;g.lineWidth=.06;g.lineCap='round';g.stroke();
  g.beginPath();g.moveTo(.08,-.045);g.lineTo(.95,-.03);g.lineTo(1.08,0);g.lineTo(.95,.03);g.lineTo(.08,.045);g.closePath();
  g.fillStyle=LG(g,0,-.05,0,.05,[0,'#ffffff',.5,LC.steel,1,LC.steel2]);g.fill();g.strokeStyle=sh(LC.steel3,-.2);g.lineWidth=.03;g.stroke();
  g.restore();
 }else{
  limb(g,ax,ay,.085,.5,-.4,.065,LC.sk,ol,lw);
  g.beginPath();g.arc(.52,-.36,.085,0,TAU);fs(g,LC.sk,ol,lw);
 }
 /* голова */
 var hy0=-1.42+(sq*.06),hx0=.22+(st>0?.06:0);
 g.save();g.translate(hx0,hy0);if(st>0)g.rotate(-.12*st);
 /* шея-тень */
 /* затылок + щёки */
 g.beginPath();sp(g,[[-.5,.02],[-.46,-.22],[-.12,-.38],[.34,-.36],[.7,-.2],[.78,.0],[.66,.2],[.2,.3],[-.28,.24]],true,1);
 g.fillStyle=RG(g,.15,-.2,.04,1,[0,LC.sk,.55,LC.sk2,1,LC.sk3]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.lineJoin='round';g.stroke();
 /* щека-румянец */
 g.beginPath();ell(g,.18,.1,.13,.07,.1);g.fillStyle='rgba(255,120,110,.35)';g.fill();
 /* ноздря */
 g.beginPath();g.arc(.66,-.06,.025,0,TAU);g.fillStyle='rgba(15,60,30,.8)';g.fill();
 /* рот */
 var m=o.mouth==null?1:o.mouth,my=.14;
 if(o.tongue>0){var tl=o.tongue*(o.tlen||2.0),ta=o.tang||0;
  g.save();g.translate(.62,my-.03);g.rotate(ta);
  g.beginPath();g.moveTo(0,-.07);g.lineTo(tl,-.06);g.arc(tl,0,.07,-PI/2,PI/2,false);g.lineTo(0,.07);g.closePath();g.fillStyle=LG(g,0,-.07,0,.07,[0,'#ff9db0',1,LC.tg]);g.fill();g.strokeStyle=sh(LC.tg,-.5);g.lineWidth=.035;g.stroke();
  g.beginPath();g.arc(tl,0,.045,0,TAU);g.fillStyle='rgba(255,255,255,.35)';g.fill();g.restore()}
 g.beginPath();
 if(m===2||o.tongue>0){g.moveTo(.0,my-.02);g.quadraticCurveTo(.4,my+.2,.74,my-.04);g.quadraticCurveTo(.4,my+.04,.0,my-.02);g.fillStyle='#6a1d2c';g.fill();g.strokeStyle=ol;g.lineWidth=.04;g.stroke()}
 else if(m===3){g.moveTo(.0,my-.04);g.quadraticCurveTo(.4,my+.34,.74,my-.06);g.quadraticCurveTo(.4,my+.06,.0,my-.04);g.fillStyle='#6a1d2c';g.fill();g.strokeStyle=ol;g.lineWidth=.04;g.stroke();
  g.beginPath();ell(g,.4,my+.15,.15,.07,0);g.fillStyle=LC.tg;g.fill()}
 else if(m===0){g.moveTo(.02,my);g.quadraticCurveTo(.4,my+.02,.74,my-.03);g.strokeStyle=ol;g.lineWidth=.045;g.lineCap='round';g.stroke()}
 else if(m===4){g.moveTo(.06,my+.08);g.quadraticCurveTo(.38,my-.1,.72,my+.06);g.strokeStyle=ol;g.lineWidth=.045;g.lineCap='round';g.stroke()} // грусть/страх
 else{g.moveTo(.02,my-.04);g.quadraticCurveTo(.4,my+.14,.74,my-.06);g.strokeStyle=ol;g.lineWidth=.045;g.lineCap='round';g.stroke()}
 /* шлем: большой, слегка съехавший */
 var hb=o.helm===0?0:1;
 if(hb){g.save();g.translate(-.26,-.66);g.rotate(-.2+(o.hj||0));
  var pw=Math.sin((o.cape==null?t*3:o.cape)+.6)*.07;
  /* султан */
  g.beginPath();sp(g,[[-.04,-.66],[-.22,-.98+pw],[-.58,-1.0-pw],[-.92,-.78+pw*1.4],[-.66,-.74],[-.4,-.66],[-.16,-.56]],true,1);
  g.fillStyle=LG(g,-.9,-1,0,-.5,[0,'#f0505a',1,LC.red2]);g.fill();g.strokeStyle=sh(LC.red2,-.45);g.lineWidth=lw;g.stroke();
  g.beginPath();g.moveTo(-.1,-.7);g.quadraticCurveTo(-.4,-.92+pw,-.78,-.78+pw);g.strokeStyle='rgba(255,200,200,.55)';g.lineWidth=.03;g.lineCap='round';g.stroke();
  /* купол */
  g.beginPath();sp(g,[[-.58,-.04],[-.56,-.34],[-.34,-.6],[.0,-.7],[.34,-.6],[.54,-.34],[.6,-.06]],false,1);g.lineTo(.6,.03);g.lineTo(-.6,.03);g.closePath();
  g.fillStyle=LG(g,-.55,-.7,.55,.0,[0,'#f4f8ff',.28,LC.steel,.7,LC.steel2,1,LC.steel3]);g.fill();g.strokeStyle=sh(LC.steel3,-.3);g.lineWidth=lw*1.15;g.stroke();
  /* гребень */
  g.beginPath();g.moveTo(-.02,-.7);g.quadraticCurveTo(-.01,-.35,-.02,.03);g.strokeStyle=sh(LC.steel3,-.1);g.lineWidth=.05;g.stroke();
  g.beginPath();g.arc(-.02,-.72,.06,0,TAU);fs(g,LC.gold,sh('#8a5a00',-.1),.025);
  /* блик */
  g.beginPath();g.moveTo(-.4,-.3);g.quadraticCurveTo(-.3,-.52,-.08,-.58);g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=.05;g.lineCap='round';g.stroke();
  /* обод */
  g.beginPath();sp(g,[[-.64,.04],[-.3,.1],[.3,.1],[.66,.04],[.62,-.07],[.3,-.02],[-.3,-.02],[-.6,-.08]],true,1);fs(g,LG(g,0,-.08,0,.1,[0,'#e6eef8',.4,LC.steel,1,LC.steel3]),sh(LC.steel3,-.3),lw);
  g.fillStyle=LC.gold;for(k=0;k<4;k++){g.beginPath();g.arc(-.42+k*.28,.02,.03,0,TAU);g.fill()}
  g.restore();
  /* ремешок */
  g.beginPath();g.moveTo(-.5,-.4);g.quadraticCurveTo(-.45,.1,.05,.26);g.strokeStyle='#6b3f1d';g.lineWidth=.045;g.lineCap='round';g.stroke()}
 /* глаза-«бугры» */
 var fr=fear,er=.25+fr*.03;
 function bump(cx,cy,r){g.beginPath();ell(g,cx,cy,r*1.12,r*1.02);g.fillStyle=RG(g,cx-r*.2,cy-r*.3,r*.1,r*1.5,[0,LC.sk,.6,LC.sk2,1,LC.sk3]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke()}
 bump(-.02,-.42,er*.95);bump(.46,-.44,er);
 var lid=o.lid==null?(fr>.5?0:.08):o.lid,tl2=o.tl==null?(fr>.5?-.55:.35):o.tl;
 eye(g,-.02,-.44,er*.82,{lx:o.lx==null?.45:o.lx,ly:o.ly||0,lid:lid,bl:o.bl,tilt:tl2*-1,lidc:LC.sk2,ol:ol,iris:'#6b3b12'});
 eye(g,.47,-.46,er*.88,{lx:o.lx==null?.45:o.lx,ly:o.ly||0,lid:lid,bl:o.bl,tilt:tl2,lidc:LC.sk2,ol:ol,iris:'#6b3b12'});
 /* брови */
 if(o.brow!==0){var bw=fr>.5?-.06:.05;g.strokeStyle='rgba(20,60,30,.9)';g.lineWidth=.05;g.lineCap='round';
  g.beginPath();g.moveTo(-.2,-.74+bw*0);g.quadraticCurveTo(0,-.78-fr*.06,.14,-.72+(fr>.5?-.06:.05));g.stroke();
  g.beginPath();g.moveTo(.32,-.74+(fr>.5?-.06:.05));g.quadraticCurveTo(.5,-.8-fr*.06,.68,-.74)
  g.stroke()}
 g.restore(); // голова
 g.restore();
}
