/* ===== вода, кувшинки, светляки ===== */
function drawWater(g,bg,P,W,H,WY,cam,U,t){
 g.fillStyle=LG(g,0,WY,0,H,[0,P.water[0],1,P.water[1]]);g.fillRect(0,WY,W,H-WY);
 /* отражение горизонта */
 g.fillStyle=LG(g,0,WY,0,WY+H*.14,[0,rgba(P.hz,.38),1,rgba(P.hz,0)]);g.fillRect(0,WY,W,H*.14);
 /* отражение светила: дорожка из дрожащих полос + искры */
 var m=P.moon,mx=m.x*W,gl=g.createLinearGradient(0,WY,0,H);gl.addColorStop(0,rgba(m.g,.34));gl.addColorStop(1,rgba(m.g,0));
 g.save();g.globalCompositeOperation='lighter';
 for(var i=0;i<20;i++){var f=i/19,yy=WY+4+f*f*(H-WY)*.7,bw=m.r*W*(1.05+f*1.25)*(.55+.45*Math.sin(t*1.6+i*2.3)),bx=mx+Math.sin(t*.9+i*1.7)*(3+f*10),bh=1.6+f*5.2,al=(1-f*.78)*(.2+.14*Math.sin(t*2.1+i*1.3))*(m.sun?1.25:1);
  g.fillStyle=rgba(m.g,Math.max(0,al));g.fillRect(bx-bw,yy,bw*2,bh);
  g.fillStyle=rgba('#ffffff',Math.max(0,al*.6));g.fillRect(bx-bw*.45,yy+bh*.25,bw*.9,bh*.5)}
 for(i=0;i<18;i++){var hh=Math.sin(i*127.1)*43758.5453,h1=hh-Math.floor(hh),h2=(Math.sin(i*311.7)*43758.5453)%1,fy=Math.pow(Math.abs(h2),.8),sy=WY+10+fy*(H-WY)*.62,sx=mx+(h1-.5)*m.r*W*(3+fy*5),tw=Math.pow(Math.max(0,Math.sin(t*(1.6+h1*2.6)+i*5.1)),8),sl=2+fy*6;
  if(tw<.05)continue;g.strokeStyle='rgba(255,255,255,'+(tw*.85).toFixed(3)+')';g.lineWidth=1+fy*.8;g.beginPath();g.moveTo(sx-sl,sy);g.lineTo(sx+sl,sy);g.moveTo(sx,sy-sl*.6);g.lineTo(sx,sy+sl*.6);g.stroke()}
 g.restore();
 /* лёгкая дымка над водой у горизонта */
 for(i=0;i<3;i++){var mxx=((t*(6+i*3)+i*W*.4)%(W*1.4))-W*.2,my2=WY+3+i*6;g.fillStyle=RG(g,mxx,my2,0,W*.5,[0,rgba(P.fog,.1),1,rgba(P.fog,0)]);g.save();g.translate(0,my2);g.scale(1,.12);g.translate(0,-my2);g.fillRect(mxx-W*.5,my2-W*.5,W,W);g.restore()}
 /* волны */
 g.lineCap='round';
 for(i=0;i<22;i++){var f=i/22,yy2=WY+8+f*f*(H-WY-10),a=.05+.1*f,sp=((i*53)%97)/97,xo=((i*137.5+cam*U*(.4+f*.6))%(W+120)+W+120)%(W+120)-60,l=24+f*70+sp*30;
  g.strokeStyle=rgba(P.ref,a);g.lineWidth=1+f*1.6;g.beginPath();g.moveTo(xo,yy2+Math.sin(t*1.2+i)*1.2);g.lineTo(xo+l,yy2+Math.sin(t*1.2+i+1)*1.2);g.stroke()}
}
function waterFade(g,P,W,H,WY){var q=g.createLinearGradient(0,WY,0,H);q.addColorStop(0,rgba(P.water[0],.0));q.addColorStop(.35,rgba(P.water[0],.55));q.addColorStop(1,rgba(P.water[1],.92));g.fillStyle=q;g.fillRect(0,WY,W,H-WY)}
/* кувшинка: центр (x,WY), радиус r (в U) */
function drawLily(g,x,y,rU,U,o){o=o||{};var rx=rU*U,ry=rx*.27,P=o.pal||PAL[0],c1=o.c1||P.pad[0],c2=o.c2||P.pad[1],lit=o.lit||0,sink=o.sink||0,t=o.t||0,tilt=o.tilt||0;y+=sink*U*.4;
 /* тень/ободок воды */
 g.fillStyle='rgba(0,20,30,.28)';g.beginPath();g.ellipse(x,y+ry*.25,rx*1.06,ry*1.2,0,0,TAU);g.fill();
 g.save();g.translate(x,y);
 var n0=-.65,nw=.32;
 g.beginPath();for(var a=n0+nw;a<=n0+TAU-nw;a+=.12)g.lineTo(Math.cos(a)*rx,Math.sin(a)*ry);g.lineTo(0,0);g.closePath();
 g.fillStyle=RG(g,-rx*.15,-ry*.3,rx*.05,rx*1.1,[0,sh(c1,.25),.55,c1,1,c2],0,0);g.fill();
 g.lineWidth=Math.max(1.2,U*.045);g.strokeStyle=sh(c2,-.45);g.stroke();
 /* прожилки */
 g.strokeStyle=rgba(sh(c2,-.35).replace('rgb','rgba').replace(')',',.35)')?'#000':'#000',.0);
 g.strokeStyle='rgba(10,50,30,.28)';g.lineWidth=Math.max(1,U*.025);
 for(a=n0+nw+.2;a<n0+TAU-nw;a+=.55){g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*rx*.92,Math.sin(a)*ry*.92);g.stroke()}
 /* блик на кромке */
 g.beginPath();g.ellipse(0,-ry*.08,rx*.88,ry*.78,0,PI*1.05,PI*1.75);g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=U*.04;g.stroke();
 if(lit>0){g.globalCompositeOperation='lighter';var q=RG(g,0,0,0,rx*1.1,[0,rgba('#ffe29a',.55*lit),.6,rgba('#ffb64a',.22*lit),1,'rgba(255,180,60,0)']);g.fillStyle=q;g.beginPath();g.ellipse(0,0,rx*1.15,ry*1.3,0,0,TAU);g.fill();g.globalCompositeOperation='source-over'}
 if(o.flower){var fx=rx*.5,fy=-ry*.1,fr=U*.28;for(var k=0;k<7;k++){var ang=-PI/2+(k-3)*.42;g.save();g.translate(fx,fy);g.rotate(ang*.8);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(fr*.5,-fr*.5,0,-fr*1.1);g.quadraticCurveTo(-fr*.5,-fr*.5,0,0);g.fillStyle=LG(g,0,0,0,-fr,[0,'#ffd9e6',1,'#ff7aa8']);g.fill();g.strokeStyle='rgba(120,20,60,.4)';g.lineWidth=1;g.stroke();g.restore()}
  g.beginPath();g.arc(fx,fy-fr*.15,fr*.18,0,TAU);g.fillStyle='#ffe066';g.fill()}
 g.restore()}
