/* ===== Порох: упрямый серый пони с дымчатой гривой ===== */
var PC={coat:'#a9b2bd',coat2:'#7d8896',coat3:'#4d5766',bel:'#d9dee4',mane:'#343846',mane2:'#585f72',ol:'#262c38',hoof:'#4a3a33',red:'#d83a44',gold:'#ffd04a',nose:'#e7a0a8'};
/* o: t, gait(0 стоит..1 галоп), ph (фаза ног, если задана), bl, mouth, head (наклон головы), ear, face, saddle(1/0), rider */
function pLeg(g,hx,hy,l1,l2,a1,a2,w,col,ol,lw){var kx=hx+Math.sin(a1)*l1,ky=hy+Math.cos(a1)*l1,ax=kx+Math.sin(a1+a2)*l2,ay=ky+Math.cos(a1+a2)*l2;
 limb(g,hx,hy,w*1.25,kx,ky,w*.8,col,ol,lw);limb(g,kx,ky,w*.8,ax,ay,w*.62,col,ol,lw);
 g.beginPath();g.moveTo(ax-w*.7,ay-.02);g.lineTo(ax+w*.9,ay-.02);g.lineTo(ax+w*1.05,ay+.1);g.lineTo(ax-w*.75,ay+.1);g.closePath();fs(g,PC.hoof,ol,lw);return[ax,ay]}
