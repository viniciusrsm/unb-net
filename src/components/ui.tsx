import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { compraLiberada, useJogo } from '@/game/estado';
import { tocar } from '@/sons';
import { cor, MARGEM, sombra, tipo } from '@/theme';
import { Bonequinho, Furo, IconeCaixa, IconeManual, IconeNavegador, IconeVoltar } from './Icones';

// ——— Botão ———

type TipoBotao = 'primario' | 'secundario' | 'perigo' | 'escuro';

const botaoCores: Record<TipoBotao, { fundo: string; texto: string; borda?: string }> = {
  primario: { fundo: cor.marcaTexto, texto: cor.tinta },
  secundario: { fundo: 'transparent', texto: cor.formulario, borda: cor.formulario },
  perigo: { fundo: cor.carimboVermelho, texto: cor.branco },
  escuro: { fundo: cor.tinta, texto: cor.formulario },
};

export function Botao({
  titulo,
  onPress,
  tipo: t = 'primario',
  desabilitado,
}: {
  titulo: string;
  onPress: () => void;
  tipo?: TipoBotao;
  desabilitado?: boolean;
}) {
  const c = botaoCores[t];
  return (
    <Pressable
      accessibilityRole="button"
      disabled={desabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: c.fundo },
        c.borda ? { borderWidth: 2, borderColor: c.borda, paddingVertical: 13 } : null,
        pressed && { opacity: 0.8, transform: [{ translateY: 1 }] },
        desabilitado && { opacity: 0.4 },
      ]}
    >
      <Text style={[tipo.subtitulo, { color: c.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

// ——— HUD ———

export function Hud({ rotulo }: { rotulo: string }) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[estilos.hud, { paddingTop: top + 14 }]}>
      <View style={estilos.hudQuadrado} />
      <Text style={[tipo.hudMarca, { color: cor.formulario, flex: 1 }]}>UnB Net</Text>
      <View style={estilos.hudEtiqueta}>
        <Text style={[tipo.pequenoDestaque, { color: cor.tinta }]}>{rotulo}</Text>
      </View>
    </View>
  );
}

// ——— Barra de abas ———

export type App = 'caixa' | 'navegador' | 'manual';

const ABAS: { app: App; rotulo: string; Icone: typeof IconeCaixa }[] = [
  { app: 'caixa', rotulo: 'Caixa', Icone: IconeCaixa },
  { app: 'navegador', rotulo: 'Navegador', Icone: IconeNavegador },
  { app: 'manual', rotulo: 'Manual', Icone: IconeManual },
];

