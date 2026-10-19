process.env.V4SRC=process.env.V4SRC||'/tmp/claude-0/-home-claude/4b8a68e5-b739-5cfa-a644-389ea9d9a2f7/scratchpad/v7/src';
const {ctx,PROF}=require('/tmp/claude-0/-home-claude/4b8a68e5-b739-5cfa-a644-389ea9d9a2f7/scratchpad/tools/runbot.js');
const N=+process.argv[2]||12;
for(let ch=0;ch<15;ch++){
 const out=[];
 for(const [pn,pf] of Object.entries(PROF)){
  let wins=0,t=0,falls=0;
  for(let s=0;s<N;s++){
   let r;try{r=ctx.runOne({mode:'story',ch:ch,seed:5100+ch*37,up:{h:0,e:0,p:0,s:0,m:0},assist:+(process.argv[3]||0)},pf,s*17+3,300)}catch(e){r={ph:'ERR '+e.message,falls:0,time:0}}
   if(r.ph==='win'){wins++;t+=r.time}falls+=r.falls;if(String(r.ph).startsWith('ERR')){out.push(r.ph);break}}
  out.push(pn+' '+wins+'/'+N+' t='+(wins?(t/wins).toFixed(0):'-')+' f='+(falls/N).toFixed(1));
 }
 console.log('этап',ch+1,out.join(' | '));
}