function drawIce(g,x,y,rU,U,o){o=o||{};var rx=rU*U,ry=rx*.27,lit=o.lit||0;g.fillStyle='rgba(0,30,60,.25)';g.beginPath();g.ellipse(x,y+ry*.3,rx*1.04,ry*1.15,0,0,TAU);g.fill();
 g.save();g.translate(x,y);g.beginPath();var pts=[[-1,.1],[-.8,-.75],[-.1,-1],[.7,-.8],[1,.05],[.6,.85],[-.2,1],[-.85,.7]];pts.forEach(function(p,i){i?g.lineTo(p[0]*rx,p[1]*ry):g.moveTo(p[0]*rx,p[1]*ry)});g.closePath();
 g.fillStyle=LG(g,-rx,-ry,rx,ry,[0,'#f4fcff',.5,'#c4e6fa',1,'#8cc4ee']);g.fill();g.strokeStyle='#5a9ac8';g.lineWidth=U*.04;g.lineJoin='round';g.stroke();
 g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=U*.025;g.beginPath();g.moveTo(-rx*.5,-ry*.2);g.lineTo(-rx*.1,ry*.1);g.lineTo(rx*.3,-ry*.2);g.moveTo(-rx*.1,ry*.1);g.lineTo(0,ry*.6);g.stroke();
 if(lit>0){g.globalCompositeOperation='lighter';g.fillStyle=RG(g,0,0,0,rx*1.1,[0,rgba('#fff3c4',.5*lit),1,'rgba(255,220,140,0)']);g.beginPath();g.ellipse(0,0,rx*1.1,ry*1.3,0,0,TAU);g.fill();g.globalCompositeOperation='source-over'}
 g.restore()}
