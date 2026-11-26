import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ItemLista, LinkVoltar, Papel, Tela, voltarAoMemorando } from '@/components/ui';
import { VERBETES } from '@/game/conteudo/verbetes';
import { rotuloHud, useJogo } from '@/game/estado';
import type { VerbeteId } from '@/game/tipos';
import { cor, MARGEM, tipo } from '@/theme';

/** 07 Manual */
export default function Manual() {
  const { verbete: inicial, modo } = useLocalSearchParams<{ verbete?: VerbeteId; modo?: 'leitura' }>();
  const { estado, despachar } = useJogo();
  const leitura = modo === 'leitura' || !estado.iniciado;

  // Todos os verbetes ficam abertos desde o início; `verbete` na rota escolhe a aba.
  const [atual, setAtual] = useState<VerbeteId>(
    inicial && VERBETES.some((v) => v.id === inicial) ? inicial : 'phishing',
  );
  const verbete = VERBETES.find((v) => v.id === atual) ?? VERBETES[0];

  // Rola a fileira de abas até a aba aberta (ex.: "Engenharia social" não cabe na tela).
  const chips = useRef<ScrollViewInstance>(null);
  const posicoes = useRef<Partial<Record<VerbeteId, number>>>({});
  const rolouInicial = useRef(false);
  const mostrarChip = (id: VerbeteId, animado: boolean) => {
    const x = posicoes.current[id];
    if (x !== undefined) chips.current?.scrollTo({ x: Math.max(0, x - MARGEM), animated: animado });
  };

  useEffect(() => {
    despachar({ tipo: 'lerVerbete', id: atual });
  }, [atual, despachar]);

  return (
    <Tela hud={rotuloHud(estado.dia)} aba={leitura ? undefined : 'manual'}>
      <ScrollView contentContainerStyle={{ paddingVertical: 16, gap: 14, flexGrow: 1 }}>
        <View style={{ paddingHorizontal: MARGEM }}>
          {leitura ? (
            <LinkVoltar rotulo="Voltar" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
          ) : (
            <LinkVoltar rotulo="Memorando" onPress={voltarAoMemorando} />
          )}
        </View>

        <ScrollView
          ref={chips}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={estilos.chips}
          accessibilityRole="tablist"
        >
          {VERBETES.map((v) => {
            const ativo = v.id === atual;
            return (
              <Pressable
                key={v.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: ativo }}
                onLayout={(e) => {
                  posicoes.current[v.id] = e.nativeEvent.layout.x;
                  if (ativo && !rolouInicial.current) {
                    rolouInicial.current = true;
                    mostrarChip(v.id, false);
                  }
                }}
                onPress={() => {
                  setAtual(v.id);
                  mostrarChip(v.id, true);
                }}
                style={[estilos.chip, ativo ? { backgroundColor: cor.marcaTexto, borderColor: cor.marcaTexto } : null]}
              >
                <Text style={[tipo.pequenoDestaque, { color: ativo ? cor.tinta : cor.formulario }]}>{v.chip}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: MARGEM, gap: 14, flex: 1 }}>
          <View style={{ gap: 2 }}>
            <Text style={[tipo.pequeno, { color: cor.linha }]}>Verbete do manual de segurança</Text>
            <Text style={[tipo.displayG, { color: cor.formulario }]}>{verbete.titulo}</Text>
          </View>

          <Papel style={estilos.cartao}>
            <Text style={[tipo.corpo, { color: cor.tinta }]}>{verbete.definicao}</Text>
            <Text style={[tipo.subtitulo, { color: cor.tinta }]}>Como reconhecer</Text>
            {verbete.reconhecer.map((t) => (
              <ItemLista key={t} texto={t} />
            ))}
            <Text style={[tipo.subtitulo, { color: cor.tinta }]}>O que fazer</Text>
            <Text style={[tipo.corpo, { color: cor.tinta }]}>{verbete.fazer}</Text>
          </Papel>
        </View>
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  chips: { gap: 8, paddingHorizontal: MARGEM },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: cor.linha,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  cartao: { flex: 1, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 20, gap: 12 },
});
