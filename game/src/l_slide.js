/* ===== логика «Пятнашки» 3×3: из 8 плиток собрать картинку; ход — сдвинуть плитку в пустую клетку ===== */
var SLD={
 GOAL:[1,2,3,4,5,6,7,8,0],
 moves:function(a){var z=a.indexOf(0),x=z%3,y=(z/3)|0,o=[];if(x>0)o.push(z-1);if(x<2)o.push(z+1);if(y>0)o.push(z-3);if(y<2)o.push(z+3);return o},
 apply:function(a,i){var b=a.slice(),z=b.indexOf(0);b[z]=b[i];b[i]=0;return b},
 won:function(a){for(var i=0;i<9;i++)if(a[i]!==SLD.GOAL[i])return false;return true},
 DIST:null,
 /* таблица расстояний от собранного состояния (все 181440 достижимых позиций) */
 build:function(){if(SLD.DIST)return SLD.DIST;var D={},q=[SLD.GOAL.join('')],i=0;D[q[0]]=0;
  while(i<q.length){var k=q[i++],a=k.split('').map(Number),dd=D[k];var mv=SLD.moves(a);for(var j=0;j<mv.length;j++){var b=SLD.apply(a,mv[j]).join('');if(D[b]===undefined){D[b]=dd+1;q.push(b)}}}
  SLD.DIST=D;return D},
 dist:function(a){return SLD.build()[a.join('')]},
 /* лучший ход: индекс плитки, которую нужно сдвинуть */
 best:function(a){var D=SLD.build(),mv=SLD.moves(a),b=null,bd=1e9;for(var i=0;i<mv.length;i++){var d=D[SLD.apply(a,mv[i]).join('')];if(d<bd){bd=d;b=mv[i]}}return b}
};
