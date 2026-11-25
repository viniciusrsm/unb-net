# unb-net — Crachá Provisório

Jogo mobile sobre segurança da informação, feito em Expo (SDK 58) a partir do protótipo do Figma.
Você é o estagiário novo da UnB Net e precisa passar a semana sem cair em nenhum golpe.

## Rodar

```bash
npm install
npx expo start        # escaneie o QR code com o Expo Go
npx expo start --web  # ou rode no navegador
```

## Estrutura

- `src/app/` — telas (Expo Router): início, briefing, caixa, email/[id], navegador, manual, escolha/[id], ligacao/[id], triagem/[id], desligado, concluido
- `src/components/` — componentes do Figma (Botão, HUD, Barra de abas, Crachá, Carimbo, Lupa), ícones e peças das atividades
- `src/game/conteudo/` — bancos de conteúdo: e-mails, atividades (escolhas, ligações, triagens, incidentes), compras e verbetes do manual
- `src/game/gerador.ts` — sorteia o plano de cada dia sem repetir nada na semana e preferindo o que o jogador ainda não viu
- `src/game/estado.tsx` — estado do jogo (reducer) e histórico salvo no aparelho
- `src/theme.ts` — cores, tipografia e sombra do Figma
- `docs/figma/` — especificação extraída do Figma, capturas e SVGs

## Como o conteúdo varia

Cada dia é sorteado na hora em que começa: 2 ou 3 e-mails pendentes (sempre ao menos um golpe e um legítimo),
1 ou 2 atividades de tipos diferentes e, na sexta, um incidente. Ao repetir um dia, nada da tentativa anterior
volta; numa nova semana, o sorteio prefere o que ainda não apareceu. Para adicionar conteúdo, basta incluir
itens nos arquivos de `src/game/conteudo/`.
