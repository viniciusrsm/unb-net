import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

import { cor as paleta } from '@/theme';

type Props = { size?: number; color?: string };

const traco = { strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;

export function IconeCaixa({ size = 22, color = paleta.formulario }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      <Path d="M2.75 11.9167H7.33333L8.70833 14.6667H13.2917L14.6667 11.9167H19.25" stroke={color} strokeWidth={1.8} {...traco} />
      <Path d="M5.04167 4.58333H16.9583L19.25 11.9167V17.4167H2.75V11.9167L5.04167 4.58333Z" stroke={color} strokeWidth={1.8} {...traco} />
    </Svg>
  );
}

export function IconeNavegador({ size = 22, color = paleta.formulario }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      <Path d="M19.25 11C19.25 15.5563 15.5563 19.25 11 19.25C6.44365 19.25 2.75 15.5563 2.75 11C2.75 6.44365 6.44365 2.75 11 2.75C15.5563 2.75 19.25 6.44365 19.25 11Z" stroke={color} strokeWidth={1.8} {...traco} />
      <Path d="M2.75 11H19.25M11 2.75C13.9333 6.05 13.9333 15.95 11 19.25C8.06667 15.95 8.06667 6.05 11 2.75Z" stroke={color} strokeWidth={1.8} {...traco} />
    </Svg>
  );
}

export function IconeManual({ size = 22, color = paleta.formulario }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22">
      <Path d="M4.58333 4.125C4.58333 3.76033 4.7282 3.41059 4.98606 3.15273C5.24392 2.89487 5.59366 2.75 5.95833 2.75H17.4167V16.5H5.95833C5.59366 16.5 5.24392 16.6449 4.98606 16.9027C4.7282 17.1606 4.58333 17.5103 4.58333 17.875V4.125Z" stroke={color} strokeWidth={1.8} {...traco} />
      <Path d="M4.58333 17.875C4.58333 18.2397 4.7282 18.5894 4.98606 18.8473C5.24392 19.1051 5.59366 19.25 5.95833 19.25H17.4167V16.5" stroke={color} strokeWidth={1.8} {...traco} />
      <Path d="M8.25 6.875H13.75M8.25 10.0833H11.9167" stroke={color} strokeWidth={1.8} {...traco} />
    </Svg>
  );
}

export function IconeLupa({ size = 18, color = paleta.marcaTexto }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Path d="M13.125 8.25C13.125 10.9424 10.9424 13.125 8.25 13.125C5.55761 13.125 3.375 10.9424 3.375 8.25C3.375 5.55761 5.55761 3.375 8.25 3.375C10.9424 3.375 13.125 5.55761 13.125 8.25Z" stroke={color} strokeWidth={2} {...traco} />
      <Path d="M15 15L11.85 11.85" stroke={color} strokeWidth={2} {...traco} />
    </Svg>
  );
}

export function IconeVoltar({ size = 18, color = paleta.formulario }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Path d="M11.25 13.5L6.75 9L11.25 4.5" stroke={color} strokeWidth={2} {...traco} />
    </Svg>
  );
}

export function IconeArquivo({ size = 18, color = paleta.tinta }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Path d="M10.5 2.25H4.5V15.75H13.5V5.25L10.5 2.25Z" stroke={color} strokeWidth={2} {...traco} />
      <Path d="M10.5 2.25V5.25H13.5" stroke={color} strokeWidth={2} {...traco} />
    </Svg>
  );
}

export function IconeAlerta({ size = 16, color = paleta.carimboVermelho }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path d="M8 2.66667L1.66667 13.3333H14.3333L8 2.66667Z" stroke={color} strokeWidth={2} {...traco} />
      <Path d="M8 6.66667V9.33333M8 11.6667V11.7333" stroke={color} strokeWidth={2} {...traco} />
    </Svg>
  );
}

export function IconeX({ size = 14, color = paleta.carimboVermelho }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke={color} strokeWidth={2} {...traco} />
    </Svg>
  );
}

export function IconeCheck({ size = 14, color = paleta.texto2 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path d="M2.91667 7.29167L5.54167 9.91667L11.0833 4.375" stroke={color} strokeWidth={2} {...traco} />
    </Svg>
  );
}

export function IconeCadeado({ size = 14, color = paleta.linha }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path d="M3.79167 6.41667H10.2083C10.6916 6.41667 11.0833 6.80842 11.0833 7.29167V10.7917C11.0833 11.2749 10.6916 11.6667 10.2083 11.6667H3.79167C3.30842 11.6667 2.91667 11.2749 2.91667 10.7917V7.29167C2.91667 6.80842 3.30842 6.41667 3.79167 6.41667Z" stroke={color} strokeWidth={2} {...traco} />
      <Path d="M4.66667 6.41667V4.66667C4.66667 4.04783 4.9125 3.45434 5.35008 3.01675C5.78767 2.57917 6.38116 2.33333 7 2.33333C7.61884 2.33333 8.21233 2.57917 8.64992 3.01675C9.0875 3.45434 9.33333 4.04783 9.33333 4.66667V6.41667" stroke={color} strokeWidth={2} {...traco} />
    </Svg>
  );
}

export function Radio({ marcado, size = 18 }: { marcado: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18">
      <Circle cx={9} cy={9} r={8.25} stroke={paleta.tinta} strokeWidth={1.5} fill={marcado ? paleta.tinta : 'none'} />
    </Svg>
  );
}

export function Furo({ preenchido, size = 12 }: { preenchido: boolean; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12">
      <Circle cx={6} cy={6} r={5.4} stroke={paleta.tinta} strokeWidth={1} fill={preenchido ? paleta.mesa : 'none'} />
    </Svg>
  );
}

export function Bonequinho({ width = 64, height = 74 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 63.36 73.92">
      <Defs>
        <ClipPath id="clip">
          <Rect width={63.36} height={73.92} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip)">
        <Path d="M31.68 39.6C39.6992 39.6 46.2 33.0992 46.2 25.08C46.2 17.0608 39.6992 10.56 31.68 10.56C23.6608 10.56 17.16 17.0608 17.16 25.08C17.16 33.0992 23.6608 39.6 31.68 39.6Z" fill={paleta.linha} />
        <Path d="M5.28 73.92C5.28 56.76 17.16 44.88 31.68 44.88C46.2 44.88 58.08 56.76 58.08 73.92H5.28Z" fill={paleta.linha} />
      </G>
    </Svg>
  );
}
