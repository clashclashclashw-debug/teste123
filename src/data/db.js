import KitDomPequeno from '../../assets/produtos/kit-dom-pequeno.jpeg';
import KitDomMedio from '../../assets/produtos/kit-dom-medio.jpeg';
import KitDomGrande from '../../assets/produtos/kit-dom-grande.jpeg';
import KitEmpBasico from '../../assets/produtos/kit-emp-basico.jpeg';
import KitEmpMedio from '../../assets/produtos/kit-emp-medio.jpeg';
import KitEmpCompleto from '../../assets/produtos/kit-emp-completo.jpeg';
import KitEscolar from '../../assets/produtos/kit-escolar.jpeg';
import KitOutBasico from '../../assets/produtos/kit-out-basico.jpeg';
import KitOutPernoite from '../../assets/produtos/kit-out-pernoite.jpeg';
import Radio from '../../assets/produtos/radio.jpeg';
import Lanterna from '../../assets/produtos/lanterna.jpeg';
import Apito from '../../assets/produtos/apito.jpeg';
import Garrafa from '../../assets/produtos/garrafa.jpeg';
import Pulseira from '../../assets/produtos/pulseira.jpeg';
import Estojo from '../../assets/produtos/estojo.jpeg';
import SacoCama from '../../assets/produtos/saco-cama.jpeg';
import Canivete from '../../assets/produtos/canivete.jpeg';
import Manta from '../../assets/produtos/manta.jpeg';
import Tarp from '../../assets/produtos/tarp.jpeg';
import Fogao from '../../assets/produtos/fogao.jpeg';

// In-memory database (simulates Excel/backend)
// In a real app, this would be replaced by AsyncStorage + API calls

