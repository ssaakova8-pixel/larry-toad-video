/* ===== вид «Загадка»: Госпожа Паутинья загадывает, три ответа ===== */
LV.riddle=[
 {q:'Зимой и летом\nодним цветом.',a:['Ель','Берёза','Ромашка'],ok:0,win:'Верно! Ель не сбрасывает хвою — потому и зелёная круглый год.'},
 {q:'Сидит дед, во сто шуб одет.\nКто его раздевает,\nтот слёзы проливает.',a:['Лук','Репа','Подсолнух'],ok:0,win:'Верно, лук! От него и правда слёзы.'},
 {q:'Не лает, не кусает,\nа в дом не пускает.',a:['Замок','Колокольчик','Подкова'],ok:0,win:'Верно, замок! Охраняет дверь и без зубов.'},
 {q:'Растёт она вниз головой.\nНе летом растёт, а зимой.\nНо солнце её припечёт —\nзаплачет она и умрёт.',a:['Сосулька','Свеча','Морковь'],ok:0,win:'Верно, сосулька! Плачет, когда пригреет солнце.'},
 {q:'Что за чудо-красота!\nРасписные ворота\nпоказались на пути —\nни проехать, ни пройти.',a:['Радуга','Мост','Ярмарка'],ok:0,win:'Верно, радуга! Через неё не проехать, зато красиво.'},
 {q:'Кто говорит\nна всех языках?',a:['Эхо','Сорока','Ручей'],ok:0,win:'Верно, эхо! Повторит всё, что ему скажешь.'},
 {q:'Днём прячусь в траве,\nа ночью зажигаю\nсвой фонарик. Кто я?',a:['Светляк','Комар','Стрекоза'],ok:0,win:'Верно, светляк! Ночью без нас никак.'},
 {q:'Красный плащик, точки чёрные,\nкрылья прячу под него.\nНе кусаюсь, не жужжу.\nКто я?',a:['Божья коровка','Пчела','Муравей'],ok:0,win:'Это же наша Крапинка! Сама себя не узнала бы.'},
 {q:'Утром на четырёх ногах,\nднём на двух,\nвечером на трёх.\nКто это?',a:['Человек','Конь','Лягушка'],ok:0,win:'Верно, человек: малышом ползает, потом ходит, а в старости берёт палочку.'},
 {q:'Что становится больше,\nесли из него вынимать?',a:['Яма','Мешок','Озеро'],ok:0,win:'Верно, яма! Чем больше выкопал — тем она больше.'},
 {q:'У паука восемь лапок,\nу жука — шесть.\nСколько лапок у них вместе?',a:['12','14','16'],ok:1,win:'Верно: восемь и шесть — четырнадцать.'},
 {q:'Ни земля, ни вода:\nни пройти,\nни проплыть.',a:['Болото','Пустыня','Река'],ok:0,win:'Верно, болото! Нам как раз через него идти.'},
 {q:'Без рук, без ног,\nа ворота открывает.',a:['Ветер','Мороз','Дождь'],ok:0,win:'Верно, ветер! Он и ворота распахнёт, и листья закружит.'},
 {q:'Плету без спиц и без крючка\nузор на ветках с утречка.\nКто я?',a:['Паук','Портниха','Рыбак'],ok:0,win:'Верно! Паук — лучший кружевник в округе.'}
];
PZ.riddle={
 theme:function(g,x,y,w,h){g.fillStyle=LG(g,x,y,x,y+h,[0,'#2a1c4a',1,'#120a28']);g.fillRect(x,y,w,h);
  /* паутина в углах */
  g.strokeStyle='rgba(220,225,255,.16)';g.lineWidth=1.2;[[x,y,1,1],[x+w,y,-1,1]].forEach(function(c){for(var i=1;i<=6;i++){g.beginPath();g.arc(c[0],c[1],i*w*.1,c[2]>0?0:PI/2,c[2]>0?PI/2:PI);g.stroke()}for(i=0;i<=6;i++){var a=i/6*PI/2;g.beginPath();g.moveTo(c[0],c[1]);g.lineTo(c[0]+c[2]*Math.cos(a)*w*.62,c[1]+c[3]*Math.sin(a)*w*.62);g.stroke()}})},
 asp:function(){return{c:4,r:4.7,k:1}},
 init:function(L){var s={P:L,gone:{},ok:-1,okT:0,hm:null,busy:false,shake:{},t0:0};return s},
 snap:function(){return{}},rest:function(){},
 lay:function(B){var w=B.cell*4,h=B.cell*4.7,m=B.cell*.16,o={x:B.ox,y:B.oy,w:w,h:h,m:m};o.sc={x:o.x+m,y:o.y+h*.2,w:w-2*m,h:h*.31};var by=o.y+h*.55,bh=h*.108,gap=h*.024;o.b=[0,1,2].map(function(i){return{x:o.x+m*1.4,y:by+i*(bh+gap),w:w-2*m*1.4,h:bh}});return o},
 update:function(s,dt,P){s.t0+=dt;if(s.ok>=0)s.okT+=dt;for(var k in s.shake){s.shake[k]-=dt;if(s.shake[k]<=0)delete s.shake[k]}},
 down:function(s,p,B,P){if(s.ok>=0)return;var o=PZ.riddle.lay(B),i;for(i=0;i<3;i++){var b=o.b[i];if(p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h){if(s.gone[i])return;
   if(i===s.P.ok){s.ok=i;s.okT=0;sfx('perk');pfBurst(b.x+b.w/2,b.y+b.h/2,24,'#fff3a0',220,1)}
   else{s.gone[i]=true;s.shake[i]=.4;sfx('nope');pzSay('krap',['Не то! Подумай ещё.','Хм, нет. Паутинья хитрая!','Почти… но нет. Ещё разок!'][Math.floor(Math.random()*3)],3)}
   P.idle=0;return}}},
 hint:function(s){var wr=[0,1,2].filter(function(i){return i!==s.P.ok&&!s.gone[i]});if(wr.length>1){var w=wr[Math.floor(Math.random()*wr.length)];s.gone[w]=true;s.shake[w]=.4;sfx('bell');return{mark:null,say:'Один ответ точно лишний — я его убрала.'}}
  return{mark:{i:s.P.ok},say:'Осталось два — а правильный вот этот!'}},
 auto:function(s,B){if(s.ok>=0)return null;var b=PZ.riddle.lay(B).b[s.P.ok];return[{t:'tap',x:b.x+b.w/2,y:b.y+b.h/2}]},
 won:function(s){return s.ok>=0&&s.okT>.7},
 draw:function(s,B,t,PP){var o=PZ.riddle.lay(B),L=s.P,i,cell=B.cell,sc=o.sc;
  /* паучок на нити */
  var spx=o.x+o.w*.5,spy=o.y+o.h*.11+Math.sin(t*1.6)*cell*.05,ask=PP&&PP.page&&PP.page.ask||'spider';if(ask==='captain')drawBug(g,spx,o.y+o.h*.1+Math.sin(t*1.6)*cell*.04,cell*.2,{k:'captain',t:t,face:1,mood:s.ok>=0?1:0});else drawSpider(g,spx,spy,cell*.27,{t:t,mood:s.ok>=0?1:0,top:o.y});
  /* свиток */
  g.save();g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=14;g.shadowOffsetY=4;rr(sc.x,sc.y,sc.w,sc.h,cell*.18);g.fillStyle=LG(g,sc.x,sc.y,sc.x,sc.y+sc.h,[0,'#fbf1d6',1,'#e9d6a2']);g.fill();g.restore();rr(sc.x,sc.y,sc.w,sc.h,cell*.18);g.lineWidth=3;g.strokeStyle='#8a5a2a';g.stroke();
  var px=fz(22),lines,lh;for(;px>=12;px-=1){lines=[];L.q.split('\n').forEach(function(ln){wrapLines(ln,sc.w-cell*.5,px,{w:600}).forEach(function(x){lines.push(x)})});if(lines.length*px*1.3<=sc.h-cell*.35)break}
  lh=px*1.3;var y0=sc.y+sc.h/2-(lines.length-1)*lh/2;lines.forEach(function(ln,j){txt(ln,sc.x+sc.w/2,y0+j*lh,px,'#3a2410',{al:'center',fam:FT,w:600,bl:'middle'})});
  /* ответы */
  for(i=0;i<3;i++){var b=o.b[i],gone=s.gone[i],isOk=s.ok===i,sk=s.shake[i]?Math.sin(t*60)*cell*.04*(s.shake[i]/.4):0,pu=s.hm&&s.hm.i===i?1+.03*Math.sin(t*8):1;
   g.save();g.translate(b.x+b.w/2+sk,b.y+b.h/2);g.scale(pu,pu);g.globalAlpha=gone?.3:1;rr(-b.w/2,-b.h/2,b.w,b.h,b.h*.3);
   g.fillStyle=isOk?LG(g,0,-b.h/2,0,b.h/2,[0,'#9ff08a',1,'#3fae45']):gone?'#403456':LG(g,0,-b.h/2,0,b.h/2,[0,'#fff3c8',1,'#e9c97a']);g.fill();g.lineWidth=3;g.strokeStyle=isOk?'#1d6a28':gone?'#241a36':'#8a5a1a';g.stroke();
   if(!gone&&!isOk){g.fillStyle='rgba(255,255,255,.35)';rr(-b.w/2+4,-b.h/2+3,b.w-8,b.h*.32,b.h*.2);g.fill()}
   txt(L.a[i],0,0,Math.min(fz(22),b.h*.5),isOk?'#0d3a14':gone?'#8f84a6':'#3a2410',{al:'center',fam:FT,w:700,bl:'middle'});
   if(gone){g.strokeStyle='rgba(255,120,120,.8)';g.lineWidth=4;g.beginPath();g.moveTo(-b.w*.42,0);g.lineTo(b.w*.42,0);g.stroke()}
   g.restore();
   if(s.hm&&s.hm.i===i)hintRing(b.x+b.w-b.h*.5,b.y+b.h/2,b.h*.55,t)}}
};
