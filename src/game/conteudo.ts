/**
 * Conteúdo do jogo. O que está no Figma foi copiado literalmente; o resto
 * (e-mails sem tela, lojas 1 e 2, verbetes além de Phishing, falhas além da
 * folha de pagamento) foi escrito seguindo o mesmo tom.
 */

export type Dia = 'seg' | 'sex';

export type VerbeteId = 'phishing' | 'lojas' | 'links' | 'senhas' | 'backup';

export type FalhaId = 'folha' | 'link' | 'denuncia-falsa' | 'loja-falsa' | 'orcamento' | 'ransomware' | 'backup-antigo';

export type Email = {
  id: string;
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
  acaoConfiar?: string;
  falhaSeConfiar?: FalhaId;
  falhaSeDenunciar?: FalhaId;
};

export const DOMINIO_OFICIAL = 'unbnet.com.br';

export const EMAILS: Email[] = [
  {
    id: 'ricardo',
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
    falhaSeDenunciar: 'denuncia-falsa',
  },
  {
    id: 'suporte',
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
    falhaSeConfiar: 'link',
  },
  {
    id: 'ti',
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
];

export const EMAILS_PENDENTES = EMAILS.filter((e) => !e.jaLido).map((e) => e.id);

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
  falha?: FalhaId;
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

export type Backup = { id: string; quando: string; detalhe: string; perigo?: boolean; falha?: FalhaId };

export const BACKUPS: Backup[] = [
  { id: 'hoje', quando: 'Hoje, 12:00', detalhe: 'Contém arquivos já criptografados', perigo: true, falha: 'ransomware' },
  { id: 'quinta', quando: 'Quinta, 23:00', detalhe: 'Íntegra, verificada às 23:40' },
  { id: 'quarta', quando: 'Quarta, 23:00', detalhe: 'Íntegra, perde 2 dias de trabalho', falha: 'backup-antigo' },
];

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
    id: 'links',
    chip: 'Links maliciosos',
    titulo: 'Links maliciosos',
    liberadoEm: 'seg',
    definicao: 'Links que levam a páginas falsas de login ou baixam programas que roubam dados.',
    reconhecer: [
      'Endereço parecido com o oficial, mas com algo a mais',
      'Ameaça de perder acesso ou dados se você não agir já',
      'Pedido de login e senha logo depois do clique',
    ],
    fazer: 'Não clique. Acesse o sistema digitando o endereço oficial e avise a TI.',
  },
  {
    id: 'senhas',
    chip: 'Senhas fortes',
    titulo: 'Senhas fortes',
    liberadoEm: 'seg',
    definicao: 'A senha é a chave do sistema. Uma senha fraca ou repetida abre a porta para qualquer um.',
    reconhecer: [
      'Senha curta, com nome, data ou sequência',
      'A mesma senha usada em vários sites',
      'Senha anotada ou compartilhada com colegas',
    ],
    fazer: 'Use uma frase longa e única para cada serviço, guarde num gerenciador de senhas e ative a verificação em duas etapas.',
  },
  {
    id: 'backup',
    chip: 'Backup',
    titulo: 'Backup',
    liberadoEm: 'sex',
    definicao: 'Cópias de segurança permitem voltar os arquivos a um ponto anterior a um ataque ou acidente.',
    reconhecer: [
      'Cópias feitas depois do ataque podem estar infectadas',
      'Só confie em cópias verificadas',
      'Quanto mais antiga a cópia, mais trabalho se perde',
    ],
    fazer: 'Restaure a cópia íntegra mais recente anterior ao ataque e isole as máquinas infectadas.',
  },
];

export type Falha = {
  dia: Dia;
  hora: string;
  titulo: string;
  texto: string;
  pistas: string[];
  verbete: VerbeteId;
};

const nomeDia: Record<Dia, string> = { seg: 'segunda-feira', sex: 'sexta-feira' };

