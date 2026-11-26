import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { IconeAlerta, IconeCheck, IconeLupa, IconeNavegador, IconeX } from '@/components/Icones';
import { Botao, LinkVoltar, MarcaTexto, PistaLupa, Tela, voltarAoMemorando } from '@/components/ui';
import { planoAtual, proximaTarefa, rotuloHud, useJogo } from '@/game/estado';
import type { Compra, Ilustracao } from '@/game/tipos';
import { tocar } from '@/sons';
import { cor, MARGEM, sombra, tipo } from '@/theme';

/** 05 Navegador */
export default function Navegador() {
  const { estado } = useJogo();
  const atividade = planoAtual(estado)?.atividades.find((a) => a.tipo === 'compra');
  const compra = atividade?.tipo === 'compra' ? atividade.compra : null;

  return (
    <Tela hud={rotuloHud(estado.dia)} aba="navegador">
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <LinkVoltar rotulo="Memorando" onPress={voltarAoMemorando} />
        {compra ? (
          <Loja compra={compra} />
        ) : (
          <View style={[estilos.pagina, { padding: 24, gap: 12, alignItems: 'center' }]}>
            <IconeNavegador size={40} color={cor.linha} />
            <Text style={[tipo.subtitulo, { color: cor.tinta, textAlign: 'center' }]}>Nenhuma página aberta</Text>
            <Text style={[tipo.pequeno, { color: cor.texto2, textAlign: 'center' }]}>
              Hoje ninguém pediu compras. O navegador fica fechado: menos abas abertas, menos chances de cair em golpe.
            </Text>
          </View>
        )}
      </ScrollView>
    </Tela>
  );
}

