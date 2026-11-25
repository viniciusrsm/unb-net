# Crachá Provisório — especificação extraída do Figma

Fonte: arquivo Figma `s5D3m0HMd2f2tInBHUAR0n`, página **Crachá Provisório**. Extraído em 2026-11-24.

- Capturas de cada tela: [telas/](telas/)
- Ícones e ilustrações (SVG): [assets/](assets/)

> **Protótipo:** o arquivo **não tem nenhuma conexão de protótipo** (0 interações, 0 flows).
> O fluxo abaixo foi deduzido dos textos dos botões e precisa ser confirmado.

---

## 1. Tokens

### Cores (coleção de variáveis "Cores", modo "Padrão")

| Variável | Hex | Uso |
|---|---|---|
| `cor/tinta` | `#1C2B3A` | Texto principal sobre papel, botão escuro |
| `cor/mesa` | `#2E4A52` | Fundo das telas |
| `cor/mesa-escura` | `#223840` | HUD, barra de abas, painéis escuros |
| `cor/formulario` | `#EEF3EA` | "Papel": cartões, texto claro sobre fundo escuro |
| `cor/pauta` | `#DDE9D8` | E-mail lido, barra de URL, foto do crachá |
| `cor/linha` | `#A9BCB0` | Divisórias, bordas, texto apagado |
| `cor/texto-2` | `#55676E` | Texto secundário sobre papel |
| `cor/carimbo-azul` | `#2346C8` | Carimbo "Confiar", cordão, marcador de não lido |
| `cor/carimbo-vermelho` | `#C7303A` | Carimbo "Denunciar", botão Perigo, alertas |
| `cor/marca-texto` | `#F4DB3B` | Destaque amarelo: botão primário, pistas, indicador ativo |
| `cor/branco` | `#FFFFFF` | Página da loja, item selecionado, anexo |

### Tipografia (estilos de texto)

Fontes: **Big Shoulders Display** (títulos) e **IBM Plex Sans** (texto), ambas no Google Fonts.

| Estilo | Fonte | Peso | Tamanho | Altura de linha | Espaçamento |
|---|---|---|---|---|---|
| Display/Mega | Big Shoulders Display | 900 Black | 84 | 90% | 0 |
| Display/G | Big Shoulders Display | 900 Black | 50 | 95% | 0 |
| Display/M | Big Shoulders Display | 700 Bold | 32 | 100% | 1% |
| Carimbo | Big Shoulders Display | 900 Black | 44 | 100% | 8% |
| Título | IBM Plex Sans | 600 SemiBold | 22 | 130% | 0 |
| Subtítulo | IBM Plex Sans | 600 SemiBold | 16 | 140% | 0 |
| Corpo | IBM Plex Sans | 400 Regular | 16 | 155% | 0 |
| Corpo/Destaque | IBM Plex Sans | 500 Medium | 16 | 155% | 0 |
| Pequeno | IBM Plex Sans | 400 Regular | 13 | 145% | 0 |
| Pequeno/Destaque | IBM Plex Sans | 600 SemiBold | 13 | 145% | 0 |

O HUD usa Big Shoulders Display Bold 22 (fora dos estilos). As abas usam IBM Plex SemiBold 11.

### Efeitos

- **Sombra/Janela:** sombra projetada sólida, sem desfoque, `0 8px 0 0 rgba(18,31,38,0.35)`. Usada em todos os cartões de papel.

### Formas e espaçamentos recorrentes

- Tela: 390 × 844. HUD no topo (88 px). Barra de abas embaixo (88 px), só nas telas de app (03, 05, 07).
- Margem lateral: 20 px (24 px nas telas 01 e 09).
- Raios: botão 2 px, cartão 4 px, página da loja 6 px, chips do manual 14 px (pílula), folha de ações 16 px (só no topo).
- Botão: padding 13 × 22 px, largura total, Subtítulo 16/SemiBold. Gap de 12 px entre botões.

---

## 2. Componentes

### Botão (`Tipo`)
| Variante | Fundo | Texto | Borda |
|---|---|---|---|
| Primário | `marca-texto` | `tinta` | — |
| Secundário | transparente | `formulario` | 2 px `formulario` |
| Perigo | `carimbo-vermelho` | `branco` | — |

Na tela 05 aparece uma variação com fundo `tinta` e texto `formulario` ("Comprar 2 unidades").

