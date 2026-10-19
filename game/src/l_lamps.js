/* ===== логика «Фонарики»: тап по лампе переключает её и соседей; зажечь все ===== */
var LAMPS={
 parse:function(L){var n=L.n,m=L.m||n,on=[],i;for(i=0;i<n*m;i++)on[i]=L.on.charAt(i)==='1'?1:0;return{n:n,m:m,st:{on:on}}},
 clone:function(s){return{on:s.on.slice()}},
 tap:function(P,s,i){var t=LAMPS.clone(s),x=i%P.n,y=(i/P.n)|0;function fl(a,b){if(a<0||b<0||a>=P.n||b>=P.m)return;t.on[b*P.n+a]^=1}fl(x,y);fl(x+1,y);fl(x-1,y);fl(x,y+1);fl(x,y-1);return t},
 won:function(P,s){for(var i=0;i<s.on.length;i++)if(!s.on[i])return false;return true},
 /* решение по GF(2): минимальный набор нажатий (массив индексов) или null */
 solve:function(P,s){var N=P.n*P.m,i,j,A=[];
  for(i=0;i<N;i++){var row=[];for(j=0;j<N;j++)row[j]=0;A.push(row)}
  for(j=0;j<N;j++){var t=LAMPS.tap(P,{on:new Array(N).fill(0)},j);for(i=0;i<N;i++)A[i][j]=t.on[i]}
  /* A*x = b, b[i] = нужно ли переключить лампу i (она сейчас погашена) */
  var b=[];for(i=0;i<N;i++)b[i]=s.on[i]?0:1;
  var M=A.map(function(r,k){return r.concat([b[k]])}),piv=[],r=0,c;
  for(c=0;c<N&&r<N;c++){var p=-1;for(i=r;i<N;i++)if(M[i][c]){p=i;break}if(p<0)continue;var tmp=M[r];M[r]=M[p];M[p]=tmp;for(i=0;i<N;i++)if(i!==r&&M[i][c])for(j=c;j<=N;j++)M[i][j]^=M[r][j];piv.push(c);r++}
  for(i=r;i<N;i++)if(M[i][N])return null;
  var free=[];for(c=0;c<N;c++)if(piv.indexOf(c)<0)free.push(c);
  var best=null,combos=1<<Math.min(free.length,12);
  for(var m=0;m<combos;m++){var x=new Array(N).fill(0),fi;for(fi=0;fi<free.length&&fi<12;fi++)x[free[fi]]=(m>>fi)&1;
   for(i=piv.length-1;i>=0;i--){var v=M[i][N];for(j=0;j<free.length;j++)if(M[i][free[j]])v^=x[free[j]];x[piv[i]]=v}
   var w=0,list=[];for(i=0;i<N;i++)if(x[i]){w++;list.push(i)}if(!best||w<best.length)best=list}
  return best}
};
