// Загружает симуляцию (без графики и звука) из src/ в отдельный vm-контекст — для ботов и прогонов без браузера.
const vm=require('vm'),fs=require('fs'),path=require('path');
const SRC=process.env.V4SRC||path.join(__dirname,'..','src');
const SIMFILES=['a0_helpers.js','s0_data.js','s1_track.js','s2_sim.js','s3_boss.js','s4_net.js','s5_ghosts.js'];
const PRE="function rng(seed){var s=seed|0||1;return function(){s=(s*1664525+1013904223)|0;return((s>>>8)&0xffffff)/0x1000000}}";
function load(files){
 const noop=()=>{};
 const ctx=vm.createContext({console,Math,Date,JSON,setTimeout,clearTimeout,localStorage:{getItem:()=>null,setItem:noop},navigator:{},window:{},document:{createElement:()=>({getContext:()=>null})}});
 vm.runInContext(PRE,ctx);
 for(const f of files)vm.runInContext(fs.readFileSync(path.join(SRC,f),'utf8'),ctx,{filename:f});
 return ctx}
module.exports={load,SIMFILES};
