/* ===== art helpers ===== */
var TAU=Math.PI*2,PI=Math.PI;
function clamp(v,a,b){return v<a?a:v>b?b:v}
function lerp(a,b,t){return a+(b-a)*t}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
function easeOut(t){return 1-Math.pow(1-t,3)}
function hex2rgb(h){if(h[0]!=='#')return null;if(h.length===4)h='#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];return[parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]}
var _shc={};
/* shade: amt -1..1 (dark..light), keeps hue */
function sh(c,a){var k=c+'|'+a;if(_shc[k])return _shc[k];var r=hex2rgb(c);if(!r)return c;var o;
 if(a<0){o=r.map(function(v){return Math.round(v*(1+a))})}else{o=r.map(function(v){return Math.round(v+(255-v)*a)})}
 return _shc[k]='rgb('+o[0]+','+o[1]+','+o[2]+')'}
function mix(c1,c2,t){var a=hex2rgb(c1),b=hex2rgb(c2);return'rgb('+Math.round(lerp(a[0],b[0],t))+','+Math.round(lerp(a[1],b[1],t))+','+Math.round(lerp(a[2],b[2],t))+')'}
function rgba(c,a){var r=hex2rgb(c);return'rgba('+r[0]+','+r[1]+','+r[2]+','+a+')'}
/* smooth closed/open path through points (Catmull-Rom → bezier) */
function sp(g,pts,closed,k){k=k==null?1:k;var n=pts.length,i,p0,p1,p2,p3,c1x,c1y,c2x,c2y;
 if(closed){g.moveTo(pts[0][0],pts[0][1]);for(i=0;i<n;i++){p0=pts[(i-1+n)%n];p1=pts[i];p2=pts[(i+1)%n];p3=pts[(i+2)%n];
  c1x=p1[0]+(p2[0]-p0[0])/6*k;c1y=p1[1]+(p2[1]-p0[1])/6*k;c2x=p2[0]-(p3[0]-p1[0])/6*k;c2y=p2[1]-(p3[1]-p1[1])/6*k;g.bezierCurveTo(c1x,c1y,c2x,c2y,p2[0],p2[1])}g.closePath()}
 else{g.moveTo(pts[0][0],pts[0][1]);for(i=0;i<n-1;i++){p0=pts[Math.max(i-1,0)];p1=pts[i];p2=pts[i+1];p3=pts[Math.min(i+2,n-1)];
  c1x=p1[0]+(p2[0]-p0[0])/6*k;c1y=p1[1]+(p2[1]-p0[1])/6*k;c2x=p2[0]-(p3[0]-p1[0])/6*k;c2y=p2[1]-(p3[1]-p1[1])/6*k;g.bezierCurveTo(c1x,c1y,c2x,c2y,p2[0],p2[1])}}}
function RG(g,x,y,r0,r1,st,x1,y1){var q=g.createRadialGradient(x,y,r0,x1==null?x:x1,y1==null?y:y1,r1),i;for(i=0;i<st.length;i+=2)q.addColorStop(st[i],st[i+1]);return q}
function LG(g,x0,y0,x1,y1,st){var q=g.createLinearGradient(x0,y0,x1,y1),i;for(i=0;i<st.length;i+=2)q.addColorStop(st[i],st[i+1]);return q}
function ell(g,x,y,rx,ry,rot){g.beginPath();g.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot||0,0,TAU)}
/* fill current path with fill, stroke with ol */
function fs(g,fill,ol,lw){g.fillStyle=fill;g.fill();if(ol){g.strokeStyle=ol;g.lineWidth=lw;g.lineJoin='round';g.lineCap='round';g.stroke()}}
/* tapered limb from (x0,y0) w0 to (x1,y1) w1 */
function limb(g,x0,y0,w0,x1,y1,w1,fill,ol,lw){var a=Math.atan2(y1-y0,x1-x0)+PI/2,c=Math.cos(a),s=Math.sin(a);g.beginPath();
 g.moveTo(x0+c*w0,y0+s*w0);g.lineTo(x1+c*w1,y1+s*w1);g.arc(x1,y1,w1,a,a-PI,true);g.lineTo(x0-c*w0,y0-s*w0);g.arc(x0,y0,w0,a+PI,a,true);g.closePath();fs(g,fill,ol,lw)}