function tuft(g,x,y,ang,len,w,col1,col2,ol,lw){g.save();g.translate(x,y);g.rotate(ang);g.beginPath();g.moveTo(-w*.5,0);g.quadraticCurveTo(-w*.9,-len*.55,0,-len);g.quadraticCurveTo(w*.9,-len*.5,w*.5,0);g.closePath();g.fillStyle=LG(g,0,0,0,-len,[0,col1,1,col2]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.lineJoin='round';g.stroke();g.restore()}
function drawPorokh(g,x,y,s,o){o=o||{};var t=o.t||0,gt=o.gait||0,f=o.face||1,lw=.04,ol=PC.ol,ph=o.ph==null?t*(gt>0?11:0):o.ph,bob=(gt>0?Math.abs(Math.sin(ph))*.08*gt:Math.sin(t*2)*.01);
 g.save();g.translate(x,y);g.scale(s*f,s);
 var sw=Math.sin(t*2.4+1)*.1;
 /* хвост — пышный, дымчатый */
 var tw=gt>0?Math.sin(ph)*.08:sw*.8,k,i,wv=Math.sin(t*2.6)*.05,lift=gt*.85;
 var tcol=LG(g,-.7,-1,-1.4,-.2,[0,PC.mane,1,PC.mane2]);
 for(i=0;i<3;i++){var sx=-.62-i*.02,sy=-1.04-bob+i*.04;
  var e=[sx-.5-lift*.9-i*.08,sy+.85-lift*.9+tw+i*.04+wv];
  ribbon(g,bez([sx,sy],[sx-.28-lift*.3,sy-.12-lift*.25],[sx-.46-lift*.6,sy+.3-lift*.6+tw],e),.17-i*.03,.015,i===1?PC.mane2:tcol,ol,lw*.85,.45)}
 var A=Math.sin(ph),B=Math.sin(ph+PI),amp=.7*gt+.03,L1=.3,L2=.3,W=.115;
 /* ноги дальние */
 pLeg(g,.46,-.7-bob,L1,L2,A*amp+.02,(A>0?-.55:.1)*gt-.05,W*.9,sh(PC.coat2,-.2),ol,lw);
 pLeg(g,-.5,-.74-bob,L1,L2,B*amp,(B>0?.55:-.15)*gt+.05,W*.95,sh(PC.coat2,-.2),ol,lw);
 /* корпус */
 g.beginPath();sp(g,[[-.74,-.96-bob],[-.66,-1.24-bob],[-.25,-1.32-bob],[.3,-1.32-bob],[.68,-1.18-bob],[.8,-.9-bob],[.68,-.58-bob],[.2,-.5-bob],[-.3,-.52-bob],[-.66,-.62-bob]],true,1);
 g.fillStyle=RG(g,-.1,-1.22,.05,1.1,[0,PC.coat,.6,PC.coat2,1,PC.coat3]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 g.save();g.clip();g.beginPath();ell(g,.05,-.45,.95,.26,0);g.fillStyle='rgba(235,240,246,.6)';g.fill();
 g.fillStyle='rgba(70,82,100,.3)';for(k=0;k<9;k++){ell(g,-.55+k*.14+(k%2)*.04,-1.1+(k*53%7)*.035-bob,.055,.04,.3);g.fill()}
 g.restore();
 /* шея */
 var hd=o.head||0;
 g.beginPath();sp(g,[[.28,-1.28-bob],[.44,-1.58-bob],[.7,-1.8-bob+hd*.08],[1.0,-1.76-bob+hd*.1],[1.04,-1.5-bob],[.9,-1.14-bob],[.64,-.86-bob]],true,1);
 g.fillStyle=RG(g,.6,-1.4,.04,.9,[0,PC.coat,.6,PC.coat2,1,PC.coat3]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 /* грива: волной вдоль шеи */
 var mp=Math.sin(t*3)*.03+(gt>0?Math.sin(ph)*.1*gt:0),wf=Math.sin(t*2.2)*.025;
 g.beginPath();sp(g,[[.94,-1.92-bob],[.74,-1.9-bob],[.56,-1.72-bob],[.42,-1.52-bob],[.3,-1.3-bob],[.12+mp,-1.36-bob],[.14+mp+wf,-1.62-bob],[.22+mp,-1.9-bob],[.4,-2.12-bob+wf],[.64,-2.22-bob],[.86,-2.2-bob],[1.02,-2.08-bob]],true,1);
 g.fillStyle=LG(g,.1,-1.3,.9,-2.2,[0,PC.mane,1,PC.mane2]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.lineJoin='round';g.stroke();
 g.strokeStyle='rgba(190,200,225,.45)';g.lineWidth=.025;g.lineCap='round';
 g.beginPath();g.moveTo(.86,-2.08-bob);g.quadraticCurveTo(.5,-2.0-bob,.2+mp,-1.5-bob);g.stroke();
 g.beginPath();g.moveTo(.8,-2.14-bob);g.quadraticCurveTo(.42,-2.06-bob,.22+mp,-1.7-bob);g.stroke();
 /* голова */
 g.save();g.translate(0,hd*.1);
 g.beginPath();sp(g,[[.84,-1.88-bob],[1.08,-1.9-bob],[1.3,-1.78-bob],[1.5,-1.54-bob],[1.54,-1.36-bob],[1.38,-1.26-bob],[1.12,-1.32-bob],[.96,-1.5-bob],[.86,-1.68-bob]],true,1);
 g.fillStyle=RG(g,1.1,-1.65,.04,.8,[0,PC.coat,.6,PC.coat2,1,PC.coat3]);g.fill();g.strokeStyle=ol;g.lineWidth=lw;g.stroke();
 g.beginPath();sp(g,[[1.1,-1.88-bob],[1.22,-1.76-bob],[1.42,-1.56-bob],[1.5,-1.5-bob],[1.36,-1.54-bob],[1.14,-1.74-bob]],true,1);g.fillStyle=PC.bel;g.fill();
 g.beginPath();ell(g,1.46,-1.38-bob,.1,.08,.3);g.fillStyle=PC.nose;g.fill();g.beginPath();g.arc(1.5,-1.4-bob,.02,0,TAU);g.fillStyle='#552';g.fill();
 var m=o.mouth||0;g.beginPath();g.moveTo(1.46,-1.3-bob);g.quadraticCurveTo(1.3,-1.28-bob+m*.07,1.14,-1.38-bob);g.strokeStyle=ol;g.lineWidth=.03;g.lineCap='round';g.stroke();
 if(m>0){g.beginPath();g.moveTo(1.4,-1.29-bob);g.quadraticCurveTo(1.3,-1.22-bob,1.2,-1.32-bob);g.fillStyle='#8a2a3c';g.fill()}
 var ea=o.ear==null?Math.sin(t*1.7)*.12:o.ear;
 g.save();g.translate(.92,-1.9-bob);g.rotate(-.15+ea);g.beginPath();g.moveTo(-.1,0);g.quadraticCurveTo(-.14,-.28,.02,-.38);g.quadraticCurveTo(.14,-.22,.12,0);g.closePath();fs(g,PC.coat2,ol,lw);
 g.beginPath();g.moveTo(-.03,-.02);g.quadraticCurveTo(-.05,-.2,.02,-.28);g.quadraticCurveTo(.07,-.18,.06,-.02);g.fillStyle=PC.nose;g.fill();g.restore();
 /* чёлка */
 tuft(g,.98,-1.9-bob,.3+mp*.3,.36,.17,PC.mane,PC.mane2,ol,lw);tuft(g,1.04,-1.86-bob,.9+mp*.3,.3,.15,PC.mane,PC.mane2,ol,lw);
 eye(g,1.1,-1.62-bob,.115,{lx:.75,bl:o.bl,iris:'#5a3014',lidc:PC.coat2,ol:'#111',ir:.74});
 /* щека */
 g.beginPath();ell(g,1.0,-1.4-bob,.07,.045,.2);g.fillStyle='rgba(255,140,140,.3)';g.fill();
 g.restore();
 if(o.saddle!==0){g.beginPath();sp(g,[[-.3,-1.34-bob],[.2,-1.36-bob],[.32,-1.04-bob],[.24,-.76-bob],[-.32,-.78-bob],[-.4,-1.06-bob]],true,.8);fs(g,LG(g,-.3,-1.4,.3,-.8,[0,'#f25a64',1,PC.red]),sh(PC.red,-.5),lw);
  g.beginPath();g.moveTo(-.36,-.82-bob);g.lineTo(.28,-.82-bob);g.strokeStyle=PC.gold;g.lineWidth=.045;g.stroke();
  g.beginPath();sp(g,[[-.2,-1.4-bob],[.14,-1.4-bob],[.14,-1.26-bob],[-.2,-1.26-bob]],true,.5);fs(g,'#7a4a20','#3a220e',.03);
  g.beginPath();g.arc(-.04,-1.06-bob,.08,-.35,PI+.35,false);g.strokeStyle=PC.gold;g.lineWidth=.035;g.stroke()}
 pLeg(g,.5,-.68-bob,L1,L2,B*amp+.02,(B>0?.5:-.15)*gt-.05,W,PC.coat,ol,lw);
 pLeg(g,-.46,-.72-bob,L1,L2,A*amp,(A>0?-.55:.15)*gt+.05,W*1.05,PC.coat,ol,lw);
 g.restore()}
