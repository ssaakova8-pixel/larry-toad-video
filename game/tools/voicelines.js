// Собирает все озвучиваемые реплики игры: [{w,t,e}] -> voice/lines.json
// node voicelines.js
var fs=require('fs'),path=require('path'),vm=require('vm');
var SRC=path.join(__dirname,'..','src');
function rd(f){return fs.readFileSync(path.join(SRC,f),'utf8')}
var ctx={console:console,sv:{book:[]},window:{}};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(rd('c7_story.js')+'\n'+rd('g4_camp.js')+';this.SCENES=SCENES;this.BOSSLINES=BOSSLINES;this.BOSSOUT=BOSSOUT;this.BOSSPH=BOSSPH;this.STORY=STORY;this.BARKS=BARKS;this.NARB=NARB;this.STAGEI=STAGEI;this.CAMP=CAMP;this.BOOK=BOOK;this.vkey=vkey;this.PART_TXT=PART_TXT;this.MAXIM=MAXIM;this.END_TXT=END_TXT;this.TEST_TXT=TEST_TXT;',ctx);
var L=[],seen={};
function add(w,t,e,src){if(!t)return;t=String(t);var k=w+'|'+t;if(seen[k])return;seen[k]=1;L.push({w:w,t:t,e:e||'',src:src||''})}
// сцены
for(var id in ctx.SCENES){ctx.SCENES[id].l.forEach(function(l){if(l.card){add('nar',l.t.replace(/[«»]/g,''),'',id);return}if(l.w==='por')return;add(l.w,l.t,l.e,id)})}
// боссы
['BOSSLINES','BOSSOUT'].forEach(function(n){for(var k in ctx[n])ctx[n][k].forEach(function(p){if(p[0]==='por')return;add(p[0],p[1],'',n+'.'+k)})});
var who={bass:'bass',spider:'spider',captain:'captain',emperor:'sher'};
for(var k in ctx.BOSSPH)ctx.BOSSPH[k].forEach(function(t){add(who[k],t,'angry','BOSSPH.'+k)});
// подсказки по ходу этапов
ctx.STORY.ch.forEach(function(c,i){c.cues.forEach(function(q){add(q.w,q.t,'','cue'+i)})});
for(var k in ctx.BARKS)ctx.BARKS[k].forEach(function(p){add(p[0],p[1],'','bark.'+k)});
for(var k in ctx.NARB)ctx.NARB[k].forEach(function(t){add('nar',t,'','narb.'+k)});
ctx.STAGEI.forEach(function(t,i){add('nar',t,'','stagei'+i)});
// дневник Крапинки читает рассказчик? нет — только текст
// головоломки: страницы
ctx.CAMP.forEach(function(C,c){C.wins.forEach(function(t){add('krap',t,'','wins'+c)});C.pages.forEach(function(p,i){var who2=p.who||'krap';if(p.say)add(who2,p.say,'','page'+c+'.'+i);if(p.win)add('krap',p.win,'','pagewin'+c+'.'+i);if(p.g&&0)add('krap',p.g)})});
// puzzle-модули: статические строки
var files=fs.readdirSync(SRC).filter(function(f){return /^(g2_puz|g3_.*)\.js$/.test(f)});
files.forEach(function(f){var s=rd(f),m,re=/pzSay\('(krap|larry|spider|captain)',\s*'((?:[^'\\]|\\.)*)'/g;while(m=re.exec(s))add(m[1],m[2].replace(/\\'/g,"'"),'',f);
 re=/\bsay:\s*'((?:[^'\\]|\\.)*)'/g;while(m=re.exec(s))add('krap',m[1].replace(/\\'/g,"'"),'',f);
 // три варианта в массиве для ответа на неверный ответ загадки
 re=/\[('(?:[^'\\]|\\.)*'(?:,\s*'(?:[^'\\]|\\.)*')+)\]\[Math\.floor/g;while(m=re.exec(s)){m[1].split(/',\s*'/).forEach(function(x){add('krap',x.replace(/^'|'$/g,''),'',f)})}});
// загадки: вопросы читают Паутинья и капитан (по страницам), победные фразы — Крапинка
var rs=rd('g3_riddle.js'),m2,rq=/\{q:'((?:[^'\\]|\\.)*)',a:\[[^\]]*\],ok:\d,win:'((?:[^'\\]|\\.)*)'\}/g,R=[];
while(m2=rq.exec(rs))R.push({q:m2[1].replace(/\\n/g,'\n'),win:m2[2]});
var pr=ctx.CAMP.reduce(function(a,C){return a.concat(C.pages.filter(function(p){return p.k==='riddle'}))},[]);
pr.forEach(function(p){var r=R[p.lv];if(!r){console.error('нет загадки',p.lv);return}var q=r.q.replace(/\n/g,' ');add(p.who||'spider',q,'',"riddle"+p.lv);add('krap',r.win,'','riddlewin'+p.lv)});
ctx.PART_TXT.forEach(function(t){add('nar',t,'','part')});ctx.MAXIM.forEach(function(t){add('nar',t,'','maxim')});add('nar',ctx.END_TXT,'','end');add('nar',ctx.TEST_TXT,'','test');
fs.writeFileSync(path.join(__dirname,'..','voice','lines.json'),JSON.stringify(L,null,1));
var by={};L.forEach(function(l){by[l.w]=(by[l.w]||0)+1});console.log('строк',L.length,JSON.stringify(by),'символов',L.reduce(function(s,l){return s+l.t.length},0));
