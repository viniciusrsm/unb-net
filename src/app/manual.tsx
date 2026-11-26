import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { IconeCadeado } from '@/components/Icones';
import { ItemLista, LinkVoltar, Papel, Tela, voltarAoMemorando } from '@/components/ui';
import { VERBETES } from '@/game/conteudo/verbetes';
import { rotuloHud, temasLiberados, useJogo } from '@/game/estado';
import { NOME_DIA, type VerbeteId } from '@/game/tipos';
import { cor, MARGEM, tipo } from '@/theme';

/** 07 Manual */
export default function Manual() {
  const { verbete: inicial, modo } = useLocalSearchParams<{ verbete?: VerbeteId; modo?: 'leitura' }>();
  const { estado, despachar } = useJogo();
  const leitura = modo === 'leitura' || !estado.iniciado;

  // Durante a semana, cada verbete libera quando o tema aparece num dia.
  // Fora do jogo (início, fim, derrota) o manual fica todo aberto para consulta.
  const liberados = temasLiberados(estado);
  const liberado = (id: VerbeteId) => leitura || liberados.has(id);

  const [atual, setAtual] = useState<VerbeteId>(inicial && liberado(inicial) ? inicial : 'phishing');
  const verbete = VERBETES.find((v) => v.id === atual) ?? VERBETES[0];

  useEffect(() => {
    despachar({ tipo: 'lerVerbete', id: atual });
  }, [atual, despachar]);

  return (
    <Tela hud={rotuloHud(estado.dia)} aba={leitura ? undefined : 'manual'}>
      <ScrollView contentContainerStyle={{ paddingVertical: 16, gap: 14, flexGrow: 1 }}>
        <View style={{ paddingHorizontal: MARGEM }}>
          {leitura ? (
            <LinkVoltar rotulo="Voltar" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
          ) : (
            <LinkVoltar rotulo="Memorando" onPress={voltarAoMemorando} />
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.chips}>
          {VERBETES.map((v) => {
            const ativo = v.id === atual;
            const aberto = liberado(v.id);
            return (
              // Verbetes bloqueados mostram o cadeado: liberam quando o tema aparecer na semana.
              <Pressable
                key={v.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: ativo, disabled: !aberto }}
                disabled={!aberto}
                onPress={() => setAtual(v.id)}
                style={[estilos.chip, ativo ? { backgroundColor: cor.marcaTexto, borderColor: cor.marcaTexto } : null]}
              >
                {!aberto ? <IconeCadeado /> : null}
                <Text style={[tipo.pequenoDestaque, { color: ativo ? cor.tinta : aberto ? cor.formulario : cor.linha }]}>
                  {v.chip}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: MARGEM, gap: 14, flex: 1 }}>
          <View style={{ gap: 2 }}>
            <Text style={[tipo.pequeno, { color: cor.linha }]}>
              {!leitura && liberados.get(verbete.id)
                ? `Verbete liberado na ${NOME_DIA[liberados.get(verbete.id)!]}`
                : 'Verbete do manual de segurança'}
            </Text>
            <Text style={[tipo.displayG, { color: cor.formulario }]}>{verbete.titulo}</Text>
          </View>

          <Papel style={estilos.cartao}>
            <Text style={[tipo.corpo, { color: cor.tinta }]}>{verbete.definicao}</Text>
            <Text style={[tipo.subtitulo, { color: cor.tinta }]}>Como reconhecer</Text>
            {verbete.reconhecer.map((t) => (
              <ItemLista key={t} texto={t} />
            ))}
            <Text style={[tipo.subtitulo, { color: cor.tinta }]}>O que fazer</Text>
            <Text style={[tipo.corpo, { color: cor.tinta }]}>{verbete.fazer}</Text>
          </Papel>
        </View>
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  chips: { gap: 8, paddingHorizontal: MARGEM },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: cor.linha,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  cartao: { flex: 1, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 20, gap: 12 },
});