function Loja({ compra }: { compra: Compra }) {
  const { estado, despachar } = useJogo();
  const [lojaId, setLojaId] = useState(compra.lojas[0].id);
  const [lupa, setLupa] = useState(false);
  const chave = `compra:${compra.id}`;
  const loja = compra.lojas.find((l) => l.id === lojaId) ?? compra.lojas[0];
  const compradaId = estado.lojasCompradas[chave];
  const comprada = compradaId ? compra.lojas.find((l) => l.id === compradaId) : null;
  const proxima = proximaTarefa(estado);

  const comprar = () => {
    if (loja.falha) {
      despachar({ tipo: 'falhar', falha: loja.falha });
      router.replace('/desligado');
    } else {
      tocar('acerto');
      despachar({ tipo: 'concluirAtividade', chave, loja: loja.id, minutos: 3 });
    }
  };

  return (
    <>
      <View style={estilos.pedido}>
        <Text style={[tipo.pequenoDestaque, { color: cor.marcaTexto }]}>
          Pedido de {compra.solicitante}, {compra.setor}
        </Text>
        <Text style={[tipo.pequeno, { color: cor.formulario }]}>
          {compra.quantidade} × {compra.produto.toLowerCase()}, até {compra.limite} no total.
        </Text>
      </View>

      {comprada ? (
        <View style={[estilos.pagina, { padding: 20, gap: 12 }]}>
          <Text style={[tipo.titulo, { color: cor.tinta }]}>Compra aprovada</Text>
          <Text style={[tipo.corpo, { color: cor.tinta }]}>
            {compra.quantidade} itens na {comprada.nome}, pagos com o cartão corporativo e dentro do limite. {compra.solicitante}{' '}
            já recebeu o comprovante.
          </Text>
          <Botao
            tipo="escuro"
            titulo={proxima ? proxima.rotulo : 'Voltar ao memorando'}
            onPress={() => (proxima ? router.replace(proxima.rota) : voltarAoMemorando())}
          />
        </View>
      ) : (
        <>
          <View style={estilos.seletor} accessibilityRole="tablist">
            {compra.lojas.map((l) => {
              const ativa = l.id === loja.id;
              return (
                <Pressable
                  key={l.id}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: ativa }}
                  onPress={() => {
                    setLojaId(l.id);
                    setLupa(false);
                  }}
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
                {loja.contador ? <Text style={[tipo.pequenoDestaque, { color: cor.marcaTexto }]}>{loja.contador}</Text> : null}
              </View>

              <View style={{ padding: 16, gap: 10 }}>
                <Produto tipo={compra.ilustracao} />
                <Text style={[tipo.subtitulo, { color: cor.tinta }]}>{compra.produto}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  {loja.precoAntigo ? (
                    <Text style={[tipo.pequeno, { color: cor.texto2, textDecorationLine: 'line-through' }]}>{loja.precoAntigo}</Text>
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
                      {lupa ? s.ok ? <IconeCheck /> : <IconeX /> : <View style={estilos.bolinha} />}
                      {lupa && !s.ok ? (
                        <MarcaTexto negrito={false}>{s.texto}</MarcaTexto>
                      ) : (
                        <Text style={[tipo.pequeno, { color: cor.texto2, flexShrink: 1 }]}>{s.texto}</Text>
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

                <Botao tipo="escuro" titulo={`Comprar ${compra.quantidade} unidades`} onPress={comprar} />
              </View>
            </View>
          </Pressable>
        </>
      )}
    </>
  );
}

/** Ilustração simples do produto, feita com formas (como o monitor do Figma). */
function Produto({ tipo: t }: { tipo: Ilustracao }) {
  const escuro = cor.tinta;
  let desenho: React.ReactNode;
  switch (t) {
    case 'monitor':
      desenho = (
        <>
          <View style={{ width: 150, height: 88, backgroundColor: cor.mesa, borderWidth: 4, borderColor: escuro, borderRadius: 3 }} />
          <View style={{ width: 14, height: 16, backgroundColor: escuro }} />
          <View style={{ width: 64, height: 6, borderRadius: 3, backgroundColor: escuro }} />
        </>
      );
      break;
    case 'notebook':
      desenho = (
        <>
          <View style={{ width: 130, height: 82, backgroundColor: cor.mesa, borderWidth: 4, borderColor: escuro, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
          <View style={{ width: 166, height: 10, backgroundColor: escuro, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }} />
        </>
      );
      break;
    case 'headset':
      desenho = (
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 110, height: 60, borderWidth: 8, borderColor: escuro, borderBottomWidth: 0, borderTopLeftRadius: 55, borderTopRightRadius: 55 }} />
          <View style={{ flexDirection: 'row', gap: 70, marginTop: -6 }}>
            <View style={{ width: 26, height: 40, borderRadius: 8, backgroundColor: cor.mesa, borderWidth: 4, borderColor: escuro }} />
            <View style={{ width: 26, height: 40, borderRadius: 8, backgroundColor: cor.mesa, borderWidth: 4, borderColor: escuro }} />
          </View>
        </View>
      );
      break;
    case 'webcam':
      desenho = (
        <>
          <View style={{ width: 90, height: 50, borderRadius: 25, backgroundColor: escuro, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: cor.mesa, borderWidth: 4, borderColor: cor.linha }} />
          </View>
          <View style={{ width: 10, height: 26, backgroundColor: escuro }} />
          <View style={{ width: 50, height: 6, borderRadius: 3, backgroundColor: escuro }} />
        </>
      );
      break;
    case 'cadeira':
      desenho = (
        <>
          <View style={{ width: 70, height: 60, borderRadius: 10, backgroundColor: cor.mesa, borderWidth: 4, borderColor: escuro }} />
          <View style={{ width: 90, height: 14, borderRadius: 6, backgroundColor: escuro, marginTop: 4 }} />
          <View style={{ width: 8, height: 22, backgroundColor: escuro }} />
          <View style={{ width: 80, height: 6, borderRadius: 3, backgroundColor: escuro }} />
        </>
      );
      break;
    case 'teclado':
      desenho = (
        <View style={{ width: 170, height: 60, borderRadius: 6, backgroundColor: escuro, padding: 8, gap: 5 }}>
          {[0, 1, 2].map((l) => (
            <View key={l} style={{ flexDirection: 'row', gap: 5 }}>
              {Array.from({ length: 10 }, (_, k) => (
                <View key={k} style={{ flex: 1, height: 9, borderRadius: 2, backgroundColor: cor.mesa }} />
              ))}
            </View>
          ))}
        </View>
      );
      break;
  }
  return <View style={estilos.produtoFundo}>{desenho}</View>;
}

const estilos = StyleSheet.create({
  conteudo: { gap: 12, paddingHorizontal: MARGEM, paddingVertical: 16 },
  pedido: { backgroundColor: cor.mesaEscura, borderRadius: 4, paddingTop: 10, paddingBottom: 12, paddingHorizontal: 14, gap: 2 },
  seletor: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 4, backgroundColor: cor.mesaEscura },
  seletorItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 3 },
  pagina: { backgroundColor: cor.branco, borderRadius: 6, overflow: 'hidden', ...sombra },
  url: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: cor.pauta, paddingHorizontal: 12, paddingVertical: 10 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: cor.tinta, paddingHorizontal: 14, paddingVertical: 10 },
  produtoFundo: {
    backgroundColor: cor.formulario,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    minHeight: 138,
  },
  bolinha: { width: 6, height: 6, borderRadius: 3, backgroundColor: cor.linha, marginHorizontal: 4 },
});
