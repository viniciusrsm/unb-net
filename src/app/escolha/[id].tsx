import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { Acerto, ListaOpcoes, Lupa, useOpcoesEmbaralhadas } from '@/components/atividade';
import { IconeAlerta } from '@/components/Icones';
import { Botao, LinkVoltar, Tela } from '@/components/ui';
import { ESCOLHAS, FINAIS } from '@/game/conteudo/atividades';
import { rotuloHud, useJogo } from '@/game/estado';
import type { Escolha } from '@/game/tipos';
import { cor, MARGEM, tipo } from '@/theme';

/**
 * Escolha única (radio + lupa): senha, pendrive, Wi-Fi, porta restrita...
 * e os incidentes de sexta (08 no Figma).
 */
export default function EscolhaTela() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const escolha = [...ESCOLHAS, ...FINAIS].find((e) => e.id === id);
  if (!escolha) return <Redirect href="/briefing" />;
  return <Conteudo escolha={escolha} />;
}

function Conteudo({ escolha }: { escolha: Escolha }) {
  const { estado, despachar } = useJogo();
  const opcoes = useOpcoesEmbaralhadas(escolha.opcoes, escolha.ordemFixa);
  const [marcada, setMarcada] = useState<string | null>(null);
  const [lupa, setLupa] = useState(false);
  const chave = `escolha:${escolha.id}`;
  const feita = estado.concluidas.includes(chave);
  const selecionada = opcoes.find((o) => o.id === marcada);

  const confirmar = () => {
    if (!selecionada) return;
    if (selecionada.falha) {
      despachar({ tipo: 'falhar', falha: selecionada.falha });
      router.replace('/desligado');
      return;
    }
    despachar({ tipo: 'concluirAtividade', chave });
    if (escolha.final) router.replace('/concluido');
  };

  const rotulo = selecionada
    ? typeof escolha.rotuloBotao === 'string'
      ? escolha.rotuloBotao
      : escolha.rotuloBotao(selecionada)
    : 'Escolha uma opção';

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

          <ListaOpcoes
            opcoes={opcoes}
            marcada={marcada}
            onMarcar={setMarcada}
            onLupa={() => setLupa((v) => !v)}
            desabilitada={feita}
          />

          {feita ? (
            <Acerto explicacao={escolha.pista} />
          ) : (
            <>
              <Lupa ativa={lupa} pista={escolha.pista} onAlternar={() => setLupa((v) => !v)} dica="Toque e segure uma opção para usar a lupa." />
              <View style={{ flexGrow: 1, minHeight: 16 }} />
              <Botao titulo={rotulo} desabilitado={!selecionada} onPress={confirmar} />
            </>
          )}
        </View>
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  alerta: { backgroundColor: cor.carimboVermelho, paddingHorizontal: MARGEM, paddingTop: 18, paddingBottom: 20, gap: 8 },
});
