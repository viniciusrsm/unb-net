import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { IconeAlerta, IconeLupa, Radio } from '@/components/Icones';
import { Botao, LinkVoltar, Papel, PistaLupa, Tela } from '@/components/ui';
import { ESCOLHAS } from '@/game/conteudo';
import { rotuloHud, useJogo } from '@/game/estado';
import { cor, MARGEM, tipo } from '@/theme';

/**
 * Tela de escolha única (radio + lupa). Serve para a senha de terça, o
 * pendrive de quarta, o backup de quinta e o incidente de sexta (08 no Figma).
 */
export default function EscolhaTela() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { estado, despachar } = useJogo();
  const [marcada, setMarcada] = useState<string | null>(null);
  const [lupa, setLupa] = useState(false);

  const escolha = ESCOLHAS.find((e) => e.id === id);
  if (!escolha) return <Redirect href="/briefing" />;

  const selecionada = escolha.opcoes.find((o) => o.id === marcada);
  const jaFeita = estado.escolhas[escolha.id];

  const confirmar = () => {
    if (!selecionada) return;
    despachar({ tipo: 'escolher', escolhaId: escolha.id, opcaoId: selecionada.id });
    if (selecionada.falha) router.replace('/desligado');
    else if (escolha.final) router.replace('/concluido');
    else router.replace('/briefing');
  };

  const alternarLupa = () => setLupa((v) => !v);

  return (
    <Tela hud={rotuloHud(estado.dia, estado.minutos)}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 16, paddingBottom: 36, paddingTop: escolha.alerta ? 0 : 16 }}>
        {escolha.alerta ? (
          <View style={estilos.alerta}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <IconeAlerta size={22} color={cor.branco} />
              <Text style={[tipo.displayM, { color: cor.branco, flex: 1 }]}>{escolha.alerta.titulo}</Text>
            </View>
            <Text style={[tipo.corpo, { color: cor.branco }]}>{escolha.alerta.texto}</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: MARGEM, gap: 14 }}>
            <LinkVoltar rotulo="Memorando" onPress={() => router.replace('/briefing')} />
            {escolha.titulo ? <Text style={[tipo.displayM, { color: cor.formulario }]}>{escolha.titulo}</Text> : null}
          </View>
        )}

        <View style={{ flex: 1, gap: 14, paddingHorizontal: MARGEM }}>
          <Text style={[tipo.corpo, { color: cor.formulario }]}>{escolha.enunciado}</Text>

          <Papel style={{ overflow: 'hidden' }}>
            {escolha.opcoes.map((o) => {
              const ativa = o.id === (jaFeita ?? marcada);
              return (
                <Pressable
                  key={o.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: ativa, disabled: !!jaFeita }}
                  disabled={!!jaFeita}
                  onPress={() => setMarcada(o.id)}
                  onLongPress={alternarLupa}
                  delayLongPress={350}
                  style={[
                    estilos.opcao,
                    ativa && { backgroundColor: cor.branco, borderLeftWidth: 4, borderLeftColor: cor.tinta },
                  ]}
                >
                  <Radio marcado={ativa} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[tipo.corpoDestaque, { color: o.perigo ? cor.carimboVermelho : cor.tinta }]}>{o.titulo}</Text>
                    <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{o.detalhe}</Text>
                  </View>
                </Pressable>
              );
            })}
          </Papel>

          {lupa ? (
            <Pressable onPress={alternarLupa}>
              <PistaLupa rotacao={1} texto={escolha.pista} />
            </Pressable>
          ) : (
            <Pressable onPress={alternarLupa} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <IconeLupa />
              <Text style={[tipo.pequeno, { color: cor.formulario, flex: 1 }]}>
                Toque e segure uma opção para usar a lupa.
              </Text>
            </Pressable>
          )}

          <View style={{ flexGrow: 1, minHeight: 16 }} />

          {jaFeita ? (
            <Botao titulo="Voltar ao memorando" onPress={() => router.replace('/briefing')} />
          ) : (
            <Botao
              titulo={selecionada ? escolha.rotuloBotao(selecionada) : 'Escolha uma opção'}
              desabilitado={!selecionada}
              onPress={confirmar}
            />
          )}
        </View>
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  alerta: { backgroundColor: cor.carimboVermelho, paddingHorizontal: MARGEM, paddingTop: 18, paddingBottom: 20, gap: 8 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cor.linha,
  },
});
