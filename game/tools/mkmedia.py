#!/usr/bin/env python3
# Собирает v7/media.js: музыка (mp3 base64) + голоса (voice.js) + атлас звуков.
import base64, json, os, sys
SP='/tmp/claude-0/-home-claude/4b8a68e5-b739-5cfa-a644-389ea9d9a2f7/scratchpad'
A=SP+'/aud'
SRC={'m_menu':'out3','m_ch1':'out3','m_ch2':'out3','m_ch3':'out3','m_ch4':'out3','m_ch5':'out3','m_night':'out3','m_boss':'out3',
     'm_prolog':'out2','m_sad':'out2','m_dawn':'out2','m_boss2':'out2','m_puz':'out2','m_camp':'out2','m_race':'out2'}
def b64(p): return base64.b64encode(open(p,'rb').read()).decode()
mus=',\n'.join("%s:'%s'"%(n,b64('%s/%s/%s.mp3'%(A,d,n))) for n,d in SRC.items())
voice=open(SP+'/v7/voice/voice.js',encoding='utf8').read()
sfx="var SFXB64='%s';\nvar SFXM=%s;\n"%(b64(A+'/out/sfx.mp3'),json.dumps(json.load(open(A+'/out/sfx.json'))))
js="var MUS={%s};\n%s%s"%(mus,voice,sfx)
open(SP+'/v7/media.js','w',encoding='utf8').write(js)
print('media.js %.1f MB'%(len(js)/1048576), 'music', sum(os.path.getsize('%s/%s/%s.mp3'%(A,d,n)) for n,d in SRC.items())//1024,'KB')
