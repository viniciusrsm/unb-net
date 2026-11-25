import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Botao, Papel, Tela } from '@/components/ui';
import {
  ABREV_DIA,
  DIAS,
  DIAS_INFO,
  ESCOLHAS,
  LOJAS,
  NOME_DIA,
  capitalizar,
  emailsDoDia,
  indiceDia,
  type Tarefa,
} from '@/game/conteudo';
import { diaConcluido, proximaTarefa, relogio, rotuloHud, tarefaFeita, useJogo, type Estado } from '@/game/estado';
import { cor, MARGEM, tipo } from '@/theme';

function descrever(estado: Estado, t: Tarefa) {
  if (t.tipo === 'caixa') {
    const n = emailsDoDia(estado.dia).length;
    return { titulo: 'Ler a caixa de entrada', detalhe: `${n} mensage${n === 1 ? 'm' : 'ns'}` };
  }
  if (t.tipo === 'compra') return { titulo: 'Comprar 2 monitores', detalhe: `${LOJAS.length} lojas indicadas` };
  const e = ESCOLHAS.find((x) => x.id === t.id);
  return { titulo: e?.tarefa ?? '', detalhe: e?.detalheTarefa ?? '' };
}

/** 02 Briefing do dia */
export default function Briefing() {
  const { estado, despachar } = useJogo();
  const info = DIAS_INFO[estado.dia];
  const idx = indiceDia(estado.dia);
  const feito = diaConcluido(estado);
  const proxima = proximaTarefa(estado);

  const acao = proxima
    ? { titulo: proxima.rotulo, onPress: () => router.replace(proxima.rota) }
    : {
        titulo: `Encerrar ${NOME_DIA[estado.dia]}`,
        onPress: () => {
          despachar({ tipo: 'avancarDia' });
          router.replace('/briefing');
        },
      };

  return (
    <Tela hud={rotuloHud(estado.dia, estado.minutos)}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={{ gap: 6 }}>
          <Text style={[tipo.pequenoDestaque, { color: cor.marcaTexto }]}>Dia {idx + 1} de 5</Text>
          <Text style={[tipo.displayG, { color: cor.formulario }]}>{capitalizar(NOME_DIA[estado.dia])}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 6 }}>
          {DIAS.map((d, i) => {
            const atual = i === idx;
            const passado = i < idx;
            return (
              <View key={d} style={{ flex: 1, gap: 6 }}>
                <View
                  style={[
                    estilos.segmento,
                    atual || passado
                      ? { backgroundColor: cor.marcaTexto, opacity: passado ? 0.5 : 1 }
                      : { backgroundColor: cor.formulario, opacity: 0.2 },
                  ]}
                />
                <Text style={[tipo.pequeno, { color: atual ? cor.formulario : cor.linha }]}>{ABREV_DIA[d]}</Text>
              </View>
            );
          })}
        </View>

        <Papel style={estilos.memo}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Text style={[tipo.pequenoDestaque, { color: cor.texto2, flex: 1 }]}>Memorando do RH</Text>
            <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{relogio(info.inicio)}</Text>
          </View>
          <Text style={[tipo.corpo, { color: cor.tinta }]}>{feito && info.memorandoFeito ? info.memorandoFeito : info.memorando}</Text>
          <View>
            {info.tarefas.map((t) => {
              const { titulo, detalhe } = descrever(estado, t);
              const ok = tarefaFeita(estado, t);
              return (
                <View key={titulo} style={estilos.tarefa}>
                  <View style={[estilos.check, ok && { backgroundColor: cor.tinta }]}>
                    {ok ? <Text style={estilos.checkMarca}>✓</Text> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        tipo.corpoDestaque,
                        { color: cor.tinta },
                        ok && { textDecorationLine: 'line-through', color: cor.texto2 },
                      ]}
                    >
                      {titulo}
                    </Text>
                    <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{detalhe}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Papel>

        <View style={{ flexGrow: 1, minHeight: 24 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={estilos.ponto} />
          <Text style={[tipo.pequenoDestaque, { color: cor.formulario, flex: 1 }]}>
            Erros permitidos nesta semana: nenhum
          </Text>
        </View>

        <Botao titulo={acao.titulo} onPress={acao.onPress} />
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  conteudo: { flexGrow: 1, gap: 24, paddingHorizontal: MARGEM, paddingTop: 28, paddingBottom: 40 },
  segmento: { height: 6, borderRadius: 1 },
  memo: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 22, gap: 14 },
  tarefa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: cor.linha,
  },
  check: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: cor.tinta,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMarca: { color: cor.formulario, fontSize: 12, lineHeight: 14, fontWeight: '700' },
  ponto: { width: 10, height: 10, borderRadius: 5, backgroundColor: cor.carimboVermelho },
});
