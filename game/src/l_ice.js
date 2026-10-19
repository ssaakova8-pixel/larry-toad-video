/* ===== логика «Лёд»: Ларри скользит, пока не упрётся; остановить его можно только камнем или краем; цель — иглу ===== */
/* карта: '#' камень, '.' лёд, 'S' старт, 'G' иглу (останавливает) */
var ICE={
 DX:[1,-1,0,0],DY:[0,0,1,-1],
 parse:function(L){var rows=L.rows,h=rows.length,w=rows[0].length,rk=[],sx=0,sy=0,gx=0,gy=0,i=0,x,y,c;
  for(y=0;y<h;y++)for(x=0;x<w;x++,i++){c=rows[y].charAt(x);rk[i]=c==='#'?1:0;if(c==='S'){sx=x;sy=y}if(c==='G'){gx=x;gy=y}}
  return{w:w,h:h,rk:rk,gx:gx,gy:gy,st:{x:sx,y:sy}}},
 slide:function(P,s,d){var x=s.x,y=s.y,n=0;for(;;){var nx=x+ICE.DX[d],ny=y+ICE.DY[d];if(nx<0||ny<0||nx>=P.w||ny>=P.h||P.rk[ny*P.w+nx])break;x=nx;y=ny;n++;if(x===P.gx&&y===P.gy)break}
  return{x:x,y:y,n:n}},
 won:function(P,s){return s.x===P.gx&&s.y===P.gy},
 solve:function(P,s){var q=[[s.x,s.y]],pr={},i=0;pr[s.x+','+s.y]=null;
  while(i<q.length){var c=q[i++];if(c[0]===P.gx&&c[1]===P.gy){var o=[],k=c[0]+','+c[1];while(pr[k]){o.push(pr[k].d);k=pr[k].p}return o.reverse()}
   for(var d=0;d<4;d++){var r=ICE.slide(P,{x:c[0],y:c[1]},d);if(!r.n)continue;var kn=r.x+','+r.y;if(kn in pr)continue;pr[kn]={p:c[0]+','+c[1],d:d};q.push([r.x,r.y])}}
  return null}
};
