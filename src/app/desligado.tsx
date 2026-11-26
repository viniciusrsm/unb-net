import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { Botao, Carimbo, ItemLista, Papel, Tela, voltarAoMemorando } from '@/components/ui';
import { verbete as buscarVerbete } from '@/game/conteudo/verbetes';
import { relogio, rotuloHud, useJogo } from '@/game/estado';
import { NOME_DIA } from '@/game/tipos';
import { cor, MARGEM, tipo } from '@/theme';

/** 06 Desligado */
export default function Desligado() {
  const { estado, repetirDia } = useJogo();
  // Guarda a falha ao abrir a tela: "Repetir" limpa o estado antes da navegação terminar.
  const [snap] = useState(() => (estado.falha ? { falha: estado.falha, dia: estado.dia, minutos: estado.minutos } : null));
  if (!snap) return <Redirect href="/" />;

  const { falha, dia, minutos } = snap;
  const verbete = buscarVerbete(falha.verbete);

  return (
    <Tela hud={rotuloHud(dia)}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 12, paddingHorizontal: MARGEM, paddingTop: 16, paddingBottom: 28 }}>
        <Papel style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Text style={[tipo.pequenoDestaque, { color: cor.texto2, flex: 1 }]}>Comunicado do RH</Text>
            <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{relogio(minutos)}</Text>
          </View>
          <Text style={[tipo.titulo, { color: cor.tinta }]}>Você foi demitido na {NOME_DIA[dia]}</Text>
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
          titulo={`Ler no manual: ${verbete.chip}`}
          onPress={() => router.push(`/manual?modo=leitura&verbete=${falha.verbete}`)}
        />
        <Botao
          tipo="secundario"
          titulo={`Repetir ${NOME_DIA[dia]}`}
          onPress={() => {
            repetirDia();
            voltarAoMemorando();
          }}
        />
        <Text style={[tipo.pequeno, { color: cor.linha, textAlign: 'center' }]}>
          Ao repetir, o dia volta com outras mensagens e tarefas.
        </Text>
      </ScrollView>
    </Tela>
  );
}
