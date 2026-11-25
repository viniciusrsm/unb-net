import type { TextStyle, ViewStyle } from 'react-native';

/** Variáveis da coleção "Cores" do Figma. */
export const cor = {
  tinta: '#1C2B3A',
  mesa: '#2E4A52',
  mesaEscura: '#223840',
  formulario: '#EEF3EA',
  pauta: '#DDE9D8',
  linha: '#A9BCB0',
  texto2: '#55676E',
  carimboAzul: '#2346C8',
  carimboVermelho: '#C7303A',
  marcaTexto: '#F4DB3B',
  branco: '#FFFFFF',
} as const;

export const fonte = {
  displayBold: 'BigShouldersDisplay_700Bold',
  displayBlack: 'BigShouldersDisplay_900Black',
  regular: 'IBMPlexSans_400Regular',
  medium: 'IBMPlexSans_500Medium',
  semibold: 'IBMPlexSans_600SemiBold',
} as const;

const estilo = (fontFamily: string, fontSize: number, alturaLinha: number, espacamento = 0): TextStyle => ({
  fontFamily,
  fontSize,
  lineHeight: Math.round(fontSize * alturaLinha),
  letterSpacing: fontSize * espacamento,
});

/** Estilos de texto do Figma. */
export const tipo = {
  displayMega: estilo(fonte.displayBlack, 84, 0.9),
  displayG: estilo(fonte.displayBlack, 50, 0.95),
  displayM: estilo(fonte.displayBold, 32, 1, 0.01),
  carimbo: estilo(fonte.displayBlack, 44, 1, 0.08),
  titulo: estilo(fonte.semibold, 22, 1.3),
  subtitulo: estilo(fonte.semibold, 16, 1.4),
  corpo: estilo(fonte.regular, 16, 1.55),
  corpoDestaque: estilo(fonte.medium, 16, 1.55),
  pequeno: estilo(fonte.regular, 13, 1.45),
  pequenoDestaque: estilo(fonte.semibold, 13, 1.45),
  hudMarca: estilo(fonte.displayBold, 22, 1, 0.01),
  aba: estilo(fonte.semibold, 11, 1.45),
} satisfies Record<string, TextStyle>;

/** Efeito "Sombra/Janela": sombra sólida, sem desfoque. */
export const sombra: ViewStyle = { boxShadow: '0px 8px 0px 0px rgba(18,31,38,0.35)' };

export const MARGEM = 20;
