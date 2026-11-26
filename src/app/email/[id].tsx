import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconeArquivo, IconeLupa } from '@/components/Icones';
import { Botao, Carimbo, CarimboAnimado, LinkVoltar, MarcaTexto, Papel, PistaLupa, Tela } from '@/components/ui';
import { emailsDoDia, rotuloHud, useJogo, type Decisao } from '@/game/estado';
import { cor, MARGEM, tipo } from '@/theme';

/** 04 E-mail */
export default function EmailTela() {
  const { id, lupa: lupaParam } = useLocalSearchParams<{ id: string; lupa?: string }>();
  const { estado, despachar } = useJogo();
  const [lupa, setLupa] = useState(lupaParam === '1');
  const [carimbando, setCarimbando] = useState<Decisao | null>(null);
  const { bottom } = useSafeAreaInsets();

  const email = emailsDoDia(estado).find((e) => e.id === id);

  useEffect(() => {
    if (email) despachar({ tipo: 'abrirEmail', id: email.id });
  }, [email, despachar]);

  const decisao = email ? estado.decisoes[email.id] : undefined;

  const aoTerminarCarimbo = useCallback(() => {
    if (!email || !carimbando) return;
    const falhou = carimbando === 'confiar' ? !!email.golpe : !email.golpe;
    if (falhou) router.replace('/desligado');
    else if (carimbando === 'confiar' && email.destinoAoConfiar) router.replace(email.destinoAoConfiar);
    else router.back();
  }, [email, carimbando]);

  if (!email) {
    return (
      <Tela hud={rotuloHud(estado.dia)}>
        <View style={{ padding: MARGEM }}>
          <LinkVoltar rotulo="Caixa de entrada" onPress={() => router.back()} />
        </View>
      </Tela>
    );
  }

  const decidir = (d: Decisao) => {
    despachar({ tipo: 'decidirEmail', id: email.id, decisao: d });
    setCarimbando(d);
  };

  const precisaDecidir = !email.jaLido && !decisao && !carimbando;

  const rodape = precisaDecidir ? (
    <View style={[estilos.acoes, { paddingBottom: Math.max(bottom, 28) }]}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Text style={[tipo.pequenoDestaque, { color: cor.formulario, flex: 1 }]}>O que você faz com este e-mail?</Text>
        <Text style={[tipo.pequeno, { color: cor.marcaTexto }]}>1 chance</Text>
      </View>
      <Botao tipo="perigo" titulo={email.acaoDenunciar ?? 'Denunciar como golpe'} onPress={() => decidir('denunciar')} />
      <Botao tipo="secundario" titulo={email.acaoConfiar ?? 'Confiar'} onPress={() => decidir('confiar')} />
    </View>
  ) : null;

  return (
    <Tela hud={rotuloHud(estado.dia)} rodape={rodape}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <LinkVoltar rotulo="Caixa de entrada" onPress={() => router.back()} />

        <Pressable
          onLongPress={() => setLupa((v) => !v)}
          delayLongPress={350}
          accessibilityHint="Toque e segure para usar a lupa"
        >
          <Papel style={estilos.email}>
            <Text style={[tipo.titulo, { color: cor.tinta }]}>{email.assunto}</Text>
            <View style={{ gap: 4 }}>
              <Text style={[tipo.pequenoDestaque, { color: cor.tinta }]}>{email.remetenteCompleto}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{email.usuario}</Text>
                <MarcaTexto destaque={lupa && email.dominioSuspeito} negrito={lupa && email.dominioSuspeito}>
                  {email.dominio}
                </MarcaTexto>
              </View>
            </View>
            <Text style={[tipo.corpo, { color: cor.tinta }]}>{email.corpo}</Text>
            {email.anexo ? (
              <View style={estilos.anexo}>
                <IconeArquivo />
                <Text style={[tipo.pequenoDestaque, { color: cor.tinta, flex: 1 }]}>{email.anexo}</Text>
              </View>
            ) : null}

            {lupa ? (
              <PistaLupa texto={email.pista} />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.8 }}>
                <IconeLupa size={16} color={cor.texto2} />
                <Text style={[tipo.pequeno, { color: cor.texto2 }]}>Toque e segure o e-mail para usar a lupa.</Text>
              </View>
            )}

            {/* O carimbo fica numa faixa própria no fim do papel, para não cobrir o texto nem a lupa. */}
            {decisao && !carimbando ? (
              <View pointerEvents="none" style={estilos.carimboFaixa}>
                <View style={estilos.carimboFixo}>
                  <View style={{ transform: [{ rotate: decisao === 'denunciar' ? '-6deg' : '5deg' }, { scale: 0.62 }] }}>
                    <Carimbo tipo={decisao === 'denunciar' ? 'Denunciar' : 'Confiar'} />
                  </View>
                </View>
              </View>
            ) : null}
          </Papel>
        </Pressable>
      </ScrollView>

      {carimbando ? (
        <CarimboAnimado tipo={carimbando === 'denunciar' ? 'Denunciar' : 'Confiar'} onFim={aoTerminarCarimbo} />
      ) : null}
    </Tela>
  );
}

const estilos = StyleSheet.create({
  conteudo: { gap: 14, paddingHorizontal: MARGEM, paddingTop: 14, paddingBottom: 32 },
  email: { paddingHorizontal: 18, paddingVertical: 16, gap: 12 },
  anexo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: cor.branco,
    borderWidth: 1,
    borderColor: cor.linha,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  acoes: {
    backgroundColor: cor.mesaEscura,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: MARGEM,
    gap: 12,
  },
  // A escala não muda o tamanho de layout: a altura fixa reserva só o espaço visível
  // e a margem negativa compensa a largura "fantasma" do carimbo encolhido.
  carimboFaixa: { marginTop: 4, borderTopWidth: 1, borderTopColor: cor.linha },
  carimboFixo: { height: 72, alignItems: 'flex-end', justifyContent: 'center', marginRight: -40 },
});
