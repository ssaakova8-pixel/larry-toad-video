#!/usr/bin/env python3
# Озвучка: lines.json -> TTS (Piper через sherpa-onnx) -> обработка по ролям (ffmpeg) -> mp3 -> проверка распознаванием -> voice.json
# python3 vbuild.py [render|asr|pack|all] [--only substr] [--force]
import json, os, re, subprocess, sys, hashlib, base64, wave, concurrent.futures as cf, shutil

SP = '/tmp/claude-0/-home-claude/4b8a68e5-b739-5cfa-a644-389ea9d9a2f7/scratchpad'
V7 = SP + '/v7'
VD = V7 + '/voice'
TTSB = SP + '/asr/sherpa-onnx-v1.12.13-linux-x64-shared/bin/sherpa-onnx-offline-tts'
ASRB = SP + '/asr/sherpa-onnx-v1.12.13-linux-x64-shared/bin/sherpa-onnx-offline'
LIB = SP + '/asr/sherpa-onnx-v1.12.13-linux-x64-shared/lib'
ASRM = SP + '/asr/sherpa-onnx-nemo-ctc-giga-am-v2-russian-2025-04-19'
ENV = dict(os.environ, LD_LIBRARY_PATH=LIB)
for d in ('raw', 'mp3', 'wav'):
    os.makedirs(VD + '/' + d, exist_ok=True)

def vkey(w, t):
    h = 5381
    for ch in (w + '|' + t):
        h = ((h << 5) + h + ord(ch)) & 0xFFFFFFFF
    n = h; s = ''
    if n == 0: return '0'
    while n:
        s = '0123456789abcdefghijklmnopqrstuvwxyz'[n % 36] + s; n //= 36
    return s

# базовые голоса и профили ролей. pitch — полутонов, tempo — множитель темпа, ls — length_scale модели (больше = медленнее)
ROLES = {
    'nar':     dict(m='ruslan', pitch=0.0,  tempo=0.97, ls=1.04, post='aecho=0.88:0.22:48:0.10,equalizer=f=180:t=q:w=1.2:g=2,equalizer=f=3200:t=q:w=1.5:g=1.5'),
    'larry':   dict(m='denis',  pitch=3.4,  tempo=1.05, ls=0.98, post='equalizer=f=2800:t=q:w=1.2:g=2'),
    'krap':    dict(m='irina',  pitch=1.3,  tempo=1.08, ls=0.96, post='equalizer=f=3500:t=q:w=1.4:g=2.5'),
    'vyp':     dict(m='irina',  pitch=-3.6, tempo=0.90, ls=1.06, post='aecho=0.88:0.28:55:0.14,lowpass=f=6500'),
    'bass':    dict(m='ruslan', pitch=-4.2, tempo=0.90, ls=1.04, post='tremolo=f=24:d=0.22,equalizer=f=140:t=q:w=1.2:g=3'),
    'sher':    dict(m='dmitri', pitch=2.4,  tempo=1.13, ls=0.95, post='aecho=0.8:0.6:7:0.30,highpass=f=140,equalizer=f=2600:t=q:w=1:g=3'),
    'spider':  dict(m='irina',  pitch=-1.6, tempo=0.93, ls=1.04, post='aecho=0.85:0.35:70:0.20,equalizer=f=250:t=q:w=1:g=2'),
    'captain': dict(m='denis',  pitch=-2.8, tempo=1.04, ls=0.97, post='treble=g=3:f=3500,acompressor=threshold=0.12:ratio=3:attack=5:release=60'),
}
EMO = {  # e -> (множитель темпа, добавка к высоте в полутонах)
    'angry': (1.07, 0.6), 'worry': (0.96, 0.4), 'shock': (1.05, 0.9), 'laugh': (1.02, 0.7), 'smile': (1.0, 0.2),
    'smirk': (0.98, -0.2), 'calm': (0.97, -0.2), 'boom': (0.95, -0.4), 'dizzy': (0.92, -0.5), 'scared': (1.06, 0.8)}

