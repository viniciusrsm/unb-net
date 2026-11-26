"""
Sintetiza os efeitos sonoros do jogo (mono, 22,05 kHz, 16 bits). Curtos e baixos de propósito.

Uso: python3 scripts/gerar_sons.py assets/sons
"""
import math, random, struct, sys, wave

TAXA = 22050
random.seed(417)

def salvar(nome, amostras, pico=0.5):
    m = max(abs(a) for a in amostras) or 1
    # leve fade-in/out para não estalar
    n = len(amostras)
    for i in range(min(40, n)):
        amostras[i] *= i / 40
        amostras[n - 1 - i] *= i / 40
    dados = b''.join(struct.pack('<h', int(a / m * pico * 32767)) for a in amostras)
    with wave.open(f'{sys.argv[1]}/{nome}.wav', 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(TAXA); w.writeframes(dados)

def nota(freq, dur, decai, harm=((1, 1.0),), atraso=0.0):
    out = []
    for i in range(int(dur * TAXA)):
        t = i / TAXA
        env = math.exp(-t / decai) * min(1, t / 0.004)
        out.append(env * sum(a * math.sin(2 * math.pi * freq * h * t) for h, a in harm))
    return [0.0] * int(atraso * TAXA) + out

def mistura(*faixas):
    n = max(len(f) for f in faixas)
    return [sum(f[i] if i < len(f) else 0 for f in faixas) for i in range(n)]

def ruido(dur, decai, passa_baixa=0.25):
    out, y = [], 0.0
    for i in range(int(dur * TAXA)):
        y += passa_baixa * (random.uniform(-1, 1) - y)
        out.append(y * math.exp(-(i / TAXA) / decai))
    return out

# Carimbo: baque grave (queda de 110→60 Hz) + "tapa" de papel bem curto.
baque = []
fase = 0.0
for i in range(int(0.22 * TAXA)):
    t = i / TAXA
    f = 60 + 50 * math.exp(-t / 0.03)
    fase += 2 * math.pi * f / TAXA
    baque.append(math.sin(fase) * math.exp(-t / 0.05))
salvar('carimbo', mistura(baque, [0.9 * a for a in ruido(0.06, 0.012, 0.35)]), pico=0.9)

# Lupa: "tic" de vidro suave, agudo e curtíssimo.
salvar('lupa', mistura(nota(1760, 0.16, 0.035, ((1, 1), (2.01, 0.25))), nota(2640, 0.12, 0.02, ((1, 0.35),), atraso=0.035)), pico=0.45)

# Toque: clique seco para marcar opções.
salvar('toque', nota(1100, 0.04, 0.008, ((1, 1), (2, 0.2))), pico=0.35)

# Acerto: duas notas suaves subindo (mi → lá).
salvar('acerto', mistura(nota(659.25, 0.3, 0.09, ((1, 1), (2, 0.15))), nota(880, 0.38, 0.12, ((1, 1), (2, 0.15)), atraso=0.09)), pico=0.55)

# Erro: duas notas graves descendo, abafadas.
salvar('erro', mistura(nota(311.1, 0.35, 0.12, ((1, 1), (3, 0.08))), nota(233.1, 0.55, 0.18, ((1, 1), (3, 0.08)), atraso=0.16)), pico=0.55)
