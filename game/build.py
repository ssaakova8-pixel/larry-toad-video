#!/usr/bin/env python3
# Сборка одного html: шапка со шрифтами + (музыка/голоса base64) + код из src/ в заданном порядке.
import sys, os, re
SP=os.path.dirname(os.path.abspath(__file__))
ORDER=[l.strip() for l in open(os.path.join(SP,'order.txt'),encoding='utf8') if l.strip() and not l.startswith('#')]
mode=sys.argv[2] if len(sys.argv)>2 else 'dev'
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(SP,'out','dev.html')
head=open(os.path.join(SP,'..','x','head.html'),encoding='utf8').read()
head=head.replace('<title>Сэр Ларри Тоут</title>','<title>Топ-Тоут</title>')
import base64
_ic=os.path.join(SP,'..','x','icon180.png')
if os.path.exists(_ic):
    _b=base64.b64encode(open(_ic,'rb').read()).decode()
    _tags='<link rel="apple-touch-icon" href="data:image/png;base64,%s"><link rel="icon" type="image/png" href="data:image/png;base64,%s">'%(_b,_b)
    head=head.replace('</head>',_tags+'</head>',1)
media='';blocks=''
if mode in('lite','full2','full','art'):
    v='lite' if mode=='lite' else 'full'
    media=open(os.path.join(SP,'media_%s.idx.js'%v),encoding='utf8').read()
    blocks=open(os.path.join(SP,'media_%s.blocks.html'%v),encoding='utf8').read()
else:
    media='var MUS={};var VOICE={};\n'
code=[]
for f in ORDER:
    p=os.path.join(SP,'src',f)
    if not os.path.exists(p):
        print('нет файла',f); sys.exit(1)
    code.append('/* --- %s --- */\n'%f+open(p,encoding='utf8').read())
js=media+'\n'+'\n'.join(code)
js=js.replace('</script>','<\\/script>')
html=head+blocks+'<script>\n'+js+'\n</script></body></html>\n'
if mode=='art':
    # для публикации через Artifact: без <html>/<head>/<body> — оболочку добавляет платформа
    m=re.search(r'<style>(.*?)</style>',head,re.S); css=m.group(1)
    bodyp=head[head.index('<body>')+6:]
    html='<title>Топ-Тоут</title>\n<style>'+css+'</style>\n'+bodyp+blocks+'<script>\n'+js+'\n</script>\n'

open(out,'w',encoding='utf8').write(html)
print(out,len(html)//1024,'КБ')