### Carimbo (`Tipo`: Confiar / Denunciar)
Borda externa de 4 px, padding 5 px, opacidade 92%. Borda interna de 1,5 px com padding 10 × 22 px. Texto "CONFIAR"/"DENUNCIAR" no estilo Carimbo, com a linha "Estagiário nº 0417" (Pequeno/Destaque) abaixo. Azul = `carimbo-azul`, vermelho = `carimbo-vermelho`. Veja [telas/componente-carimbo.png](telas/componente-carimbo.png). Esse componente ainda não aparece em nenhuma tela.

### Linha de e-mail (`Estado`)
Padding 14 × 16 px, gap 12 px, borda inferior de 1 px `linha`. Marcador de 8 px, remetente em Pequeno/Destaque, hora em Pequeno `texto-2`.
- **Não lido:** fundo `formulario`, marcador azul ([assets/marcador-nao-lido.svg](assets/marcador-nao-lido.svg)), assunto em Pequeno/Destaque `tinta`.
- **Lido:** fundo `pauta`, sem marcador visível ([assets/marcador-lido.svg](assets/marcador-lido.svg)), assunto em Pequeno `texto-2`.
- **Selecionado:** fundo `branco`, borda esquerda de 4 px `tinta`, assunto em Pequeno `texto-2`.

### Crachá
Cartão `formulario` com raio de ~9 px e sombra sólida. De cima para baixo: furo (barra `mesa`), faixa amarela "UnB Net | Estagiário", foto (fundo `pauta` + [bonequinho.svg](assets/bonequinho.svg)), "Crachá Provisório" (Big Shoulders Black), 5 furos Seg–Sex e "Válido até sexta-feira".
- Os furos começam vazios ([furo-vazio.svg](assets/furo-vazio.svg)) e ficam preenchidos a cada dia concluído ([furo-preenchido.svg](assets/furo-preenchido.svg)).
- Na tela 01 aparece girado +3°, pendurado no cordão (barra azul de 18 × 64 px + presilha `linha` de 30 × 14 px). Na tela 09 aparece girado −2°.

### Aba (`App` × `Ativo`) e Barra de abas
Aba de 84 px de largura: indicador de 28 × 3 px (`marca-texto` quando ativa, ausente quando inativa), ícone de 22 px e rótulo de 11 px (opacidade 55% quando inativa).
Ícones: [icone-caixa.svg](assets/icone-caixa.svg), [icone-navegador.svg](assets/icone-navegador.svg), [icone-manual.svg](assets/icone-manual.svg).
A barra de abas tem fundo `mesa-escura`, borda superior de 1 px `formulario`, padding lateral de 28 px e padding inferior de 30 px, com as abas distribuídas (`space-between`).

### HUD
Fundo `mesa-escura`, padding 14 × 20 px, gap 14 px.
- Linha 1: status bar fake ("9:41" + bateria com contorno de 24 × 11 px).
- Linha 2: quadrado amarelo de 12 px + "UnB Net" (Big Shoulders Bold 22) + etiqueta amarela com dia e hora (prop `dia`, ex.: "Seg, 09:14").

### Pista da lupa
Bilhete `marca-texto` levemente girado (−1,2° ou +1°), padding 10/12 px, título "Lupa" (Pequeno/Destaque) e texto em Pequeno, com sombra sólida.

---

## 3. Telas

| # | Tela | HUD (`dia`) | Abas | Captura |
|---|---|---|---|---|
| 01 | Início | — | — | [01-inicio.png](telas/01-inicio.png) |
| 02 | Briefing do dia | Seg, 08:30 | — | [02-briefing-do-dia.png](telas/02-briefing-do-dia.png) |
| 03 | Caixa de entrada | Seg, 09:14 | Caixa ativa | [03-caixa-de-entrada.png](telas/03-caixa-de-entrada.png) |
| 04 | E-mail do falso chefe | Seg, 09:16 | — | [04-email-falso-chefe.png](telas/04-email-falso-chefe.png) |
| 05 | Navegador — loja falsa | Seg, 10:02 | Navegador ativa | [05-navegador-loja-falsa.png](telas/05-navegador-loja-falsa.png) |
| 06 | Desligado (derrota) | Seg, 09:18 | — | [06-desligado.png](telas/06-desligado.png) |
| 07 | Manual — Phishing | Seg, 09:20 | Manual ativa | [07-manual-phishing.png](telas/07-manual-phishing.png) |
| 08 | Sexta — incidente e backup | Sex, 16:40 | — | [08-sexta-incidente-backup.png](telas/08-sexta-incidente-backup.png) |
| 09 | Semana concluída (vitória) | — | — | [09-semana-concluida.png](telas/09-semana-concluida.png) |

