/* ===== мир: палитры, фоны-параллакс, вода, кувшинки ===== */
var PAL=[
 {n:'Тихая Заводь',sky:['#071433','#14346b','#2f6f9a'],hz:'#6fb6c4',moon:{x:.74,y:.2,r:.075,c:'#fff6d8',g:'#bfe3ff'},stars:1,far:'#11406a',mid:'#0c3452',near:'#082a3b',tree:'#0a2a3a',water:['#17607a','#082d46'],fog:'#7fc8d8',dark:.42,glow:'#ffe6a0',part:'fly',pad:['#3fae6a','#1f7a4a'],ref:'#9fe0ff'},
 {n:'Осиный Тростник',sky:['#10324a','#2d7a78','#e6a85a'],hz:'#ffcf7a',moon:{x:.3,y:.3,r:.1,c:'#ffd98a',g:'#ffb55a',sun:1},stars:.2,far:'#2c6a62',mid:'#1f5650',near:'#133f3c',tree:'#0f3a3a',water:['#2a7f7a','#0f3f46'],fog:'#ffd39a',dark:.3,glow:'#ffe0a0',part:'pollen',pad:['#6bc45a','#2f8a3a'],ref:'#ffe0a8'},
 {n:'Лунные Топи',sky:['#150d33','#3a2a76','#8b79c9'],hz:'#c9b8ff',moon:{x:.62,y:.22,r:.13,c:'#f4f1ff',g:'#b9a6ff'},stars:1,far:'#2c2563',mid:'#211b4d',near:'#171238',tree:'#150f35',water:['#3a3585','#120d33'],fog:'#a99cf0',dark:.36,glow:'#d9c8ff',part:'wisp',pad:['#6aa890','#2f6a66'],ref:'#d9ccff'},
 {n:'Ледяной Затон',sky:['#0a2a52','#2a78b8','#bfeaff'],hz:'#e6f8ff',moon:{x:.3,y:.18,r:.06,c:'#ffffff',g:'#bfeaff'},stars:.7,far:'#6aa6d6',mid:'#4f8cc0',near:'#356ea6',tree:'#2e5f94',water:['#4aa6d6','#1d5a8e'],fog:'#e0f6ff',dark:.2,glow:'#d6f2ff',part:'snow',pad:['#bfe6ff','#7fb8e0'],ref:'#e8f8ff',aurora:1},
 {n:'Холм Рассвета',sky:['#3a2a6a','#d9608a','#ffc66a'],hz:'#ffe39a',moon:{x:.7,y:.5,r:.17,c:'#fff2b0',g:'#ffd06a',sun:1},stars:.15,far:'#7a3a7a',mid:'#5a2a62',near:'#3a1d4a',tree:'#2e1640',water:['#c9607f','#5a2a62'],fog:'#ffd0a0',dark:.1,glow:'#fff0b0',part:'ember',pad:['#8ad85a','#3f9a3a'],ref:'#ffd9a0'}
];
var CAMP_DAWN=[0,.12,.3,.55,.8,1]; /* стадии рассвета лагеря 0..5 */
function mkc(w,h){var c=document.createElement('canvas');c.width=Math.max(2,Math.round(w));c.height=Math.max(2,Math.round(h));return c}
function rng(seed){var s=seed|0||1;return function(){s=(s*1664525+1013904223)|0;return((s>>>8)&0xffffff)/0x1000000}}
function crest(ctx,x0,x1,y,amp,seed,col,col2,H,rim){var r=rng(seed),n=5,ph=[],fr=[],am=[],i,x,yy;for(i=0;i<n;i++){ph.push(r()*TAU);fr.push(Math.max(1,Math.round((i+1)*(.8+r()*.8))));am.push(amp/(i+1.3))}
 ctx.beginPath();ctx.moveTo(x0,H);for(x=x0;x<=x1;x+=6){yy=y;for(i=0;i<n;i++)yy+=Math.sin(x/(x1-x0)*TAU*fr[i]+ph[i])*am[i];ctx.lineTo(x,yy)}ctx.lineTo(x1,H);ctx.closePath();
 ctx.fillStyle=LG(ctx,0,y-amp*1.6,0,H,[0,col,1,col2||col]);ctx.fill();
 if(rim){ctx.beginPath();for(x=x0;x<=x1;x+=6){yy=y;for(i=0;i<n;i++)yy+=Math.sin(x/(x1-x0)*TAU*fr[i]+ph[i])*am[i];x===x0?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}ctx.strokeStyle=rim;ctx.lineWidth=2;ctx.stroke()}
}
function wrapDraw(ctx,TW,fn,pad){fn(0);fn(TW);fn(-TW)}
function willow(ctx,x,y,h,col,hi,seed){var r=rng(seed),w=h*.55,i;
 ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-h*.05,y);ctx.quadraticCurveTo(x-h*.04,y-h*.35,x-h*.02,y-h*.55);ctx.lineTo(x+h*.03,y-h*.55);ctx.quadraticCurveTo(x+h*.06,y-h*.3,x+h*.06,y);ctx.fill();
 ctx.strokeStyle=col;ctx.lineCap='round';
 for(i=0;i<26;i++){var a=-PI*.95+i/25*PI*.9,sx=x+Math.cos(a)*w*.35*(r()*.5+.6),sy=y-h*.55+Math.sin(a)*w*.25*.5;ctx.lineWidth=h*.014+r()*h*.01;ctx.beginPath();ctx.moveTo(x,y-h*.55);
  var ex=x+Math.cos(a)*w*(.5+r()*.35),ey=y-h*(.12+r()*.2);ctx.quadraticCurveTo(x+Math.cos(a)*w*.55,y-h*.95,ex,ey);ctx.stroke()}
 ctx.beginPath();ctx.ellipse(x,y-h*.72,w*.42,h*.2,0,0,TAU);ctx.fillStyle=col;ctx.fill();
 if(hi){ctx.strokeStyle=hi;ctx.lineWidth=h*.008;ctx.globalAlpha=.55;for(i=0;i<8;i++){var a2=-PI*.9+i/7*PI*.8;ctx.beginPath();ctx.moveTo(x+Math.cos(a2)*w*.2,y-h*.8);ctx.quadraticCurveTo(x+Math.cos(a2)*w*.5,y-h*.9,x+Math.cos(a2)*w*.55,y-h*.35);ctx.stroke()}ctx.globalAlpha=1}}
