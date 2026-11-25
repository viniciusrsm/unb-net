import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Botao, Cracha, Tela } from '@/components/ui';
import { useJogo } from '@/game/estado';
import { cor, tipo } from '@/theme';

/** 01 Início */
export default function Inicio() {
  const { iniciarSemana } = useJogo();

  return (
    <Tela>
      {/* Faixas de fundo, 4% de opacidade */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {Array.from({ length: 12 }, (_, i) => (
          <View key={i} style={[estilos.faixa, { top: i * 94 }]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={estilos.conteudo} bounces={false}>
        <View style={{ alignItems: 'center' }}>
          <View style={estilos.cordao} />
          <View style={estilos.presilha} />
          <Cracha />
        </View>

        <View style={{ flexGrow: 1, minHeight: 28 }} />

        <View style={{ gap: 12 }}>
          <Text style={[tipo.displayG, { color: cor.formulario }]}>Bem-vindo a{'\n'}UnB Net</Text>
          <Text style={[tipo.corpo, { color: cor.formulario }]}>
            Você é o estagiário novo da empresa UnB Net. Se alguém invadir o sistema por sua causa, o crachá volta para o
            RH antes de sexta.
          </Text>
        </View>

        <View style={{ gap: 12, marginTop: 28 }}>
          <Botao
            titulo="Começar segunda-feira"
            onPress={() => {
              iniciarSemana();
              router.replace('/briefing');
            }}
          />
          <Botao tipo="secundario" titulo="Abrir o manual" onPress={() => router.push('/manual?modo=leitura')} />
        </View>
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  faixa: { position: 'absolute', left: 0, right: 0, height: 47, backgroundColor: cor.formulario, opacity: 0.04 },
  conteudo: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  cordao: { width: 18, height: 64, backgroundColor: cor.carimboAzul },
  presilha: { width: 30, height: 14, borderRadius: 3, backgroundColor: cor.linha, marginBottom: -4, zIndex: 1 },
});