### 01 Início
Fundo `mesa` com 9 faixas horizontais `formulario` a 4% de opacidade (47 px de altura, a cada 94 px). Por cima, o cordão e o crachá. Embaixo ficam o título "Bem-vindo a / UnB Net" (Display/G), o texto de introdução e os botões **Começar segunda-feira** (Primário) e **Abrir o manual** (Secundário).

### 02 Briefing do dia
"Dia 1 de 5" (Pequeno/Destaque amarelo) e "Segunda-feira" (Display/G). Barra de progresso com 5 segmentos de 6 px, gap 6 px: o dia atual em `marca-texto`, os outros em `formulario` a 20%. Cartão "Memorando do RH 08:30" com o texto e duas tarefas com checkbox de 18 px:
- "Ler a caixa de entrada" (6 mensagens)
- "Comprar 2 monitores" (3 lojas indicadas)

Rodapé com um ponto vermelho e "Erros permitidos nesta semana: nenhum", e o botão **Abrir a caixa de entrada**.

### 03 Caixa de entrada
"Caixa de entrada" (Display/M) e "3 não lidas" (amarelo). Lista:
| Remetente | Hora | Assunto | Estado |
|---|---|---|---|
| Ricardo Almeida, Diretoria | 09:12 | URGENTE: preciso da planilha da folha agora | Não lido |
| Marina Costa, Compras | 09:05 | Pedido: 2 monitores para o time de dados | Não lido |
| suporte-unbnet | 09:08 | Sua caixa de e-mail está quase cheia | Não lido |
| TI UnB Net | 08:40 | Boas-vindas: configure seu acesso | Lido |
| RH UnB Net | 08:31 | Seu crachá definitivo sai na sexta | Lido |

Dica com [icone-lupa.svg](assets/icone-lupa.svg): "Toque e segure qualquer e-mail para usar a lupa."
O briefing fala em "6 mensagens", mas a lista mostra 5.

### 04 E-mail do falso chefe
Link "‹ Caixa de entrada" ([icone-voltar.svg](assets/icone-voltar.svg)). Cartão do e-mail:
- Assunto (Título 22): "URGENTE: preciso da planilha da folha agora"
- Remetente: "Ricardo Almeida, Diretor Financeiro", `diretoria@` + **`unbnet-sa.co`** com marca-texto amarelo
- Corpo: "Estou numa reunião com o banco e sem acesso ao sistema. Me manda agora a planilha da folha com CPF e conta de todo mundo. É confidencial, não comenta com ninguém."
- Anexo/ação (fundo branco, [icone-arquivo.svg](assets/icone-arquivo.svg)): "Responder com folha_outubro.xlsx"
- Pista da lupa: "O domínio da empresa é unbnet.com.br. Este e-mail veio de unbnet-sa.co."

Folha de ações fixa no rodapé (`mesa-escura`, raio de 16 px no topo): "O que você faz com este e-mail?" + "1 chance". Botões **Denunciar como golpe** (Perigo) e **Responder normalmente** (Secundário).

### 05 Navegador — loja falsa
Cartão do pedido: "Pedido de Marina Costa, Compras / 2 monitores de 27 polegadas, até R$ 6.000 no total."
Seletor segmentado Loja 1 | Loja 2 | **Loja 3** (o ativo fica com fundo `formulario`).
Página da loja (fundo branco, raio de 6 px):
- Barra de URL `pauta` com [icone-alerta.svg](assets/icone-alerta.svg) e **`prisma-ofertas.shop`** destacado
- Cabeçalho `tinta`: "Prisma Ofertas" + "acaba em 04:59" (amarelo)
- Ilustração do monitor feita com retângulos (tela `mesa` de 150 × 88 px com borda de 4 px `tinta`, haste e base)
- "Monitor 27 polegadas QHD, 165 Hz", ~~R$ 2.799~~ **R$ 899** (Display/M vermelho) e "68% off"
- Sinais: ✕ "Pagamento somente por Pix" (destacado), ✕ "CNPJ não informado no rodapé" (destacado) e ✓ "Entrega em 2 dias úteis" ([icone-x.svg](assets/icone-x.svg), [icone-check.svg](assets/icone-check.svg))
- Botão escuro: **Comprar 2 unidades**

Só a Loja 3 está desenhada. As lojas 1 e 2 não têm tela.

### 06 Desligado
Cartão "Comunicado do RH 09:18": "Você foi demitido na segunda-feira" (Título) + "Você enviou a folha de pagamento para diretoria@unbnet-sa.co. O e-mail imitava o diretor, mas era phishing. Os dados de 1.240 funcionários saíram da empresa." Há um espaço vazio de 78 px no cartão, provavelmente reservado para o carimbo.
"O que você deixou passar" (Subtítulo amarelo), com 3 itens de marcador quadrado amarelo:
- O endereço vinha de unbnet-sa.co, não de unbnet.com.br
- Urgência e pedido de segredo para você não checar
- Dados pessoais pedidos fora do sistema da empresa

