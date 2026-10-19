/* ===== вид «Пятнашки»: сложить картину Фонаря ===== */
var SLDPIC={k:'',c:null};
function slidePic(cell){var k=cell+'';if(SLDPIC.k===k)return SLDPIC.c;var S=cell*3,c=mkc(S*dpr,S*dpr),x=c.getContext('2d');x.scale(dpr,dpr);var g0=g;g=x;
 g.fillStyle=LG(g,0,0,0,S,[0,'#0b1540',.5,'#3b3a8e',.78,'#f08a6a',1,'#ffd08a']);g.fillRect(0,0,S,S);var r=rng(7),i;
 for(i=0;i<70;i++){g.fillStyle='rgba(255,255,255,'+(.3+r()*.6)+')';g.beginPath();g.arc(r()*S,r()*S*.5,r()*1.6+.5,0,TAU);g.fill()}
 glow(g,S*.2,S*.2,S*.32,'#fff3c0',.5);g.beginPath();g.arc(S*.2,S*.2,S*.085,0,TAU);g.fillStyle=RG(g,S*.18,S*.18,S*.01,S*.1,[0,'#fffbe6',1,'#f0dca0']);g.fill();g.fillStyle='rgba(190,170,110,.4)';[[.17,.17,.02],[.23,.23,.014],[.21,.16,.011]].forEach(function(c){g.beginPath();g.arc(S*c[0],S*c[1],S*c[2],0,TAU);g.fill()});
 glow(g,S*.56,S*.62,S*.6,'#ffd27a',.4);
 g.fillStyle='#1b3a2a';g.beginPath();g.moveTo(0,S*.72);g.quadraticCurveTo(S*.3,S*.6,S*.55,S*.72);g.quadraticCurveTo(S*.8,S*.82,S,S*.7);g.lineTo(S,S);g.lineTo(0,S);g.closePath();g.fill();
 g.fillStyle=LG(g,0,S*.7,0,S,[0,'#3c8a46',1,'#14381e']);g.beginPath();g.moveTo(0,S*.8);g.quadraticCurveTo(S*.45,S*.7,S,S*.82);g.lineTo(S,S);g.lineTo(0,S);g.closePath();g.fill();
 for(i=0;i<5;i++){var rx=S*(.72+i*.055),rh=S*(.14+r()*.07);g.strokeStyle='#0f2a18';g.lineWidth=S*.012;g.beginPath();g.moveTo(rx,S*.9);g.quadraticCurveTo(rx+S*.01,S*.9-rh*.6,rx+S*.02,S*.9-rh);g.stroke();g.fillStyle='#6b3a1c';rr(rx+S*.008,S*.9-rh-S*.03,S*.024,S*.06,S*.01);g.fill()}
 drawLantern(g,S*.56,S*.4,S*.2,[1,1,1,1,1],0,{lit:1});
 drawLarry(g,S*.2,S*.93,S*.1,{t:0,face:1,mouth:1,lamp:1});
 for(i=0;i<22;i++){drawFirefly(g,r()*S,S*(.28+r()*.62),S*.018,0,i,.9)}
 g=g0;SLDPIC.k=k;SLDPIC.c=c;return c}
PZ.slide={
 theme:function(g,x,y,w,h){g.fillStyle='#1c1208';g.fillRect(x,y,w,h)},
 asp:function(){return{c:3,r:3,k:1}},
 init:function(L){var a=L.start.slice();return{a:a,pos:a.map(function(v,i){return[i%3,(i/3)|0]}),an:null,busy:false,hm:null,q:[]}},
 snap:function(s){return{a:s.a.slice()}},
 rest:function(s,o){s.a=o.a.slice();s.an=null;s.busy=false;s.q=[]},
 update:function(s,dt,P){if(s.an){s.an.t+=dt;if(s.an.t>=.12){s.a=SLD.apply(s.a,s.an.i);s.an=null;sfx('tick');if(s.q.length){var n=s.q.shift();PZ.slide.start(s,n)}else s.busy=false}}},
 start:function(s,i){s.an={i:i,t:0,tile:s.a[i],z:s.a.indexOf(0)};s.busy=true},
 down:function(s,p,B,P){if(s.busy)return;var gx=Math.floor((p.x-B.ox)/B.cell),gy=Math.floor((p.y-B.oy)/B.cell);if(gx<0||gy<0||gx>2||gy>2)return;var i=gy*3+gx,z=s.a.indexOf(0),zx=z%3,zy=(z/3)|0;
  if(i===z)return;if(gx!==zx&&gy!==zy){sfx('nope');return}
  /* сдвиг линии: плитки между выбранной и пустой */
  var list=[],stp=gx===zx?(gy<zy?3:-3):(gx<zx?1:-1),j=z-stp;while(true){list.push(j);if(j===i)break;j-=stp}
  pzPush();PZ.slide.start(s,list[0]);s.q=list.slice(1)},
 hint:function(s){var i=SLD.best(s.a);if(i==null)return null;return{mark:{i:i},say:'Сдвинь эту плитку в свободное место.'}},
 auto:function(s,B){var h=PZ.slide.hint(s);if(!h)return null;var i=h.mark.i;return[{t:'tap',x:B.ox+(i%3+.5)*B.cell,y:B.oy+(((i/3)|0)+.5)*B.cell}]},
 won:function(s){return SLD.won(s.a)},
 draw:function(s,B,t){var cell=B.cell,pic=slidePic(cell),i,a=s.a,w=SLD.won(a);
  for(i=0;i<9;i++){g.fillStyle='rgba(0,0,0,.35)';rr(B.ox+(i%3)*cell+3,B.oy+((i/3)|0)*cell+3,cell-6,cell-6,10);g.fill()}
  for(i=0;i<9;i++){var v=a[i];if(v===0&&!w)continue;var tv=v===0?9:v,sx=(tv-1)%3,sy=((tv-1)/3)|0,px=B.ox+(i%3)*cell,py=B.oy+((i/3)|0)*cell;
   if(s.an&&s.an.tile===v&&v!==0){var z=s.an.z,k=ease(Math.min(1,s.an.t/.12));px=lerp(px,B.ox+(z%3)*cell,k);py=lerp(py,B.oy+((z/3)|0)*cell,k)}
   if(s.an&&s.an.i===i){}
   g.save();rr(px+2,py+2,cell-4,cell-4,9);g.clip();g.drawImage(pic,sx*cell*dpr,sy*cell*dpr,cell*dpr,cell*dpr,px,py,cell,cell);g.restore();
   if(!w){g.lineWidth=3;g.strokeStyle='rgba(255,236,170,.75)';rr(px+2,py+2,cell-4,cell-4,9);g.stroke();g.fillStyle='rgba(0,0,0,.45)';rr(px+6,py+6,cell*.24,cell*.24,6);g.fill();txt(String(v),px+6+cell*.12,py+6+cell*.12+fz(7)*.45,fz(12),'#ffe9a8',{al:'center',fam:FU,w:700})}}
  if(s.hm){var i2=s.hm.i,hx=B.ox+(i2%3+.5)*cell,hy=B.oy+(((i2/3)|0)+.5)*cell;hintRing(hx,hy,cell*.42,t)}}
};
