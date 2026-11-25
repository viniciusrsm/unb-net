import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { IconeLupa } from '@/components/Icones';
import { Botao, Papel, Tela } from '@/components/ui';
import { emailsDoDia, emailsResolvidos, naoLidos, proximaTarefa, rotuloHud, useJogo, type Decisao } from '@/game/estado';
import type { Email } from '@/game/tipos';
import { cor, MARGEM, tipo } from '@/theme';

/** 03 Caixa de entrada */
export default function Caixa() {
  const { estado } = useJogo();
  const pendentes = naoLidos(estado);
  const proxima = proximaTarefa(estado);

  // Não lidos primeiro (mais recentes em cima), depois os já lidos — o gerador já entrega nessa ordem.
  const lista = emailsDoDia(estado);

  const abrir = (email: Email, lupa = false) =>
    router.push({ pathname: '/email/[id]', params: lupa ? { id: email.id, lupa: '1' } : { id: email.id } });

  return (
    <Tela hud={rotuloHud(estado.dia, estado.minutos)} aba="caixa">
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text style={[tipo.displayM, { color: cor.formulario, flex: 1 }]}>Caixa de entrada</Text>
          <Text style={[tipo.pequenoDestaque, { color: cor.marcaTexto }]}>
            {pendentes > 0 ? `${pendentes} não lida${pendentes > 1 ? 's' : ''}` : 'tudo lido'}
          </Text>
        </View>

        {lista.length === 0 ? (
          <Text style={[tipo.corpo, { color: cor.linha }]}>Nenhuma mensagem nova hoje.</Text>
        ) : null}

        <Papel style={{ overflow: 'hidden' }}>
          {lista.map((email) => (
            <LinhaDeEmail
              key={email.id}
              email={email}
              lido={!!email.jaLido || estado.emailsAbertos.includes(email.id)}
              decisao={estado.decisoes[email.id]}
              onPress={() => abrir(email)}
              onLongPress={() => abrir(email, true)}
            />
          ))}
        </Papel>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <IconeLupa />
          <Text style={[tipo.pequeno, { color: cor.formulario, flex: 1 }]}>
            Toque e segure qualquer e-mail para usar a lupa.
          </Text>
        </View>

        {emailsResolvidos(estado) && lista.length > 0 ? (
          <View style={{ gap: 12, marginTop: 8 }}>
            <Text style={[tipo.pequenoDestaque, { color: cor.marcaTexto }]}>
              {proxima ? 'Caixa resolvida. Ainda falta uma tarefa hoje.' : 'Todas as tarefas de hoje estão feitas.'}
            </Text>
            {proxima ? (
              <Botao titulo={proxima.rotulo} onPress={() => router.replace(proxima.rota)} />
            ) : (
              <Botao titulo="Voltar ao memorando" onPress={() => router.replace('/briefing')} />
            )}
          </View>
        ) : null}
      </ScrollView>
    </Tela>
  );
}

function LinhaDeEmail({
  email,
  lido,
  decisao,
  onPress,
  onLongPress,
}: {
  email: Email;
  lido: boolean;
  decisao?: Decisao;
  onPress: () => void;
  onLongPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Toque e segure para usar a lupa"
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      style={({ pressed }) => [
        estilos.linha,
        { backgroundColor: lido ? cor.pauta : cor.formulario },
        pressed && { backgroundColor: cor.branco, borderLeftWidth: 4, borderLeftColor: cor.tinta },
      ]}
    >
      <View style={[estilos.marcador, !lido && { backgroundColor: cor.carimboAzul }]} />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={[tipo.pequenoDestaque, { color: cor.tinta, flex: 1 }]}>{email.remetente}</Text>
          <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{email.hora}</Text>
        </View>
        <Text style={[lido ? tipo.pequeno : tipo.pequenoDestaque, { color: lido ? cor.texto2 : cor.tinta }]}>
          {email.assunto}
        </Text>
        {decisao ? (
          <Text
            style={[
              tipo.pequenoDestaque,
              estilos.selo,
              {
                color: decisao === 'denunciar' ? cor.carimboVermelho : cor.carimboAzul,
                borderColor: decisao === 'denunciar' ? cor.carimboVermelho : cor.carimboAzul,
              },
            ]}
          >
            {decisao === 'denunciar' ? 'DENUNCIADO' : 'CONFIADO'}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  conteudo: { gap: 16, padding: MARGEM },
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cor.linha,
  },
  marcador: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  selo: {
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1.5,
    borderRadius: 3,
    paddingHorizontal: 6,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1,
  },
});
