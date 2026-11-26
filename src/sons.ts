import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/**
 * Efeitos sonoros curtos e baixos, que confirmam uma ação em vez de chamar atenção.
 * Gerados por scripts/gerar_sons.py.
 */
const ARQUIVOS = {
  /** Baque grave quando o carimbo bate no papel. */
  carimbo: require('../assets/sons/carimbo.wav'),
  /** "Tic" de vidro quando a lupa revela a pista. */
  lupa: require('../assets/sons/lupa.wav'),
  /** Clique seco ao marcar uma opção. */
  toque: require('../assets/sons/toque.wav'),
  /** Duas notas subindo: tarefa resolvida. */
  acerto: require('../assets/sons/acerto.wav'),
  /** Duas notas descendo: demissão. */
  erro: require('../assets/sons/erro.wav'),
} as const;

export type Som = keyof typeof ARQUIVOS;

// O equilíbrio entre os sons fica nos próprios arquivos (ver `pico` no gerador).
const VOLUME: Record<Som, number> = { carimbo: 1, lupa: 1, toque: 1, acerto: 1, erro: 1 };

let players: Partial<Record<Som, AudioPlayer>> | null = null;

function carregar() {
  if (players) return players;
  players = {};
  // Respeita o modo silencioso e não pausa a música de outros apps.
  setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => {});
  for (const som of Object.keys(ARQUIVOS) as Som[]) {
    try {
      const p = createAudioPlayer(ARQUIVOS[som]);
      p.volume = VOLUME[som];
      players[som] = p;
    } catch {
      // Sem áudio disponível (ex.: web sem interação ainda): o jogo segue em silêncio.
    }
  }
  return players;
}

/** Carrega os sons antes do primeiro uso, para não haver atraso no primeiro toque. */
export function prepararSons() {
  carregar();
}

export function tocar(som: Som) {
  const p = carregar()[som];
  if (!p) return;
  try {
    p.seekTo(0).catch(() => {});
    p.play();
  } catch {
    // Falha de áudio nunca deve travar o jogo.
  }
}
