// node storysim.js [N] [stages] : прогон сказки ботами разных умений, без графики
const {ctx,PROF}=require('./runbot7');const vm=require('vm');
vm.runInContext(`
function runStage(ch,prof,seed,cap,up,en2){var cs=CHS[ch];if(en2!==undefined)cs.en2=en2;var S=newSim({mode:'story',ch:ch,seed:seed,up:up||UP0});S.ev.length=0;var B=mkBot({sigma:prof.sigma,react:prof.react,lapse:prof.lapse,seed:seed,dash:prof.dash});var n=Math.round(cap*SIM_HZ);
 var kinds={};
 for(var i=0;i<n;i++){B.step(S);simStep(S);S.ev.length=0;if(S.phase==='win'||S.phase==='fail')break;if(S.phase==='prize'||S.phase==='dawn')break}
 return{ph:S.phase,t:S.clock,hits:S.hits,falls:S.falls,kills:S.kills,pads:S.padsDone,petals:S.petals,en:S.en.length,par:S.parries}}`,ctx);
if(process.env.NOEN2)ctx.CHS.forEach(c=>c.en2=null);
const N=+process.argv[2]||6;const stages=(process.argv[3]||'0,1,2,3,4,5,6,7,8,9,10,11,12,13,14').split(',').map(Number);
for(const ch of stages){const row=[];
 for(const [pn,pf] of Object.entries(PROF)){let ok=0,h=0,f=0,k=0,par=0;
  for(let s=0;s<N;s++){const r=ctx.runStage(ch,pf,300+s*13,400,process.env.UPALL?{h:3,e:3,p:3,s:3,m:3,g:3,r:3,w:3,t:3}:undefined);if(r.ph!=='fail')ok++;h+=r.hits;f+=r.falls;k+=r.kills;par+=r.par}
  row.push(`${pn}: ok ${ok}/${N} hits ${(h/N).toFixed(1)} falls ${(f/N).toFixed(1)} kills ${(k/N).toFixed(1)} par ${(par/N).toFixed(1)}`)}
 console.log('stage',ch+1,ctx.CHS[ch].name,'\n  '+row.join('\n  '))}
