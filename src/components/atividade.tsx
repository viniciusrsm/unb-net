import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { IconeLupa, Radio } from '@/components/Icones';
import { Botao, Papel, PistaLupa, voltarAoMemorando } from '@/components/ui';
import { embaralhar } from '@/game/gerador';
import { proximaTarefa, useJogo } from '@/game/estado';
import type { Opcao } from '@/game/tipos';
import { tocar } from '@/sons';
import { cor, tipo } from '@/theme';

/** Opções em ordem aleatória (fixada enquanto a tela estiver aberta). */
export function useOpcoesEmbaralhadas(opcoes: Opcao[], fixa = false) {
  const [ordem] = useState(() => (fixa ? opcoes : embaralhar(opcoes)));
  return ordem;
}

export function ListaOpcoes({
  opcoes,
  marcada,
  onMarcar,
  onLupa,
  desabilitada,
}: {
  opcoes: Opcao[];
  marcada: string | null;
  onMarcar: (id: string) => void;
  onLupa: () => void;
  desabilitada?: boolean;
}) {
  return (
    <Papel style={{ overflow: 'hidden' }}>
      {opcoes.map((o) => {
        const ativa = o.id === marcada;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="radio"
            accessibilityState={{ checked: ativa, disabled: desabilitada }}
            disabled={desabilitada}
            onPress={() => {
              if (o.id !== marcada) tocar('toque');
              onMarcar(o.id);
            }}
            onLongPress={onLupa}
            delayLongPress={350}
            style={[estilos.opcao, ativa && { backgroundColor: cor.branco, borderLeftWidth: 4, borderLeftColor: cor.tinta }]}
          >
            <Radio marcado={ativa} />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[tipo.corpoDestaque, { color: o.perigo ? cor.carimboVermelho : cor.tinta }]}>{o.titulo}</Text>
              <Text style={[tipo.pequeno, { color: cor.texto2 }]}>{o.detalhe}</Text>
            </View>
          </Pressable>
        );
      })}
    </Papel>
  );
}

export function Lupa({ ativa, pista, onAlternar, dica }: { ativa: boolean; pista: string; onAlternar: () => void; dica: string }) {
  return ativa ? (
    <Pressable onPress={onAlternar}>
      <PistaLupa rotacao={1} texto={pista} />
    </Pressable>
  ) : (
    <Pressable onPress={onAlternar} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <IconeLupa />
      <Text style={[tipo.pequeno, { color: cor.formulario, flex: 1 }]}>{dica}</Text>
    </Pressable>
  );
}

/** Cartão de acerto, com a explicação e o botão para a próxima tarefa. */
export function Acerto({ explicacao }: { explicacao: string }) {
  const { estado } = useJogo();
  const proxima = proximaTarefa(estado);
  return (
    <View style={{ gap: 14 }}>
      <Papel style={{ padding: 18, gap: 8, borderLeftWidth: 4, borderLeftColor: cor.carimboAzul }}>
        <Text style={[tipo.pequenoDestaque, { color: cor.carimboAzul, letterSpacing: 1 }]}>DECISÃO CERTA</Text>
        <Text style={[tipo.corpo, { color: cor.tinta }]}>{explicacao}</Text>
      </Papel>
      {proxima ? (
        <Botao titulo={proxima.rotulo} onPress={() => router.replace(proxima.rota)} />
      ) : (
        <Botao titulo="Voltar ao memorando" onPress={voltarAoMemorando} />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
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
