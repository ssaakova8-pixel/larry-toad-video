#!/usr/bin/env python3
"""Восстанавливает входные файлы сборки из готовых docs/index.html и docs/lite.html:
../x/head.html, ../x/icon180.png, media_full.*, media_lite.* — чтобы build.py снова собирал игру из src/.
Запуск: python3 tools/unpack.py"""
import os, re, base64
SP=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT=os.path.dirname(SP)
def unpack(src, v, write_head):
    h=open(os.path.join(ROOT,'docs',src),encoding='utf8').read()
    bi=h.index('<body>')+len('<body>')
    si=h.index('<script type="text/plain"')       # первый блок медиа
    mi=h.index('<script>\n',si)                   # основной скрипт
    ci=h.index('/* --- a0_helpers.js --- */')
    head=h[:si]; blocks=h[si:mi]; media=h[mi+len('<script>\n'):ci]
    if media.endswith('\n'): media=media[:-1]
    m=re.search(r'<link rel="apple-touch-icon" href="data:image/png;base64,([^"]+)"><link rel="icon"[^>]*>',head)
    if m:
        if write_head: open(os.path.join(ROOT,'x','icon180.png'),'wb').write(base64.b64decode(m.group(1)))
        head=head.replace(m.group(0),'')
    head=head.replace('<title>Топ-Тоут</title>','<title>Сэр Ларри Тоут</title>')
    if write_head: open(os.path.join(ROOT,'x','head.html'),'w',encoding='utf8').write(head)
    open(os.path.join(SP,'media_%s.idx.js'%v),'w',encoding='utf8').write(media.replace('<\\/script>','</script>'))
    open(os.path.join(SP,'media_%s.blocks.html'%v),'w',encoding='utf8').write(blocks)
    print(src,'->',v,len(head),len(blocks),len(media))
os.makedirs(os.path.join(ROOT,'x'),exist_ok=True)
unpack('index.html','full',True)
unpack('lite.html','lite',False)
