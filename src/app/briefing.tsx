import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { IconeCadeado, IconeVoltar } from '@/components/Icones';
import { Botao, Papel, Tela } from '@/components/ui';
import {
  descreverTarefa,
  diaConcluido,
  planoAtual,
  relogio,
  rotaDaTarefa,
  rotuloHud,
  tarefaFeita,
  tarefaLiberada,
  useJogo,
} from '@/game/estado';
import { ABREV_DIA, DIAS, INICIO_DIA, NOME_DIA, capitalizar, chaveAtividade, indiceDia } from '@/game/tipos';
import { cor, MARGEM, tipo } from '@/theme';

/** 02 Briefing do dia */
export default function Briefing() {
  const { estado, avancarDia } = useJogo();
  const plano = planoAtual(estado);
  if (!plano) return <Redirect href="/" />;

  const idx = indiceDia(estado.dia);
  const feito = diaConcluido(estado);

  return (
    <Tela hud={rotuloHud(estado.dia)}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={{ gap: 6 }}>
          <Text style={[tipo.pequenoDestaque, { color: cor.marcaTexto }]}>
            Semana {estado.semana} · Dia {idx + 1} de 5
          </Text>
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
            <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{relogio(INICIO_DIA[estado.dia])}</Text>
          </View>
          <Text style={[tipo.corpo, { color: cor.tinta }]}>
            {feito ? 'Todas as tarefas de hoje foram feitas sem cair em nenhum golpe. Pode encerrar o dia.' : plano.intro}
          </Text>
          <View>
            {plano.atividades.map((a) => {
              const { titulo, detalhe } = descreverTarefa(estado, a);
              const ok = tarefaFeita(estado, a);
              const liberada = tarefaLiberada(estado, a);
              // Cada tarefa abre a sua área; o memorando fica embaixo na pilha para voltar.
              return (
                <Pressable
                  key={chaveAtividade(a)}
                  accessibilityRole="button"
                  accessibilityState={{ checked: ok, disabled: !liberada }}
                  accessibilityHint={
                    !liberada ? 'Tarefa trancada.' : ok ? 'Tarefa feita. Toque para rever.' : 'Toque para começar esta tarefa.'
                  }
                  disabled={!liberada}
                  onPress={() => router.push(rotaDaTarefa(a))}
                  style={({ pressed }) => [
                    estilos.tarefa,
                    pressed && { backgroundColor: cor.pauta },
                    !liberada && { opacity: 0.55 },
                  ]}
                >
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
                    <Text style={[tipo.pequeno, { color: cor.texto2 }]}>
                      {liberada ? detalhe : 'O pedido chega por e-mail: confie nele na caixa de entrada para abrir.'}
                    </Text>
                  </View>
                  {liberada ? (
                    <View style={{ transform: [{ rotate: '180deg' }], opacity: ok ? 0.4 : 1 }}>
                      <IconeVoltar color={cor.tinta} />
                    </View>
                  ) : (
                    <IconeCadeado size={18} color={cor.texto2} />
                  )}
                </Pressable>
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

        {feito ? (
          <Botao
            titulo={`Encerrar ${NOME_DIA[estado.dia]}`}
            onPress={() => {
              avancarDia();
              router.replace('/briefing');
            }}
          />
        ) : (
          <Text style={[tipo.pequeno, { color: cor.linha, textAlign: 'center' }]}>
            Toque numa tarefa do memorando para começar.
          </Text>
        )}
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
    paddingHorizontal: 20,
    marginHorizontal: -20,
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
