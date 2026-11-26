import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { Acerto, ListaOpcoes, Lupa, useOpcoesEmbaralhadas } from '@/components/atividade';
import { Botao, LinkVoltar, Tela } from '@/components/ui';
import { LIGACOES } from '@/game/conteudo/atividades';
import { rotuloHud, useJogo } from '@/game/estado';
import type { Fala, Ligacao } from '@/game/tipos';
import { cor, MARGEM, sombra, tipo } from '@/theme';

/** Ligação: a conversa aparece aos poucos e, no fim, você decide o que responder. */
export default function LigacaoTela() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ligacao = LIGACOES.find((l) => l.id === id);
  if (!ligacao) return <Redirect href="/briefing" />;
  return <Conteudo ligacao={ligacao} />;
}

function Conteudo({ ligacao }: { ligacao: Ligacao }) {
  const { estado, despachar } = useJogo();
  const chave = `ligacao:${ligacao.id}`;
  const feita = estado.concluidas.includes(chave);
  const opcoes = useOpcoesEmbaralhadas(ligacao.opcoes);
  const [visiveis, setVisiveis] = useState(feita ? ligacao.falas.length : 0);
  const [segundos, setSegundos] = useState(0);
  const [marcada, setMarcada] = useState<string | null>(null);
  const [lupa, setLupa] = useState(false);
  const scroll = useRef<ScrollViewInstance>(null);
  const terminou = visiveis >= ligacao.falas.length;

  useEffect(() => {
    if (terminou) return;
    const t = setTimeout(() => setVisiveis((v) => v + 1), visiveis === 0 ? 600 : 1500);
    return () => clearTimeout(t);
  }, [visiveis, terminou]);

  useEffect(() => {
    if (feita) return;
    const t = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [feita]);

  const selecionada = opcoes.find((o) => o.id === marcada);

  const confirmar = () => {
    if (!selecionada) return;
    if (selecionada.falha) {
      despachar({ tipo: 'falhar', falha: selecionada.falha });
      router.replace('/desligado');
      return;
    }
    despachar({ tipo: 'concluirAtividade', chave, minutos: 4 });
  };

  const iniciais = ligacao.chamador
    .split(/[ ,]+/)
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  return (
    <Tela hud={rotuloHud(estado.dia)}>
      <ScrollView
        ref={scroll}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ flexGrow: 1, gap: 14, padding: MARGEM, paddingBottom: 36 }}
      >
        <LinkVoltar rotulo="Memorando" onPress={() => router.replace('/briefing')} />

        <View style={estilos.chamada}>
          <View style={estilos.avatar}>
            <Text style={[tipo.hudMarca, { color: cor.tinta }]}>{iniciais}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[tipo.subtitulo, { color: cor.formulario }]}>{ligacao.chamador}</Text>
            <Text style={[tipo.pequeno, { color: cor.linha }]}>{ligacao.numero}</Text>
          </View>
          <View style={estilos.tempo}>
            <View style={[estilos.pontoAoVivo, feita && { backgroundColor: cor.linha }]} />
            <Text style={[tipo.pequenoDestaque, { color: cor.formulario }]}>
              {feita ? 'encerrada' : `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`}
            </Text>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          {ligacao.falas.slice(0, visiveis).map((f, i) => (
            <Balao key={i} fala={f} />
          ))}
          {!terminou ? (
            <Pressable onPress={() => setVisiveis(ligacao.falas.length)} style={{ alignSelf: 'center', padding: 6 }}>
              <Text style={[tipo.pequeno, { color: cor.linha }]}>… ouvindo · toque para pular</Text>
            </Pressable>
          ) : null}
        </View>

        {terminou ? (
          <View style={{ gap: 14 }}>
            <Text style={[tipo.subtitulo, { color: cor.marcaTexto }]}>{ligacao.pergunta}</Text>
            <ListaOpcoes opcoes={opcoes} marcada={marcada} onMarcar={setMarcada} onLupa={() => setLupa((v) => !v)} desabilitada={feita} />
            {feita ? (
              <Acerto explicacao={ligacao.pista} />
            ) : (
              <>
                <Lupa ativa={lupa} pista={ligacao.pista} onAlternar={() => setLupa((v) => !v)} dica="Toque e segure uma opção para usar a lupa." />
                <Botao titulo={selecionada ? 'Responder' : 'Escolha uma resposta'} desabilitado={!selecionada} onPress={confirmar} />
              </>
            )}
          </View>
        ) : null}
      </ScrollView>
    </Tela>
  );
}

function Balao({ fala }: { fala: Fala }) {
  const [entrada] = useState(() => new Animated.Value(0));
  useEffect(() => {
    Animated.timing(entrada, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [entrada]);
  const eles = fala.de === 'eles';
  return (
    <Animated.View
      style={[
        estilos.balao,
        eles ? estilos.balaoEles : estilos.balaoVoce,
        { opacity: entrada, transform: [{ translateY: entrada.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] },
      ]}
    >
      <Text style={[tipo.corpo, { color: cor.tinta }]}>{fala.texto}</Text>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  chamada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: cor.mesaEscura,
    borderRadius: 4,
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cor.marcaTexto,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pontoAoVivo: { width: 8, height: 8, borderRadius: 4, backgroundColor: cor.carimboVermelho },
  balao: { maxWidth: '85%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 4, ...sombra },
  balaoEles: { alignSelf: 'flex-start', backgroundColor: cor.formulario, borderTopLeftRadius: 0 },
  balaoVoce: { alignSelf: 'flex-end', backgroundColor: cor.marcaTexto, borderTopRightRadius: 0 },
});