function pine(ctx,x,y,h,col,hi,snow){var w=h*.32,i;ctx.fillStyle=col;for(i=0;i<5;i++){var yy=y-h*(.2+i*.17),ww=w*(1-i*.17);ctx.beginPath();ctx.moveTo(x-ww,yy);ctx.lineTo(x,yy-h*.3);ctx.lineTo(x+ww,yy);ctx.closePath();ctx.fill();
 if(snow){ctx.fillStyle=snow;ctx.beginPath();ctx.moveTo(x-ww*.5,yy-h*.15);ctx.lineTo(x,yy-h*.3);ctx.lineTo(x+ww*.5,yy-h*.15);ctx.quadraticCurveTo(x,yy-h*.1,x-ww*.5,yy-h*.15);ctx.fill();ctx.fillStyle=col}}
 ctx.fillRect(x-h*.02,y-h*.2,h*.04,h*.2)}
function deadTree(ctx,x,y,h,col,seed){var r=rng(seed);ctx.strokeStyle=col;ctx.lineCap='round';function br(x0,y0,a,l,w,d){if(d<=0||l<2)return;var x1=x0+Math.cos(a)*l,y1=y0+Math.sin(a)*l;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();br(x1,y1,a-.35-r()*.3,l*.72,w*.7,d-1);br(x1,y1,a+.35+r()*.3,l*.72,w*.7,d-1);if(r()>.5)br(x1,y1,a+(r()-.5)*.4,l*.6,w*.6,d-1)}br(x,y,-PI/2+(r()-.5)*.3,h*.38,h*.05,5)}
function mushHouse(ctx,x,y,h,cap,lit,seed){ctx.fillStyle='#e9dcc0';ctx.beginPath();ctx.moveTo(x-h*.14,y);ctx.quadraticCurveTo(x-h*.12,y-h*.5,x-h*.1,y-h*.6);ctx.lineTo(x+h*.1,y-h*.6);ctx.quadraticCurveTo(x+h*.12,y-h*.5,x+h*.14,y);ctx.fill();
 ctx.fillStyle=cap;ctx.beginPath();ctx.ellipse(x,y-h*.62,h*.4,h*.28,0,PI,TAU);ctx.lineTo(x+h*.4,y-h*.6);ctx.quadraticCurveTo(x,y-h*.5,x-h*.4,y-h*.6);ctx.fill();
 ctx.fillStyle='rgba(255,255,255,.75)';[[-.2,-.78,.05],[.05,-.88,.06],[.22,-.74,.045]].forEach(function(p){ctx.beginPath();ctx.arc(x+p[0]*h,y+p[1]*h,p[2]*h,0,TAU);ctx.fill()});
 if(lit){glow(ctx,x,y-h*.3,h*.55,'#ffd37a',.55);ctx.fillStyle='#ffd36a';ctx.beginPath();ctx.ellipse(x,y-h*.3,h*.05,h*.075,0,0,TAU);ctx.fill();ctx.fillStyle='#7a4a1a';ctx.beginPath();ctx.moveTo(x-h*.045,y);ctx.lineTo(x-h*.045,y-h*.16);ctx.quadraticCurveTo(x,y-h*.22,x+h*.045,y-h*.16);ctx.lineTo(x+h*.045,y);ctx.fill()}}
