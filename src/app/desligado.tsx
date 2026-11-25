import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { Botao, Carimbo, ItemLista, Papel, Tela } from '@/components/ui';
import { FALHAS, NOME_DIA, VERBETES } from '@/game/conteudo';
import { rotuloHud, useJogo } from '@/game/estado';
import { cor, MARGEM, tipo } from '@/theme';

/** 06 Desligado */
export default function Desligado() {
  const { estado, despachar } = useJogo();
  // Guarda a falha ao abrir a tela: "Repetir" limpa o estado antes da navegação terminar.
  const [falhaId] = useState(estado.falha);
  if (!falhaId) return <Redirect href="/" />;

  const falha = FALHAS[falhaId];
  const verbete = VERBETES.find((v) => v.id === falha.verbete);
  const [h, m] = falha.hora.split(':').map(Number);

  return (
    <Tela hud={rotuloHud(falha.dia, h * 60 + m)}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 12, paddingHorizontal: MARGEM, paddingTop: 16, paddingBottom: 28 }}>
        <Papel style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Text style={[tipo.pequenoDestaque, { color: cor.texto2, flex: 1 }]}>Comunicado do RH</Text>
            <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{falha.hora}</Text>
          </View>
          <Text style={[tipo.titulo, { color: cor.tinta }]}>Você foi demitido na {NOME_DIA[falha.dia]}</Text>
          <Text style={[tipo.corpo, { color: cor.tinta }]}>{falha.texto}</Text>
          <View style={{ height: 78, alignItems: 'flex-end', justifyContent: 'center' }}>
            <View style={{ transform: [{ rotate: '-6deg' }, { scale: 0.62 }], marginRight: -40 }}>
              <Carimbo tipo="Denunciar" />
            </View>
          </View>
        </Papel>

        <View style={{ gap: 8, paddingTop: 22 }}>
          <Text style={[tipo.subtitulo, { color: cor.marcaTexto }]}>O que você deixou passar</Text>
          {falha.pistas.map((p) => (
            <ItemLista key={p} texto={p} corTexto={cor.formulario} />
          ))}
        </View>

        <View style={{ flexGrow: 1, minHeight: 12 }} />

        <Botao
          titulo={`Ler no manual: ${verbete?.chip ?? 'Phishing'}`}
          onPress={() => router.push(`/manual?modo=leitura&verbete=${falha.verbete}`)}
        />
        <Botao
          tipo="secundario"
          titulo={`Repetir ${NOME_DIA[falha.dia]}`}
          onPress={() => {
            despachar({ tipo: 'repetirDia' });
            router.replace('/briefing');
          }}
        />
      </ScrollView>
    </Tela>
  );
}
