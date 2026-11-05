process.env.V4SRC=require('path').join(__dirname,'..','src');
const {load,SIMFILES}=require('./simload');
const botSrc=require('./bot7');
const ctx=load(SIMFILES);
require('vm').runInContext(botSrc,ctx);
const PROF={kid:{sigma:.085,react:.38,lapse:.05},avg:{sigma:.05,react:.22,lapse:.02},good:{sigma:.032,react:.14,lapse:.006},pro:{sigma:.018,react:.07,lapse:0}};
ctx.PROF=PROF;
const code=`
function runOne(cfg,prof,seed,cap){var S=newSim(cfg);S.ev.length=0;var B=mkBot({sigma:prof.sigma,react:prof.react,lapse:prof.lapse,seed:seed,dash:prof.dash});var n=Math.round(cap*SIM_HZ);
 for(var i=0;i<n;i++){B.step(S);simStep(S);S.ev.length=0;if(S.phase==='win'||S.phase==='fail')break}
 return{ph:S.phase,time:S.mode==='race'?(S.phase==='win'?S.finishT:null):S.clock,pen:S.pen,falls:S.falls,hits:S.hits,perf:S.perfects,land:S.landings,jumps:B.jumps,kills:S.kills,fire:S.fire,petals:S.petals,pads:S.padsDone,dm:S.dm}}
`;
require('vm').runInContext(code,ctx);
module.exports={ctx,PROF};
if(require.main===module){
 const mode=process.argv[2]||'race';
 const N=+process.argv[3]||30;
 if(mode==='race'){
  for(const rv of (process.argv[4]?process.argv[4].split(",").map(Number):[...Array(ctx.RIVERS.length).keys()])){
   const out=[];
   for(const [pn,pf] of Object.entries(PROF)){
    let wins=0,tt=[],fl=0,hits=0,perf=0,land=0;
    for(let s=0;s<N;s++){
     const r=ctx.runOne({mode:'race',seed:1000+s,river:rv,up:{h:0,e:0,p:0,s:0,m:0}},pf,s*17+3,240);
     if(r.ph==='win'){wins++;tt.push(r.time)}fl+=r.falls;hits+=r.hits;perf+=r.perf;land+=r.land}
    tt.sort((a,b)=>a-b);
    out.push(`${pn}: win ${wins}/${N} t50=${tt.length?tt[tt.length>>1].toFixed(1):'-'} best=${tt.length?tt[0].toFixed(1):'-'} falls/run=${(fl/N).toFixed(2)} hits/run=${(hits/N).toFixed(2)} perfect%=${(100*perf/Math.max(1,land)).toFixed(0)}`);
   }
   console.log('RIVER',rv,ctx.RIVERS[rv].name,'tier',ctx.RIVERS[rv].tier,'\n  '+out.join('\n  '));
  }
 }
}
