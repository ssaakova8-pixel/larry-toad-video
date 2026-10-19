#!/usr/bin/env python3
# Собирает звук для двух сборок (lite / full): «спящие» блоки данных + короткий индекс.
#   v7/media_<v>.blocks.html  — <script type="text/plain" id="D_...">base64</script> ...
#   v7/media_<v>.idx.js       — var MUS={имя:1}; var VOICE={ключ:[длит]}; var SFXM={...}
import base64, json, os, subprocess, sys
SP='/tmp/claude-0/-home-claude/4b8a68e5-b739-5cfa-a644-389ea9d9a2f7/scratchpad'
A=SP+'/aud'; V=SP+'/v7'
A4=SP+'/aud4/out'      # v8: новая тёплая музыка и мягкие звуки
SRC={n:'' for n in ['m_menu','m_prolog','m_ch1','m_ch2','m_ch3','m_ch4','m_ch5','m_night','m_boss','m_boss2','m_sad','m_dawn','m_puz','m_camp','m_race']}
CFG={
 'lite':dict(tracks=['m_menu','m_prolog','m_ch1','m_ch2','m_ch3','m_ch4','m_ch5','m_boss','m_dawn','m_puz','m_night'],
             mus=['-ac','1','-ar','22050','-b:a','22k'],voice='story+larry',author='author16.mp3'),
 'full':dict(tracks=list(SRC),mus=['-ac','1','-ar','32000','-b:a','32k'],voice='all',author='author24.mp3')}
def b64(b): return base64.b64encode(b).decode()
def enc_music(v,n):
    d=V+'/mus_'+v; os.makedirs(d,exist_ok=True); o='%s/%s.mp3'%(d,n)
    subprocess.run(['ffmpeg','-y','-v','error','-i','%s/%s.wav'%(A4,n),'-c:a','libmp3lame']+CFG[v]['mus']+[o],check=True); return o
def main(v):
    c=CFG[v]; meta=json.load(open(V+'/voice/meta.json'))
    src=open(V+'/src/g5_lines.js',encoding='utf8').read(); rows=json.loads(src[src.index('['):src.rindex(']')+1].replace(';',''))
    st={(r[0],r[1]) for r in rows if r[3]==1}
    keys=[]
    for k,m in meta.items():
        w,t=m['w'],m['t']
        if c['voice']=='all' or (w,t) in st or (c['voice']=='story+larry' and w=='larry'): keys.append(k)
    blocks=[];idxm=[];sizes={'music':0,'voice':0,'sfx':0,'author':0}
    for n in c['tracks']:
        p=enc_music(v,n); d=open(p,'rb').read(); sizes['music']+=len(d); blocks.append('<script type="text/plain" id="D_m_%s">%s</script>'%(n,b64(d))); idxm.append('%s:1'%n)
    vo=[]
    for k in keys:
        d=open('%s/voice/mp3_16/%s.mp3'%(V,k),'rb').read(); sizes['voice']+=len(d)
        blocks.append('<script type="text/plain" id="D_v_%s">%s</script>'%(k,b64(d))); vo.append('"%s":[%s]'%(k,meta[k]['dur']))
    ad=open(V+'/voice/author/'+c['author'],'rb').read(); sizes['author']=len(ad)
    blocks.append('<script type="text/plain" id="D_v_author">%s</script>'%b64(ad)); vo.append('"author":[60.36]')
    # звуки событий: готовый атлас (моно 80k)
    sd=open(A4+'/sfx2.mp3','rb').read(); sizes['sfx']=len(sd); blocks.append('<script type="text/plain" id="D_sfx">%s</script>'%b64(sd))
    idx='var MUS={%s};var VOICE={%s};var SFXM=%s;\n'%(','.join(idxm),','.join(vo),json.dumps(json.load(open(A4+'/sfx2.json'))))
    open('%s/media_%s.blocks.html'%(V,v),'w',encoding='utf8').write('\n'.join(blocks)+'\n'); open('%s/media_%s.idx.js'%(V,v),'w',encoding='utf8').write(idx)
    tot=sum(sizes.values()); print(v,{k:s//1024 for k,s in sizes.items()},'KB raw; клипов голоса',len(keys),'; всего b64 ≈ %.1f МБ'%(tot*4/3/1048576))
for v in (sys.argv[1:] or ['lite','full']): main(v)