export const FALHAS: Record<FalhaId, Falha> = {
  folha: {
    dia: 'seg',
    hora: '09:18',
    titulo: `Você foi demitido na ${nomeDia.seg}`,
    texto:
      'Você enviou a folha de pagamento para diretoria@unbnet-sa.co. O e-mail imitava o diretor, mas era phishing. Os dados de 1.240 funcionários saíram da empresa.',
    pistas: [
      'O endereço vinha de unbnet-sa.co, não de unbnet.com.br',
      'Urgência e pedido de segredo para você não checar',
      'Dados pessoais pedidos fora do sistema da empresa',
    ],
    verbete: 'phishing',
  },
  link: {
    dia: 'seg',
    hora: '09:15',
    titulo: `Você foi demitido na ${nomeDia.seg}`,
    texto:
      'Você digitou seu login e senha em unbnet-suporte.help. Em minutos, alguém entrou no sistema com a sua conta e baixou os contratos de clientes.',
    pistas: [
      'O link levava para fora de unbnet.com.br',
      'Prazo de 1 hora para você agir sem pensar',
      'A TI nunca pede senha por e-mail',
    ],
    verbete: 'links',
  },
  'denuncia-falsa': {
    dia: 'seg',
    hora: '09:15',
    titulo: `Você foi demitido na ${nomeDia.seg}`,
    texto:
      'Você denunciou como golpe um pedido legítimo da Marina, de Compras. A conta dela foi bloqueada pela TI e a compra do time de dados parou.',
    pistas: [
      'O e-mail vinha de unbnet.com.br, o domínio oficial',
      'O pedido batia com o memorando do RH',
      'Nenhum dado sensível foi pedido',
    ],
    verbete: 'phishing',
  },
  'loja-falsa': {
    dia: 'seg',
    hora: '10:05',
    titulo: `Você foi demitido na ${nomeDia.seg}`,
    texto:
      'Você pagou R$ 1.798 por Pix para prisma-ofertas.shop. O site saiu do ar uma hora depois e os monitores nunca chegaram.',
    pistas: [
      'Desconto de 68% e cronômetro para apressar a compra',
      'Pagamento somente por Pix',
      'CNPJ não informado no rodapé',
    ],
    verbete: 'lojas',
  },
  orcamento: {
    dia: 'seg',
    hora: '10:05',
    titulo: `Você foi demitido na ${nomeDia.seg}`,
    texto:
      'Você gastou R$ 6.398 no cartão corporativo, acima dos R$ 6.000 autorizados pela Marina. A compra foi estornada e o financeiro abriu uma auditoria.',
    pistas: [
      'O pedido tinha limite de R$ 6.000 no total',
      '2 unidades de R$ 3.199 passam do limite',
      'Outra loja confiável cabia no orçamento',
    ],
    verbete: 'lojas',
  },
  ransomware: {
    dia: 'sex',
    hora: '16:45',
    titulo: `Você foi demitido na ${nomeDia.sex}`,
    texto:
      'Você restaurou a cópia de hoje, 12:00. Ela já tinha o ransomware, que voltou a criptografar o servidor inteiro, inclusive as cópias antigas.',
    pistas: [
      'A cópia de hoje foi feita depois do ataque',
      'Ela já continha arquivos criptografados',
      'A cópia de quinta estava íntegra e verificada',
    ],
    verbete: 'backup',
  },
  'backup-antigo': {
    dia: 'sex',
    hora: '16:45',
    titulo: `Você foi demitido na ${nomeDia.sex}`,
    texto:
      'Você restaurou a cópia de quarta. O ataque foi contido, mas a empresa inteira perdeu 2 dias de trabalho que estavam salvos na cópia de quinta.',
    pistas: [
      'A cópia de quinta, 23:00, estava íntegra',
      'Ela foi verificada às 23:40, antes do ataque',
      'Quanto mais antiga a cópia, mais trabalho se perde',
    ],
    verbete: 'backup',
  },
};
