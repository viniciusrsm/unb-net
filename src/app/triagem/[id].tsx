import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { Acerto, Lupa } from '@/components/atividade';
import { Botao, LinkVoltar, Papel, Tela } from '@/components/ui';
import { TRIAGENS } from '@/game/conteudo/atividades';
import { planoAtual, rotuloHud, useJogo } from '@/game/estado';
import type { ItemTriagem, Triagem } from '@/game/tipos';
import { cor, fonte, MARGEM, tipo } from '@/theme';

/** Triagem: classificar vários itens de uma vez. Um erro já conta. */
export default function TriagemTela() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { estado } = useJogo();
  const triagem = TRIAGENS.find((t) => t.id === id);
  const atividade = planoAtual(estado)?.atividades.find((a) => a.tipo === 'triagem' && a.id === id);
  if (!triagem || !atividade || atividade.tipo !== 'triagem') return <Redirect href="/briefing" />;
  return <Conteudo triagem={triagem} itens={atividade.itens.map((i) => triagem.itens[i])} />;
}

function Conteudo({ triagem, itens }: { triagem: Triagem; itens: ItemTriagem[] }) {
  const { estado, despachar } = useJogo();
  const chave = `triagem:${triagem.id}`;
  const feita = estado.concluidas.includes(chave);
  const [respostas, setRespostas] = useState<(boolean | null)[]>(() => itens.map((it) => (feita ? it.ok : null)));
  const [lupa, setLupa] = useState(false);
  const completas = respostas.every((r) => r !== null);

  const marcar = (i: number, ok: boolean) => setRespostas((r) => r.map((x, j) => (j === i ? ok : x)));

  const confirmar = () => {
    const erradas = itens.filter((it, i) => respostas[i] !== it.ok);
    if (erradas.length > 0) {
      despachar({
        tipo: 'falhar',
        falha: {
          texto: triagem.falhaTexto,
          pistas: erradas.slice(0, 3).map((it) => `${it.texto}: ${minuscula(it.explicacao)}`),
          verbete: triagem.tema,
        },
      });
      router.replace('/desligado');
      return;
    }
    despachar({ tipo: 'concluirAtividade', chave, minutos: 6 });
  };

  return (
    <Tela hud={rotuloHud(estado.dia)}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 14, padding: MARGEM, paddingBottom: 36 }}>
        <LinkVoltar rotulo="Memorando" onPress={() => router.replace('/briefing')} />
        <Text style={[tipo.displayM, { color: cor.formulario }]}>{triagem.titulo}</Text>
        <Text style={[tipo.corpo, { color: cor.formulario }]}>{triagem.enunciado}</Text>

        <Papel style={{ overflow: 'hidden' }}>
          {itens.map((it, i) => (
            <View key={it.texto} style={estilos.item}>
              <Text style={estilos.texto}>{it.texto}</Text>
              {feita ? <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{it.explicacao}</Text> : null}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Escolha
                  rotulo={triagem.rotuloOk}
                  ativa={respostas[i] === true}
                  corAtiva={cor.carimboAzul}
                  onPress={() => marcar(i, true)}
                  desabilitada={feita}
                />
                <Escolha
                  rotulo={triagem.rotuloRuim}
                  ativa={respostas[i] === false}
                  corAtiva={cor.carimboVermelho}
                  onPress={() => marcar(i, false)}
                  desabilitada={feita}
                />
              </View>
            </View>
          ))}
        </Papel>

        {feita ? (
          <Acerto explicacao={triagem.pista} />
        ) : (
          <>
            <Lupa ativa={lupa} pista={triagem.pista} onAlternar={() => setLupa((v) => !v)} dica="Toque aqui para usar a lupa." />
            <View style={{ flexGrow: 1, minHeight: 8 }} />
            <Text style={[tipo.pequeno, { color: cor.linha, textAlign: 'center' }]}>
              {respostas.filter((r) => r !== null).length} de {itens.length} classificados
            </Text>
            <Botao titulo={completas ? 'Enviar para a TI' : 'Classifique todos os itens'} desabilitado={!completas} onPress={confirmar} />
          </>
        )}
      </ScrollView>
    </Tela>
  );
}

function Escolha({
  rotulo,
  ativa,
  corAtiva,
  onPress,
  desabilitada,
}: {
  rotulo: string;
  ativa: boolean;
  corAtiva: string;
  onPress: () => void;
  desabilitada?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: ativa }}
      disabled={desabilitada}
      onPress={onPress}
      style={[estilos.botao, { borderColor: ativa ? corAtiva : cor.linha }, ativa && { backgroundColor: corAtiva }]}
    >
      <Text style={[tipo.pequenoDestaque, { color: ativa ? cor.branco : cor.texto2 }]}>{rotulo}</Text>
    </Pressable>
  );
}

const minuscula = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

const estilos = StyleSheet.create({
  item: { padding: 14, gap: 10, borderBottomWidth: 1, borderBottomColor: cor.linha },
  texto: { fontFamily: fonte.semibold, fontSize: 15, lineHeight: 21, color: cor.tinta },
  botao: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 3, borderWidth: 1.5 },
});
