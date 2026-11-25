import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { IconeAlerta, IconeLupa, Radio } from '@/components/Icones';
import { Botao, Papel, PistaLupa, Tela } from '@/components/ui';
import { BACKUPS } from '@/game/conteudo';
import { rotuloHud, useJogo } from '@/game/estado';
import { cor, MARGEM, tipo } from '@/theme';

/** 08 Sexta — incidente e backup */
export default function Incidente() {
  const { estado, despachar } = useJogo();
  const [escolha, setEscolha] = useState<string | null>(null);
  const [lupa, setLupa] = useState(false);
  const selecionado = BACKUPS.find((b) => b.id === escolha);

  const restaurar = () => {
    if (!selecionado) return;
    despachar({ tipo: 'restaurar', backupId: selecionado.id });
    router.replace(selecionado.falha ? '/desligado' : '/concluido');
  };

  return (
    <Tela hud={rotuloHud(estado.dia, estado.minutos)}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 16, paddingBottom: 36 }}>
        <View style={estilos.alerta}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <IconeAlerta size={22} color={cor.branco} />
            <Text style={[tipo.displayM, { color: cor.branco, flex: 1 }]}>Sistema sob ataque</Text>
          </View>
          <Text style={[tipo.corpo, { color: cor.branco }]}>
            Alguém do Financeiro abriu um anexo com ransomware. 312 arquivos já estão bloqueados e o número sobe.
          </Text>
        </View>

        <View style={{ flex: 1, gap: 14, paddingHorizontal: MARGEM }}>
          <Text style={[tipo.corpo, { color: cor.formulario }]}>Escolha de qual cópia restaurar o servidor de arquivos.</Text>

          <Pressable onLongPress={() => setLupa((v) => !v)} delayLongPress={350} accessibilityHint="Toque e segure para usar a lupa">
            <Papel style={{ overflow: 'hidden' }}>
              {BACKUPS.map((b) => {
                const marcado = b.id === escolha;
                return (
                  <Pressable
                    key={b.id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: marcado }}
                    onPress={() => setEscolha(b.id)}
                    onLongPress={() => setLupa((v) => !v)}
                    delayLongPress={350}
                    style={[
                      estilos.opcao,
                      marcado && { backgroundColor: cor.branco, borderLeftWidth: 4, borderLeftColor: cor.tinta, paddingLeft: 16 },
                    ]}
                  >
                    <Radio marcado={marcado} />
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[tipo.corpoDestaque, { color: b.perigo ? cor.carimboVermelho : cor.tinta }]}>{b.quando}</Text>
                      <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{b.detalhe}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </Papel>
          </Pressable>

          {lupa ? (
            <PistaLupa rotacao={1} texto="Restaurar a cópia de hoje traria o ransomware de volta junto com os arquivos." />
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <IconeLupa />
              <Text style={[tipo.pequeno, { color: cor.formulario, flex: 1 }]}>Toque e segure a lista para usar a lupa.</Text>
            </View>
          )}

          <View style={{ flexGrow: 1, minHeight: 16 }} />

          <Botao
            titulo={selecionado ? `Restaurar cópia de ${selecionado.quando.charAt(0).toLowerCase()}${selecionado.quando.slice(1)}` : 'Escolha uma cópia'}
            desabilitado={!selecionado}
            onPress={restaurar}
          />
        </View>
      </ScrollView>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  alerta: { backgroundColor: cor.carimboVermelho, paddingHorizontal: MARGEM, paddingTop: 18, paddingBottom: 20, gap: 8 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: cor.linha,
  },
});
