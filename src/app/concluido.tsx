import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { Botao, Cracha, Tela } from '@/components/ui';
import { errosNaSemana, useJogo } from '@/game/estado';
import { NOME_DIFICULDADE } from '@/game/tipos';
import { cor, tipo } from '@/theme';

/** 09 Semana concluída */
export default function Concluido() {
  const { estado, iniciarSemana } = useJogo();
  if (!estado.concluido) return <Redirect href="/" />;

  const erros = errosNaSemana(estado);
  const stats = [
    { valor: estado.totalDecisoes, rotulo: 'decisões' },
    { valor: estado.verbetesLidos.length, rotulo: 'verbetes lidos' },
    { valor: erros, rotulo: erros === 1 ? 'erro' : 'erros' },
  ];

  return (
    <Tela>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={{ alignItems: 'center', paddingVertical: 8 }}>
          <Cracha furos={5} escala={0.88} rotacao={-2} titulo={['Crachá', 'Definitivo']} />
        </View>

        <View style={{ flexGrow: 1, minHeight: 24 }} />

        <View style={{ gap: 12 }}>
          <Text style={[tipo.displayG, { color: cor.formulario }]}>Semana{'\n'}concluída.{erros === 0 ? '\nNenhum erro.' : ''}</Text>
          <Text style={[tipo.corpo, { color: cor.formulario }]}>
            O RH trocou seu crachá provisório pelo definitivo. Você terminou a semana {estado.semana} no nível{' '}
            {NOME_DIFICULDADE[estado.dificuldade].toLowerCase()}
            {erros === 0 ? ' com o sistema da UnB Net inteiro' : `, com ${erros} advertência${erros > 1 ? 's' : ''}`}. Na
            próxima semana, os golpes serão outros.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {stats.map((s) => (
              <View key={s.rotulo} style={estilos.stat}>
                <Text style={[tipo.displayM, { color: cor.marcaTexto }]}>{s.valor}</Text>
                <Text style={[tipo.pequeno, { color: cor.formulario }]}>{s.rotulo}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 12, marginTop: 24 }}>
          <Botao titulo="Ver o manual completo" onPress={() => router.push('/manual?modo=leitura')} />
          <Botao
            tipo="secundario"
            titulo="Começar uma nova semana"
            onPress={() => {
              iniciarSemana();
              router.replace('/briefing');
            }}
          />
        </View>
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  conteudo: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  stat: { flex: 1, borderWidth: 1, borderColor: cor.linha, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 10 },
});
