const vm=require('vm'),fs=require('fs');
const ctx=vm.createContext({console,Math,PZ:{},LV:{},PI:Math.PI,TAU:Math.PI*2});
vm.runInContext("function rng(seed){var s=seed|0||1;return function(){s=(s*1664525+1013904223)|0;return((s>>>8)&0xffffff)/0x1000000}}",ctx);
vm.runInContext(fs.readFileSync(__dirname+'/../src/g3_gears.js','utf8'),ctx);
vm.runInContext(`
function testLevel(i){var L=LV.gears[i],s=PZ.gears.init(L),G=s.G,j,r;
 var res={lvl:i,ok:true,msg:''};
 /* ставим решение */
 var pool=s.items.filter(function(it){return it.id>1});
 G.chain.forEach(function(c){var it=pool.filter(function(p){return p.r===c.r&&p.x==null})[0];if(!it){res.ok=false;res.msg='нет колеса r'+c.r;return}
   if(!gearCan(s,it,c.x,c.y)){res.ok=false;res.msg='нельзя поставить '+c.x+','+c.y}else{it.x=c.x;it.y=c.y}});
 s.net=gearsNet(s);var won=PZ.gears.won(s);
 if(!won){res.ok=false;res.msg+=' не выиграно: tOn='+s.net.tOn+' jam='+s.net.jam+' td='+s.net.td+' need='+s.need}
 res.n=G.chain.length;res.tray=G.tray.length;res.M=G.M.x+','+G.M.y+'r'+G.M.r;res.T=G.T.x+','+G.T.y+'r'+G.T.r;res.need=G.need;res.holes=G.holes.length;
 /* подсказка по пустому полю должна указывать корректно */
 return res}`,ctx);
for(let i=0;i<12;i++)console.log(JSON.stringify(ctx.testLevel(i)));
