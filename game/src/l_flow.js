/* ===== логика «Нити»: соединить светляков одного цвета нитью; нити не пересекаются; (в сложных) заполнить все клетки ===== */
var FLOW={
 parse:function(L){var n=L.n,ep=[],i;for(i=0;i<n*n;i++)ep[i]=-1;L.pairs.forEach(function(p,k){ep[p[1]*n+p[0]]=k;ep[p[3]*n+p[2]]=k});
  return{n:n,pairs:L.pairs,fill:!!L.fill,ep:ep,sol:L.sol||null,st:{p:L.pairs.map(function(){return[]})}}},
 clone:function(s){return{p:s.p.map(function(a){return a.slice()})}},
 cell:function(P,k,end){var p=P.pairs[k];return end?p[3]*P.n+p[2]:p[1]*P.n+p[0]},
 done:function(P,s,k){var a=s.p[k];if(a.length<2)return false;var f=a[0],l=a[a.length-1],A=FLOW.cell(P,k,0),B=FLOW.cell(P,k,1);return(f===A&&l===B)||(f===B&&l===A)},
 won:function(P,s){var used={},i,j,cnt=0;for(i=0;i<s.p.length;i++){if(!FLOW.done(P,s,i))return false;var a=s.p[i];for(j=0;j<a.length;j++){if(used[a[j]])return false;used[a[j]]=1;cnt++;if(j&&Math.abs((a[j]%P.n)-(a[j-1]%P.n))+Math.abs(((a[j]/P.n)|0)-((a[j-1]/P.n)|0))!==1)return false}}
  return P.fill?cnt===P.n*P.n:true},
 solved:function(P,sol){return FLOW.won(P,{p:sol})}
};
