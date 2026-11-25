import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { IconeAlerta, IconeCheck, IconeLupa, IconeX } from '@/components/Icones';
import { Botao, MarcaTexto, PistaLupa, Tela } from '@/components/ui';
import { LOJAS } from '@/game/conteudo';
import { rotuloHud, segundaConcluida, useJogo } from '@/game/estado';
import { cor, MARGEM, sombra, tipo } from '@/theme';

/** 05 Navegador */
export default function Navegador() {
  const { estado, despachar } = useJogo();
  const [lojaId, setLojaId] = useState(LOJAS[0].id);
  const [lupa, setLupa] = useState(false);
  const loja = LOJAS.find((l) => l.id === lojaId) ?? LOJAS[0];
  const comprada = estado.compra ? LOJAS.find((l) => l.id === estado.compra) : null;

  const trocarLoja = (id: string) => {
    setLojaId(id);
    setLupa(false);
  };

  const comprar = () => {
    despachar({ tipo: 'comprar', lojaId: loja.id });
    if (loja.falha) router.replace('/desligado');
  };

  return (
    <Tela hud={rotuloHud(estado.dia, estado.minutos)} aba="navegador">
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.pedido}>
          <Text style={[tipo.pequenoDestaque, { color: cor.marcaTexto }]}>Pedido de Marina Costa, Compras</Text>
          <Text style={[tipo.pequeno, { color: cor.formulario }]}>2 monitores de 27 polegadas, até R$ 6.000 no total.</Text>
        </View>

        {comprada ? (
          <View style={[estilos.pagina, { padding: 20, gap: 12 }]}>
            <Text style={[tipo.titulo, { color: cor.tinta }]}>Compra aprovada</Text>
            <Text style={[tipo.corpo, { color: cor.tinta }]}>
              2 monitores na {comprada.nome}, pagos com o cartão corporativo. A Marina já recebeu o comprovante.
            </Text>
            {segundaConcluida(estado) ? (
              <Botao tipo="escuro" titulo="Voltar ao memorando" onPress={() => router.replace('/briefing')} />
            ) : (
              <Botao tipo="escuro" titulo="Voltar à caixa de entrada" onPress={() => router.replace('/caixa')} />
            )}
          </View>
        ) : (
          <>
            <View style={estilos.seletor} accessibilityRole="tablist">
              {LOJAS.map((l) => {
                const ativa = l.id === loja.id;
                return (
                  <Pressable
                    key={l.id}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: ativa }}
                    onPress={() => trocarLoja(l.id)}
                    style={[estilos.seletorItem, ativa && { backgroundColor: cor.formulario }]}
                  >
                    <Text style={[tipo.pequenoDestaque, { color: ativa ? cor.tinta : cor.formulario }]}>{l.rotulo}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onLongPress={() => setLupa((v) => !v)} delayLongPress={350} accessibilityHint="Toque e segure para usar a lupa">
              <View style={estilos.pagina}>
                <View style={estilos.url}>
                  {lupa && loja.dominioSuspeito ? <IconeAlerta /> : null}
                  <MarcaTexto destaque={lupa && loja.dominioSuspeito}>{loja.dominio}</MarcaTexto>
                </View>
                <View style={estilos.cabecalho}>
                  <Text style={[tipo.hudMarca, { color: cor.branco, flex: 1 }]}>{loja.nome}</Text>
                  {loja.contador ? (
                    <Text style={[tipo.pequenoDestaque, { color: cor.marcaTexto }]}>{loja.contador}</Text>
                  ) : null}
                </View>

                <View style={{ padding: 16, gap: 10 }}>
                  <Monitor />
                  <Text style={[tipo.subtitulo, { color: cor.tinta }]}>{loja.produto}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
                    {loja.precoAntigo ? (
                      <Text style={[tipo.pequeno, { color: cor.texto2, textDecorationLine: 'line-through' }]}>
                        {loja.precoAntigo}
                      </Text>
                    ) : null}
                    <Text style={[tipo.displayM, { color: loja.desconto ? cor.carimboVermelho : cor.tinta }]}>{loja.preco}</Text>
                    {loja.desconto ? (
                      <Text style={[tipo.pequenoDestaque, { color: cor.carimboVermelho }]}>{loja.desconto}</Text>
                    ) : (
                      <Text style={[tipo.pequeno, { color: cor.texto2 }]}>cada</Text>
                    )}
                  </View>

                  <View style={{ gap: 6 }}>
                    {loja.sinais.map((s) => (
                      <View key={s.texto} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {lupa ? (s.ok ? <IconeCheck /> : <IconeX />) : <View style={estilos.bolinha} />}
                        {lupa && !s.ok ? (
                          <MarcaTexto negrito={false}>{s.texto}</MarcaTexto>
                        ) : (
                          <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{s.texto}</Text>
                        )}
                      </View>
                    ))}
                  </View>

                  {lupa ? (
                    <PistaLupa texto={loja.pista} rotacao={1} />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.8 }}>
                      <IconeLupa size={16} color={cor.texto2} />
                      <Text style={[tipo.pequeno, { color: cor.texto2 }]}>Toque e segure a página para usar a lupa.</Text>
                    </View>
                  )}

                  <Botao tipo="escuro" titulo="Comprar 2 unidades" onPress={comprar} />
                </View>
              </View>
            </Pressable>
          </>
        )}
      </ScrollView>
    </Tela>
  );
}

function Monitor() {
  return (
    <View style={estilos.monitorFundo}>
      <View style={estilos.monitorTela} />
      <View style={{ width: 14, height: 16, backgroundColor: cor.tinta }} />
      <View style={{ width: 64, height: 6, borderRadius: 3, backgroundColor: cor.tinta }} />
    </View>
  );
}

const estilos = StyleSheet.create({
  conteudo: { gap: 12, paddingHorizontal: MARGEM, paddingVertical: 16 },
  pedido: { backgroundColor: cor.mesaEscura, borderRadius: 4, paddingTop: 10, paddingBottom: 12, paddingHorizontal: 14, gap: 2 },
  seletor: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 4, backgroundColor: cor.mesaEscura },
  seletorItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 3 },
  pagina: { backgroundColor: cor.branco, borderRadius: 6, overflow: 'hidden', ...sombra },
  url: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: cor.pauta, paddingHorizontal: 12, paddingVertical: 10 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: cor.tinta, paddingHorizontal: 14, paddingVertical: 10 },
  monitorFundo: { backgroundColor: cor.formulario, borderRadius: 4, alignItems: 'center', paddingTop: 16, paddingBottom: 12 },
  monitorTela: { width: 150, height: 88, backgroundColor: cor.mesa, borderWidth: 4, borderColor: cor.tinta, borderRadius: 3 },
  bolinha: { width: 6, height: 6, borderRadius: 3, backgroundColor: cor.linha, marginHorizontal: 4 },
});
