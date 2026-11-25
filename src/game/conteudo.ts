/**
 * Conteúdo do jogo. O que está no Figma (segunda e sexta) foi copiado
 * literalmente; terça a quinta, e tudo que não tinha tela, foi escrito
 * seguindo o mesmo tom. Cada dia libera um verbete do manual e prepara o
 * ataque de sexta.
 */

export type Dia = 'seg' | 'ter' | 'qua' | 'qui' | 'sex';

export const DIAS: Dia[] = ['seg', 'ter', 'qua', 'qui', 'sex'];

export const indiceDia = (dia: Dia) => DIAS.indexOf(dia);

export const NOME_DIA: Record<Dia, string> = {
  seg: 'segunda-feira',
  ter: 'terça-feira',
  qua: 'quarta-feira',
  qui: 'quinta-feira',
  sex: 'sexta-feira',
};

export const ABREV_DIA: Record<Dia, string> = { seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex' };

export const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export type VerbeteId = 'phishing' | 'lojas' | 'links' | 'senhas' | 'backup';

// ——— E-mails ———

export type Email = {
  id: string;
  dia: Dia;
  remetente: string;
  remetenteCompleto: string;
  usuario: string;
  dominio: string;
  dominioSuspeito: boolean;
  hora: string;
  assunto: string;
  corpo: string;
  anexo?: string;
  pista: string;
  /** E-mails já lidos são só informativos: não pedem decisão. */
  jaLido?: boolean;
  /** Se for golpe, denunciar é o certo. Se não for, confiar é o certo. */
  golpe?: boolean;
  acaoDenunciar?: string;
  acaoConfiar?: string;
  falhaSeConfiar?: string;
  falhaSeDenunciar?: string;
  /** Para onde ir depois de confiar (por padrão, volta à caixa). */
  destinoAoConfiar?: '/navegador';
};

export const DOMINIO_OFICIAL = 'unbnet.com.br';

export const EMAILS: Email[] = [
  // ——— Segunda: phishing ———
  {
    id: 'ricardo',
    dia: 'seg',
    remetente: 'Ricardo Almeida, Diretoria',
    remetenteCompleto: 'Ricardo Almeida, Diretor Financeiro',
    usuario: 'diretoria@',
    dominio: 'unbnet-sa.co',
    dominioSuspeito: true,
    hora: '09:12',
    assunto: 'URGENTE: preciso da planilha da folha agora',
    corpo:
      'Estou numa reunião com o banco e sem acesso ao sistema. Me manda agora a planilha da folha com CPF e conta de todo mundo. É confidencial, não comenta com ninguém.',
    anexo: 'Responder com folha_outubro.xlsx',
    pista: 'O domínio da empresa é unbnet.com.br. Este e-mail veio de unbnet-sa.co.',
    golpe: true,
    acaoConfiar: 'Responder normalmente',
    falhaSeConfiar: 'folha',
  },
  {
    id: 'marina',
    dia: 'seg',
    remetente: 'Marina Costa, Compras',
    remetenteCompleto: 'Marina Costa, Compras',
    usuario: 'marina.costa@',
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    hora: '09:05',
    assunto: 'Pedido: 2 monitores para o time de dados',
    corpo:
      'Oi! Preciso de 2 monitores de 27 polegadas para o time de dados, até R$ 6.000 no total. Separei 3 lojas no navegador. Pode escolher a melhor e fechar a compra pelo cartão corporativo?',
    pista: 'Domínio oficial, pedido que bate com o memorando do RH e nenhum dado sensível pedido.',
    golpe: false,
    acaoConfiar: 'Abrir as lojas indicadas',
    falhaSeDenunciar: 'denuncia-marina',
    destinoAoConfiar: '/navegador',
  },
  {
    id: 'suporte',
    dia: 'seg',
    remetente: 'suporte-unbnet',
    remetenteCompleto: 'Suporte UnB Net',
    usuario: 'no-reply@',
    dominio: 'unbnet-suporte.help',
    dominioSuspeito: true,
    hora: '09:08',
    assunto: 'Sua caixa de e-mail está quase cheia',
    corpo:
      'Sua caixa atingiu 98% da capacidade. Para não perder mensagens, confirme seu login e senha em até 1 hora no link abaixo: unbnet-suporte.help/liberar-espaco',
    anexo: 'Liberar espaço agora',
    pista: 'O link leva para unbnet-suporte.help, fora da empresa. A TI nunca pede sua senha por e-mail.',
    golpe: true,
    acaoConfiar: 'Clicar em liberar espaço',
    falhaSeConfiar: 'link-suporte',
  },
  {
    id: 'ti',
    dia: 'seg',
    remetente: 'TI UnB Net',
    remetenteCompleto: 'TI UnB Net',
    usuario: 'ti@',
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    hora: '08:40',
    assunto: 'Boas-vindas: configure seu acesso',
    corpo:
      'Bem-vindo! Seu acesso já está ativo. Troque a senha provisória no portal interno e nunca informe sua senha por e-mail ou telefone. Na dúvida, ligue no ramal 2000.',
    pista: 'Domínio oficial e nenhum pedido de senha. Mensagem legítima.',
    jaLido: true,
  },
  {
    id: 'rh',
    dia: 'seg',
    remetente: 'RH UnB Net',
    remetenteCompleto: 'RH UnB Net',
    usuario: 'rh@',
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    hora: '08:31',
    assunto: 'Seu crachá definitivo sai na sexta',
    corpo:
      'Seu crachá provisório vale até sexta-feira. Se a semana terminar sem incidentes de segurança, você recebe o definitivo. Boa sorte!',
    pista: 'Domínio oficial. Mensagem legítima.',
    jaLido: true,
  },

  // ——— Terça: senhas ———
  {
    id: 'pedro',
    dia: 'ter',
    remetente: 'Pedro Lima, Relatórios',
    remetenteCompleto: 'Pedro Lima, Relatórios',
    usuario: 'pedro.lima@',
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    hora: '09:21',
    assunto: 'Me passa sua senha rapidinho?',
    corpo:
      'Meu acesso ao sistema de relatórios caiu e preciso fechar o relatório até as 10h. Me passa sua senha que eu entro com a sua conta, depois te devolvo. Não precisa avisar a TI, é rapidinho.',
    pista:
      'O domínio é oficial, mas senha não se empresta: tudo o que o Pedro fizer com a sua conta fica registrado no seu nome.',
    golpe: true,
    acaoDenunciar: 'Recusar e avisar a TI',
    acaoConfiar: 'Enviar a senha',
    falhaSeConfiar: 'senha-emprestada',
  },
  {
    id: 'cofre',
    dia: 'ter',
    remetente: 'Senhas Seguras Pro',
    remetenteCompleto: 'Senhas Seguras Pro',
    usuario: 'renovacao@',
    dominio: 'senhas-seguras-pro.co',
    dominioSuspeito: true,
    hora: '09:02',
    assunto: 'Seu cofre de senhas vence hoje: 90% off',
    corpo:
      'A licença do seu cofre de senhas vence hoje! Renove agora com 90% de desconto e importe todas as senhas salvas no seu navegador com um clique.',
    anexo: 'Renovar e importar senhas',
    pista:
      'A UnB Net nunca contratou esse serviço, e "importar todas as senhas do navegador" entregaria tudo a um site desconhecido.',
    golpe: true,
    acaoConfiar: 'Renovar e importar senhas',
    falhaSeConfiar: 'cofre-falso',
  },
  {
    id: 'ti-senha',
    dia: 'ter',
    remetente: 'TI UnB Net',
    remetenteCompleto: 'TI UnB Net',
    usuario: 'ti@',
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    hora: '08:35',
    assunto: 'Lembrete: troque sua senha provisória hoje',
    corpo:
      'Sua senha provisória expira hoje às 18h. Troque pelo portal interno, digitando portal.unbnet.com.br no navegador. Nunca pedimos sua senha por e-mail.',
    pista: 'Domínio oficial, sem link e sem pedido de senha. Mensagem legítima.',
    jaLido: true,
  },

  // ——— Quarta: links ———
  {
    id: 'entrega',
    dia: 'qua',
    remetente: 'Rápida Entregas',
    remetenteCompleto: 'Rápida Entregas',
    usuario: 'aviso@',
    dominio: 'rapida-entregas.info',
    dominioSuspeito: true,
    hora: '09:11',
    assunto: 'Sua encomenda está retida',
    corpo:
      'Não conseguimos entregar sua encomenda. Pague a taxa de reentrega de R$ 4,90 em até 2 horas ou o pacote volta ao remetente: encurta.li/x8Kq',
    anexo: 'Abrir encurta.li/x8Kq',
    pista:
      'Você não fez nenhuma compra pessoal, e o link encurtado esconde o destino real: rapida-entregas.info/pagamento.',
    golpe: true,
    acaoConfiar: 'Abrir o link e pagar',
    falhaSeConfiar: 'link-entrega',
  },
  {
    id: 'fotos',
    dia: 'qua',
    remetente: 'Camila Rocha, Marketing',
    remetenteCompleto: 'Camila Rocha, Marketing',
    usuario: 'camila.rocha@',
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    hora: '09:04',
    assunto: 'Fotos da confraternização',
    corpo:
      'Oi, gente! Subi as fotos da confra. É só entrar com o login e a senha da empresa para ver: fotos-unbnet.drive-share.net/confra',
    anexo: 'Abrir fotos-unbnet.drive-share.net',
    pista:
      'O remetente é oficial, mas o link vai para drive-share.net e pede o login da empresa. A conta da Camila provavelmente foi invadida.',
    golpe: true,
    acaoConfiar: 'Abrir as fotos',
    falhaSeConfiar: 'conta-invadida',
  },
  {
    id: 'holerite',
    dia: 'qua',
    remetente: 'RH UnB Net',
    remetenteCompleto: 'RH UnB Net',
    usuario: 'rh@',
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    hora: '08:50',
    assunto: 'Holerite de outubro disponível',
    corpo:
      'Seu holerite já está no portal. Acesse digitando portal.unbnet.com.br no navegador, como sempre. Não enviamos links de login por e-mail.',
    pista: 'Domínio oficial e nenhum link: o RH manda você digitar o endereço. Mensagem legítima.',
    golpe: false,
    acaoConfiar: 'Marcar como lido',
    falhaSeDenunciar: 'denuncia-rh',
  },

  // ——— Quinta: anexos e backup ———
  {
    id: 'nota',
    dia: 'qui',
    remetente: 'Alfa Papelaria',
    remetenteCompleto: 'Alfa Papelaria, Financeiro',
    usuario: 'financeiro@',
    dominio: 'alfa-papelaria.com.br',
    dominioSuspeito: false,
    hora: '09:17',
    assunto: 'Nota fiscal de outubro em anexo',
    corpo:
      'Segue a nota fiscal de outubro. O arquivo está compactado com senha por segurança: a senha é 1234. Favor abrir hoje para não atrasar o pagamento.',
    anexo: 'NF_outubro.zip',
    pista:
      'Dentro do .zip há um NF_outubro.pdf.exe: é um programa, não um PDF. O zip com senha serve para escapar do antivírus.',
    golpe: true,
    acaoDenunciar: 'Denunciar o anexo',
    acaoConfiar: 'Abrir o anexo',
    falhaSeConfiar: 'anexo',
  },
  {
    id: 'julia',
    dia: 'qui',
    remetente: 'Júlia Martins, Contabilidade',
    remetenteCompleto: 'Júlia Martins, Contabilidade',
    usuario: 'julia.martins@',
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    hora: '09:09',
    assunto: 'Planilha de fechamento no servidor',
    corpo:
      'A planilha de fechamento do mês está na pasta Financeiro do servidor de arquivos. Você pode conferir se o backup desta noite vai incluir essa pasta?',
    pista: 'Domínio oficial e nenhum link ou anexo. Pedido legítimo, que bate com a tarefa de hoje.',
    golpe: false,
    acaoConfiar: 'Responder: vou conferir',
    falhaSeDenunciar: 'denuncia-julia',
  },
  {
    id: 'ti-backup',
    dia: 'qui',
    remetente: 'TI UnB Net',
    remetenteCompleto: 'TI UnB Net',
    usuario: 'ti@',
    dominio: DOMINIO_OFICIAL,
    dominioSuspeito: false,
    hora: '08:32',
    assunto: 'Tarefa de hoje: backup noturno',
    corpo:
      'Hoje você configura o backup noturno do servidor de arquivos. Lembre da regra da casa: cópia diária, fora da rede e sempre verificada.',
    pista: 'Domínio oficial. Mensagem legítima, e com uma dica para a tarefa de hoje.',
    jaLido: true,
  },
];

export const emailsDoDia = (dia: Dia) => EMAILS.filter((e) => e.dia === dia);
export const pendentesDoDia = (dia: Dia) => emailsDoDia(dia).filter((e) => !e.jaLido);

// ——— Lojas (segunda) ———

export type Sinal = { texto: string; ok: boolean };

export type Loja = {
  id: string;
  rotulo: string;
  nome: string;
  dominio: string;
  dominioSuspeito: boolean;
  contador?: string;
  produto: string;
  precoAntigo?: string;
  preco: string;
  desconto?: string;
  sinais: Sinal[];
  pista: string;
  falha?: string;
};

export const LOJAS: Loja[] = [
  {
    id: 'loja1',
    rotulo: 'Loja 1',
    nome: 'Monitorama',
    dominio: 'monitorama.com.br',
    dominioSuspeito: false,
    produto: 'Monitor 27 polegadas QHD, 165 Hz',
    preco: 'R$ 2.749',
    sinais: [
      { texto: 'Cartão, boleto ou Pix', ok: true },
      { texto: 'CNPJ e endereço no rodapé', ok: true },
      { texto: 'Total: R$ 5.498, dentro do limite', ok: true },
    ],
    pista: 'Preço de mercado, CNPJ informado e pagamento com cartão. Loja confiável e dentro do orçamento.',
  },
  {
    id: 'loja2',
    rotulo: 'Loja 2',
    nome: 'TecnoPreço',
    dominio: 'tecnopreco.com.br',
    dominioSuspeito: false,
    produto: 'Monitor 27 polegadas QHD, 165 Hz',
    preco: 'R$ 3.199',
    sinais: [
      { texto: 'Cartão, boleto ou Pix', ok: true },
      { texto: 'CNPJ e endereço no rodapé', ok: true },
      { texto: 'Total: R$ 6.398, acima do limite', ok: false },
    ],
    pista: 'A loja é confiável, mas 2 unidades passam dos R$ 6.000 que a Marina autorizou.',
    falha: 'orcamento',
  },
  {
    id: 'loja3',
    rotulo: 'Loja 3',
    nome: 'Prisma Ofertas',
    dominio: 'prisma-ofertas.shop',
    dominioSuspeito: true,
    contador: 'acaba em 04:59',
    produto: 'Monitor 27 polegadas QHD, 165 Hz',
    precoAntigo: 'R$ 2.799',
    preco: 'R$ 899',
    desconto: '68% off',
    sinais: [
      { texto: 'Pagamento somente por Pix', ok: false },
      { texto: 'CNPJ não informado no rodapé', ok: false },
      { texto: 'Entrega em 2 dias úteis', ok: true },
    ],
    pista: 'Desconto de 68%, cronômetro de pressão, só Pix e nenhum CNPJ: sinais clássicos de loja falsa.',
    falha: 'loja-falsa',
  },
];

// ——— Escolhas (uma por dia, de terça a sexta) ———

export type Opcao = { id: string; titulo: string; detalhe: string; perigo?: boolean; falha?: string };

export type Escolha = {
  id: string;
  dia: Dia;
  tarefa: string;
  detalheTarefa: string;
  /** Faixa vermelha no topo (incidente). */
  alerta?: { titulo: string; texto: string };
  titulo?: string;
  enunciado: string;
  opcoes: Opcao[];
  pista: string;
  rotuloBotao: (o: Opcao) => string;
  /** Acertar esta escolha termina a semana. */
  final?: boolean;
};

const minusculaInicial = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export const ESCOLHAS: Escolha[] = [
  {
    id: 'senha',
    dia: 'ter',
    tarefa: 'Trocar a senha provisória',
    detalheTarefa: 'Expira hoje às 18h',
    titulo: 'Nova senha',
    enunciado: 'A TI pediu para trocar a senha provisória do sistema. Qual senha você cadastra?',
    opcoes: [
      { id: 'cargo', titulo: 'Estagiario@2026', detalhe: 'Tem maiúscula, número e símbolo', falha: 'senha-fraca' },
      { id: 'frase', titulo: 'cafe-torrado-janela-azul-17', detalhe: 'Frase longa, usada só aqui' },
      { id: 'pessoal', titulo: 'A mesma do meu e-mail pessoal', detalhe: 'Fácil de lembrar', falha: 'senha-repetida' },
    ],
    pista: 'Cargo e ano são os primeiros palpites de um atacante. Tamanho vale mais que símbolos, e cada serviço pede uma senha diferente.',
    rotuloBotao: () => 'Salvar a nova senha',
  },
  {
    id: 'pendrive',
    dia: 'qua',
    tarefa: 'Resolver o pendrive achado',
    detalheTarefa: 'Etiqueta: "Salários 2026"',
    titulo: 'Achado no estacionamento',
    enunciado:
      'Na volta do almoço, você acha um pendrive no estacionamento com a etiqueta "Salários 2026". O que você faz?',
    opcoes: [
      { id: 'meu-pc', titulo: 'Plugar no meu computador', detalhe: 'Para descobrir de quem é', falha: 'pendrive' },
      { id: 'ti', titulo: 'Entregar para a TI sem plugar', detalhe: 'Eles analisam num computador isolado' },
      { id: 'recepcao', titulo: 'Plugar no computador da recepção', detalhe: 'Lá não tem dados importantes', falha: 'pendrive-recepcao' },
    ],
    pista: 'Pendrives "perdidos" com etiquetas curiosas são iscas: basta plugar em qualquer máquina da rede para rodar um programa malicioso.',
    rotuloBotao: () => 'Confirmar',
  },
  {
    id: 'config-backup',
    dia: 'qui',
    tarefa: 'Configurar o backup noturno',
    detalheTarefa: 'Servidor de arquivos',
    titulo: 'Backup noturno',
    enunciado: 'Escolha como o servidor de arquivos vai ser copiado a partir de hoje.',
    opcoes: [
      { id: 'mesmo', titulo: 'Diário às 23:00, no próprio servidor', detalhe: 'Rápido, fica junto dos arquivos', falha: 'backup-mesmo-servidor' },
      { id: 'isolado', titulo: 'Diário às 23:00, isolado e verificado', detalhe: 'Cópia fora da rede, com teste de integridade' },
      { id: 'semanal', titulo: 'Semanal, todo domingo', detalhe: 'Ocupa menos espaço', falha: 'backup-semanal' },
    ],
    pista: 'Uma cópia no próprio servidor é criptografada junto com ele por um ransomware. E uma cópia semanal pode perder dias inteiros de trabalho.',
    rotuloBotao: () => 'Salvar configuração',
  },
  {
    id: 'restauracao',
    dia: 'sex',
    tarefa: 'Recuperar o servidor de arquivos',
    detalheTarefa: 'Ataque em andamento',
    alerta: {
      titulo: 'Sistema sob ataque',
      texto: 'Alguém do Financeiro abriu um anexo com ransomware. 312 arquivos já estão bloqueados e o número sobe.',
    },
    enunciado: 'Escolha de qual cópia restaurar o servidor de arquivos.',
    opcoes: [
      { id: 'hoje', titulo: 'Hoje, 12:00', detalhe: 'Contém arquivos já criptografados', perigo: true, falha: 'ransomware' },
      { id: 'quinta', titulo: 'Quinta, 23:00', detalhe: 'Íntegra, verificada às 23:40' },
      { id: 'quarta', titulo: 'Quarta, 23:00', detalhe: 'Íntegra, perde 2 dias de trabalho', falha: 'backup-antigo' },
    ],
    pista: 'Restaurar a cópia de hoje traria o ransomware de volta junto com os arquivos.',
    rotuloBotao: (o) => `Restaurar cópia de ${minusculaInicial(o.titulo)}`,
    final: true,
  },
];

// ——— Dias ———

export type Tarefa = { tipo: 'caixa' } | { tipo: 'compra' } | { tipo: 'escolha'; id: string };

export type DiaInfo = {
  inicio: number;
  memorando: string;
  memorandoFeito: string;
  tarefas: Tarefa[];
};

const h = (hh: number, mm: number) => hh * 60 + mm;

export const DIAS_INFO: Record<Dia, DiaInfo> = {
  seg: {
    inicio: h(8, 30),
    memorando:
      'Bem-vindo à UnB Net. Hoje você cuida da caixa de entrada do time e de uma compra para o setor de Compras. Na dúvida, não clique: consulte o manual.',
    memorandoFeito: 'Bom trabalho hoje. Caixa limpa e compra feita sem cair em nenhum golpe. Pode encerrar o dia.',
    tarefas: [{ tipo: 'caixa' }, { tipo: 'compra' }],
  },
  ter: {
    inicio: h(8, 30),
    memorando:
      'Terça é dia de senhas. Sua senha provisória vence hoje e tem mensagem nova na caixa. Lembre: senha não se empresta, nem para colega. O verbete "Senhas fortes" foi liberado no manual.',
    memorandoFeito: 'Senha nova cadastrada e ninguém usando a sua conta. Pode encerrar a terça.',
    tarefas: [{ tipo: 'caixa' }, { tipo: 'escolha', id: 'senha' }],
  },
  qua: {
    inicio: h(8, 30),
    memorando:
      'Quarta é dia de links. Antes de clicar, confira para onde o link leva de verdade, mesmo que venha de um colega. O verbete "Links maliciosos" foi liberado no manual.',
    memorandoFeito: 'Nenhum link suspeito aberto e o pendrive está com a TI. Pode encerrar a quarta.',
    tarefas: [{ tipo: 'caixa' }, { tipo: 'escolha', id: 'pendrive' }],
  },
  qui: {
    inicio: h(8, 30),
    memorando:
      'Quinta é dia de backup. A TI pediu para você configurar a cópia noturna do servidor de arquivos, e tem anexo novo na caixa. O verbete "Backup" foi liberado no manual.',
    memorandoFeito: 'Anexo suspeito denunciado e backup noturno configurado. Pode encerrar a quinta.',
    tarefas: [{ tipo: 'caixa' }, { tipo: 'escolha', id: 'config-backup' }],
  },
  sex: {
    inicio: h(16, 40),
    memorando:
      'Último dia, quase na hora de ir embora. Mas o Financeiro acabou de ligar: os arquivos do servidor estão sumindo. A TI precisa de você agora.',
    memorandoFeito: '',
    tarefas: [{ tipo: 'escolha', id: 'restauracao' }],
  },
};

// ——— Manual ———

export type Verbete = {
  id: VerbeteId;
  chip: string;
  titulo: string;
  liberadoEm: Dia;
  definicao: string;
  reconhecer: string[];
  fazer: string;
};

export const VERBETES: Verbete[] = [
  {
    id: 'phishing',
    chip: 'Phishing',
    titulo: 'Phishing',
    liberadoEm: 'seg',
    definicao:
      'Um golpe em que alguém se passa por uma pessoa ou empresa de confiança para fazer você entregar dados, senhas ou dinheiro.',
    reconhecer: [
      'Domínio do remetente diferente do oficial',
      'Pressa, ameaça ou pedido de segredo',
      'Pedido de dados que a pessoa já teria acesso',
    ],
    fazer: 'Confirme por outro canal, como o ramal do diretor. Depois, denuncie o e-mail para a TI.',
  },
  {
    id: 'lojas',
    chip: 'Lojas falsas',
    titulo: 'Lojas falsas',
    liberadoEm: 'seg',
    definicao: 'Sites que imitam lojas de verdade para receber o pagamento e nunca entregar o produto.',
    reconhecer: [
      'Preço muito abaixo do mercado e cronômetro de pressão',
      'Pagamento só por Pix ou transferência',
      'Sem CNPJ, endereço ou canal de atendimento',
    ],
    fazer: 'Prefira lojas conhecidas, confira o CNPJ e pague com cartão, que permite contestar a compra.',
  },
  {
    id: 'senhas',
    chip: 'Senhas fortes',
    titulo: 'Senhas fortes',
    liberadoEm: 'ter',
    definicao: 'A senha é a chave do sistema. Uma senha fraca, repetida ou emprestada abre a porta para qualquer um.',
    reconhecer: [
      'Senha com nome, cargo, data ou sequência',
      'A mesma senha usada em vários serviços',
      'Alguém pedindo sua senha, mesmo um colega',
    ],
    fazer:
      'Use uma frase longa e única para cada serviço, guarde num gerenciador aprovado pela TI e ative a verificação em duas etapas. Nunca empreste sua senha.',
  },
  {
    id: 'links',
    chip: 'Links maliciosos',
    titulo: 'Links maliciosos',
    liberadoEm: 'qua',
    definicao: 'Links e dispositivos que levam a páginas falsas de login ou instalam programas que roubam dados.',
    reconhecer: [
      'Endereço parecido com o oficial, ou escondido num link encurtado',
      'Link vindo de colega que pede login fora do portal',
      'Pendrive ou arquivo de origem desconhecida',
    ],
    fazer: 'Não clique e não plugue. Acesse o sistema digitando o endereço oficial e entregue tudo que for suspeito para a TI.',
  },
  {
    id: 'backup',
    chip: 'Backup',
    titulo: 'Backup',
    liberadoEm: 'qui',
    definicao: 'Cópias de segurança permitem voltar os arquivos a um ponto anterior a um ataque ou acidente.',
    reconhecer: [
      'Cópia no mesmo servidor ou na mesma rede é atacada junto',
      'Cópia feita depois do ataque pode estar infectada',
      'Quanto mais antiga a cópia, mais trabalho se perde',
    ],
    fazer:
      'Faça cópias diárias, isoladas da rede e verificadas. Num ataque, restaure a cópia íntegra mais recente anterior a ele.',
  },
];

// ——— Falhas ———

export type Falha = {
  dia: Dia;
  hora: string;
  texto: string;
  pistas: string[];
  verbete: VerbeteId;
};

const denunciaFalsa = (dia: Dia, hora: string, quem: string, consequencia: string, pistas: string[]): Falha => ({
  dia,
  hora,
  texto: `Você denunciou como golpe uma mensagem legítima de ${quem}. ${consequencia}`,
  pistas,
  verbete: 'phishing',
});

export const FALHAS: Record<string, Falha> = {
  // Segunda
  folha: {
    dia: 'seg',
    hora: '09:18',
    texto:
      'Você enviou a folha de pagamento para diretoria@unbnet-sa.co. O e-mail imitava o diretor, mas era phishing. Os dados de 1.240 funcionários saíram da empresa.',
    pistas: [
      'O endereço vinha de unbnet-sa.co, não de unbnet.com.br',
      'Urgência e pedido de segredo para você não checar',
      'Dados pessoais pedidos fora do sistema da empresa',
    ],
    verbete: 'phishing',
  },
  'link-suporte': {
    dia: 'seg',
    hora: '09:15',
    texto:
      'Você digitou seu login e senha em unbnet-suporte.help. Em minutos, alguém entrou no sistema com a sua conta e baixou os contratos de clientes.',
    pistas: ['O link levava para fora de unbnet.com.br', 'Prazo de 1 hora para você agir sem pensar', 'A TI nunca pede senha por e-mail'],
    verbete: 'phishing',
  },
  'denuncia-marina': denunciaFalsa('seg', '09:15', 'Marina, de Compras', 'A conta dela foi bloqueada pela TI e a compra do time de dados parou.', [
    'O e-mail vinha de unbnet.com.br, o domínio oficial',
    'O pedido batia com o memorando do RH',
    'Nenhum dado sensível foi pedido',
  ]),
  'loja-falsa': {
    dia: 'seg',
    hora: '10:05',
    texto: 'Você pagou R$ 1.798 por Pix para prisma-ofertas.shop. O site saiu do ar uma hora depois e os monitores nunca chegaram.',
    pistas: ['Desconto de 68% e cronômetro para apressar a compra', 'Pagamento somente por Pix', 'CNPJ não informado no rodapé'],
    verbete: 'lojas',
  },
  orcamento: {
    dia: 'seg',
    hora: '10:05',
    texto:
      'Você gastou R$ 6.398 no cartão corporativo, acima dos R$ 6.000 autorizados pela Marina. A compra foi estornada e o financeiro abriu uma auditoria.',
    pistas: ['O pedido tinha limite de R$ 6.000 no total', '2 unidades de R$ 3.199 passam do limite', 'Outra loja confiável cabia no orçamento'],
    verbete: 'lojas',
  },

  // Terça
  'senha-emprestada': {
    dia: 'ter',
    hora: '09:25',
    texto:
      'Você mandou sua senha para o Pedro. A conta dele tinha sido invadida: quem pediu foi um atacante, que entrou com o seu acesso e apagou relatórios do trimestre.',
    pistas: ['Senha não se empresta, nem para colega', 'Pedido para não avisar a TI', 'Pressa para você não pensar duas vezes'],
    verbete: 'senhas',
  },
  'cofre-falso': {
    dia: 'ter',
    hora: '09:06',
    texto:
      'Você importou as senhas do navegador para senhas-seguras-pro.co. O site guardou todas elas, inclusive a do sistema da UnB Net e a do cartão corporativo.',
    pistas: ['A empresa nunca contratou esse serviço', 'Domínio desconhecido e desconto exagerado', 'Pedido para entregar todas as senhas de uma vez'],
    verbete: 'senhas',
  },
  'senha-fraca': {
    dia: 'ter',
    hora: '17:40',
    texto:
      'Você cadastrou Estagiario@2026. Em menos de uma hora, um robô que testa senhas comuns acertou e entrou no sistema com a sua conta.',
    pistas: ['Cargo e ano estão entre os primeiros palpites', 'Símbolos no lugar de sempre não ajudam muito', 'Uma frase longa seria muito mais difícil de adivinhar'],
    verbete: 'senhas',
  },
  'senha-repetida': {
    dia: 'ter',
    hora: '17:40',
    texto:
      'Você usou a mesma senha do seu e-mail pessoal. Ela já tinha vazado num site antigo, e alguém a testou no sistema da UnB Net. Funcionou.',
    pistas: ['Senhas vazadas são testadas em todo lugar', 'Cada serviço precisa de uma senha diferente', 'Uma frase longa e única evitaria o problema'],
    verbete: 'senhas',
  },

  // Quarta
  'link-entrega': {
    dia: 'qua',
    hora: '09:15',
    texto:
      'Você abriu o link e pagou a "taxa de reentrega" com o cartão corporativo. Os dados do cartão foram usados em compras de R$ 14 mil no mesmo dia.',
    pistas: ['Você não estava esperando nenhuma entrega', 'Link encurtado escondendo o destino', 'Prazo de 2 horas para pagar'],
    verbete: 'links',
  },
  'conta-invadida': {
    dia: 'qua',
    hora: '09:10',
    texto:
      'Você digitou o login da empresa em drive-share.net. A conta da Camila tinha sido invadida, e agora a sua também está mandando o mesmo e-mail para todo mundo.',
    pistas: ['O link ia para drive-share.net, fora da empresa', 'Fotos não precisam do login da empresa', 'Remetente conhecido não garante que o link seja seguro'],
    verbete: 'links',
  },
  'denuncia-rh': denunciaFalsa('qua', '08:55', 'RH', 'O aviso de holerite foi bloqueado para a empresa inteira e o RH passou a manhã explicando o mal-entendido.', [
    'O e-mail vinha de unbnet.com.br',
    'Não tinha link nenhum: pedia para digitar o endereço',
    'Não pedia senha nem dados',
  ]),
  pendrive: {
    dia: 'qua',
    hora: '13:20',
    texto:
      'Você plugou o pendrive no seu computador. Não tinha planilha nenhuma: um programa rodou sozinho e abriu uma porta para o atacante dentro da rede.',
    pistas: ['Etiqueta curiosa para você não resistir', 'Origem desconhecida', 'A TI analisa esse tipo de coisa num computador isolado'],
    verbete: 'links',
  },
  'pendrive-recepcao': {
    dia: 'qua',
    hora: '13:20',
    texto:
      'Você plugou o pendrive no computador da recepção. Ele também está na rede da empresa: o programa se espalhou dali para o servidor de arquivos.',
    pistas: ['Todo computador da rede é uma porta de entrada', 'Origem desconhecida', 'A TI analisa esse tipo de coisa num computador isolado'],
    verbete: 'links',
  },

  // Quinta
  anexo: {
    dia: 'qui',
    hora: '09:20',
    texto:
      'Você abriu NF_outubro.pdf.exe. Não era uma nota fiscal: era um programa que começou a criptografar os arquivos da sua máquina e da rede.',
    pistas: ['A extensão final era .exe, não .pdf', 'Zip com senha para escapar do antivírus', 'Pressa para "não atrasar o pagamento"'],
    verbete: 'backup',
  },
  'denuncia-julia': denunciaFalsa('qui', '09:12', 'Júlia, da Contabilidade', 'A conta dela foi bloqueada no dia do fechamento do mês.', [
    'O e-mail vinha de unbnet.com.br',
    'Sem link nem anexo',
    'O pedido batia com a sua tarefa de hoje',
  ]),
  'backup-mesmo-servidor': {
    dia: 'qui',
    hora: '18:10',
    texto:
      'Você deixou o backup no próprio servidor. A TI fez um teste de ataque no fim do dia: a cópia foi criptografada junto com os arquivos e não sobrou nada para restaurar.',
    pistas: ['A cópia ficava na mesma máquina dos arquivos', 'Sem verificação de integridade', 'A regra da casa era cópia fora da rede'],
    verbete: 'backup',
  },
  'backup-semanal': {
    dia: 'qui',
    hora: '18:10',
    texto:
      'Você configurou o backup só aos domingos. No teste de fim de dia, a TI mostrou que um ataque na sexta perderia a semana inteira de trabalho.',
    pistas: ['Cópia semanal perde dias inteiros', 'A regra da casa era cópia diária', 'Também faltava a verificação'],
    verbete: 'backup',
  },

  // Sexta
  ransomware: {
    dia: 'sex',
    hora: '16:45',
    texto:
      'Você restaurou a cópia de hoje, 12:00. Ela já tinha o ransomware, que voltou a criptografar o servidor inteiro, inclusive as cópias antigas.',
    pistas: ['A cópia de hoje foi feita depois do ataque', 'Ela já continha arquivos criptografados', 'A cópia de quinta estava íntegra e verificada'],
    verbete: 'backup',
  },
  'backup-antigo': {
    dia: 'sex',
    hora: '16:45',
    texto:
      'Você restaurou a cópia de quarta. O ataque foi contido, mas a empresa inteira perdeu 2 dias de trabalho que estavam salvos na cópia de quinta.',
    pistas: ['A cópia de quinta, 23:00, estava íntegra', 'Ela foi verificada às 23:40, antes do ataque', 'Quanto mais antiga a cópia, mais trabalho se perde'],
    verbete: 'backup',
  },
};