function hive(ctx,x,y,h,col,seed){ctx.strokeStyle='#2b3a2a';ctx.lineWidth=h*.015;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-h*.35);ctx.stroke();
 ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x,y-h*.34);ctx.bezierCurveTo(x+h*.28,y-h*.3,x+h*.24,y+h*.2,x,y+h*.34);ctx.bezierCurveTo(x-h*.24,y+h*.2,x-h*.28,y-h*.3,x,y-h*.34);ctx.fill();
 ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=h*.012;for(var i=0;i<5;i++){ctx.beginPath();ctx.moveTo(x-h*.22,y-h*.2+i*.1*h);ctx.quadraticCurveTo(x,y-h*.14+i*.1*h,x+h*.22,y-h*.2+i*.1*h);ctx.stroke()}
 ctx.fillStyle='#1a1008';ctx.beginPath();ctx.ellipse(x,y+h*.3,h*.05,h*.035,0,0,TAU);ctx.fill()}
function reedTuft(ctx,x,y,h,col,seed,cat){var r=rng(seed),n=5+(r()*5|0),i;ctx.strokeStyle=col;ctx.lineCap='round';
 for(i=0;i<n;i++){var a=-PI/2+(r()-.5)*.5,l=h*(.6+r()*.5),cx=x+(r()-.5)*h*.1;ctx.lineWidth=h*.022;ctx.beginPath();ctx.moveTo(cx,y);ctx.quadraticCurveTo(cx+Math.cos(a)*l*.5,y-l*.6,cx+Math.cos(a)*l*.7+(r()-.5)*h*.2,y-l);ctx.stroke()}
 if(cat){for(i=0;i<2;i++){var cx2=x+(i?.06:-.05)*h,cl=h*(.75+r()*.25);ctx.lineWidth=h*.016;ctx.beginPath();ctx.moveTo(cx2,y);ctx.lineTo(cx2+(i?1:-1)*h*.03,y-cl);ctx.stroke();ctx.fillStyle=sh(col,-.3);ctx.beginPath();ctx.ellipse(cx2+(i?1:-1)*h*.03,y-cl-h*.05,h*.03,h*.09,0,0,TAU);ctx.fill()}}}
