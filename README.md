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

- `src/app/` — telas (Expo Router): início, briefing, caixa, email/[id], navegador, manual, escolha/[id] (senha, pendrive, backup, incidente), desligado, concluido
- `src/components/` — componentes do Figma (Botão, HUD, Barra de abas, Crachá, Carimbo, Lupa) e ícones
- `src/game/` — conteúdo do jogo e estado (reducer)
- `src/theme.ts` — cores, tipografia e sombra do Figma
- `docs/figma/` — especificação extraída do Figma, capturas e SVGs
