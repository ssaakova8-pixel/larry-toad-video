/* ===== s4: запись забега, проверка, «вызов другу», рейтинг =====
   Запись — это список нажатий [тик, код, …]. Сжатая запись одной реки умещается в ~250 символов, поэтому:
   • «вызов другу» — обычный текст: отправил в мессенджер, друг вставил — и гонится с твоим призраком;
   • любое время можно проверить: симуляция детерминирована, запись проигрывается заново и даёт то же время;
   • рейтинг мира подключается через общую базу (Net), когда она есть; без неё работает «Лига реки» с соперниками-призраками. */
var B64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function recEncode(rec){var out='',prev=0,i,v;for(i=0;i<rec.length;i+=2){var dt=rec[i]-prev;prev=rec[i];v=dt*8+(rec[i+1]&7);
  while(v>=32){out+=B64[32|(v&31)];v=Math.floor(v/32)}out+=B64[v]}return out}
function recDecode(s){var rec=[],i=0,t=0,n=s.length;while(i<n){var v=0,m=1,c,k;do{k=B64.indexOf(s[i++]);if(k<0)return null;c=k;v+=(c&31)*m;m*=32}while((c&32)&&i<n);
  var code=v%8,dt=Math.floor(v/8);t+=dt;rec.push(t,code);if(rec.length>6000)return null}return rec}
/* проверка: проиграть запись на той же реке и получить время */
function verifyRun(river,rec,custom){if(!rec||rec.length<2||rec.length>6000)return{ok:false};
 var cfg=custom?{mode:'race',seed:custom.seed,custom:custom,up:UP0}:{mode:'race',seed:RIVERS[river].seed,river:river,up:UP0},tg=newSim(cfg),i=0,g2=0,cap=120*600;
 for(var k=0;k<rec.length;k+=2)if(!(rec[k+1]>=1&&rec[k+1]<=5)||rec[k]<0)return{ok:false};
 while(tg.phase==='play'&&g2++<cap){while(i<rec.length&&rec[i]===tg.tick){simInput(tg,INPN[rec[i+1]]);i+=2}simStep(tg);tg.ev.length=0}
 return tg.phase==='win'?{ok:true,t:tg.finishT,falls:tg.falls,pen:tg.pen,perf:tg.perfects}:{ok:false}}
/* код вызова: ЛАРРИ.<река>.<сотые секунды>.<имя>.<запись> */
function nameEnc(s){return encodeURIComponent(s).replace(/\./g,'%2E').replace(/%/g,'~')}
function nameDec(s){try{return decodeURIComponent(s.replace(/~/g,'%'))}catch(e){return'Гонщик'}}
function makeChallenge(river,t,name,rec){return'ЛАРРИ.'+river+'.'+Math.round(t*100)+'.'+nameEnc(name||'Гонщик')+'.'+recEncode(rec)}
function parseChallenge(txt){txt=String(txt||'').replace(/\s+/g,'');var m=/(?:ЛАРРИ|LARRY)\.(\d+)\.(\d+)\.([^.]*)\.([A-Za-z0-9_-]+)/.exec(txt);if(!m)return{ok:false,err:'Это не похоже на код вызова'};
 var river=+m[1];if(!RIVERS[river])return{ok:false,err:'Такой реки у меня нет'};var rec=recDecode(m[4]);if(!rec)return{ok:false,err:'Код повреждён'};
 var v=verifyRun(river,rec);if(!v.ok)return{ok:false,err:'Забег не проходит проверку'};
 if(Math.abs(v.t*100-(+m[2]))>3)return{ok:false,err:'Время в коде не сходится с записью'};
 return{ok:true,river:river,t:v.t,name:nameDec(m[3]).slice(0,24),rec:rec}}

/* ---------- ники: без свободного ввода (детям безопаснее) ---------- */
var NICK_A=['Ловкий','Смелый','Быстрый','Весёлый','Хитрый','Зоркий','Тихий','Звонкий','Храбрый','Шустрый','Бравый','Лихой'];
var NICK_N=['Лягушонок','Кузнечик','Светляк','Пескарь','Комарик','Сверчок','Тритон','Головастик','Жучок','Утёнок','Ёрш','Мотылёк'];
function makeNick(seed){var r=rng(seed|0);return NICK_A[(r()*NICK_A.length)|0]+' '+NICK_N[(r()*NICK_N.length)|0]}
function myNick(){if(!sv.nick){sv.nick=makeNick((Date.now()^0x9e3779b9)&0x7fffffff)+' '+(100+((Date.now()*7)%900|0));save()}return sv.nick}
function nickReroll(){sv.nick='';return myNick()}

/* ---------- Лига реки: соперники-призраки + ты + друзья + (если есть) мир ---------- */
function riverLeague(river){var list=[],gh=(typeof GH!=='undefined'&&GH[river])||[],i,r=sv.race[river];
 for(i=0;i<gh.length;i++)list.push({n:gh[i].n,t:gh[i].t,kind:'bot',rec:gh[i].rec,i:i,icon:gh[i].ic});
 var ins=(sv.codes&&sv.codes[river])||[];for(i=0;i<ins.length;i++)list.push({n:ins[i].n,t:ins[i].t,kind:'friend',rec:ins[i].rec,i:i});
 if(r&&r.best)list.push({n:myNick(),t:r.best,kind:'me',rec:r.rec});
 list.sort(function(a,b){return a.t-b.t});return list}
function riverRank(river,t){var l=riverLeague(river),k=1;for(var i=0;i<l.length;i++)if(l[i].kind!=='me'&&l[i].t<t)k++;return{rank:k,of:l.filter(function(x){return x.kind!=='me'}).length+1}}
function addFriendGhost(c){sv.codes=sv.codes||{};var a=sv.codes[c.river]=sv.codes[c.river]||[];for(var i=0;i<a.length;i++)if(a[i].n===c.name&&Math.abs(a[i].t-c.t)<.02)return false;
 a.push({n:c.name,t:c.t,rec:c.rec});a.sort(function(x,y){return x.t-y.t});if(a.length>6)a.length=6;save();return true}

/* ---------- Net: общая база (когда страница опубликована с базой данных) ---------- */
var Net={ok:false,db:null,uid:null,tried:false,err:null};
function netInit(){if(Net.tried)return;Net.tried=true;
 try{if(typeof window==='undefined'||!window.claude||!window.claude.use)return;
  var to=setTimeout(function(){},10000);
  window.claude.use('db').then(function(db){clearTimeout(to);if(db){Net.db=db;Net.ok=true}}).catch(function(e){Net.err=e});
  window.claude.use('user').then(function(u){if(u&&u.id)u.id().then(function(id){Net.uid=id}).catch(function(){})}).catch(function(){})}catch(e){Net.err=e}}
function netSubmit(river,t,rec){if(!Net.ok||!Net.uid)return Promise.resolve(false);
 try{return Net.db.doc('scores/r'+river+'/entries/'+Net.uid).set({n:myNick(),t:Math.round(t*100)/100,rec:recEncode(rec),at:Date.now()}).then(function(){return true},function(){return false})}catch(e){return Promise.resolve(false)}}
function netTop(river,cb){if(!Net.ok){cb(null);return}
 try{Net.db.collection('scores/r'+river+'/entries').orderBy('t').limit(25).get().then(function(snap){var out=[];snap.docs.forEach(function(d){var x=d.data();if(x&&typeof x.t==='number')out.push({n:String(x.n||'Гонщик').slice(0,28),t:x.t,rec:x.rec,uid:d.id})});cb(out)},function(){cb(null)})}catch(e){cb(null)}}