function drawLog(g,x,y,rU,U,o){o=o||{};var rx=rU*U,ry=U*.3,lit=o.lit||0;g.fillStyle='rgba(0,20,30,.3)';g.beginPath();g.ellipse(x,y+ry*.5,rx*1.02,ry*.9,0,0,TAU);g.fill();
 g.save();g.translate(x,y-ry*.15);g.beginPath();g.moveTo(-rx*.96,-ry*.5);g.quadraticCurveTo(0,-ry*.82,rx*.96,-ry*.5);g.lineTo(rx*.96,ry*.5);g.quadraticCurveTo(0,ry*.78,-rx*.96,ry*.5);g.closePath();
 g.fillStyle=LG(g,0,-ry,0,ry,[0,'#b98a58',.5,'#8a5a30',1,'#5a3818']);g.fill();g.strokeStyle='#3a220e';g.lineWidth=U*.04;g.stroke();
 g.strokeStyle='rgba(40,20,5,.35)';g.lineWidth=U*.025;for(var i=0;i<5;i++){g.beginPath();g.moveTo(-rx*.8+i*rx*.4,-ry*.45);g.quadraticCurveTo(-rx*.76+i*rx*.4,0,-rx*.8+i*rx*.4,ry*.45);g.stroke()}
 g.fillStyle='#5aa83a';g.beginPath();g.ellipse(-rx*.4,-ry*.45,rx*.18,ry*.2,0,0,TAU);g.fill();g.beginPath();g.ellipse(rx*.5,-ry*.5,rx*.14,ry*.16,0,0,TAU);g.fill();
 g.beginPath();g.ellipse(rx*.96,0,ry*.28,ry*.52,0,0,TAU);g.fillStyle='#d9ae78';g.fill();g.stroke();g.beginPath();g.ellipse(rx*.96,0,ry*.14,ry*.26,0,0,TAU);g.stroke();
 if(lit>0){g.globalCompositeOperation='lighter';g.fillStyle=RG(g,0,0,0,rx,[0,rgba('#ffe29a',.4*lit),1,'rgba(255,180,60,0)']);g.beginPath();g.ellipse(0,0,rx*1.1,ry*1.6,0,0,TAU);g.fill();g.globalCompositeOperation='source-over'}
 g.restore()}
function drawDock(g,x,y,rU,U,o){var rx=rU*U,h=U*.3;g.fillStyle='rgba(0,20,30,.3)';g.beginPath();g.ellipse(x,y+h*.4,rx*1.05,h*.8,0,0,TAU);g.fill();
 g.save();g.translate(x,y-h*.5);var n=Math.max(3,Math.round(rx/(U*.45))),i;g.fillStyle='#6b4423';for(i=0;i<4;i++){var px=-rx*.9+i*rx*.6;g.fillRect(px,0,U*.14,h*1.6)}
 for(i=0;i<n;i++){var bx=-rx+i*(rx*2/n);g.beginPath();g.rect(bx+1,-h*.2,rx*2/n-2,h*.7);g.fillStyle=LG(g,0,-h*.2,0,h*.5,[0,i%2?'#c99a64':'#d6a870',1,'#8a5a30']);g.fill();g.strokeStyle='#3a220e';g.lineWidth=U*.03;g.stroke()}
 g.restore()}
function drawFirefly(g,x,y,u,t,ph,a){a=a==null?1:a;var f=.6+.4*Math.sin(t*5+ph),w=Math.sin(t*38+ph*3)*.35;glow(g,x,y,u*1.25,'#fff0a0',.75*f*a);
 g.save();g.translate(x,y);g.fillStyle='rgba(255,255,255,'+(.55*a)+')';g.beginPath();g.ellipse(-u*.1,-u*.1,u*.16,u*.07,-.6+w,0,TAU);g.fill();g.beginPath();g.ellipse(u*.1,-u*.1,u*.16,u*.07,.6-w,0,TAU);g.fill();
 g.fillStyle='rgba(60,50,30,'+a+')';g.beginPath();g.ellipse(0,0,u*.1,u*.07,0,0,TAU);g.fill();g.fillStyle='rgba(255,246,170,'+a+')';g.beginPath();g.ellipse(-u*.07,u*.01,u*.09,u*.065,0,0,TAU);g.fill();g.restore()}
