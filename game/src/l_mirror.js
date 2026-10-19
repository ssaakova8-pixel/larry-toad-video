/* ===== логика «Зеркала»: луч света от лампы Крапинки; кристаллы-зеркала поворачиваются тапом; зажечь все фонарики ===== */
/* карта: '.' пусто, '#' камень, '/' и '\' — поворотные зеркала, 'a' ('/') и 'b' ('\') — неподвижные, 'T' фонарик, '>' '^' '<' 'v' — источник */
var MIR={
 DX:[1,0,-1,0],DY:[0,-1,0,1],
 parse:function(L){var rows=L.rows,h=rows.length,w=rows[0].length,kind=[],o=[],sx=0,sy=0,sd=0,tg=[],tg_i=[],i=0,x,y,c,tog=[];
  for(y=0;y<h;y++)for(x=0;x<w;x++,i++){c=rows[y].charAt(x);kind[i]=0;o[i]=0;
   if(c==='#')kind[i]=1;else if(c==='/'||c==='\\'){kind[i]=2;o[i]=c==='/'?0:1;tog.push(i)}else if(c==='a'||c==='b'){kind[i]=3;o[i]=c==='a'?0:1}
   else if(c==='T'){kind[i]=4;tg.push(i)}else if(c==='>'||c==='^'||c==='<'||c==='v'){kind[i]=5;sx=x;sy=y;sd='>^<v'.indexOf(c)}}
  return{w:w,h:h,kind:kind,sx:sx,sy:sy,sd:sd,tg:tg,tog:tog,st:{o:o}}},
 clone:function(s){return{o:s.o.slice()}},
 REF:[[1,0,3,2],[3,2,1,0]],
 trace:function(P,s){var x=P.sx,y=P.sy,d=P.sd,seen={},segs=[],lit={},n=0,cx=x,cy=y;
  while(n++<500){var nx=cx+MIR.DX[d],ny=cy+MIR.DY[d];if(nx<0||ny<0||nx>=P.w||ny>=P.h){segs.push([cx,cy,nx,ny,d,1]);break}
   var i=ny*P.w+nx,k=P.kind[i];if(k===1){segs.push([cx,cy,nx,ny,d,2]);break}
   segs.push([cx,cy,nx,ny,d,0]);var key=i+'.'+d;if(seen[key])break;seen[key]=1;
   if(k===2||k===3)d=MIR.REF[s.o[i]][d];else if(k===4)lit[i]=1;cx=nx;cy=ny}
  return{segs:segs,lit:lit}},
 lit:function(P,s){var t=MIR.trace(P,s),n=0;for(var i=0;i<P.tg.length;i++)if(t.lit[P.tg[i]])n++;return n},
 won:function(P,s){return MIR.lit(P,s)===P.tg.length},
 /* все решения по переключаемым зеркалам: [{mask, flips:[idx...]}] */
 all:function(P,s,cap){var k=P.tog.length,out=[],m,j,t=MIR.clone(s);cap=cap||100000;
  for(m=0;m<(1<<k);m++){for(j=0;j<k;j++)t.o[P.tog[j]]=(m>>j)&1;if(MIR.won(P,t)){var fl=[];for(j=0;j<k;j++)if(t.o[P.tog[j]]!==s.o[P.tog[j]])fl.push(P.tog[j]);out.push(fl);if(out.length>=cap)break}}
  return out},
 solve:function(P,s){var a=MIR.all(P,s),b=null;for(var i=0;i<a.length;i++)if(!b||a[i].length<b.length)b=a[i];return b}
};