/* glow */
function glow(g,x,y,r,c,a){var q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(c,a));q.addColorStop(.4,rgba(c,a*.4));q.addColorStop(1,rgba(c,0));g.fillStyle=q;g.beginPath();g.arc(x,y,r,0,TAU);g.fill()}
/* eye: x,y center, r radius. o: lx,ly look(-1..1), lid 0..1 (fraction covered from top), tilt (lid angle, + = angry inner-down), bl blink 0..1, iris, lidc (lid colour), ol */
function eye(g,x,y,r,o){o=o||{};var lx=(o.lx||0)*r*.26,ly=(o.ly||0)*r*.26,ir=o.iris||'#3b2a1a',sc=o.sc||'#fffdf4',ol=o.ol||'#1d2b1a',lidc=o.lidc||'#4aa83c',
 cover=clamp(Math.max(o.lid||0,o.bl||0),0,1),tilt=(o.tilt||0)*r*.5,ry=r*(o.ry||1.08);
 g.save();g.translate(x,y);if(o.ang)g.rotate(o.ang);
 ell(g,0,0,r,ry);g.fillStyle=RG(g,-r*.25,-ry*.3,r*.08,r*1.15,[0,'#ffffff',.65,sc,1,sh(sc,-.22)]);g.fill();
 g.save();ell(g,0,0,r*.99,ry*.99);g.clip();
 var ir0=r*(o.ir||.64);g.beginPath();g.arc(lx,ly,ir0,0,TAU);g.fillStyle=RG(g,lx,ly+ir0*.25,ir0*.1,ir0*1.05,[0,sh(ir,.45),.5,ir,1,sh(ir,-.55)]);g.fill();
 g.beginPath();g.arc(lx,ly,ir0,0,TAU);g.strokeStyle=sh(ir,-.6);g.lineWidth=r*.06;g.stroke();
 g.beginPath();g.arc(lx,ly,ir0*.45,0,TAU);g.fillStyle=o.pup||'#07070c';g.fill();
 g.beginPath();g.arc(lx-ir0*.34,ly-ir0*.38,ir0*.27,0,TAU);g.fillStyle='rgba(255,255,255,.96)';g.fill();
 g.beginPath();g.arc(lx+ir0*.32,ly+ir0*.36,ir0*.12,0,TAU);g.fillStyle='rgba(255,255,255,.75)';g.fill();
 if(cover>0.01){var y0=-ry+2*ry*cover;g.beginPath();g.moveTo(-r*1.4,-ry*1.4);g.lineTo(r*1.4,-ry*1.4);g.lineTo(r*1.4,y0+tilt);g.lineTo(-r*1.4,y0-tilt);g.closePath();g.fillStyle=lidc;g.fill();
  g.beginPath();g.moveTo(-r*1.4,y0-tilt);g.lineTo(r*1.4,y0+tilt);g.strokeStyle=ol;g.lineWidth=r*.13;g.stroke()}
 g.restore();
 ell(g,0,0,r,ry);g.strokeStyle=ol;g.lineWidth=r*.11;g.stroke();
 g.restore()}

/* ribbon: tapered strip along a polyline (control pts are smoothed). w0..w1 half-widths */
function bez(p0,p1,p2,p3,n){n=n||14;var o=[],i,t,u;for(i=0;i<=n;i++){t=i/n;u=1-t;o.push([u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]])}return o}
function ribbon(g,pts,w0,w1,fill,ol,lw,wm){var n=pts.length,L=[],R=[],i,dx,dy,l,w,t;
 for(i=0;i<n;i++){var a=pts[Math.max(i-1,0)],b=pts[Math.min(i+1,n-1)];dx=b[0]-a[0];dy=b[1]-a[1];l=Math.hypot(dx,dy)||1;t=i/(n-1);
  w=lerp(w0,w1,t);if(wm)w*=1+wm*Math.sin(t*PI);L.push([pts[i][0]-dy/l*w,pts[i][1]+dx/l*w]);R.push([pts[i][0]+dy/l*w,pts[i][1]-dx/l*w])}
 g.beginPath();g.moveTo(L[0][0],L[0][1]);for(i=1;i<n;i++)g.lineTo(L[i][0],L[i][1]);for(i=n-1;i>=0;i--)g.lineTo(R[i][0],R[i][1]);g.closePath();fs(g,fill,ol,lw)}
