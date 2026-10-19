#!/usr/bin/env python3
# Генерирует src/g5_lines.js: список всех озвученных реплик для Студии голоса (по порядку сюжета, с названием раздела).
import json, re
SP='/tmp/claude-0/-home-claude/4b8a68e5-b739-5cfa-a644-389ea9d9a2f7/scratchpad/v7'
L=json.load(open(SP+'/voice/lines.json',encoding='utf8'))
src=open(SP+'/src/c7_story.js',encoding='utf8').read()
i=src.index('var CHAIN=[');j=src.index('];',i)
chain=re.findall(r"'([SRZWE](?::[^']*)?)'",src[i:j])
chap=0;sc2ch={};
for e in chain:
    if e.startswith('S:'): sc2ch.setdefault(e[2:],chap)
    elif e.startswith('W:'): chap+=1
CH=['Глава I · Тихая Заводь','Глава II · Осиный Тростник','Глава III · Лунные Топи','Глава IV · Ледяной Затон','Глава V · Холм Рассвета']
def sec(s):
    if s.startswith('prolog'): return 'Пролог'
    if s in sc2ch: 
        c=sc2ch[s]; return CH[min(c,4)] if not s.startswith('fin') else 'Финал'
    if s.startswith('fin'): return 'Финал'
    if s.startswith('int'):
        n=int(re.sub(r'\D','',s) or 0); return CH[min(n+1,4)]
    m=re.match(r'^(cue|stagei)(\d+)$',s)
    if m:
        n=int(m.group(2)); return CH[min(n//3,4)]+' · подсказки'
    if s.startswith('narb') or s.startswith('bark'): return 'Комментатор по ходу игры'
    if s.startswith('BOSS'): return 'Бои с боссами'
    if s=='part' or s=='maxim' or s=='end': return 'Части Фонаря и мудрости'
    return 'Головоломки и мелочи'
def story(l): return 1 if (l['w']=='nar' and (l['src'] in sc2ch or l['src'].startswith(('prolog','fin','int')) or l['src'] in ('part','maxim','end'))) else 0
out=[[l['w'],l['t'],sec(l['src']),story(l)] for l in L]
js='/* ===== список реплик для Студии голоса (генерируется tools/mkstudio.py) ===== */\nvar STL='+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n'
open(SP+'/src/g5_lines.js','w',encoding='utf8').write(js)
import collections
print(len(out),'реплик; рассказчик-сюжет:',sum(o[3] for o in out),'; разделов:',collections.Counter(o[2] for o in out).most_common(20))
