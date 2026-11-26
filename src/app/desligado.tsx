import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { Botao, Carimbo, ItemLista, Papel, Tela, voltarAoMemorando } from '@/components/ui';
import { verbete as buscarVerbete } from '@/game/conteudo/verbetes';
import { errosNaSemana, errosPermitidos, relogio, rotuloHud, useJogo } from '@/game/estado';
import { NOME_DIA } from '@/game/tipos';
import { tocar } from '@/sons';
import { cor, MARGEM, tipo } from '@/theme';

/**
 * 06 Desligado. Enquanto a semana ainda tolera erros, a mesma tela vira uma advertência:
 * explica o erro e deixa voltar ao trabalho.
 */
export default function Desligado() {
  const { estado, repetirDia } = useJogo();
  // Guarda a falha ao abrir a tela: "Repetir" limpa o estado antes da navegação terminar.
  const [snap] = useState(() =>
    estado.falha
      ? {
          falha: estado.falha,
          dia: estado.dia,
          minutos: estado.minutos,
          demitido: estado.demitido,
          erros: errosNaSemana(estado),
          permitidos: errosPermitidos(estado),
        }
      : null,
  );
  useEffect(() => {
    if (snap) tocar('erro');
  }, [snap]);
  if (!snap) return <Redirect href="/" />;

  const { falha, dia, minutos, demitido, erros, permitidos } = snap;
  const verbete = falha.verbete ? buscarVerbete(falha.verbete) : null;
  const restantes = permitidos - erros;

  return (
    <Tela hud={rotuloHud(dia)}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 12, paddingHorizontal: MARGEM, paddingTop: 16, paddingBottom: 28 }}>
        <Papel style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Text style={[tipo.pequenoDestaque, { color: cor.texto2, flex: 1 }]}>Comunicado do RH</Text>
            <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{relogio(minutos)}</Text>
          </View>
          <Text style={[tipo.titulo, { color: cor.tinta }]}>
            {demitido ? `Você foi demitido na ${NOME_DIA[dia]}` : `Advertência na ${NOME_DIA[dia]}`}
          </Text>
          <Text style={[tipo.corpo, { color: cor.tinta }]}>{falha.texto}</Text>
          {demitido ? (
            <View style={{ height: 78, alignItems: 'flex-end', justifyContent: 'center' }}>
              <View style={{ transform: [{ rotate: '-6deg' }, { scale: 0.62 }], marginRight: -40 }}>
                <Carimbo tipo="Denunciar" />
              </View>
            </View>
          ) : (
            <View style={estilos.contagem}>
              <Text style={[tipo.pequenoDestaque, { color: cor.carimboVermelho }]}>
                Erros nesta semana: {erros} de {permitidos}
              </Text>
              <Text style={[tipo.pequeno, { color: cor.texto2 }]}>
                {restantes === 0
                  ? 'Não há mais margem: o próximo erro custa o crachá.'
                  : `Você ainda pode errar ${restantes === 1 ? 'mais uma vez' : `mais ${restantes} vezes`}; o erro seguinte custa o crachá.`}
              </Text>
            </View>
          )}
        </Papel>

        <View style={{ gap: 8, paddingTop: 22 }}>
          <Text style={[tipo.subtitulo, { color: cor.marcaTexto }]}>
            {verbete ? 'O que você deixou passar' : 'Por que a mensagem era legítima'}
          </Text>
          {falha.pistas.map((p) => (
            <ItemLista key={p} texto={p} corTexto={cor.formulario} />
          ))}
        </View>

        <View style={{ flexGrow: 1, minHeight: 12 }} />

        {verbete ? (
          <Botao
            titulo={`Ler no manual: ${verbete.chip}`}
            onPress={() => router.push(`/manual?modo=leitura&verbete=${verbete.id}`)}
          />
        ) : null}
        {demitido ? (
          <>
            <Botao
              tipo={verbete ? 'secundario' : 'primario'}
              titulo={`Repetir ${NOME_DIA[dia]}`}
              onPress={() => {
                repetirDia();
                voltarAoMemorando();
              }}
            />
            <Text style={[tipo.pequeno, { color: cor.linha, textAlign: 'center' }]}>
              Ao repetir, o dia volta com outras mensagens e tarefas.
            </Text>
          </>
        ) : (
          <Botao
            tipo={verbete ? 'secundario' : 'primario'}
            titulo="Voltar ao trabalho"
            // Volta para a área de onde o erro veio (caixa, memorando...).
            onPress={() => (router.canGoBack() ? router.back() : voltarAoMemorando())}
          />
        )}
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  contagem: { gap: 2, borderTopWidth: 1, borderTopColor: cor.linha, paddingTop: 12 },
});
