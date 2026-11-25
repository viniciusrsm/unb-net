import type { VerbeteId } from '../tipos';

export type Verbete = {
  id: VerbeteId;
  chip: string;
  titulo: string;
  definicao: string;
  reconhecer: string[];
  fazer: string;
};

export const VERBETES: Verbete[] = [
  {
    id: 'phishing',
    chip: 'Phishing',
    titulo: 'Phishing',
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
    definicao: 'Sites que imitam lojas de verdade para receber o pagamento e nunca entregar o produto.',
    reconhecer: [
      'Preço muito abaixo do mercado e cronômetro de pressão',
      'Pagamento só por Pix ou transferência',
      'Sem CNPJ, endereço, política de troca ou canal de atendimento',
    ],
    fazer: 'Prefira lojas conhecidas, confira o CNPJ, respeite o limite autorizado e pague com cartão, que permite contestar a compra.',
  },
  {
    id: 'links',
    chip: 'Links e anexos',
    titulo: 'Links e anexos',
    definicao: 'Links, arquivos e dispositivos que levam a páginas falsas de login ou instalam programas que roubam dados.',
    reconhecer: [
      'Endereço parecido com o oficial, ou escondido num link encurtado',
      'Arquivo com extensão dupla, como .pdf.exe, ou zip com senha',
      'Pendrive ou arquivo de origem desconhecida',
    ],
    fazer: 'Não clique, não abra e não plugue. Acesse o sistema digitando o endereço oficial e entregue o que for suspeito para a TI.',
  },
  {
    id: 'senhas',
    chip: 'Senhas fortes',
    titulo: 'Senhas fortes',
    definicao: 'A senha é a chave do sistema. Uma senha fraca, repetida ou emprestada abre a porta para qualquer um.',
    reconhecer: [
      'Senha com nome, cargo, data ou sequência',
      'A mesma senha usada em vários serviços',
      'Alguém pedindo sua senha, mesmo um colega',
    ],
    fazer:
      'Use uma frase longa e única para cada serviço, guarde num gerenciador aprovado pela TI e nunca empreste sua senha.',
  },
  {
    id: 'mfa',
    chip: 'Duas etapas',
    titulo: 'Verificação em duas etapas',
    definicao:
      'Uma segunda confirmação, como um código ou um aviso no celular, que impede o acesso mesmo quando a senha vazou.',
    reconhecer: [
      'Pedido de aprovação de login que você não fez',
      'Alguém pedindo o código que chegou no seu celular',
      'Vários pedidos seguidos para você aprovar "só para parar"',
    ],
    fazer: 'Nunca aprove o que você não pediu e nunca passe o código para ninguém. Negue, troque a senha e avise a TI.',
  },
  {
    id: 'engenharia',
    chip: 'Engenharia social',
    titulo: 'Engenharia social',
    definicao:
      'Manipulação de pessoas, por telefone, pessoalmente ou por mensagem, para conseguir acesso, dados ou dinheiro sem precisar invadir nada.',
    reconhecer: [
      'Autoridade ou simpatia para você não questionar',
      'Pressa, ameaça ou um favor "rapidinho"',
      'Pedido de dados, pagamento ou acesso fora do processo normal',
    ],
    fazer:
      'Desligue e ligue de volta pelo número oficial. Confirme mudanças de conta bancária pelo contato do contrato e não abra portas para quem não tem crachá.',
  },
  {
    id: 'dados',
    chip: 'Dados pessoais',
    titulo: 'Dados pessoais e LGPD',
    definicao:
      'CPF, telefone, endereço e dados bancários de clientes e colegas são protegidos por lei. A empresa responde por qualquer vazamento.',
    reconhecer: [
      'Planilha de clientes indo para e-mail ou celular pessoal',
      'Formulário fora do sistema pedindo dados bancários',
      'Documentos e telas abertos sem ninguém olhando',
    ],
    fazer:
      'Compartilhe só o necessário, pelos sistemas da empresa e com autorização. Bloqueie a tela ao sair e guarde documentos impressos.',
  },
  {
    id: 'wifi',
    chip: 'Redes e Wi-Fi',
    titulo: 'Redes e Wi-Fi',
    definicao: 'Redes abertas ou falsas permitem que alguém no mesmo lugar veja ou altere o que você envia.',
    reconhecer: [
      'Rede aberta, sem senha, com nome genérico',
      'Duas redes com nomes quase iguais',
      'Página de login pedindo dados pessoais para liberar a internet',
    ],
    fazer: 'Fora da empresa, use o roteador do celular ou a VPN corporativa. Nunca acesse sistemas internos numa rede aberta.',
  },
  {
    id: 'atualizacoes',
    chip: 'Atualizações',
    titulo: 'Atualizações e aplicativos',
    definicao:
      'Atualizações corrigem falhas que os atacantes já conhecem. Aplicativos de fora da loja ou com permissões demais abrem novas portas.',
    reconhecer: [
      'Atualização de segurança adiada por semanas',
      '"Atualização" que chega por e-mail ou anexo',
      'Aplicativo pedindo permissões que não fazem sentido',
    ],
    fazer: 'Instale as atualizações oficiais no mesmo dia, só pelo sistema ou loja oficial, e negue permissões desnecessárias.',
  },
  {
    id: 'backup',
    chip: 'Backup',
    titulo: 'Backup',
    definicao: 'Cópias de segurança permitem voltar os arquivos a um ponto anterior a um ataque ou acidente.',
    reconhecer: [
      'Cópia no mesmo servidor ou na mesma rede é atacada junto',
      'Cópia feita depois do ataque pode estar infectada',
      'Quanto mais antiga a cópia, mais trabalho se perde',
    ],
    fazer:
      'Faça cópias diárias, isoladas da rede e verificadas. Num ataque, restaure a cópia íntegra mais recente anterior a ele.',
  },
  {
    id: 'incidentes',
    chip: 'Incidentes',
    titulo: 'Resposta a incidentes',
    definicao: 'O que fazer quando o ataque já aconteceu: conter, avisar quem precisa e recuperar, nessa ordem.',
    reconhecer: [
      'Conta enviando mensagens que o dono não mandou',
      'Arquivos sumindo ou criptografados',
      'Equipamento perdido ou dados aparecendo fora da empresa',
    ],
    fazer:
      'Primeiro contenha: bloqueie contas e isole máquinas. Depois avise a TI e o encarregado de dados. Só então recupere e investigue. Nunca esconda o incidente.',
  },
];

export const verbete = (id: VerbeteId) => VERBETES.find((v) => v.id === id) ?? VERBETES[0];