def norm_tts(t):
    t = t.replace('\n', ' ')
    t = re.sub(r'[«»"]', '', t)
    t = t.replace('…', '...').replace('—', ' — ')
    t = re.sub(r'\s+—\s+', ', ', t)
    t = re.sub(r',\s*,', ',', t)
    t = re.sub(r'\.\.\.\s*$', '.', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def raw_path(model, ls, text):
    h = hashlib.md5((model + '|' + str(ls) + '|' + text).encode()).hexdigest()[:14]
    return '%s/raw/%s_%s.wav' % (VD, model, h)

def tts(model, ls, text):
    out = raw_path(model, ls, text)
    if os.path.exists(out): return out
    M = '%s/tts/vits-piper-ru_RU-%s-medium' % (SP, model)
    cmd = [TTSB, '--vits-model=%s/ru_RU-%s-medium.onnx' % (M, model), '--vits-tokens=%s/tokens.txt' % M,
           '--vits-data-dir=%s/espeak-ng-data' % M, '--num-threads=1', '--vits-length-scale=%s' % ls,
           '--vits-noise-scale=0.6', '--vits-noise-scale-w=0.7', '--output-filename=' + out + '.tmp.wav', text]
    r = subprocess.run(cmd, env=ENV, capture_output=True, text=True)
    if not os.path.exists(out + '.tmp.wav'):
        print('TTS FAIL', text[:50], r.stderr[-200:]); return None
    os.rename(out + '.tmp.wav', out)
    return out

def process(line):
    w, t, e = line['w'], line['t'], line.get('e', '')
    role = ROLES[w]
    speak = norm_tts(t)
    raw = tts(role['m'], role['ls'], speak)
    if not raw: return None
    k = vkey(w, t)
    emo = EMO.get(e, (1.0, 0.0))
    tempo = role['tempo'] * emo[0]
    pitch = role['pitch'] + emo[1]
    ratio = 2 ** (pitch / 12.0)
    trim = 'silenceremove=start_periods=1:start_duration=0:start_threshold=-48dB:detection=peak,areverse,silenceremove=start_periods=1:start_duration=0:start_threshold=-48dB:detection=peak,areverse'
    chain = [trim, 'highpass=f=75',
             'rubberband=tempo=%.4f:pitch=%.4f:formant=preserved:pitchq=quality:transients=smooth' % (tempo, ratio)]
    if role.get('post'): chain.append(role['post'])
    chain += ['loudnorm=I=-19:TP=-2:LRA=8', 'alimiter=limit=0.89', 'apad=pad_dur=0.04']
    wav = '%s/wav/%s.wav' % (VD, k)
    mp3 = '%s/mp3/%s.mp3' % (VD, k)
    r = subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-af', ','.join(chain), '-ar', '22050', '-ac', '1', wav], capture_output=True, text=True)
    if r.returncode: print('FF FAIL', k, r.stderr[-300:]); return None
    r = subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', wav, '-ac', '1', '-ar', '22050', '-c:a', 'libmp3lame', '-b:a', '32k', mp3], capture_output=True, text=True)
    if r.returncode: print('MP3 FAIL', k, r.stderr[-300:]); return None
    with wave.open(wav) as f: dur = f.getnframes() / f.getframerate()
    return dict(k=k, w=w, t=t, dur=round(dur, 3), wav=wav, mp3=mp3, bytes=os.path.getsize(mp3))

def render(only=None, force=False, jobs=2):
    L = json.load(open(VD + '/lines.json', encoding='utf8'))
    if only: L = [l for l in L if only in l['t'] or only == l['w'] or only in l.get('src', '')]
    res = {}
    if os.path.exists(VD + '/meta.json') and not force:
        res = json.load(open(VD + '/meta.json'))
    todo = [l for l in L if force or vkey(l['w'], l['t']) not in res or not os.path.exists(res[vkey(l['w'], l['t'])]['mp3'])]
    print('к рендеру', len(todo), 'из', len(L)); sys.stdout.flush()
    n = 0
    with cf.ThreadPoolExecutor(jobs) as ex:
        for r in ex.map(process, todo):
            n += 1
            if r: res[r['k']] = r
            if n % 25 == 0:
                print(n, '/', len(todo)); sys.stdout.flush()
                json.dump(res, open(VD + '/meta.json', 'w'), ensure_ascii=False)
    json.dump(res, open(VD + '/meta.json', 'w'), ensure_ascii=False)
    print('готово', len(res), 'клипов, ', sum(r['bytes'] for r in res.values()) // 1024, 'КБ mp3,', round(sum(r['dur'] for r in res.values()) / 60, 1), 'мин')

def wnorm(s):
    s = s.lower().replace('ё', 'е')
    s = re.sub(r'[^а-яa-z0-9 ]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

def lev(a, b):
    m, n = len(a), len(b)
    d = list(range(n + 1))
    for i in range(1, m + 1):
        p = d[:]; d[0] = i
        for j in range(1, n + 1):
            d[j] = min(p[j] + 1, d[j - 1] + 1, p[j - 1] + (a[i - 1] != b[j - 1]))
    return d[n]

def asr_one(b):
    cmd = [ASRB, '--nemo-ctc-model=%s/model.int8.onnx' % ASRM, '--tokens=%s/tokens.txt' % ASRM, '--num-threads=1', b['wav']]
    rr = subprocess.run(cmd, env=ENV, capture_output=True, text=True)
    f = re.findall(r'"text": *"([^"]*)"', rr.stdout + rr.stderr)
    return f[0] if f else ''

def asr_check():
    meta = json.load(open(VD + '/meta.json'))
    items = list(meta.values())
    outs = {}
    with cf.ThreadPoolExecutor(4) as ex:
        for b, f in zip(items, ex.map(asr_one, items)):
            outs[b['k']] = f
    bad = []
    for k, b in meta.items():
        exp = wnorm(re.sub(r'[«»]', '', b['t'].replace('\n', ' '))); got = wnorm(outs.get(k, ''))
        cer = lev(exp, got) / max(1, len(exp))
        b['asr'] = outs.get(k, ''); b['cer'] = round(cer, 3)
        if cer > 0.28: bad.append((cer, b['w'], b['t'], outs.get(k, '')))
    json.dump(meta, open(VD + '/meta.json', 'w'), ensure_ascii=False)
    bad.sort(reverse=True)
    print('плохих', len(bad), 'из', len(meta))
    for c, w, t, g in bad[:80]: print('%.2f [%s] %s\n      -> %s' % (c, w, t[:100], g[:100]))
    avg = sum(b['cer'] for b in meta.values()) / len(meta)
    print('средняя ошибка', round(avg, 3))

def pack():
    meta = json.load(open(VD + '/meta.json'))
    parts = []
    for k, b in sorted(meta.items()):
        parts.append('"%s":[%s,"%s"]' % (k, b['dur'], base64.b64encode(open(b['mp3'], 'rb').read()).decode()))
    js = 'var VOICE={' + ','.join(parts) + '};\n'
    open(VD + '/voice.js', 'w').write(js)
    print('voice.js', len(js) // 1024, 'КБ,', len(meta), 'клипов')

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'all'
    only = None
    if '--only' in sys.argv: only = sys.argv[sys.argv.index('--only') + 1]
    force = '--force' in sys.argv
    if cmd in ('render', 'all'): render(only, force)
    if cmd in ('asr', 'all'): asr_check()
    if cmd in ('pack', 'all'): pack()