export function BarraDeAbas({ ativa }: { ativa: App }) {
  const { bottom } = useSafeAreaInsets();
  const { estado } = useJogo();
  // O navegador só entra na barra quando há uma compra liberada (pedido aceito na caixa).
  const temCompra = !!compraLiberada(estado);
  const abas = ABAS.filter(({ app }) => app !== 'navegador' || temCompra || ativa === 'navegador');
  return (
    <View style={[estilos.barra, { paddingBottom: Math.max(bottom, 30) }]}>
      {abas.map(({ app, rotulo, Icone }) => {
        const ativo = app === ativa;
        return (
          <Pressable
            key={app}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            onPress={() => !ativo && router.replace(`/${app}`)}
            style={estilos.aba}
          >
            <View style={[estilos.abaIndicador, ativo && { backgroundColor: cor.marcaTexto }]} />
            <View style={{ opacity: ativo ? 1 : 0.55 }}>
              <Icone />
            </View>
            <Text style={[tipo.aba, { color: cor.formulario, opacity: ativo ? 1 : 0.55 }]}>{rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ——— Estrutura de tela ———

export function Tela({
  hud,
  aba,
  rodape,
  children,
  style,
}: {
  hud?: string;
  aba?: App;
  rodape?: ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={estilos.fundo}>
      <View style={estilos.coluna}>
        {hud ? <Hud rotulo={hud} /> : null}
        <View
          style={[
            { flex: 1 },
            !hud && { paddingTop: top },
            !aba && !rodape && { paddingBottom: bottom },
            style,
          ]}
        >
          {children}
        </View>
        {rodape}
        {aba ? <BarraDeAbas ativa={aba} /> : null}
      </View>
    </View>
  );
}

/** Volta ao memorando que está embaixo na pilha (ou o abre, se não estiver lá). */
export const voltarAoMemorando = () => router.dismissTo('/briefing');

export function LinkVoltar({ rotulo, onPress }: { rotulo: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={10} style={estilos.voltar}>
      <IconeVoltar />
      <Text style={[tipo.pequenoDestaque, { color: cor.formulario }]}>{rotulo}</Text>
    </Pressable>
  );
}

// ——— Papel (cartão claro com sombra sólida) ———

export function Papel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[estilos.papel, style]}>{children}</View>;
}

// ——— Marca-texto inline ———

export function MarcaTexto({ children, destaque = true, negrito = true }: { children: string; destaque?: boolean; negrito?: boolean }) {
  return (
    <View style={[{ paddingHorizontal: destaque ? 3 : 0 }, destaque && { backgroundColor: cor.marcaTexto }]}>
      <Text style={[negrito ? tipo.pequenoDestaque : tipo.pequeno, { color: destaque ? cor.tinta : cor.texto2 }]}>{children}</Text>
    </View>
  );
}

// ——— Item com marcador quadrado amarelo ———

export function ItemLista({ texto, corTexto = cor.tinta }: { texto: string; corTexto?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <View style={{ paddingTop: 7 }}>
        <View style={{ width: 10, height: 10, borderRadius: 1, backgroundColor: cor.marcaTexto }} />
      </View>
      <Text style={[tipo.corpo, { color: corTexto, flex: 1 }]}>{texto}</Text>
    </View>
  );
}

// ——— Pista da lupa ———

export function PistaLupa({ texto, rotacao = -1.2 }: { texto: string; rotacao?: number }) {
  const [entrada] = useState(() => new Animated.Value(0));
  useEffect(() => {
    tocar('lupa');
    Animated.spring(entrada, { toValue: 1, useNativeDriver: true, friction: 6 }).start();
  }, [entrada]);
  return (
    <Animated.View
      style={[
        estilos.pista,
        {
          opacity: entrada,
          transform: [
            { rotate: `${rotacao}deg` },
            { scale: entrada.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
          ],
        },
      ]}
    >
      <Text style={[tipo.pequenoDestaque, { color: cor.tinta }]}>Lupa</Text>
      <Text style={[tipo.pequeno, { color: cor.tinta }]}>{texto}</Text>
    </Animated.View>
  );
}

// ——— Carimbo ———

export function Carimbo({ tipo: t }: { tipo: 'Confiar' | 'Denunciar' }) {
  const c = t === 'Denunciar' ? cor.carimboVermelho : cor.carimboAzul;
  return (
    <View style={[estilos.carimboFora, { borderColor: c }]}>
      <View style={[estilos.carimboDentro, { borderColor: c }]}>
        <Text style={[tipo.carimbo, { color: c }]}>{t.toUpperCase()}</Text>
        <Text style={[tipo.pequenoDestaque, { color: c }]}>Estagiário nº 0417</Text>
      </View>
    </View>
  );
}

/** Carimbo que "bate" na tela e chama onFim quando a animação termina. */
export function CarimboAnimado({ tipo: t, onFim }: { tipo: 'Confiar' | 'Denunciar'; onFim: () => void }) {
  const [v] = useState(() => new Animated.Value(0));
  useEffect(() => {
    // O som sai no impacto, quando o carimbo termina de "descer".
    const impacto = setTimeout(() => tocar('carimbo'), 150);
    Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.delay(750),
    ]).start(() => onFim());
    return () => clearTimeout(impacto);
  }, [v, onFim]);
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      <Animated.View
        style={{
          opacity: v.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1] }),
          transform: [
            { rotate: t === 'Denunciar' ? '-8deg' : '6deg' },
            { scale: v.interpolate({ inputRange: [0, 1], outputRange: [2.2, 1] }) },
          ],
        }}
      >
        <Carimbo tipo={t} />
      </Animated.View>
    </View>
  );
}

