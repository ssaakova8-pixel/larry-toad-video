/* ===== логика «Кувшинки» (без графики — проверяется в Node) =====
   Ларри прыгает на соседнюю кувшинку (вверх/вниз/влево/вправо). Кувшинка, с которой он спрыгнул, тонет
   (у большой «B» — две жизни). Золотая «G» не тонет. Победа: стоять на золотой, собрав все цветы «F». */
var LILY={
 parse:function(L){var rows=L.rows,h=rows.length,w=rows[0].length,u=[],f=[],x0=0,y0=0,gx=-1,gy=-1,i=0,x,y,c,nf=0;
  for(y=0;y<h;y++)for(x=0;x<w;x++,i++){c=rows[y].charAt(x);u[i]=c==='.'?0:c==='B'?2:c==='G'?9:1;f[i]=c==='F'?1:0;if(c==='F')nf++;if(c==='S'){x0=x;y0=y}if(c==='G'){gx=x;gy=y}}
  return{w:w,h:h,gx:gx,gy:gy,nf:nf,st:{x:x0,y:y0,u:u,f:f,n:nf}}},
 clone:function(s){return{x:s.x,y:s.y,u:s.u.slice(),f:s.f.slice(),n:s.n}},
 key:function(s){return s.x+','+s.y+'|'+s.u.join('')+'|'+s.f.join('')},
 won:function(P,s){return s.x===P.gx&&s.y===P.gy&&s.n===0},
 moves:function(P,s){var o=[],d=[[1,0],[-1,0],[0,1],[0,-1]],k,nx,ny;
  for(k=0;k<4;k++){nx=s.x+d[k][0];ny=s.y+d[k][1];if(nx<0||ny<0||nx>=P.w||ny>=P.h)continue;if(s.u[ny*P.w+nx]>0)o.push([nx,ny])}return o},
 /* ход: вернуть новое состояние (старое не меняется) */
 step:function(P,s,nx,ny){var t=LILY.clone(s),i=s.y*P.w+s.x,j=ny*P.w+nx;if(!(Math.abs(nx-s.x)+Math.abs(ny-s.y)===1))return null;if(nx<0||ny<0||nx>=P.w||ny>=P.h||s.u[j]<=0)return null;
  if(t.u[i]<9)t.u[i]--;t.x=nx;t.y=ny;if(t.f[j]){t.f[j]=0;t.n--}return t},
 /* поиск решения: список клеток; null если нет. lim — предел обхода */
 solve:function(P,s,lim){var seen={},cnt=0,path=[],best=null;lim=lim||400000;
  function dfs(st){if(best||cnt>lim)return;cnt++;if(LILY.won(P,st)){best=path.slice();return}var k=LILY.key(st);if(seen[k])return;seen[k]=1;
   var mv=LILY.moves(P,st),i,t;for(i=0;i<mv.length;i++){t=LILY.step(P,st,mv[i][0],mv[i][1]);path.push(mv[i]);dfs(t);if(best)return;path.pop()}}
  dfs(s);return best},
 /* число различных решений (до cap) и число тупиков среди достижимых состояний */
 count:function(P,s,cap,lim){var seen={},cnt=0,sol=0,dead=0,tot=0;cap=cap||50;lim=lim||300000;
  function dfs(st){if(sol>=cap||cnt>lim)return;cnt++;if(LILY.won(P,st)){sol++;return}var k=LILY.key(st);if(seen[k])return;seen[k]=1;tot++;
   var mv=LILY.moves(P,st),i;if(!mv.length){dead++;return}for(i=0;i<mv.length;i++)dfs(LILY.step(P,st,mv[i][0],mv[i][1]))}
  dfs(s);return{sol:sol,dead:dead,tot:tot,over:cnt>lim}}
};
