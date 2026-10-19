/* ===== логика «Брёвна»: Порох двигает брёвна и засыпает ими воду, чтобы дойти до флажка ===== */
/* карта: '#' дерево/камень, '.' земля, '~' вода, 'L' бревно на земле, 'H' Порох, 'X' флажок */
var LOGS={
 D:[[1,0],[-1,0],[0,1],[0,-1]],
 parse:function(L){var rows=L.rows,h=rows.length,w=rows[0].length,g=[],lg=[],hx=0,hy=0,ex=0,ey=0,i=0,x,y,c;
  for(y=0;y<h;y++)for(x=0;x<w;x++,i++){c=rows[y].charAt(x);g[i]=c==='#'?2:c==='~'?1:0;lg[i]=c==='L'?1:0;if(c==='H'){hx=x;hy=y}if(c==='X'){ex=x;ey=y}}
  return{w:w,h:h,ex:ex,ey:ey,st:{x:hx,y:hy,g:g,l:lg}}},
 clone:function(s){return{x:s.x,y:s.y,g:s.g.slice(),l:s.l.slice()}},
 key:function(s){return s.x+','+s.y+'|'+s.l.join('')+'|'+s.g.join('')},
 won:function(P,s){return s.x===P.ex&&s.y===P.ey},
 /* шаг в направлении d (0..3): вернуть {s:новое состояние,push:true|false,fill:true|false} или null */
 step:function(P,s,d){var dx=LOGS.D[d][0],dy=LOGS.D[d][1],nx=s.x+dx,ny=s.y+dy;if(nx<0||ny<0||nx>=P.w||ny>=P.h)return null;var j=ny*P.w+nx,gj=s.g[j];
  if(gj===2||gj===1)return null;
  if(s.l[j]){var bx=nx+dx,by=ny+dy;if(bx<0||by<0||bx>=P.w||by>=P.h)return null;var k=by*P.w+bx;if(s.g[k]===2||s.l[k])return null;if(bx===P.ex&&by===P.ey)return null;
   var t=LOGS.clone(s);t.l[j]=0;var fill=false;if(t.g[k]===1){t.g[k]=0;fill=true}else t.l[k]=1;t.x=nx;t.y=ny;return{s:t,push:true,fill:fill,bx:bx,by:by}}
  var t2=LOGS.clone(s);t2.x=nx;t2.y=ny;return{s:t2,push:false,fill:false}},
 /* кратчайшее решение по ходам (BFS) → массив направлений, или null */
 solve:function(P,s,lim){lim=lim||500000;var q=[s],par={},k0=LOGS.key(s),i=0,cnt=0;par[k0]=null;var meta={};meta[k0]=null;
  while(i<q.length&&cnt<lim){var c=q[i++],kc=LOGS.key(c);cnt++;if(LOGS.won(P,c)){var out=[],kk=kc;while(meta[kk]){out.push(meta[kk].d);kk=meta[kk].p}return out.reverse()}
   for(var d=0;d<4;d++){var r=LOGS.step(P,c,d);if(!r)continue;var kn=LOGS.key(r.s);if(meta[kn]!==undefined)continue;meta[kn]={p:kc,d:d};q.push(r.s)}}
  return null},
 /* число толчков в кратчайшем решении (по ходам BFS это не минимум толчков, но годится как оценка) */
 pushes:function(P,s,path){var c=s,n=0;for(var i=0;i<path.length;i++){var r=LOGS.step(P,c,path[i]);if(r.push)n++;c=r.s}return n},
 /* путь без толчков от Пороха до клетки (x,y): массив направлений или null */
 walk:function(P,s,tx,ty){if(s.x===tx&&s.y===ty)return[];var q=[[s.x,s.y]],pr={},i=0;pr[s.x+','+s.y]=null;
  while(i<q.length){var c=q[i++];for(var d=0;d<4;d++){var nx=c[0]+LOGS.D[d][0],ny=c[1]+LOGS.D[d][1];if(nx<0||ny<0||nx>=P.w||ny>=P.h)continue;var j=ny*P.w+nx;if(s.g[j]!==0||s.l[j])continue;var k=nx+','+ny;if(k in pr)continue;pr[k]={p:c[0]+','+c[1],d:d};
    if(nx===tx&&ny===ty){var o=[],kk=k;while(pr[kk]){o.push(pr[kk].d);kk=pr[kk].p}return o.reverse()}q.push([nx,ny])}}
  return null}
};