// ——— Crachá ———

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

export function Cracha({
  furos = 0,
  titulo = ['Crachá', 'Provisório'],
  escala = 1,
  rotacao = 3,
}: {
  furos?: number;
  titulo?: [string, string];
  escala?: number;
  rotacao?: number;
}) {
  const s = (n: number) => n * escala;
  const mini = { fontSize: s(8.6), lineHeight: s(12.5) };
  return (
    <View
      style={{
        width: s(198),
        backgroundColor: cor.formulario,
        borderRadius: s(9.24),
        alignItems: 'center',
        gap: s(11.88),
        paddingTop: s(11.88),
        paddingBottom: s(17.16),
        paddingHorizontal: s(15.84),
        boxShadow: `0px ${s(5.28)}px 0px 0px rgba(18,31,38,0.35)`,
        transform: [{ rotate: `${rotacao}deg` }],
      }}
    >
      <View style={{ width: s(42), height: s(6.6), borderRadius: s(3.3), backgroundColor: cor.mesa }} />
      <View
        style={{
          alignSelf: 'stretch',
          flexDirection: 'row',
          backgroundColor: cor.marcaTexto,
          paddingHorizontal: s(9.24),
          paddingVertical: s(5.28),
        }}
      >
        <Text style={[tipo.pequenoDestaque, mini, { color: cor.tinta, flex: 1 }]}>UnB Net</Text>
        <Text style={[tipo.pequenoDestaque, mini, { color: cor.tinta }]}>Estagiário</Text>
      </View>
      <View
        style={{
          width: s(79.2),
          height: s(92.4),
          backgroundColor: cor.pauta,
          borderWidth: s(0.66),
          borderColor: cor.linha,
          borderRadius: s(2.64),
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'hidden',
        }}
      >
        <Bonequinho width={s(63.36)} height={s(73.92)} />
      </View>
      <View style={{ alignItems: 'center' }}>
        {titulo.map((linha) => (
          <Text key={linha} style={[tipo.displayG, { fontSize: s(33), lineHeight: s(31.5), color: cor.tinta }]}>
            {linha}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: s(6.6) }}>
        {DIAS.map((d, i) => (
          <View key={d} style={{ alignItems: 'center', gap: s(2.64) }}>
            <Furo preenchido={i < furos} size={s(11.88)} />
            <Text style={[tipo.pequeno, mini, { color: cor.texto2 }]}>{d}</Text>
          </View>
        ))}
      </View>
      <Text style={[tipo.pequeno, mini, { color: cor.texto2 }]}>Válido até sexta-feira</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: cor.mesa, alignItems: 'center' },
  coluna: { flex: 1, width: '100%', maxWidth: 480 },
  botao: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 2,
  },
  hud: {
    backgroundColor: cor.mesaEscura,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: MARGEM,
    paddingBottom: 14,
  },
  hudQuadrado: { width: 12, height: 12, borderRadius: 2, backgroundColor: cor.marcaTexto },
  hudEtiqueta: { backgroundColor: cor.marcaTexto, borderRadius: 2, paddingHorizontal: 10, paddingVertical: 4 },
  barra: {
    backgroundColor: cor.mesaEscura,
    borderTopWidth: 1,
    borderTopColor: cor.formulario,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 28,
  },
  aba: { width: 84, alignItems: 'center', gap: 6, paddingBottom: 4 },
  abaIndicador: { width: 28, height: 3, borderRadius: 2 },
  voltar: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  papel: { backgroundColor: cor.formulario, borderRadius: 4, ...sombra },
  pista: {
    alignSelf: 'stretch',
    backgroundColor: cor.marcaTexto,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 12,
    gap: 4,
    ...sombra,
  },
  carimboFora: { borderWidth: 4, borderRadius: 6, padding: 5, opacity: 0.92, backgroundColor: 'rgba(238,243,234,0.6)' },
  carimboDentro: { borderWidth: 1.5, borderRadius: 3, paddingVertical: 10, paddingHorizontal: 22, alignItems: 'center' },
});