export const DB = {
  users: [
    { id: 1, nome: 'Administrador', email: 'admin@emergencia.pt', password: 'admin123', role: 'admin', created_at: '2024-01-01' },
    { id: 2, nome: 'João Silva',    email: 'joao@email.com',      password: 'user123',  role: 'user',  created_at: '2024-01-15' },
    { id: 3, nome: 'Maria Santos',  email: 'maria@email.com',     password: 'user123',  role: 'user',  created_at: '2024-02-01' },
    { id: 4, nome: 'Carlos Sousa',  email: 'carlos@email.com',    password: 'user123',  role: 'user',  created_at: '2024-04-10' },
    { id: 5, nome: 'Ana Ferreira',  email: 'ana@email.com',       password: 'user123',  role: 'user',  created_at: '2024-04-18' },
    { id: 6, nome: 'Rui Pereira',   email: 'rui@email.com',       password: 'user123',  role: 'user',  created_at: '2024-05-02' },
    { id: 7, nome: 'Inês Nunes',    email: 'ines@email.com',      password: 'user123',  role: 'user',  created_at: '2024-05-20' },
  ],
  products: [
    // ── Kits Domiciliares ─────────────────────────────────────────────────
    { id: 1,  nome: 'Kit Domiciliar Pequeno',       preco: 22.00,  stock: 100, categoria: 'Kits Domiciliares',  imagem: KitDomPequeno,  descricao: 'Compacto e funcional, reúne ferramentas simples mas estratégicas para garantir segurança, orientação e conforto em momentos de imprevisto. Inclui mochila repelente à água, kit de primeiros socorros, rádio portátil, manta térmica, garrafa dobrável, apito, baralho de cartas e mini lanterna LED.' },
    { id: 2,  nome: 'Kit Domiciliar Médio',         preco: 33.00,  stock: 100, categoria: 'Kits Domiciliares',  imagem: KitDomMedio,    descricao: 'Pensado para garantir autonomia durante 72 horas. Inclui saco impermeável, manta isotérmica, apito, powerbank, pulseira multifunções, kit de primeiros socorros, lanterna com dínamo, rádio portátil, pilhas, garrafa comprimível, pastilhas de purificação de água e lightsticks.' },
    { id: 3,  nome: 'Kit Domiciliar Grande',        preco: 55.00,  stock: 100, categoria: 'Kits Domiciliares',  imagem: KitDomGrande,   descricao: 'Projetado para assegurar energia, água, alimentação e primeiros socorros durante 5 a 7 dias. Inclui mochila militar, manta isotérmica reforçada, rádio com manivela, powerbank solar, lanterna LED tática, cabos multi-carregamento, rações liofilizadas e barras energéticas. Inclui Guia Digital Exclusivo.' },
    // ── Kits Empresariais ─────────────────────────────────────────────────
    { id: 4,  nome: 'Kit Básico Empresarial',       preco: 50.00,  stock: 100, categoria: 'Kits Empresariais', imagem: KitEmpBasico,   descricao: 'Desenvolvido para escritórios, lojas e pequenos estabelecimentos. Inclui estojo de primeiros socorros, 2 lanternas LED, 2 pilhas extra, extintor de incêndio, sinalização de emergência, apito, fita de sinalização, luvas, máscaras e manual rápido ilustrado.' },
    { id: 5,  nome: 'Kit Intermédio Empresarial',   preco: 95.00,  stock: 100, categoria: 'Kits Empresariais', imagem: KitEmpMedio,    descricao: 'Para empresas com maior número de pessoas ou espaços amplos. Inclui estojo de primeiros socorros, 4 lanternas LED, extintor, sinalização, apito, fita de sinalização, luvas, máscaras, manual ilustrado, manta térmica, cobertores ignífugos e kit de ferramentas básico.' },
    { id: 6,  nome: 'Kit Completo Empresarial',     preco: 145.00, stock: 100, categoria: 'Kits Empresariais', imagem: KitEmpCompleto, descricao: 'Para empresas de maior dimensão, hotéis e espaços com elevado fluxo de pessoas. Inclui kit de trauma, desfibrilhador externo automático, estojo de primeiros socorros, 6 lanternas LED, extintor de incêndio, sinalização e apito de emergência.' },
    { id: 7,  nome: 'Kit Emergência Escolar',       preco: 120.00, stock: 100, categoria: 'Kits Empresariais', imagem: KitEscolar,     descricao: 'Solução completa para escolas em situações de evacuações ou acidentes. Inclui estojo de primeiros socorros, 6 lanternas LED, 4 coletes refletores, máscara de reanimação, apito, megafone portátil, fita de sinalização e luvas de trabalho.' },
    // ── Kits Outdoor ──────────────────────────────────────────────────────
    { id: 8,  nome: 'Kit Outdoor Básico',           preco: 20.00,  stock: 100, categoria: 'Kits Outdoor',      imagem: KitOutBasico,   descricao: 'Compacto e fácil de transportar para atividades ao ar livre. Inclui pulseira multifunções, canivete multiusos, apito de sinalização, pastilhas purificadoras de água, manta térmica e lanterna LED.' },
    { id: 9,  nome: 'Kit Outdoor Pernoite',         preco: 55.00,  stock: 100, categoria: 'Kits Outdoor',      imagem: KitOutPernoite, descricao: 'Para dormidas ao ar livre com autonomia e proteção. Inclui estojo de primeiros socorros, paracord 20m, lanterna LED, mosquetão, manta térmica, fogão portátil, kit de cozinha portátil, rádio portátil, tarp, saco-cama e canivete multiusos.' },
    // ── Produtos Individuais ──────────────────────────────────────────────
    { id: 10, nome: 'Rádio Portátil',               preco: 9.00,   stock: 100, categoria: 'Produtos Individuais', imagem: Radio,         descricao: 'Equipamento essencial para manter acesso a informações oficiais em situações de falha de energia. Permite acompanhar transmissões AM/FM sem internet nem redes móveis.' },
    { id: 11, nome: 'Lanterna LED',                  preco: 10.00,  stock: 100, categoria: 'Produtos Individuais', imagem: Lanterna,      descricao: 'Compacta, resistente e de fácil utilização. Garante iluminação imediata em situações de falha de energia, evacuação ou ambientes com pouca visibilidade. Alimentada por pilhas AA/AAA.' },
    { id: 12, nome: 'Apito de Sinalização',          preco: 2.00,   stock: 100, categoria: 'Produtos Individuais', imagem: Apito,         descricao: 'Volume de 108 dB, som bitonal ouvido à distância em todas as direções. Inclui pinça e cordão. Adequado para qualquer climatologia.' },
    { id: 13, nome: 'Garrafa Dobrável 500ml',        preco: 5.00,   stock: 100, categoria: 'Produtos Individuais', imagem: Garrafa,       descricao: 'Garrafa de silicone dobrável com tampa de aço inoxidável e mosquetão de alumínio. Capacidade de 500ml. Ocupa pouco espaço quando vazia.' },
    { id: 14, nome: 'Pulseira Multifunções',         preco: 5.00,   stock: 100, categoria: 'Produtos Individuais', imagem: Pulseira,      descricao: 'Material paracord resistente (nylon), cordão de 2,5–3 metros quando desmontado, fecho ajustável. Leve e confortável para uso diário.' },
    { id: 15, nome: 'Estojo de Primeiros Socorros',  preco: 10.00,  stock: 100, categoria: 'Produtos Individuais', imagem: Estojo,        descricao: 'Compacto e organizado. Inclui 2 pares de luvas de nitrilo, compressas estéreis, pensos rápidos, pinça, termómetro digital, ligadura hipoalergénica, toalhetes de álcool a 70% e tesoura universal.' },
    { id: 16, nome: 'Saco de Cama Impermeável',      preco: 5.00,   stock: 100, categoria: 'Produtos Individuais', imagem: SacoCama,      descricao: 'Protege equipamentos e documentos contra água, chuva e humidade. Leve, resistente e reutilizável. Ideal para kits de emergência ou uso outdoor.' },
    { id: 17, nome: 'Canivete Multifunções',         preco: 8.00,   stock: 100, categoria: 'Produtos Individuais', imagem: Canivete,      descricao: 'Lâmina de aço inoxidável, cabo de aço resistente, design dobrável e compacto. Ideal para kits de emergência, camping ou viagens.' },
    { id: 18, nome: 'Manta Térmica de Uso Único',    preco: 2.40,   stock: 100, categoria: 'Produtos Individuais', imagem: Manta,         descricao: 'Dimensões 160x210 cm. Face dourada para captar calor; face prateada para manter fresco. Volume e peso reduzido na mochila.' },
    { id: 19, nome: 'Tarp',                          preco: 21.00,  stock: 100, categoria: 'Produtos Individuais', imagem: Tarp,          descricao: 'Abrigo multifunções impermeável para sol e chuva. Inclui tela impermeável, 2 mastros de 200 cm, 6 estacas, 6 cordas e bolsa. Capacidade para 4 pessoas.' },
    { id: 20, nome: 'Fogão Portátil',                preco: 25.00,  stock: 100, categoria: 'Produtos Individuais', imagem: Fogao,         descricao: 'Fogão portátil com acendimento automático. Vem com cartucho de gás incluído. Tempo de ebulição para 1 litro: 6,25 min. Dimensões: 38x31,5x13 cm.' },
  ],
  orders: [
    { id: 'ORD-001', user_id: 2, data: '2024-03-10', valor_total: 119.98, status: 'concluída' },
    { id: 'ORD-002', user_id: 3, data: '2024-03-15', valor_total: 29.99,  status: 'concluída' },
    { id: 'ORD-003', user_id: 4, data: '2024-04-12', valor_total: 53.00,  status: 'concluída' },
    { id: 'ORD-004', user_id: 5, data: '2024-04-22', valor_total: 34.20,  status: 'concluída' },
    { id: 'ORD-005', user_id: 6, data: '2024-05-05', valor_total: 145.00, status: 'pendente'  },
    { id: 'ORD-006', user_id: 7, data: '2024-05-22', valor_total: 29.00,  status: 'cancelada' },
    { id: 'ORD-007', user_id: 2, data: '2024-06-01', valor_total: 76.00,  status: 'concluída' },
  ],
  order_items: [
    { id: 1,  order_id: 'ORD-001', product_id: 1,  quantidade: 2, preco_unitario: 29.99  },
    { id: 2,  order_id: 'ORD-001', product_id: 4,  quantidade: 1, preco_unitario: 24.99  },
    { id: 3,  order_id: 'ORD-001', product_id: 5,  quantidade: 1, preco_unitario: 39.99  },
    { id: 4,  order_id: 'ORD-002', product_id: 1,  quantidade: 1, preco_unitario: 29.99  },
    { id: 5,  order_id: 'ORD-003', product_id: 2,  quantidade: 1, preco_unitario: 33.00  },
    { id: 6,  order_id: 'ORD-003', product_id: 11, quantidade: 2, preco_unitario: 10.00  },
    { id: 7,  order_id: 'ORD-004', product_id: 8,  quantidade: 1, preco_unitario: 20.00  },
    { id: 8,  order_id: 'ORD-004', product_id: 12, quantidade: 2, preco_unitario: 2.00   },
    { id: 9,  order_id: 'ORD-004', product_id: 18, quantidade: 3, preco_unitario: 2.40   },
    { id: 10, order_id: 'ORD-005', product_id: 6,  quantidade: 1, preco_unitario: 145.00 },
    { id: 11, order_id: 'ORD-006', product_id: 10, quantidade: 1, preco_unitario: 9.00   },
    { id: 12, order_id: 'ORD-006', product_id: 15, quantidade: 1, preco_unitario: 10.00  },
    { id: 13, order_id: 'ORD-006', product_id: 14, quantidade: 2, preco_unitario: 5.00   },
    { id: 14, order_id: 'ORD-007', product_id: 3,  quantidade: 1, preco_unitario: 55.00  },
    { id: 15, order_id: 'ORD-007', product_id: 19, quantidade: 1, preco_unitario: 21.00  },
  ],
};