Botões **Ler no manual: Phishing** (Primário) e **Repetir segunda-feira** (Secundário).

### 07 Manual — Phishing
Chips roláveis na horizontal: **Phishing** (ativo, amarelo), Lojas falsas, Links maliciosos, Senhas fortes e Backup (com [icone-backup.svg](assets/icone-backup.svg), provavelmente um cadeado para indicar que ainda está bloqueado).
"Verbete liberado na segunda-feira" + "Phishing" (Display/G). Cartão:
- Definição: "Um golpe em que alguém se passa por uma pessoa ou empresa de confiança para fazer você entregar dados, senhas ou dinheiro."
- **Como reconhecer:** Domínio do remetente diferente do oficial · Pressa, ameaça ou pedido de segredo · Pedido de dados que a pessoa já teria acesso
- **O que fazer:** "Confirme por outro canal, como o ramal do diretor. Depois, denuncie o e-mail para a TI."

### 08 Sexta — incidente e backup
Faixa vermelha de largura total: [icone-alerta-branco.svg](assets/icone-alerta-branco.svg) + "Sistema sob ataque" (Display/M branco) + "Alguém do Financeiro abriu um anexo com ransomware. 312 arquivos já estão bloqueados e o número sobe."
"Escolha de qual cópia restaurar o servidor de arquivos." Lista de opções (radio: [radio-vazio.svg](assets/radio-vazio.svg) / [radio-marcado.svg](assets/radio-marcado.svg)):
| Opção | Detalhe | Observação |
|---|---|---|
| Hoje, 12:00 | Contém arquivos já criptografados | Título em vermelho (armadilha) |
| **Quinta, 23:00** | Íntegra, verificada às 23:40 | Selecionada: fundo branco + borda esquerda de 4 px `tinta` |
| Quarta, 23:00 | Íntegra, perde 2 dias de trabalho | — |

Pista da lupa: "Restaurar a cópia de hoje traria o ransomware de volta junto com os arquivos." Botão **Restaurar cópia de quinta, 23:00**.

### 09 Semana concluída
Crachá girado −2° com os 5 furos preenchidos. Mesmo assim, o texto do crachá ainda diz "Crachá Provisório", apesar de a narrativa dizer que ele foi trocado pelo definitivo.
"Semana concluída. / Nenhum erro." (Display/G) + "O RH trocou seu crachá provisório pelo definitivo. Você terminou a semana com o sistema da UnB Net inteiro."
3 caixas de estatística (borda de 1 px `linha`, número em Display/M amarelo): **18** decisões · **5** verbetes lidos · **0** erros.
Botões **Ver o manual completo** (Primário) e **Jogar de novo** (Secundário).

---

## 4. Fluxo deduzido (sem protótipo no Figma)

```
01 Início ──Começar segunda-feira──▶ 02 Briefing ──Abrir a caixa──▶ 03 Caixa de entrada
   └─Abrir o manual──▶ 07 Manual                                      │ toca no e-mail do Ricardo
                                                                      ▼
                                   ┌──Denunciar como golpe──── 04 E-mail do falso chefe
                                   ▼                                  │ Responder normalmente
                           (próximo e-mail / tarefa)                  ▼
                                                               06 Desligado
                                                    ├─Ler no manual: Phishing──▶ 07 Manual
                                                    └─Repetir segunda-feira────▶ 02 Briefing
03 ⇄ 05 ⇄ 07 pela barra de abas (Caixa / Navegador / Manual)
… Ter–Qui não desenhados …  ──▶ 08 Sexta (backup) ──Restaurar quinta──▶ 09 Semana concluída
09 ──Jogar de novo──▶ 01 · ──Ver o manual completo──▶ 07
```

## 5. O que está faltando no Figma

- Interações de protótipo: nenhuma está definida.
- Dias de terça a quinta, e as telas de acerto (ex.: o resultado de denunciar o e-mail ou de recusar a loja falsa).
- Lojas 1 e 2, o resultado da compra e os outros e-mails (Marina, suporte-unbnet, TI, RH).
- Verbetes do manual além de Phishing.
- Uso do componente Carimbo e da interação "segurar para usar a lupa".
- Inconsistências: o briefing diz "6 mensagens" mas a caixa mostra 5; na tela 09 o crachá ainda diz "Provisório".