function iceSpire(ctx,x,y,h,col,hi,seed){var r=rng(seed),w=h*.22;ctx.beginPath();ctx.moveTo(x-w,y);ctx.lineTo(x-w*.6,y-h*.7);ctx.lineTo(x-w*.1,y-h);ctx.lineTo(x+w*.4,y-h*.6);ctx.lineTo(x+w,y);ctx.closePath();ctx.fillStyle=LG(ctx,x-w,y-h,x+w,y,[0,hi,.5,col,1,sh(col,-.25)]);ctx.fill();
 ctx.beginPath();ctx.moveTo(x-w*.1,y-h);ctx.lineTo(x-w*.05,y);ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=h*.012;ctx.stroke()}
function waxTower(ctx,x,y,h,col,lit){var w=h*.2,i;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-w,y);ctx.lineTo(x-w,y-h*.8);ctx.lineTo(x-w*1.15,y-h*.82);ctx.lineTo(x-w*.7,y-h*1.05);ctx.lineTo(x,y-h*1.15);ctx.lineTo(x+w*.7,y-h*1.05);ctx.lineTo(x+w*1.15,y-h*.82);ctx.lineTo(x+w,y-h*.8);ctx.lineTo(x+w,y);ctx.fill();
 ctx.strokeStyle='rgba(255,220,120,.35)';ctx.lineWidth=h*.012;for(i=0;i<5;i++){ctx.beginPath();ctx.moveTo(x-w,y-h*.15*i-h*.05);ctx.lineTo(x+w,y-h*.15*i-h*.05);ctx.stroke()}
 if(lit){ctx.fillStyle='#ffd36a';ctx.beginPath();ctx.ellipse(x,y-h*.55,w*.18,w*.26,0,0,TAU);ctx.fill();glow(ctx,x,y-h*.55,h*.4,'#ffd37a',.4)}}
