import type { Ilustracao } from '../tipos';

export type Produto = { id: Ilustracao; nome: string; plural: string; preco: number; qtdMax: number };

export const PRODUTOS: Produto[] = [
  { id: 'monitor', nome: 'Monitor 27 polegadas QHD, 165 Hz', plural: 'monitores', preco: 2749, qtdMax: 2 },
  { id: 'notebook', nome: 'Notebook 14", 16 GB, SSD 512 GB', plural: 'notebooks', preco: 4390, qtdMax: 2 },
  { id: 'headset', nome: 'Headset com cancelamento de ruído', plural: 'headsets', preco: 690, qtdMax: 4 },
  { id: 'webcam', nome: 'Webcam Full HD com microfone', plural: 'webcams', preco: 420, qtdMax: 4 },
  { id: 'cadeira', nome: 'Cadeira ergonômica com apoio lombar', plural: 'cadeiras', preco: 1490, qtdMax: 3 },
  { id: 'teclado', nome: 'Teclado sem fio com descanso de pulso', plural: 'teclados', preco: 340, qtdMax: 4 },
];

export const SOLICITANTES = [
  { nome: 'Marina Costa', setor: 'Compras', usuario: 'marina.costa@', time: 'o time de dados' },
  { nome: 'Bruno Teixeira', setor: 'Infraestrutura', usuario: 'bruno.teixeira@', time: 'a equipe de suporte' },
  { nome: 'Larissa Duarte', setor: 'Atendimento', usuario: 'larissa.duarte@', time: 'a central de atendimento' },
  { nome: 'Renato Oliveira', setor: 'Projetos', usuario: 'renato.oliveira@', time: 'os novos analistas' },
];

export const LOJAS_LEGITIMAS = [
  { nome: 'Monitorama', dominio: 'monitorama.com.br' },
  { nome: 'TecnoPreço', dominio: 'tecnopreco.com.br' },
  { nome: 'Casa do Escritório', dominio: 'casadoescritorio.com.br' },
  { nome: 'InfoMais', dominio: 'infomais.com.br' },
  { nome: 'Ponto Digital', dominio: 'pontodigital.com.br' },
];

export const LOJAS_FALSAS = [
  { nome: 'Prisma Ofertas', dominio: 'prisma-ofertas.shop' },
  { nome: 'Mega Saldão Tech', dominio: 'megasaldao-tech.store' },
  { nome: 'Outlet Oficial Brasil', dominio: 'outlet-oficial-br.online' },
  { nome: 'Queima Total Info', dominio: 'queimatotal.top' },
];

export const SINAIS_FALSOS = [
  'Pagamento somente por Pix',
  'CNPJ não informado no rodapé',
  'Site criado há 6 dias',
  'Sem política de troca ou devolução',
  'Atendimento só por WhatsApp',
  'Todas as avaliações com 5 estrelas no mesmo dia',
];
