import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Botao, Papel, Tela } from '@/components/ui';
import { EMAILS, LOJAS } from '@/game/conteudo';
import { emailsResolvidos, relogio, rotuloHud, segundaConcluida, useJogo } from '@/game/estado';
import { cor, MARGEM, tipo } from '@/theme';

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

type Tarefa = { titulo: string; detalhe: string; feita: boolean };

/** 02 Briefing do dia */
export default function Briefing() {
  const { estado, despachar } = useJogo();
  const sexta = estado.dia === 'sex';
  const segundaOk = segundaConcluida(estado);

  const tarefas: Tarefa[] = sexta
    ? [{ titulo: 'Recuperar o servidor de arquivos', detalhe: 'Ataque em andamento', feita: false }]
    : [
        { titulo: 'Ler a caixa de entrada', detalhe: `${EMAILS.length} mensagens`, feita: emailsResolvidos(estado) },
        { titulo: 'Comprar 2 monitores', detalhe: `${LOJAS.length} lojas indicadas`, feita: estado.compra !== null },
      ];

  const memorando = sexta
    ? 'Terça a quinta passaram sem incidentes. Mas agora, no fim da sexta, o Financeiro ligou: os arquivos do servidor estão sumindo. A TI precisa de você.'
    : segundaOk
      ? 'Bom trabalho hoje. Caixa limpa e compra feita sem cair em nenhum golpe. Pode encerrar o dia.'
      : 'Bem-vindo à UnB Net. Hoje você cuida da caixa de entrada do time e de uma compra para o setor de Compras. Na dúvida, não clique: consulte o manual.';

  let acao: { titulo: string; onPress: () => void };
  if (sexta) {
    acao = { titulo: 'Ir para a sala da TI', onPress: () => router.replace('/incidente') };
  } else if (segundaOk) {
    acao = {
      titulo: 'Encerrar segunda-feira',
      onPress: () => {
        despachar({ tipo: 'avancarParaSexta' });
        router.replace('/briefing');
      },
    };
  } else if (emailsResolvidos(estado)) {
    acao = { titulo: 'Abrir o navegador', onPress: () => router.replace('/navegador') };
  } else {
    acao = { titulo: 'Abrir a caixa de entrada', onPress: () => router.replace('/caixa') };
  }

  const indiceDia = sexta ? 4 : 0;

  return (
    <Tela hud={rotuloHud(estado.dia, estado.minutos)}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={{ gap: 6 }}>
          <Text style={[tipo.pequenoDestaque, { color: cor.marcaTexto }]}>Dia {indiceDia + 1} de 5</Text>
          <Text style={[tipo.displayG, { color: cor.formulario }]}>{sexta ? 'Sexta-feira' : 'Segunda-feira'}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 6 }}>
          {DIAS.map((d, i) => {
            const atual = i === indiceDia;
            const passado = i < indiceDia;
            return (
              <View key={d} style={{ flex: 1, gap: 6 }}>
                <View
                  style={[
                    estilos.segmento,
                    atual
                      ? { backgroundColor: cor.marcaTexto }
                      : { backgroundColor: cor.formulario, opacity: passado ? 0.6 : 0.2 },
                  ]}
                />
                <Text style={[tipo.pequeno, { color: atual ? cor.formulario : cor.linha }]}>{d}</Text>
              </View>
            );
          })}
        </View>

        <Papel style={estilos.memo}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Text style={[tipo.pequenoDestaque, { color: cor.texto2, flex: 1 }]}>Memorando do RH</Text>
            <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{relogio(sexta ? estado.minutos : 8 * 60 + 30)}</Text>
          </View>
          <Text style={[tipo.corpo, { color: cor.tinta }]}>{memorando}</Text>
          <View>
            {tarefas.map((t) => (
              <View key={t.titulo} style={estilos.tarefa}>
                <View style={[estilos.check, t.feita && { backgroundColor: cor.tinta }]}>
                  {t.feita ? <Text style={estilos.checkMarca}>✓</Text> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      tipo.corpoDestaque,
                      { color: cor.tinta },
                      t.feita && { textDecorationLine: 'line-through', color: cor.texto2 },
                    ]}
                  >
                    {t.titulo}
                  </Text>
                  <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{t.detalhe}</Text>
                </View>
              </View>
            ))}
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
