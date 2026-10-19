/* ===== вид «Поиск»: найди спрятанные вещи ===== */
function itS(fn,lw,col,ol){g.lineCap='round';g.lineJoin='round';g.strokeStyle=ol;g.lineWidth=lw*1.55;fn();g.stroke();g.strokeStyle=col;g.lineWidth=lw;fn();g.stroke()}
function itF(col,ol,lw){g.fillStyle=col;g.fill();g.lineWidth=lw;g.lineJoin='round';g.strokeStyle=ol;g.stroke()}
var IT={
 key:{n:'Ключ',d:function(s){itS(function(){g.beginPath();g.arc(-s*.52,0,s*.3,0,TAU);g.moveTo(-s*.22,0);g.lineTo(s*.9,0);g.moveTo(s*.62,0);g.lineTo(s*.62,s*.34);g.moveTo(s*.86,0);g.lineTo(s*.86,s*.26)},s*.19,'#f4c437','#4a3208')}},
 feather:{n:'Перо',d:function(s){g.beginPath();g.moveTo(-s*.95,s*.75);g.quadraticCurveTo(-s*.6,-s*.95,s*.95,-s*.85);g.quadraticCurveTo(s*.35,-s*.05,-s*.95,s*.75);itF(LG(g,-s,s,s,-s,[0,'#cfe8ff',1,'#6aa6f0']),'#1e3a6a',s*.07);g.strokeStyle='#1e3a6a';g.lineWidth=s*.07;g.beginPath();g.moveTo(-s*.95,s*.75);g.quadraticCurveTo(-s*.1,-s*.1,s*.7,-s*.7);g.stroke()}},
 button:{n:'Пуговка',d:function(s){g.beginPath();g.arc(0,0,s*.72,0,TAU);itF(RG(g,-s*.2,-s*.2,s*.05,s*.8,[0,'#ff9a8a',1,'#c43a2c']),'#5a120c',s*.08);g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=s*.06;g.beginPath();g.arc(0,0,s*.5,0,TAU);g.stroke();g.fillStyle='#4a0f0a';[[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]].forEach(function(p){g.beginPath();g.arc(p[0]*s,p[1]*s,s*.07,0,TAU);g.fill()})}},
 shell:{n:'Ракушка',d:function(s){g.beginPath();g.moveTo(0,s*.7);g.quadraticCurveTo(-s*1.05,s*.2,-s*.75,-s*.35);g.quadraticCurveTo(0,-s*.95,s*.75,-s*.35);g.quadraticCurveTo(s*1.05,s*.2,0,s*.7);itF(LG(g,0,-s,0,s,[0,'#ffd6e0',1,'#e88aa8']),'#6a2a42',s*.08);g.strokeStyle='rgba(120,40,70,.55)';g.lineWidth=s*.05;for(var i=-3;i<=3;i++){g.beginPath();g.moveTo(0,s*.62);g.lineTo(i*s*.2,-s*.55+Math.abs(i)*s*.06);g.stroke()}}},
 bell:{n:'Колокол',d:function(s){melBell(0,s*.05,s*.78,'#ffd24a',0,0,0)}},
 star:{n:'Звезда',d:function(s){g.beginPath();for(var i=0;i<10;i++){var a=-PI/2+i*PI/5,r=i%2?s*.4:s*.9;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();itF(RG(g,-s*.15,-s*.2,s*.05,s,[0,'#fff6b0',1,'#f0a820']),'#6a4300',s*.08)}},
 spoon:{n:'Ложка',d:function(s){g.beginPath();g.ellipse(-s*.55,0,s*.38,s*.28,0,0,TAU);itF(LG(g,-s,-s*.3,-s*.2,s*.3,[0,'#f2f6ff',1,'#9aa6c0']),'#2a3350',s*.07);itS(function(){g.beginPath();g.moveTo(-s*.2,0);g.lineTo(s*.95,0)},s*.14,'#c4cde0','#2a3350')}},
 acorn:{n:'Жёлудь',d:function(s){g.beginPath();g.moveTo(-s*.5,-s*.05);g.quadraticCurveTo(-s*.5,s*.85,0,s*.9);g.quadraticCurveTo(s*.5,s*.85,s*.5,-s*.05);g.closePath();itF(LG(g,-s*.5,0,s*.5,0,[0,'#d9a25a',1,'#8a5a22']),'#3a220a',s*.07);g.beginPath();g.ellipse(0,-s*.1,s*.62,s*.38,0,PI,TAU);g.lineTo(s*.62,-s*.05);g.lineTo(-s*.62,-s*.05);g.closePath();itF('#7a4a1c','#2a1604',s*.07);g.fillStyle='#4a2a0c';g.fillRect(-s*.05,-s*.7,s*.1,s*.2)}},
 coin:{n:'Монетка',d:function(s){g.beginPath();g.arc(0,0,s*.78,0,TAU);itF(RG(g,-s*.2,-s*.2,s*.05,s*.9,[0,'#fff0a0',1,'#d9a020']),'#5a3a00',s*.08);g.strokeStyle='rgba(120,80,0,.6)';g.lineWidth=s*.06;g.beginPath();g.arc(0,0,s*.55,0,TAU);g.stroke();g.fillStyle='rgba(140,90,0,.7)';g.beginPath();for(var i=0;i<10;i++){var a=-PI/2+i*PI/5,r=i%2?s*.12:s*.3;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill()}},
 butterfly:{n:'Бабочка',d:function(s){[-1,1].forEach(function(k){g.save();g.scale(k,1);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(s*.4,-s*1.1,s*.95,-s*.55);g.quadraticCurveTo(s*.9,s*.1,0,0);itF('#ff8ad0','#6a1a50',s*.06);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(s*.8,s*.1,s*.7,s*.7);g.quadraticCurveTo(s*.2,s*.8,0,0);itF('#7ad0ff','#1a4a7a',s*.06);g.restore()});itS(function(){g.beginPath();g.moveTo(0,-s*.35);g.lineTo(0,s*.4)},s*.12,'#3a2a50','#1a1030')}},
 candle:{n:'Свеча',d:function(s){g.beginPath();g.rect(-s*.3,-s*.25,s*.6,s*.95);itF(LG(g,-s*.3,0,s*.3,0,[0,'#fff6dc',1,'#e8cf94']),'#6a5020',s*.07);g.beginPath();g.moveTo(0,-s*.95);g.quadraticCurveTo(s*.28,-s*.55,0,-s*.28);g.quadraticCurveTo(-s*.28,-s*.55,0,-s*.95);itF('#ffb43a','#a04a00',s*.05);g.strokeStyle='#4a3a20';g.lineWidth=s*.06;g.beginPath();g.moveTo(0,-s*.28);g.lineTo(0,-s*.22);g.stroke()}},
 envelope:{n:'Письмо',d:function(s){g.beginPath();g.rect(-s*.85,-s*.55,s*1.7,s*1.1);itF('#f6ecd0','#5a4420',s*.07);g.beginPath();g.moveTo(-s*.85,-s*.55);g.lineTo(0,s*.12);g.lineTo(s*.85,-s*.55);g.strokeStyle='#5a4420';g.lineWidth=s*.07;g.stroke();g.beginPath();g.arc(0,s*.1,s*.2,0,TAU);itF('#d83a3a','#5a0e0e',s*.05)}},
 specs:{n:'Очки',d:function(s){itS(function(){g.beginPath();g.arc(-s*.5,0,s*.4,0,TAU);g.moveTo(s*.9,0);g.arc(s*.5,0,s*.4,0,TAU);g.moveTo(-s*.1,-s*.05);g.quadraticCurveTo(0,-s*.18,s*.1,-s*.05)},s*.11,'#c89a40','#3a2808');g.fillStyle='rgba(170,220,255,.35)';g.beginPath();g.arc(-s*.5,0,s*.38,0,TAU);g.arc(s*.5,0,s*.38,0,TAU);g.fill()}},
 horseshoe:{n:'Подкова',d:function(s){itS(function(){g.beginPath();g.arc(0,s*.1,s*.62,PI*.85,PI*.15+TAU*0)},s*.26,'#aeb6c8','#2a3044');g.fillStyle='#3a4258';[[-.55,.0],[-.52,-.4],[0,-.6],[.52,-.4],[.55,.0]].forEach(function(p){g.beginPath();g.arc(p[0]*s*.95,p[1]*s*.95+s*.1,s*.05,0,TAU);g.fill()})}},
 cog:{n:'Шестерня',d:function(s){g.beginPath();for(var i=0;i<16;i++){var a=i/16*TAU,r=(i%2)?s*.62:s*.9;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();itF(RG(g,-s*.2,-s*.2,s*.05,s,[0,'#e0c8a0',1,'#8a6a3a']),'#3a2a10',s*.07);g.beginPath();g.arc(0,0,s*.25,0,TAU);g.fillStyle='#2a1c0a';g.fill()}},
 mushroom:{n:'Гриб',d:function(s){g.beginPath();g.moveTo(-s*.28,0);g.lineTo(-s*.22,s*.8);g.lineTo(s*.22,s*.8);g.lineTo(s*.28,0);g.closePath();itF('#f6e8cc','#5a4020',s*.06);g.beginPath();g.ellipse(0,-s*.05,s*.85,s*.7,0,PI,TAU);g.closePath();itF('#e0402e','#5a0e08',s*.07);g.fillStyle='#fff';[[-.4,-.35,.1],[.1,-.55,.12],[.45,-.25,.09]].forEach(function(p){g.beginPath();g.arc(p[0]*s,p[1]*s,p[2]*s,0,TAU);g.fill()})}},
 diary:{n:'Дневник',d:function(s){g.beginPath();g.rect(-s*.6,-s*.8,s*1.2,s*1.6);itF(LG(g,-s*.6,0,s*.6,0,[0,'#8a4a2a',1,'#5a2a14']),'#2a1208',s*.07);g.fillStyle='#d9b65a';g.beginPath();g.rect(-s*.6,-s*.8,s*.16,s*1.6);g.fill();g.beginPath();g.arc(s*.1,0,s*.28,0,TAU);itF('#e8c860','#5a3a00',s*.05);g.fillStyle='#8a5a00';g.beginPath();for(var i=0;i<10;i++){var a=-PI/2+i*PI/5,r=i%2?s*.07:s*.18;g.lineTo(s*.1+Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill()}}
};
function itemDraw(k,x,y,s,rot){g.save();g.translate(x,y);g.rotate(rot||0);IT[k].d(s);g.restore()}
/* сцены: sky, hill, ground, water?, night? ; items: k,x,y (0..1 по сцене),s (множитель),r,cv:{k:'leaf'|'reed'|'rock',dx,dy,s} */
LV.hidden=[
 {name:'У старого пня',sky:['#7ec8e8','#d6f0e8'],hill:['#5aa078','#3a7a5a'],gr:['#5a9a3a','#2f6a2a'],water:0,sun:1,
  items:[{k:'key',x:.18,y:.76,s:1,r:-.5,cv:{k:'leaf',dx:.05,dy:-.02}},{k:'feather',x:.62,y:.52,s:1.1,r:.4,cv:{k:'reed',dx:-.04,dy:.02}},{k:'button',x:.84,y:.8,s:.9,r:0},{k:'acorn',x:.4,y:.66,s:.9,r:.3,cv:{k:'leaf',dx:-.03,dy:.0}},{k:'shell',x:.52,y:.88,s:1,r:.1},{k:'spoon',x:.14,y:.56,s:1.1,r:.9,cv:{k:'rock',dx:.06,dy:.04}}]},
 {name:'Осиная переправа',sky:['#f0a070','#ffe2b0'],hill:['#9a7a4a','#6a5a30'],gr:['#9a8a3a','#5a5a22'],water:0,sun:1,
  items:[{k:'horseshoe',x:.2,y:.72,s:1.05,r:.5,cv:{k:'reed',dx:.04,dy:.0}},{say:'Шестерёнка с императорской меткой. Он ведь сам весь на шестерёнках.',k:'cog',x:.7,y:.62,s:1,r:.2,cv:{k:'leaf',dx:.05,dy:.03}},{k:'coin',x:.45,y:.85,s:.9,r:0},{say:'Свечной огарок. Недогорел до конца — видно, задули в спешке.',k:'candle',x:.86,y:.8,s:1,r:.15},{say:'Приказ с печатью: «Факелы вокруг башни не гасить до рассвета. Ни одного. Шестерон».',k:'envelope',x:.33,y:.55,s:1,r:-.2,cv:{k:'rock',dx:.05,dy:.03}},{k:'star',x:.6,y:.46,s:.9,r:.2}]},
 {name:'Лунная трясина',sky:['#17205a','#4a4a98'],hill:['#28306a','#1c2250'],gr:['#2c5a52','#14342e'],water:0,night:1,
  items:[{say:'Очки! Чьи — неизвестно: лунные бабочки не разбирают, что тащат.',k:'specs',x:.22,y:.62,s:1.1,r:-.3,cv:{k:'reed',dx:.04,dy:.02}},{k:'bell',x:.78,y:.58,s:1,r:.1,cv:{k:'leaf',dx:-.04,dy:.03}},{say:'Бабочка сидела на виду — просто в темноте её не замечали.',k:'butterfly',x:.48,y:.46,s:1,r:.2},{say:'Дневник Паутиньи с рецептами кружев. Тут все её секреты — лучше не заглядывать.',k:'diary',x:.62,y:.84,s:1,r:.2},{k:'key',x:.14,y:.86,s:.95,r:.6,cv:{k:'rock',dx:.05,dy:-.02}},{k:'mushroom',x:.86,y:.82,s:.9,r:0}]},
 {name:'Мастерская Шестерона',sky:['#3a2a4a','#8a5a5a'],hill:['#4a3a50','#2e2238'],gr:['#5a4a3a','#2a2018'],water:0,night:1,
  items:[{say:'Шестерёнка. Старая, затёртая. Такие же у него внутри.',k:'cog',x:.18,y:.66,s:1.05,r:.4,cv:{k:'leaf',dx:.05,dy:.02}},{say:'Заводной ключик. Такими заводят игрушки… Он что, игрушка?',k:'key',x:.55,y:.56,s:1,r:-.6,cv:{k:'rock',dx:-.05,dy:.03}},{say:'Дневник. Последняя запись: «Ночь 1042. Опять не спал. Считал тиканье до рассвета, а рассвета не было».',k:'diary',x:.84,y:.7,s:1,r:-.2},{say:'Очки с треснувшим стеклом. Он часто всматривался в темноту.',k:'specs',x:.38,y:.86,s:1,r:.2},{say:'Огарок. Рядом — целая коробка таких. Он боится, что свечи кончатся.',k:'candle',x:.7,y:.88,s:1,r:0,cv:{k:'reed',dx:.05,dy:-.02}},{say:'Письмо, зачитанное до дыр: «Милый Шестерон! Я уезжаю надолго. Оставляю лампадку у изголовья: пока она горит, ничего страшного нет. Твой Мастер».',k:'envelope',x:.28,y:.5,s:1,r:.3}]}
];
function hdBG(sc,x,y,w,h,t){
 g.fillStyle=LG(g,x,y,x,y+h*.6,[0,sc.sky[0],1,sc.sky[1]]);g.fillRect(x,y,w,h);var i,r;
 if(sc.night){for(i=0;i<50;i++){g.fillStyle='rgba(255,255,255,'+(.3+hash2(i,1,2)*.6)+')';g.beginPath();g.arc(x+hash2(i,2,3)*w,y+hash2(i,3,4)*h*.4,.6+hash2(i,4,5)*1.2,0,TAU);g.fill()}glow(g,x+w*.82,y+h*.14,h*.2,'#fff3c0',.5);g.fillStyle='#fff8dc';g.beginPath();g.arc(x+w*.82,y+h*.14,h*.045,0,TAU);g.fill()}
 else if(sc.sun){glow(g,x+w*.2,y+h*.16,h*.3,'#fff0b0',.6);g.fillStyle='#fffbe0';g.beginPath();g.arc(x+w*.2,y+h*.16,h*.05,0,TAU);g.fill()}
 /* дальние холмы и ёлки */
 g.fillStyle=sc.hill[0];g.beginPath();g.moveTo(x,y+h*.5);g.quadraticCurveTo(x+w*.25,y+h*.3,x+w*.5,y+h*.46);g.quadraticCurveTo(x+w*.78,y+h*.3,x+w,y+h*.44);g.lineTo(x+w,y+h);g.lineTo(x,y+h);g.closePath();g.fill();
 for(i=0;i<9;i++){var tx=x+w*(i/9+hash2(i,7,1)*.08),ty=y+h*(.42+hash2(i,8,1)*.06),th=h*(.12+hash2(i,9,1)*.07);g.fillStyle=sh(sc.hill[1],-.1);g.beginPath();g.moveTo(tx,ty-th);g.lineTo(tx+th*.34,ty);g.lineTo(tx-th*.34,ty);g.closePath();g.fill();g.beginPath();g.moveTo(tx,ty-th*.65);g.lineTo(tx+th*.4,ty+th*.15);g.lineTo(tx-th*.4,ty+th*.15);g.closePath();g.fill()}
 g.fillStyle=sc.hill[1];g.beginPath();g.moveTo(x,y+h*.58);g.quadraticCurveTo(x+w*.4,y+h*.46,x+w*.7,y+h*.56);g.quadraticCurveTo(x+w*.9,y+h*.5,x+w,y+h*.56);g.lineTo(x+w,y+h);g.lineTo(x,y+h);g.closePath();g.fill();
 /* вода */
 if(sc.water>0){var wy=y+h*(1-sc.water);g.fillStyle=LG(g,x,wy,x,y+h,[0,sc.night?'#2a5a8a':'#4aa8c8',1,sc.night?'#12304e':'#2a78a0']);g.fillRect(x,wy,w,h-(wy-y));g.strokeStyle='rgba(255,255,255,.3)';g.lineWidth=1.3;for(i=0;i<7;i++){var ly=wy+((i*37)%(h*sc.water-6))+6;g.beginPath();g.moveTo(x+w*(.05+hash2(i,2,2)*.7),ly);g.lineTo(x+w*(.05+hash2(i,2,2)*.7)+w*.14,ly+Math.sin(t*1.5+i)*1.5);g.stroke()}
  g.fillStyle=LG(g,x,y+h*(.58),x,wy,[0,sc.gr[0],1,sc.gr[1]]);g.beginPath();g.moveTo(x,wy);g.lineTo(x,y+h*.6);g.quadraticCurveTo(x+w*.5,y+h*.56,x+w,y+h*.62);g.lineTo(x+w,wy);g.closePath();g.fill()}
 else{g.fillStyle=LG(g,x,y+h*.58,x,y+h,[0,sc.gr[0],1,sc.gr[1]]);g.beginPath();g.moveTo(x,y+h*.62);g.quadraticCurveTo(x+w*.4,y+h*.54,x+w,y+h*.6);g.lineTo(x+w,y+h);g.lineTo(x,y+h);g.closePath();g.fill()}
 /* трава-мазки */
 for(i=0;i<60;i++){var gx=x+hash2(i,11,1)*w,gy=y+h*(.6+hash2(i,12,1)*.38);if(sc.water&&gy>y+h*(1-sc.water))continue;g.strokeStyle='rgba(0,0,0,.14)';g.lineWidth=1.4;g.beginPath();g.moveTo(gx,gy);g.lineTo(gx-2,gy-h*.025);g.moveTo(gx,gy);g.lineTo(gx+2,gy-h*.022);g.stroke()}}
function hdClutter(sc,x,y,w,h,si,t){var list=[],i;
 for(i=0;i<6;i++){var wy=sc.water?1-sc.water:1.1;var yy=.6+hash2(i,21,si)*.3;if(yy>wy-.02)yy=wy-.04-hash2(i,22,si)*.04;list.push({k:i%3?'rock':'stump',x:hash2(i,23,si),y:yy,s:.45+hash2(i,24,si)*.35})}
 for(i=0;i<8;i++){var yy2=.62+hash2(i,31,si)*.28;if(sc.water&&yy2>1-sc.water-.03)yy2=1-sc.water-.05;list.push({k:i%2?'bush':'flowers',x:hash2(i,32,si),y:yy2,s:.7+hash2(i,33,si)*.6})}
 list.sort(function(a,b){return a.y-b.y});
 list.forEach(function(o,j){var px=x+o.x*w,py=y+o.y*h,u=h*.06*o.s;g.save();g.translate(px,py);
  if(o.k==='rock'){g.beginPath();g.ellipse(0,0,u*1.2,u*.8,0,0,TAU);g.fillStyle=sc.night?'#4a5a7a':'#8a96a4';g.fill();g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.ellipse(-u*.3,-u*.3,u*.5,u*.25,-.4,0,TAU);g.fill();g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1.5;g.beginPath();g.ellipse(0,0,u*1.2,u*.8,0,0,TAU);g.stroke()}
  else if(o.k==='stump'){g.fillStyle='#6a4a2a';g.fillRect(-u*.7,-u*.8,u*1.4,u*1.2);g.beginPath();g.ellipse(0,u*.4,u*.7,u*.22,0,0,TAU);g.fill();g.beginPath();g.ellipse(0,-u*.8,u*.7,u*.24,0,0,TAU);g.fillStyle='#c89a62';g.fill();g.strokeStyle='#6a4a2a';g.lineWidth=1.2;g.beginPath();g.ellipse(0,-u*.8,u*.38,u*.12,0,0,TAU);g.stroke()}
  else if(o.k==='bush'){[[-.7,0,.8],[0,-.3,1],[.7,0,.8]].forEach(function(b){g.beginPath();g.arc(b[0]*u,b[1]*u,b[2]*u,0,TAU);g.fillStyle=sc.night?'#2a6a5a':'#3f8a3a';g.fill()});g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.arc(-u*.2,-u*.6,u*.4,0,TAU);g.fill()}
  else{for(var q=0;q<4;q++){var fx=(q-1.5)*u*.5;g.strokeStyle='#2a6a2a';g.lineWidth=1.6;g.beginPath();g.moveTo(fx,u*.4);g.lineTo(fx,-u*.3-q%2*u*.2);g.stroke();g.beginPath();g.arc(fx,-u*.35-q%2*u*.2,u*.2,0,TAU);g.fillStyle=['#ff8ab0','#ffe27a','#fff','#b6a0ff'][q];g.fill()}}
  g.restore()})}
function hdCover(c,px,py,u,t,night){g.save();g.translate(px,py);
 if(c.k==='leaf'){for(var i=0;i<4;i++){g.save();g.rotate(-1.2+i*.6+Math.sin(t*1.2+i)*.03);g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(u*.9,-u*.5,u*1.8,0);g.quadraticCurveTo(u*.9,u*.5,0,0);g.fillStyle=night?(i%2?'#2e7a58':'#3a9a68'):(i%2?'#3c8f3c':'#58b84a');g.fill();g.strokeStyle='rgba(0,40,0,.35)';g.lineWidth=1.3;g.stroke();g.beginPath();g.moveTo(0,0);g.lineTo(u*1.5,0);g.stroke();g.restore()}}
 else if(c.k==='reed'){for(var j=0;j<5;j++){var rx=(j-2)*u*.28,sw=Math.sin(t*1.3+j)*u*.06;g.strokeStyle=night?'#2a6a4a':'#3a8a3a';g.lineWidth=u*.14;g.lineCap='round';g.beginPath();g.moveTo(rx,u*.9);g.quadraticCurveTo(rx+sw,0,rx+sw*1.6,-u*(1.3+j%2*.4));g.stroke();if(j%2){g.fillStyle='#6a3a1a';rr(rx+sw*1.4-u*.1,-u*(1.3+j%2*.4)-u*.2,u*.2,u*.5,u*.1);g.fill()}}}
 else{g.beginPath();g.ellipse(0,0,u*1.1,u*.75,0,0,TAU);g.fillStyle=night?'#4a5a7a':'#8a96a4';g.fill();g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.ellipse(-u*.3,-u*.25,u*.5,u*.22,-.4,0,TAU);g.fill();g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1.5;g.beginPath();g.ellipse(0,0,u*1.1,u*.75,0,0,TAU);g.stroke()}
 g.restore()}
PZ.hidden={
 theme:function(g,x,y,w,h){g.fillStyle='#10200f';g.fillRect(x,y,w,h)},
 asp:function(){return{c:4,r:4.5,k:1}},
 init:function(L){var f=L.items.map(function(){return 0});return{P:L,found:f,fl:[],ri:[],miss:0,hm:null,busy:false,t0:0,tipd:false,si:0}},
 snap:function(){return{}},rest:function(){},
 sceneRect:function(B){var w=B.cell*4,h=B.cell*4.5;return{x:B.ox,y:B.oy,w:w,h:h,sh:h*.855,sx:B.ox,sy:B.oy}},
 ipos:function(s,B,i){var R=PZ.hidden.sceneRect(B),it=s.P.items[i];return[R.x+it.x*R.w,R.y+it.y*R.sh,B.cell*.4*it.s]},
 slot:function(s,B,i){var R=PZ.hidden.sceneRect(B),n=s.P.items.length,sw=R.w/n;return[R.x+sw*(i+.5),R.y+R.sh+(R.h-R.sh)*.42,Math.min(sw*.3,R.h*.05)]},
 update:function(s,dt,P){s.t0+=dt;for(var i=s.fl.length-1;i>=0;i--){s.fl[i].t+=dt;if(s.fl[i].t>=.7){s.found[s.fl[i].i]=2;s.fl.splice(i,1)}}for(i=s.ri.length-1;i>=0;i--){s.ri[i].t+=dt;if(s.ri[i].t>.5)s.ri.splice(i,1)}},
 down:function(s,p,B,P){var it=s.P.items,i,best=-1,bd=1e9;for(i=0;i<it.length;i++){if(s.found[i])continue;var c=PZ.hidden.ipos(s,B,i),d=Math.hypot(p.x-c[0],p.y-c[1]);if(d<c[2]*1.25+B.cell*.1&&d<bd){bd=d;best=i}}
  if(best<0){s.ri.push({x:p.x,y:p.y,t:0});s.miss++;sfx('tick');if(s.miss===6&&!s.tipd){s.tipd=true;pzSay('krap','Загляни за листья, под камни и в траву. А я подскажу — нажми лампочку.',5)}P.idle=0;return}
  s.found[best]=1;s.fl.push({i:best,t:0});P.idle=0;P.moves++;var c2=PZ.hidden.ipos(s,B,best);sfx('fire',Math.min(9,s.found.filter(Boolean).length-1));pfBurst(c2[0],c2[1],16,'#ffe27a',150,.8);pfRing(c2[0],c2[1],c2[2]*1.2,'#fff3a0');
  var left=s.found.filter(function(v){return!v}).length,sy=it[best].say;if(sy)pzSay('krap',sy,Math.max(4.5,Math.min(11,sy.length/12)));else if(left>0&&left<=2&&s.found.filter(Boolean).length===it.length-left)pzSay('krap',left===1?'Остался один предмет!':'Ещё два — почти всё нашли!',2.6)},
 hint:function(s,L){var i=s.found.indexOf(0);if(i<0)return null;return{mark:{i:i},say:'Смотри туда, где светится кольцо: «'+IT[s.P.items[i].k].n+'».'}},
 auto:function(s,B){var i=s.found.indexOf(0);if(i<0)return null;var c=PZ.hidden.ipos(s,B,i);return[{t:'tap',x:c[0],y:c[1],w:60}]},
 won:function(s){return s.found.every(function(v){return v===2})},
 draw:function(s,B,t,PP){var R=PZ.hidden.sceneRect(B),sc=s.P,it=sc.items,i,si=LV.hidden.indexOf(sc);
  hdBG(sc,R.x,R.y,R.w,R.sh,t);hdClutter(sc,R.x,R.y,R.w,R.sh,si,t);
  /* предметы */
  for(i=0;i<it.length;i++){if(s.found[i]===2)continue;var c=PZ.hidden.ipos(s,B,i),o=it[i],fl=s.fl.filter(function(f){return f.i===i})[0];
   if(fl){var k=fl.t/.7,e=ease(k),to=PZ.hidden.slot(s,B,i),px=lerp(c[0],to[0],e),py=lerp(c[1],to[1],e)-Math.sin(k*PI)*B.cell*.5,sz=lerp(c[2],to[2]*1.1,e)*(1+.4*Math.sin(k*PI));g.save();g.globalCompositeOperation='lighter';glow(g,px,py,sz*2.4,'#fff0a0',.7*(1-k));g.restore();itemDraw(o.k,px,py,sz,o.r*(1-k))}
   else{g.save();g.globalAlpha=1;g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=4;itemDraw(o.k,c[0],c[1],c[2],o.r);g.restore()}}
  /* укрытия поверх */
  for(i=0;i<it.length;i++){if(s.found[i])continue;var o2=it[i];if(!o2.cv)continue;var c3=PZ.hidden.ipos(s,B,i);hdCover(o2.cv,c3[0]+o2.cv.dx*R.w,c3[1]+o2.cv.dy*R.sh,c3[2]*(o2.cv.k==='rock'?.6:o2.cv.k==='leaf'?.8:.85),t,sc.night)}
  /* подсказка */
  if(s.hm&&s.found[s.hm.i]===0){var hc=PZ.hidden.ipos(s,B,s.hm.i),pr=1+.15*Math.sin(t*5);g.save();g.globalCompositeOperation='lighter';glow(g,hc[0],hc[1],hc[2]*2.4,'#fff3a0',.55);g.restore();hintRing(hc[0],hc[1],hc[2]*1.5*pr,t)}
  /* промахи */
  for(i=0;i<s.ri.length;i++){var q=s.ri[i],kk=q.t/.5;g.strokeStyle='rgba(255,255,255,'+(.55*(1-kk))+')';g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,B.cell*(.1+kk*.25),0,TAU);g.stroke()}
  /* передний план: деревья по краям, виньетка, светлячки */
  [[-.02,1],[1.02,-1]].forEach(function(e,j){var tx=R.x+R.w*e[0],ty=R.y+R.sh;g.fillStyle=sc.night?'#1a1a30':'#4a3220';g.beginPath();g.moveTo(tx-e[1]*R.w*.05,ty);g.quadraticCurveTo(tx-e[1]*R.w*.03,ty-R.sh*.4,tx+e[1]*R.w*.015,ty-R.sh*.8);g.lineTo(tx+e[1]*R.w*.1,ty-R.sh*.8);g.quadraticCurveTo(tx+e[1]*R.w*.09,ty-R.sh*.4,tx+e[1]*R.w*.11,ty);g.closePath();g.fill();
   [[0,-.8,.17],[.1,-.66,.13],[-.02,-.5,.11]].forEach(function(b,q){g.beginPath();g.arc(tx+e[1]*R.w*b[0]*.6,ty+R.sh*b[1],R.w*b[2],0,TAU);g.fillStyle=sc.night?(q%2?'#1f4a46':'#2a5e56'):(q%2?'#3a8a3a':'#4aa84a');g.fill()})});
  var vg=RG(g,R.x+R.w/2,R.y+R.sh*.55,R.w*.25,R.w*.8,[0,'rgba(0,0,0,0)',1,'rgba(0,0,0,.35)']);g.save();g.fillStyle=vg;g.fillRect(R.x,R.y,R.w,R.sh);g.restore();
  if(sc.night)for(i=0;i<8;i++){drawFirefly(g,R.x+((i*83.1+t*(7+i%3*3))%R.w),R.y+R.sh*(.3+hash2(i,41,2)*.55)+Math.sin(t+i)*8,B.cell*.1,t,i,.8)}
  /* полоса предметов */
  var by=R.y+R.sh;g.fillStyle=LG(g,0,by,0,R.y+R.h,[0,'#3a2412',1,'#1c1008']);g.fillRect(R.x,by,R.w,R.h-R.sh);g.fillStyle='rgba(255,220,150,.35)';g.fillRect(R.x,by,R.w,2);
  for(i=0;i<it.length;i++){var sl=PZ.hidden.slot(s,B,i),fd=s.found[i]===2;g.save();g.globalAlpha=fd?1:.42;if(!fd){g.shadowColor='rgba(0,0,0,.6)';g.shadowBlur=3}itemDraw(it[i].k,sl[0],sl[1],sl[2]*1.1,0);g.restore();
   if(fd){g.strokeStyle='#8ff08a';g.lineWidth=2.6;g.lineCap='round';g.beginPath();g.moveTo(sl[0]+sl[2]*.55,sl[1]+sl[2]*.2);g.lineTo(sl[0]+sl[2]*.85,sl[1]+sl[2]*.55);g.lineTo(sl[0]+sl[2]*1.35,sl[1]-sl[2]*.35);g.stroke()}
   var nm=IT[it[i].k].n,npx=Math.max(8,fz(9.5)),swd=R.w/it.length-4;setFont(npx,500,FU);while(npx>6&&g.measureText(nm).width>swd){npx-=.5;setFont(npx,500,FU)}txt(nm,sl[0],R.y+R.h-(R.h-R.sh)*.13,npx,fd?'#d8f0c0':'rgba(255,240,210,.78)',{al:'center',fam:FU,w:500})}}
};