function cloud(ctx,x,y,w,col,al){ctx.fillStyle=rgba(col,al);for(var i=0;i<6;i++){ctx.beginPath();ctx.ellipse(x+(i-2.5)*w*.14,y+Math.sin(i*1.7)*w*.03,w*(.14+(i%3)*.04),w*(.06+(i%2)*.03),0,0,TAU);ctx.fill()}}
/* ---- сборка фона главы ---- */
function mixa(c1,c2,t,a){var x=hex2rgb(c1),y=hex2rgb(c2);return'rgba('+Math.round(lerp(x[0],y[0],t))+','+Math.round(lerp(x[1],y[1],t))+','+Math.round(lerp(x[2],y[2],t))+','+a+')'}
function makeBG(pi,W,H,WY,dpr,progress){var P=PAL[pi],bg={pi:pi,W:W,H:H,WY:WY,dpr:dpr},D=Math.min(dpr,2.5),sw=W*D,sh_=H*D;
 var s=mkc(sw,WY*D+4*D),g=s.getContext('2d');g.scale(D,D);
 g.fillStyle=LG(g,0,0,0,WY,[0,P.sky[0],.55,P.sky[1],1,P.sky[2]]);g.fillRect(0,0,W,WY+4);
 /* звёзды */
 var r=rng(pi*77+3),i;for(i=0;i<110;i++){var a=r()*P.stars*(1-(r()*.3));var yy=r()*WY*.7;g.fillStyle='rgba(255,255,255,'+(a*.8*(1-yy/(WY*.8)))+')';g.beginPath();g.arc(r()*W,yy,r()*1.3+.3,0,TAU);g.fill()}
 /* аврора */
 if(P.aurora){for(i=0;i<3;i++){g.beginPath();g.moveTo(0,WY*.3+i*18);for(var x=0;x<=W;x+=10)g.lineTo(x,WY*(.22+i*.05)+Math.sin(x*.012+i*2)*26);for(x=W;x>=0;x-=10)g.lineTo(x,WY*(.4+i*.06)+Math.sin(x*.01+i)*30);g.closePath();g.fillStyle=LG(g,0,WY*.2,0,WY*.55,[0,'rgba(120,255,200,0)',.5,'rgba(120,255,210,.28)',1,'rgba(160,140,255,0)']);g.fill()}}
 /* облака */
 for(i=0;i<5;i++)cloud(g,r()*W,WY*(.12+r()*.45),W*(.35+r()*.3),pi===4?'#ff9ab0':pi===1?'#ffd9a0':P.sky[2],pi===3?.18:.22);
 /* светило */
 var m=P.moon,mx=m.x*W,my=m.y*WY*1.1;glow(g,mx,my,m.r*W*5.5,m.g,m.sun?.65:.45);
 g.beginPath();g.arc(mx,my,m.r*W,0,TAU);g.fillStyle=RG(g,mx-m.r*W*.3,my-m.r*W*.3,m.r*W*.05,m.r*W*1.1,[0,'#fff',.4,m.c,1,sh(m.c,-.12)]);g.fill();
 if(!m.sun){g.fillStyle='rgba(120,130,170,.18)';[[-.3,-.1,.22],[.25,.2,.18],[-.1,.35,.14],[.3,-.3,.1]].forEach(function(c){g.beginPath();g.arc(mx+c[0]*m.r*W,my+c[1]*m.r*W,c[2]*m.r*W,0,TAU);g.fill()})}
 /* дымка у горизонта и лучи светила */
 g.fillStyle=LG(g,0,WY*.5,0,WY+4,[0,rgba(P.fog,0),1,rgba(P.fog,m.sun?.34:.24)]);g.fillRect(0,WY*.5,W,WY*.5+4);
 g.save();g.globalCompositeOperation='lighter';
 for(i=0;i<7;i++){var ra=PI*(.18+i*.105)+(i%2?.02:-.02),rl=WY*(1.05+((i*37)%5)*.12),rw=.035+((i*13)%4)*.012,ry=g.createRadialGradient(mx,my,m.r*W*.6,mx,my,rl);ry.addColorStop(0,rgba(m.g,m.sun?.16:.11));ry.addColorStop(1,rgba(m.g,0));
  g.fillStyle=ry;g.beginPath();g.moveTo(mx,my);g.lineTo(mx+Math.cos(ra-rw)*rl,my+Math.sin(ra-rw)*rl);g.lineTo(mx+Math.cos(ra+rw)*rl,my+Math.sin(ra+rw)*rl);g.closePath();g.fill()}
 g.restore();
 bg.sky=s;
 /* очень далёкий хребет: объём в верхней части неба */
 var RH=WY*.78,rc=mkc(sw*1.7,RH*D),rx=rc.getContext('2d');rx.scale(D,D);
 crest(rx,0,W*1.7,RH*.72,RH*.2,pi*29+5,mixa(P.sky[2],P.far,.42,.62),mixa(P.sky[2],P.far,.62,.8),RH,rgba(P.hz,.28));
 bg.ridge=rc;bg.ridgeH=RH;
 /* слои */
 var TW=Math.round(W*1.7);bg.TW=TW;bg.lay=[];
 function layer(par,hh,fn,fogA){var c=mkc(TW*D,hh*D),x=c.getContext('2d');x.scale(D,D);fn(x,TW,hh);x.save();x.translate(-TW,0);fn(x,TW,hh);x.restore();x.save();x.translate(TW,0);fn(x,TW,hh);x.restore();
  if(fogA){x.globalCompositeOperation='source-atop';x.fillStyle=LG(x,0,0,0,hh,[0,rgba(P.fog,fogA*.4),1,rgba(P.fog,fogA)]);x.fillRect(0,0,TW,hh);x.globalCompositeOperation='source-over'}
  bg.lay.push({c:c,p:par,h:hh})}
 var FH=WY*.62;
 /* далёкий: холмы, силуэты, ориентиры */
 layer(.08,FH,function(x,tw,hh){
  crest(x,0,tw,hh*.7,hh*.18,pi*11+1,P.far,sh(P.far,-.4),hh,rgba(P.hz,.5));
  var rr=rng(pi*5+9),k;
  if(pi===0){for(k=0;k<9;k++)mushHouse(x,rr()*tw,hh*.75+rr()*8,hh*(.16+rr()*.1),['#c0392b','#d35400','#8e44ad','#16a085'][k%4],true,k)}
  if(pi===1){for(k=0;k<6;k++)willow(x,rr()*tw,hh*.9,hh*.6,sh(P.far,-.25),null,k+3)}
  if(pi===2){for(k=0;k<8;k++)deadTree(x,rr()*tw,hh*.85,hh*.8,sh(P.far,-.3),k+20)}
  if(pi===3){for(k=0;k<12;k++)iceSpire(x,rr()*tw,hh*.85,hh*(.35+rr()*.5),P.far,'#e8f6ff',k)}
  if(pi===4){for(k=0;k<7;k++)waxTower(x,rr()*tw,hh*.9,hh*(.3+rr()*.25),sh(P.far,-.1),true)}
 },.42);
 /* средний */
 layer(.22,WY*.5,function(x,tw,hh){
  crest(x,0,tw,hh*.78,hh*.14,pi*13+4,P.mid,sh(P.mid,-.35),hh,rgba(P.hz,.3));
  var rr=rng(pi*9+2),k;
  for(k=0;k<7;k++){var px=rr()*tw;
   if(pi===0||pi===2)willow(x,px,hh*.96,hh*(.7+rr()*.3),P.tree,sh(P.hz,.2),k+11);
   else if(pi===1){if(k%2)hive(x,px,hh*.5,hh*.34,'#d9a23a',k);else willow(x,px,hh*.96,hh*.8,P.tree,P.hz,k)}
   else if(pi===3)pine(x,px,hh*.96,hh*(.7+rr()*.3),P.tree,'#fff','#f4fbff');
   else{if(k%2)waxTower(x,px,hh*.96,hh*.55,sh(P.mid,.05),true);else deadTree(x,px,hh*.96,hh*.7,P.tree,k)}}
 },.24);
 /* ближний (камыши/кусты) */
 layer(.45,WY*.28,function(x,tw,hh){var rr=rng(pi*3+1),k;crest(x,0,tw,hh*.8,hh*.12,pi*17+6,P.near,sh(P.near,-.3),hh);
  for(k=0;k<26;k++)reedTuft(x,rr()*tw,hh*.98,hh*(.5+rr()*.45),P.near,k+1,pi!==3&&k%3===0)},.1);
 /* передний план: крупные камыши по краям */
 var fh=H*.15,fc=mkc(TW*D,fh*D),fx=fc.getContext('2d');fx.scale(D,D);var rr2=rng(pi*31+7),kk;
 var fxs=[];for(kk=0;kk<5;kk++)fxs.push([rr2()*TW,fh*(.6+rr2()*.5)]);
 for(var wv=-1;wv<=1;wv++)for(kk=0;kk<5;kk++)reedTuft(fx,fxs[kk][0]+wv*TW,fh*1.02,fxs[kk][1],sh(P.near,-.4),kk+40,kk%2===0);
 bg.fore=fc;
 return bg}
function drawBG(g,bg,cam,t,U){var W=bg.W,WY=bg.WY,D=Math.min(bg.dpr,2.5);
 g.drawImage(bg.sky,0,0,W,WY+4);
 if(bg.ridge){var ro=((cam*.03*U)%bg.TW+bg.TW)%bg.TW,rw=Math.min(W,bg.TW-ro),ry=WY-bg.ridgeH+6;g.drawImage(bg.ridge,ro*D,0,rw*D,bg.ridge.height,0,ry,rw,bg.ridgeH);if(rw<W)g.drawImage(bg.ridge,0,0,(W-rw)*D,bg.ridge.height,rw,ry,W-rw,bg.ridgeH)}
 for(var i=0;i<bg.lay.length;i++){var L=bg.lay[i],off=((cam*L.p*U)%bg.TW+bg.TW)%bg.TW,y=WY-L.h+(i===2?8:i===1?4:0),w1=Math.min(W,bg.TW-off);
  g.drawImage(L.c,off*D,0,w1*D,L.h*D,0,y,w1,L.h);
  if(w1<W)g.drawImage(L.c,0,0,(W-w1)*D,L.h*D,w1,y,W-w1,L.h)}}
