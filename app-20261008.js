// ============================================================
// SIMULADO — SEGUNDA AVALIAÇÃO DE REDES DE COMPUTADORES
// Banco revisado e classificado por conteúdo oficial e extras do Moodle.
// Simulado oficial: blueprint de 30; personalizado: até 30, com equilíbrio por tema.
// ============================================================


// ============================================================
// UTILIDADES GERAIS
// ============================================================

function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}


const TOPIC_METADATA = Object.freeze({
  "Arquitetura": { group: "fundamentos", subtopic: "arquitetura_internet" },
  "Protocolos": { group: "fundamentos", subtopic: "pilha_protocolos" },
  "Comutação": { group: "comutacao", subtopic: "pacotes_circuitos" },
  "Camada de rede": { group: "camada_rede_roteadores", subtopic: "servicos_camada_rede" },
  "Roteamento": { group: "camada_rede_roteadores", subtopic: "repasse_roteamento" },
  "Roteadores": { group: "camada_rede_roteadores", subtopic: "arquitetura_roteador" },
  "ICMP": { group: "icmp", subtopic: "ping_traceroute" },
  "Gateway": { group: "subredes_roteamento", subtopic: "gateway" },
  "ARP": { group: "arp", subtopic: "arp" },
  "DHCP": { group: "ipv4_geral", subtopic: "dhcp" },
  "IPv4": { group: "ipv4_geral", subtopic: "enderecamento_ipv4" },
  "NAT": { group: "ipv4_nat", subtopic: "nat_pat" },
  "Subnetting": { group: "subnetting", subtopic: "calculo_subnetting" },
  "VLSM": { group: "subnetting", subtopic: "vlsm" },
  "VLAN": { group: "vlan", subtopic: "vlan_intervlan" },
  "IPv6": { group: "ipv6", subtopic: "ipv6_geral" },
  "SLAAC": { group: "ipv6", subtopic: "atribuicao_ipv6" },
  "NDP": { group: "ipv6", subtopic: "ndp" }
});


function normalizeConceptPart(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 80);
}


function questionMetadata(topic, metadata = {}) {
  const defaults = TOPIC_METADATA[topic];

  if (!defaults && (!metadata.group || !metadata.subtopic)) {
    throw new Error(`Tema sem metadados estruturais: ${topic}`);
  }

  return {
    ...defaults,
    ...metadata
  };
}


function makeQuestion(topic, text, correct, wrongOptions, explanation, metadata = {}) {
  const options = [];

  [correct, ...wrongOptions].forEach(option => {
    const value = String(option);

    if (!options.includes(value)) {
      options.push(value);
    }
  });

  if (options.length < 4) {
    throw new Error(`Questão sem 4 alternativas: ${text}`);
  }

  const shuffled = shuffle(options.slice(0, 4));

  const classification = questionMetadata(topic, metadata);
  const concept = classification.concept || [
    classification.group,
    classification.subtopic,
    normalizeConceptPart(correct)
  ].join(":");

  return {
    ...classification,
    concept,
    topic,
    q: text,
    o: shuffled,
    a: shuffled.indexOf(String(correct)),
    correctOption: String(correct),
    e: explanation
  };
}


function normalizeExistingQuestion(question) {
  const classification = questionMetadata(question.topic, question);
  const correct = question.correctOption || question.o[question.a];
  const shuffledOptions = shuffle(question.o);

  return {
    ...question,
    ...classification,
    o: shuffledOptions,
    a: shuffledOptions.indexOf(correct),
    correctOption: correct,
    source: question.source || "banco_anterior",
    concept: question.concept || [
      classification.group,
      classification.subtopic,
      normalizeConceptPart(correct)
    ].join(":")
  };
}


// ============================================================
// 40 QUESTÕES ORIGINAIS
// ============================================================

const originalQuestions = [

  {
    topic: "Camada de rede",
    q: "A função central da camada de rede é:",
    o: [
      "Comunicar processos",
      "Transferir pacotes da origem ao destino através de redes",
      "Corrigir todo erro físico",
      "Fornecer nomes DNS"
    ],
    a: 1,
    e: "A camada de rede leva datagramas do host de origem ao host de destino, inclusive atravessando redes diferentes. Comunicação entre processos é responsabilidade da camada de transporte."
  },

  {
    topic: "Comutação",
    q: "Em comutação de pacotes, é correto afirmar que:",
    o: [
      "Recursos são sempre reservados",
      "Pacotes nunca aguardam",
      "Enlaces podem ser compartilhados estatisticamente",
      "Cada fluxo precisa de circuito físico"
    ],
    a: 2,
    e: "Na comutação de pacotes, vários usuários compartilham os enlaces conforme têm dados a transmitir. Isso é multiplexação estatística e pode gerar filas."
  },

  {
    topic: "Camada de rede",
    q: "O serviço IP é chamado best effort porque:",
    o: [
      "Garante atraso",
      "Garante entrega",
      "Não fornece garantias rígidas de entrega, ordem ou atraso",
      "Usa circuito dedicado"
    ],
    a: 2,
    e: "O IP tenta entregar os datagramas, mas não garante entrega, ordem, atraso máximo nem vazão. Confiabilidade, quando necessária, é tratada por outras camadas."
  },

  {
    topic: "Protocolos",
    q: "A PDU da camada de enlace é:",
    o: [
      "Mensagem",
      "Segmento",
      "Datagrama",
      "Quadro"
    ],
    a: 3,
    e: "Na pilha de cinco camadas: aplicação usa mensagem; transporte, segmento; rede, datagrama; enlace, quadro; física, bits."
  },

  {
    topic: "Roteamento",
    q: "Repasse e roteamento diferem porque:",
    o: [
      "Repasse calcula caminhos globais",
      "Roteamento determina caminhos e repasse usa a tabela para cada pacote",
      "São sinônimos perfeitos",
      "Repasse ocorre só no host"
    ],
    a: 1,
    e: "Roteamento é o processo que calcula os caminhos e constrói as tabelas. Repasse é a ação local de consultar a tabela e enviar cada pacote à porta correta."
  },

  {
    topic: "Roteadores",
    q: "O plano de dados de um roteador está mais relacionado a:",
    o: [
      "Encaminhar pacotes",
      "Negociar BGP humano",
      "Registrar domínios",
      "Distribuir blocos IP"
    ],
    a: 0,
    e: "O plano de dados executa o encaminhamento por pacote. O plano de controle calcula e mantém as informações usadas nessa decisão."
  },

  {
    topic: "Roteamento",
    q: "No casamento do prefixo mais longo, vence:",
    o: [
      "/0",
      "O menor prefixo numérico",
      "A correspondência com maior comprimento de prefixo",
      "A primeira linha da tabela"
    ],
    a: 2,
    e: "Entre as rotas que combinam com o destino, escolhe-se a mais específica: aquela com mais bits no prefixo."
  },

  {
    topic: "Roteadores",
    q: "Bloqueio HOL ocorre quando:",
    o: [
      "Um pacote na frente da fila impede outros atrás",
      "O TTL é 0",
      "O DNS falha",
      "O host não tem IP"
    ],
    a: 0,
    e: "HOL significa Head-of-Line: o pacote da frente aguarda uma saída ocupada e bloqueia pacotes atrás dele."
  },

  {
    topic: "ICMP",
    q: "O ping usa principalmente:",
    o: [
      "ARP Request/Reply",
      "ICMP Echo Request/Reply",
      "TCP SYN/ACK",
      "DHCP Discover/Offer"
    ],
    a: 1,
    e: "O ping envia ICMP Echo Request e espera ICMP Echo Reply."
  },

  {
    topic: "ICMP",
    q: "O traceroute revela saltos porque cada roteador:",
    o: [
      "Aumenta TTL",
      "Diminui TTL e pode enviar Time Exceeded",
      "Envia ARP Reply global",
      "Consulta DNS"
    ],
    a: 1,
    e: "Cada roteador reduz o TTL. Quando ele chega a zero, o roteador descarta o datagrama e normalmente responde com ICMP Time Exceeded."
  },

  {
    topic: "Subnetting",
    q: "Uma /23 possui quantos endereços válidos tradicionais?",
    o: ["254", "510", "512", "1022"],
    a: 1,
    e: "/23 deixa 9 bits de host: 2⁹ = 512. Descontando rede e broadcast, restam 510 hosts válidos."
  },

  {
    topic: "Subnetting",
    q: "Qual é o menor prefixo para 10 hosts?",
    o: ["/29", "/28", "/27", "/30"],
    a: 1,
    e: "4 bits de host fornecem 2⁴ − 2 = 14 hosts. Logo, 32 − 4 = /28."
  },

  {
    topic: "Subnetting",
    q: "Qual é o broadcast de 192.168.222.150/27?",
    o: [
      "192.168.222.151",
      "192.168.222.158",
      "192.168.222.159",
      "192.168.222.160"
    ],
    a: 2,
    e: "/27 possui blocos de 32. 150 pertence ao intervalo 128–159. Logo, o broadcast é .159."
  },

  {
    topic: "Subnetting",
    q: "Qual é o primeiro host válido da rede 192.168.222.150/27?",
    o: [
      "192.168.222.128",
      "192.168.222.129",
      "192.168.222.130",
      "192.168.222.131"
    ],
    a: 1,
    e: "A rede é 192.168.222.128 e o primeiro host válido é 192.168.222.129."
  },

  {
    topic: "Subnetting",
    q: "Qual é o broadcast de 172.31.128.245/22?",
    o: [
      "172.31.128.255",
      "172.31.129.255",
      "172.31.131.255",
      "172.31.132.255"
    ],
    a: 2,
    e: "/22 equivale a 255.255.252.0. O bloco começa em 128 e termina em 131.255."
  },

  {
    topic: "Subnetting",
    q: "Qual máscara decimal corresponde a /26?",
    o: [
      "255.255.255.128",
      "255.255.255.192",
      "255.255.255.224",
      "255.255.255.240"
    ],
    a: 1,
    e: "/26 = 255.255.255.192."
  },

  {
    topic: "VLSM",
    q: "Em 200.101.192.0/22, uma rede para 400 hosts precisa de:",
    o: ["/24", "/23", "/25", "/22 obrigatoriamente"],
    a: 1,
    e: "/23 fornece 510 hosts válidos. /24 fornece apenas 254."
  },

  {
    topic: "Subnetting",
    q: "Qual é o endereço de rede de 101.100.50.172/28?",
    o: [
      "101.100.50.160",
      "101.100.50.168",
      "101.100.50.172",
      "101.100.50.175"
    ],
    a: 0,
    e: "/28 possui blocos de 16. 172 está no bloco 160–175."
  },

  {
    topic: "Subnetting",
    q: "Qual é o broadcast da rede 101.100.50.172/28?",
    o: [
      "101.100.50.174",
      "101.100.50.175",
      "101.100.50.176",
      "101.100.50.191"
    ],
    a: 1,
    e: "O bloco é 160–175. Portanto, o broadcast é 101.100.50.175."
  },

  {
    topic: "Gateway",
    q: "Um host envia diretamente ao destino quando:",
    o: [
      "O destino está no mesmo prefixo de sub-rede",
      "Sempre",
      "O destino é público",
      "DHCP está ativo"
    ],
    a: 0,
    e: "Se origem e destino pertencem à mesma sub-rede, o envio ocorre diretamente pelo enlace local."
  },

  {
    topic: "ARP",
    q: "Para um destino remoto, o ARP do host resolve normalmente o MAC:",
    o: [
      "Do servidor remoto",
      "Do DNS",
      "Do gateway padrão",
      "Do ISP Tier-1"
    ],
    a: 2,
    e: "ARP é local. Para destino remoto, o host precisa descobrir o MAC do gateway padrão."
  },

  {
    topic: "DHCP",
    q: "DORA significa:",
    o: [
      "Discover, Offer, Request, Acknowledge",
      "Data, Output, Route, ARP",
      "Discover, Open, Reply, Accept",
      "Nenhuma das alternativas"
    ],
    a: 0,
    e: "A sequência DHCP é Discover → Offer → Request → Acknowledge."
  },

  {
    topic: "IPv4",
    q: "Qual destes endereços é privado?",
    o: [
      "8.8.8.8",
      "172.20.10.5",
      "200.1.1.1",
      "100.1.1.1"
    ],
    a: 1,
    e: "172.20.10.5 pertence ao bloco privado 172.16.0.0/12."
  },

  {
    topic: "NAT",
    q: "Uma desvantagem do NAT discutida nos materiais é:",
    o: [
      "Amplia o espaço IPv4 para 128 bits",
      "Quebra o modelo fim a fim",
      "Elimina tabelas",
      "Torna todo host público"
    ],
    a: 1,
    e: "O NAT altera endereços/portas e mantém estado, interferindo no princípio fim a fim."
  },

  {
    topic: "VLAN",
    q: "Uma porta trunk:",
    o: [
      "Pertence obrigatoriamente a uma única VLAN sem tag",
      "Transporta várias VLANs usando marcação",
      "Não pode ligar switches",
      "Substitui roteador"
    ],
    a: 1,
    e: "Trunks transportam tráfego de várias VLANs, normalmente usando IEEE 802.1Q."
  },

  {
    topic: "VLAN",
    q: "Hosts em VLANs distintas precisam, para conversar, de:",
    o: [
      "Somente hub",
      "Roteamento de camada 3",
      "ARP global",
      "NAT obrigatório"
    ],
    a: 1,
    e: "VLANs diferentes são domínios de camada 2 distintos e precisam de roteamento entre elas."
  },

  {
    topic: "VLAN",
    q: "Qual é o padrão de tagging estudado?",
    o: ["802.11", "802.1Q", "802.3u apenas", "IPv6"],
    a: 1,
    e: "IEEE 802.1Q define a marcação de VLAN."
  },

  {
    topic: "IPv6",
    q: "Um endereço IPv6 possui:",
    o: ["32 bits", "64 bits", "128 bits", "256 bits"],
    a: 2,
    e: "IPv6 utiliza endereços de 128 bits."
  },

  {
    topic: "IPv6",
    q: "Qual abreviação IPv6 é inválida?",
    o: [
      "2001:db8::1",
      "::1",
      "2001::abcd::1",
      "fd00::10"
    ],
    a: 2,
    e: ":: pode aparecer apenas uma vez em um endereço IPv6."
  },

  {
    topic: "IPv6",
    q: "Qual não é um tipo de endereço IPv6?",
    o: [
      "Unicast",
      "Multicast",
      "Anycast",
      "Broadcast"
    ],
    a: 3,
    e: "IPv6 não possui broadcast."
  },

  {
    topic: "IPv6",
    q: "Endereços link-local usam o prefixo:",
    o: [
      "FF00::/8",
      "FE80::/10",
      "2000::/3",
      "10::/8"
    ],
    a: 1,
    e: "O bloco link-local é FE80::/10."
  },

  {
    topic: "IPv6",
    q: "Endereços unique local estão associados a:",
    o: [
      "FC00::/7",
      "FE80::/10",
      "FF00::/8",
      "2000::/3"
    ],
    a: 0,
    e: "Unique Local usa FC00::/7."
  },

  {
    topic: "IPv6",
    q: "O cabeçalho base IPv6 tem:",
    o: [
      "20 bytes",
      "40 bytes fixos",
      "60 bytes fixos",
      "Tamanho sempre variável"
    ],
    a: 1,
    e: "O cabeçalho base IPv6 possui 40 bytes fixos."
  },

  {
    topic: "IPv6",
    q: "Qual campo é funcionalmente equivalente ao TTL?",
    o: [
      "Flow Label",
      "Traffic Class",
      "Hop Limit",
      "Payload Length"
    ],
    a: 2,
    e: "Hop Limit exerce no IPv6 o papel equivalente ao TTL."
  },

  {
    topic: "IPv6",
    q: "Qual campo indica o próximo cabeçalho ou protocolo?",
    o: [
      "Next Header",
      "IHL",
      "Header Checksum",
      "Identification"
    ],
    a: 0,
    e: "Next Header aponta para um cabeçalho de extensão ou protocolo superior."
  },

  {
    topic: "IPv6",
    q: "A fragmentação IPv6 em roteador intermediário:",
    o: [
      "É obrigatória",
      "É permitida se a MTU for menor que o pacote",
      "Não é permitida",
      "Ocorre só com NAT"
    ],
    a: 2,
    e: "Roteadores IPv6 não fragmentam pacotes."
  },

  {
    topic: "SLAAC",
    q: "SLAAC significa que:",
    o: [
      "Sempre precisa de DHCPv6 stateful",
      "O host pode autoconfigurar endereço sem servidor mantendo concessões",
      "Não usa NDP",
      "Só funciona em IPv4"
    ],
    a: 1,
    e: "SLAAC permite autoconfiguração stateless usando informações fornecidas por Router Advertisement."
  },

  {
    topic: "NDP",
    q: "O NDP usa quantas mensagens principais estudadas?",
    o: ["3", "4", "5", "8"],
    a: 2,
    e: "RS, RA, NS, NA e Redirect."
  },

  {
    topic: "NDP",
    q: "Neighbor Solicitation é usada para:",
    o: [
      "Traduzir nome DNS",
      "Resolver vizinho/endereço de enlace e fazer DAD",
      "Anunciar DHCP",
      "Substituir BGP"
    ],
    a: 1,
    e: "Neighbor Solicitation participa da descoberta de vizinhos e Duplicate Address Detection."
  },

  {
    topic: "NDP",
    q: "As mensagens NDP estudadas usam Hop Limit:",
    o: ["1", "64", "128", "255"],
    a: 3,
    e: "As mensagens NDP utilizam Hop Limit 255."
  }

];


// ============================================================
// BANCO EXTRA
// ============================================================

const extraPool = [];

function addQuestion(topic, text, correct, wrong, explanation, metadata = {}) {
  extraPool.push(
    makeQuestion(topic, text, correct, wrong, explanation, metadata)
  );
}


function addStructuredQuestion(
  group,
  subtopic,
  topic,
  text,
  correct,
  wrong,
  explanation,
  concept
) {
  addQuestion(topic, text, correct, wrong, explanation, {
    group,
    subtopic,
    concept,
    source: "revisao_2026"
  });
}


// ============================================================
// ARQUITETURA / COMUTAÇÃO / PDU
// ============================================================

addQuestion(
  "Arquitetura",
  "A Internet é melhor definida como:",
  "Uma rede de redes interconectadas",
  [
    "Uma única LAN mundial",
    "Um único Sistema Autônomo",
    "Uma rede exclusivamente telefônica"
  ],
  "A Internet é composta por inúmeras redes independentes interconectadas."
);

addQuestion(
  "Arquitetura",
  "Um host é:",
  "Um sistema final que pode originar ou receber dados",
  [
    "Um enlace físico",
    "Sempre um roteador",
    "Obrigatoriamente um switch"
  ],
  "Computadores, celulares e servidores são exemplos de hosts."
);

addQuestion(
  "Arquitetura",
  "Uma LAN normalmente corresponde a:",
  "Uma rede local, como uma residência, prédio ou campus",
  [
    "Uma rede mundial",
    "Uma rede pessoal de centímetros apenas",
    "Toda a Internet"
  ],
  "LAN significa Local Area Network."
);

addQuestion(
  "Arquitetura",
  "Uma WAN caracteriza-se principalmente por:",
  "Cobrir grandes distâncias geográficas",
  [
    "Ter alcance de poucos centímetros",
    "Ser obrigatoriamente Wi-Fi",
    "Não utilizar roteadores"
  ],
  "WANs conectam redes através de grandes distâncias."
);

addQuestion(
  "Arquitetura",
  "Uma PAN é uma rede:",
  "De alcance pessoal e muito curto",
  [
    "Intercontinental",
    "Metropolitana",
    "De um ISP inteiro"
  ],
  "PAN significa Personal Area Network."
);

addQuestion(
  "Arquitetura",
  "MAN significa uma rede de abrangência:",
  "Metropolitana",
  [
    "Pessoal",
    "Mundial exclusivamente",
    "Somente residencial"
  ],
  "MAN significa Metropolitan Area Network."
);

addQuestion(
  "Arquitetura",
  "ISP significa:",
  "Internet Service Provider",
  [
    "Internet Switching Protocol",
    "Internal Service Packet",
    "IP Security Provider"
  ],
  "ISP é uma organização que fornece conectividade à Internet."
);

addQuestion(
  "Arquitetura",
  "Um Sistema Autônomo é:",
  "Um conjunto de redes e roteadores sob administração e política de roteamento comum",
  [
    "Uma única porta Ethernet",
    "Um endereço IPv4 privado",
    "Um quadro Ethernet"
  ],
  "Um AS representa um domínio administrativo de roteamento."
);

addQuestion(
  "Arquitetura",
  "O protocolo mais associado ao roteamento entre Sistemas Autônomos é:",
  "BGP",
  ["ARP", "DHCP", "ICMP Echo"],
  "BGP é usado para roteamento inter-AS."
);

addQuestion(
  "Arquitetura",
  "RIP e OSPF são normalmente utilizados:",
  "Dentro de Sistemas Autônomos",
  [
    "Para substituir Ethernet",
    "Para resolver endereços MAC",
    "Para marcação VLAN"
  ],
  "RIP e OSPF são protocolos de roteamento intra-AS."
);

addQuestion(
  "Comutação",
  "Na comutação de pacotes:",
  "Os enlaces são compartilhados estatisticamente",
  [
    "Cada fluxo recebe obrigatoriamente um circuito exclusivo",
    "Nunca existem filas",
    "Todos os recursos são reservados previamente"
  ],
  "Pacotes de diferentes usuários podem compartilhar os mesmos enlaces."
);

addQuestion(
  "Comutação",
  "Na comutação de circuitos:",
  "Recursos podem ser reservados para a comunicação",
  [
    "Não há estabelecimento de caminho",
    "Pacotes sempre usam best effort",
    "Nunca existe reserva"
  ],
  "A reserva de recursos é uma característica central da comutação de circuitos."
);

addQuestion(
  "Comutação",
  "Uma vantagem da comutação de pacotes é:",
  "Bom aproveitamento de enlaces em tráfego em rajadas",
  [
    "Garantia absoluta de atraso",
    "Ausência completa de congestionamento",
    "Reserva permanente de todos os enlaces"
  ],
  "A multiplexação estatística permite aproveitar períodos de ociosidade."
);

addQuestion(
  "Comutação",
  "Uma desvantagem da comutação de pacotes é:",
  "Pode haver filas, atrasos variáveis e perdas",
  [
    "Ela sempre desperdiça toda a largura de banda",
    "Ela exige circuito físico exclusivo",
    "Ela não permite roteadores"
  ],
  "Congestionamento pode gerar filas e descarte."
);

addQuestion(
  "Comutação",
  "Uma vantagem da comutação de circuitos é:",
  "Maior previsibilidade quando os recursos foram reservados",
  [
    "Nenhum recurso precisa ser reservado",
    "Utilização estatística perfeita",
    "Nunca existe estado na rede"
  ],
  "Recursos reservados tornam o desempenho mais previsível."
);

addQuestion(
  "Comutação",
  "Uma possível desvantagem da comutação de circuitos é:",
  "Capacidade reservada pode ficar ociosa",
  [
    "Não existe caminho",
    "Não é possível transmitir voz",
    "Sempre perde pacotes por buffer"
  ],
  "Um circuito reservado pode desperdiçar recursos quando o usuário não transmite."
);

addQuestion(
  "Comutação",
  "Store-and-forward significa:",
  "O roteador recebe o pacote antes de encaminhá-lo pelo próximo enlace",
  [
    "O roteador ignora o pacote",
    "O pacote é convertido em circuito",
    "O TTL aumenta a cada salto"
  ],
  "No modelo armazena-e-reenvia, o pacote é recebido antes de ser encaminhado."
);

addQuestion(
  "Comutação",
  "Quando pacotes chegam mais rapidamente do que podem sair:",
  "Podem formar uma fila",
  [
    "O IP muda para IPv6",
    "O endereço MAC é apagado",
    "O DNS aumenta a banda"
  ],
  "A diferença entre taxa de chegada e saída gera enfileiramento."
);

addQuestion(
  "Comutação",
  "Quando um buffer está completamente cheio:",
  "Pacotes podem ser descartados",
  [
    "O TTL volta automaticamente para 255",
    "Todos os pacotes viram broadcasts",
    "A máscara muda"
  ],
  "Overflow de buffer pode causar perda de pacotes."
);

addQuestion(
  "Comutação",
  "Multiplexação estatística significa:",
  "Usuários compartilham recursos conforme possuem dados para transmitir",
  [
    "Cada usuário recebe um enlace físico permanente",
    "O enlace fica reservado mesmo ocioso",
    "Todos transmitem obrigatoriamente ao mesmo tempo"
  ],
  "Esse compartilhamento é uma característica da comutação de pacotes."
);

addQuestion(
  "Protocolos",
  "A PDU da camada de aplicação é:",
  "Mensagem",
  ["Segmento", "Datagrama", "Quadro"],
  "Aplicação → mensagem."
);

addQuestion(
  "Protocolos",
  "A PDU da camada de transporte é:",
  "Segmento",
  ["Mensagem", "Quadro", "Bit"],
  "Transporte → segmento."
);

addQuestion(
  "Protocolos",
  "A PDU da camada de rede é:",
  "Datagrama",
  ["Mensagem", "Segmento", "Quadro"],
  "Rede → datagrama ou pacote IP."
);

addQuestion(
  "Protocolos",
  "A PDU da camada física é:",
  "Bits",
  ["Mensagem", "Datagrama", "Quadro"],
  "Física → bits."
);

addQuestion(
  "Protocolos",
  "A sequência correta de encapsulamento é:",
  "Mensagem → Segmento → Datagrama → Quadro → Bits",
  [
    "Quadro → Datagrama → Segmento → Mensagem → Bits",
    "Bits → Mensagem → Quadro → Segmento → Datagrama",
    "Datagrama → Mensagem → Bits → Quadro → Segmento"
  ],
  "É a sequência das PDUs ao descer a pilha."
);

addQuestion(
  "Protocolos",
  "Encapsulamento é o processo em que:",
  "Cada camada adiciona suas informações de controle aos dados recebidos da camada superior",
  [
    "Todos os cabeçalhos são removidos na origem",
    "IPv4 sempre é convertido em IPv6",
    "O roteador reserva um circuito"
  ],
  "Cada camada adiciona cabeçalho e, em alguns casos, trailer."
);

addQuestion(
  "Arquitetura",
  "O princípio fim-a-fim favorece:",
  "Um núcleo relativamente simples e funções complexas nas extremidades",
  [
    "Todo processamento de aplicação em roteadores",
    "Um único roteador central",
    "Circuitos dedicados obrigatórios"
  ],
  "Muitas funções são implementadas nos sistemas finais."
);

addQuestion(
  "Camada de rede",
  "Jitter significa:",
  "Variação do atraso entre pacotes",
  [
    "Quantidade de roteadores",
    "Tamanho do endereço IP",
    "Perda total da rede"
  ],
  "Jitter é variação temporal do atraso."
);


// ============================================================
// CAMADA DE REDE / ROTEAMENTO / ROTEADORES
// ============================================================

addQuestion(
  "Camada de rede",
  "Repasse ou encaminhamento é:",
  "A decisão local de enviar um pacote para a saída apropriada",
  [
    "O cálculo global de todos os caminhos",
    "A resolução DNS",
    "A configuração DHCP"
  ],
  "Repasse é uma ação local por pacote."
);

addQuestion(
  "Roteamento",
  "Roteamento é:",
  "O processo de determinar os caminhos utilizados pelos pacotes",
  [
    "A tradução IPv4 para MAC",
    "A criação do quadro Ethernet apenas",
    "A atribuição DHCP"
  ],
  "Roteamento produz conhecimento utilizado pelo repasse."
);

addQuestion(
  "Roteadores",
  "O plano de dados:",
  "Encaminha pacotes usando a tabela de repasse",
  [
    "Distribui blocos da IANA",
    "Registra nomes DNS",
    "Administra domínios"
  ],
  "O plano de dados opera pacote a pacote."
);

addQuestion(
  "Roteadores",
  "O plano de controle:",
  "Calcula ou obtém rotas e alimenta as tabelas",
  [
    "Transmite somente bits físicos",
    "Substitui Ethernet",
    "Apenas calcula checksum TCP"
  ],
  "Protocolos e algoritmos de roteamento pertencem ao plano de controle."
);

addQuestion(
  "Roteadores",
  "Uma porta de entrada de um roteador pode:",
  "Receber quadros, processar o enlace e consultar informações de encaminhamento",
  [
    "Gerenciar a IANA",
    "Criar nomes DNS",
    "Reservar sempre um circuito telefônico"
  ],
  "A porta de entrada participa da recepção e do encaminhamento."
);

addQuestion(
  "Roteadores",
  "O elemento de comutação conecta:",
  "As portas de entrada às portas de saída",
  [
    "DNS ao DHCP",
    "IANA ao NIC.br",
    "O navegador ao usuário"
  ],
  "O switching fabric transfere internamente pacotes entre interfaces."
);

addQuestion(
  "Roteadores",
  "Na comutação via memória:",
  "O pacote é transferido através da memória do roteador",
  [
    "Não há armazenamento",
    "O pacote vira broadcast",
    "A VLAN é removida obrigatoriamente"
  ],
  "É uma das arquiteturas de elemento de comutação."
);

addQuestion(
  "Roteadores",
  "Na comutação via barramento:",
  "A largura de banda do barramento compartilhado pode limitar o desempenho",
  [
    "Não existe compartilhamento",
    "O TTL não existe",
    "A máscara determina a velocidade"
  ],
  "O barramento pode tornar-se gargalo."
);

addQuestion(
  "Roteadores",
  "Uma rede de interconexão ou crossbar:",
  "Permite maior paralelismo entre entradas e saídas",
  [
    "Elimina endereços IP",
    "Substitui DNS",
    "Transforma o roteador em hub"
  ],
  "Crossbars permitem várias transferências simultâneas quando não há conflito."
);

addQuestion(
  "Roteadores",
  "HOL significa:",
  "Head-of-the-Line",
  [
    "Host Over Link",
    "Hop Output Limit",
    "Header Over LAN"
  ],
  "HOL descreve bloqueio na cabeça da fila."
);

addQuestion(
  "Roteadores",
  "O bloqueio HOL ocorre quando:",
  "O pacote da frente impede que pacotes atrás avancem",
  [
    "O DHCP fornece endereço",
    "O DNS falha",
    "O IP é privado"
  ],
  "O primeiro pacote pode bloquear os seguintes."
);

addQuestion(
  "Roteamento",
  "A rota padrão IPv4 é:",
  "0.0.0.0/0",
  [
    "255.255.255.255/32",
    "127.0.0.0/8",
    "192.168.0.0/16"
  ],
  "/0 combina com qualquer destino."
);

addQuestion(
  "Roteamento",
  "No casamento do prefixo mais longo:",
  "A rota mais específica entre as compatíveis é escolhida",
  [
    "Sempre vence /0",
    "Sempre vence a primeira linha",
    "Sempre vence o menor /x"
  ],
  "Quanto maior o comprimento do prefixo, mais específica é a rota."
);

addQuestion(
  "Roteamento",
  "Se um destino combina com /8, /16 e /24, vence:",
  "/24",
  ["/8", "/16", "/0"],
  "/24 é a correspondência mais específica."
);

addQuestion(
  "Roteamento",
  "Uma rota estática é:",
  "Configurada manualmente",
  [
    "Obrigatoriamente aprendida por BGP",
    "Criada por ARP",
    "Uma mensagem ICMP"
  ],
  "Rotas estáticas são inseridas pelo administrador."
);

addQuestion(
  "Roteamento",
  "Uma tabela de roteamento pode conter:",
  "Redes conectadas, rotas estáticas, dinâmicas e rota padrão",
  [
    "Somente endereços MAC",
    "Apenas números de porta TCP",
    "Somente nomes DNS"
  ],
  "Diversas fontes podem instalar rotas."
);

addQuestion(
  "Roteadores",
  "Um roteador com quatro interfaces pode possuir:",
  "Um endereço IP por interface",
  [
    "Obrigatoriamente um único IP",
    "Nenhum endereço IP",
    "Um endereço somente se usar NAT"
  ],
  "Endereços IP são associados às interfaces."
);

addQuestion(
  "Roteadores",
  "De forma simplificada, um switch Ethernet trabalha principalmente com:",
  "Quadros e endereços MAC",
  [
    "Somente endereços IPv6",
    "BGP",
    "DNS"
  ],
  "O switch convencional atua na camada de enlace."
);

addQuestion(
  "Roteadores",
  "De forma simplificada, um roteador trabalha principalmente com:",
  "Datagramas e endereços IP",
  [
    "Somente sinais físicos",
    "Nomes DNS",
    "Apenas endereços MAC sem IP"
  ],
  "O roteador opera na camada de rede."
);

addQuestion(
  "Camada de rede",
  "O IP é não orientado a conexão porque:",
  "Não exige estabelecimento prévio de uma conexão de camada de rede",
  [
    "Não utiliza endereços",
    "Não utiliza roteadores",
    "Só funciona em LANs"
  ],
  "Datagramas são encaminhados sem uma fase de conexão IP."
);

addQuestion(
  "Camada de rede",
  "Best effort significa que o IP:",
  "Não garante entrega, ordem, atraso máximo ou vazão mínima",
  [
    "Garante tudo isso",
    "Reserva largura de banda",
    "Garante apenas ordem"
  ],
  "A camada IP tenta encaminhar os pacotes sem garantias rígidas."
);

addQuestion(
  "Roteadores",
  "SDN está relacionado à ideia de:",
  "Separar logicamente o controle do encaminhamento",
  [
    "Eliminar todos os roteadores",
    "Substituir IP por ARP",
    "Usar somente circuitos físicos"
  ],
  "Software Defined Networking permite controle programável da rede."
);


// ============================================================
// ICMP / PING / TRACEROUTE
// ============================================================

addQuestion(
  "ICMP",
  "O ICMP é utilizado para:",
  "Controle, diagnóstico e sinalização de condições da camada de rede",
  [
    "Transferência de páginas web",
    "Tagging VLAN",
    "Resolução de nomes"
  ],
  "ICMP transporta mensagens de controle relacionadas ao IP."
);

addQuestion(
  "ICMP",
  "O ping envia normalmente:",
  "ICMP Echo Request",
  [
    "ARP Request",
    "DHCP Discover",
    "ICMP Redirect"
  ],
  "O ping envia Echo Request e espera Echo Reply."
);

addQuestion(
  "ICMP",
  "A resposta normal ao Echo Request é:",
  "Echo Reply",
  [
    "Time Exceeded",
    "ARP Reply",
    "Router Solicitation"
  ],
  "Echo Reply é a resposta do ping."
);

addQuestion(
  "ICMP",
  "No IPv4, Echo Request é o tipo:",
  "8",
  ["0", "3", "11"],
  "ICMP Echo Request = tipo 8."
);

addQuestion(
  "ICMP",
  "No IPv4, Echo Reply é o tipo:",
  "0",
  ["8", "3", "11"],
  "ICMP Echo Reply = tipo 0."
);

addQuestion(
  "ICMP",
  "Time Exceeded normalmente ocorre quando:",
  "O TTL chega a zero",
  [
    "O ARP cache está cheio",
    "A VLAN muda",
    "O servidor DHCP responde"
  ],
  "O roteador descarta o pacote quando TTL chega a zero."
);

addQuestion(
  "ICMP",
  "Destination Unreachable significa que:",
  "O pacote não pôde ser entregue em determinada condição",
  [
    "O destino respondeu normalmente",
    "O DHCP terminou",
    "A VLAN foi criada"
  ],
  "Essa mensagem sinaliza falhas de entrega."
);

addQuestion(
  "ICMP",
  "RTT significa:",
  "Round-Trip Time",
  [
    "Routing Table Type",
    "Random Transfer Time",
    "Router Trunk Tag"
  ],
  "RTT mede o tempo de ida e volta."
);

addQuestion(
  "ICMP",
  "Se 20 pings são enviados e 15 respostas chegam, a perda é:",
  "25%",
  ["5%", "15%", "75%"],
  "5 de 20 foram perdidos: 5/20 = 25%."
);

addQuestion(
  "ICMP",
  "Se um host não responde ao ping:",
  "Não é possível concluir apenas por isso que ele está desligado",
  [
    "Ele certamente está desligado",
    "O DNS obrigatoriamente caiu",
    "Ele obrigatoriamente usa IPv6"
  ],
  "Firewalls podem bloquear ICMP."
);

addQuestion(
  "ICMP",
  "O traceroute normalmente começa utilizando TTL:",
  "1",
  ["0", "64", "255"],
  "TTL=1 faz o primeiro roteador responder com Time Exceeded."
);

addQuestion(
  "ICMP",
  "Na próxima etapa do traceroute, após TTL=1, normalmente é usado:",
  "TTL=2",
  ["TTL=0", "TTL=255", "TTL=1 permanentemente"],
  "O traceroute aumenta progressivamente o TTL."
);

addQuestion(
  "ICMP",
  "O objetivo do TTL é:",
  "Evitar que pacotes circulem indefinidamente em loops",
  [
    "Identificar VLAN",
    "Determinar a porta TCP",
    "Gerar endereços MAC"
  ],
  "O TTL é decrementado pelos roteadores."
);

addQuestion(
  "ICMP",
  "Um '* * *' em um salto do traceroute:",
  "Indica ausência de resposta àquelas sondas, não necessariamente falha de encaminhamento",
  [
    "Prova que o roteador está desligado",
    "Significa que o destino foi alcançado",
    "Indica necessariamente 100% de perda fim a fim"
  ],
  "Roteadores podem limitar ou bloquear respostas ICMP."
);

addQuestion(
  "ICMP",
  "O valor ttl= mostrado pelo ping representa:",
  "O TTL restante do pacote de resposta recebido",
  [
    "O número exato de roteadores de ida",
    "A máscara da rede",
    "O tamanho do quadro"
  ],
  "Não confunda o TTL restante com número exato de saltos."
);

addQuestion(
  "ICMP",
  "O mtr combina características de:",
  "Ping e traceroute",
  [
    "DHCP e NAT",
    "ARP e DNS",
    "VLAN e Ethernet"
  ],
  "mtr apresenta saltos e medições repetidas."
);


// ============================================================
// ARP / DHCP / NAT
// ============================================================

addQuestion(
  "ARP",
  "A função do ARP é:",
  "Relacionar endereço IPv4 a endereço MAC no enlace local",
  [
    "Resolver domínio para IPv4",
    "Distribuir endereços IPv6",
    "Calcular rotas BGP"
  ],
  "ARP faz resolução IPv4 → endereço de camada de enlace."
);

addQuestion(
  "ARP",
  "Um ARP Request é normalmente enviado em:",
  "Broadcast",
  ["Unicast obrigatório", "Anycast", "Circuito virtual"],
  "Todos os dispositivos da LAN precisam receber a consulta."
);

addQuestion(
  "ARP",
  "Um ARP Reply é normalmente enviado em:",
  "Unicast",
  ["Broadcast obrigatório", "Multicast IPv6", "BGP"],
  "O dispositivo responde diretamente ao solicitante."
);

addQuestion(
  "ARP",
  "O endereço MAC de broadcast Ethernet é:",
  "FF:FF:FF:FF:FF:FF",
  [
    "00:00:00:00:00:00",
    "255.255.255.255",
    "FE80::1"
  ],
  "ARP Request utiliza broadcast Ethernet."
);

addQuestion(
  "ARP",
  "Quando o destino IPv4 está em outra sub-rede, o host procura via ARP:",
  "O MAC do gateway padrão",
  [
    "O MAC do host remoto através da Internet",
    "O MAC do servidor DNS obrigatoriamente",
    "O MAC da IANA"
  ],
  "ARP não atravessa roteadores para descobrir hosts remotos."
);

addQuestion(
  "ARP",
  "A tabela ARP armazena:",
  "Associações temporárias entre IPv4 e MAC",
  [
    "Rotas BGP",
    "Nomes DNS exclusivamente",
    "Blocos IPv6 públicos"
  ],
  "O cache ARP evita novas consultas a cada quadro."
);

addQuestion(
  "DHCP",
  "DHCP pode fornecer:",
  "IP, máscara, gateway e DNS",
  [
    "Somente endereço MAC",
    "Somente VLAN ID",
    "Somente BGP"
  ],
  "DHCP automatiza a configuração IP do host."
);

addQuestion(
  "DHCP",
  "A primeira mensagem do fluxo DORA é:",
  "Discover",
  ["Offer", "Request", "ACK"],
  "O cliente inicialmente procura servidores."
);

addQuestion(
  "DHCP",
  "Após o Discover, o servidor normalmente envia:",
  "Offer",
  ["Request", "ACK", "ARP Reply"],
  "DHCPOFFER apresenta uma configuração ao cliente."
);

addQuestion(
  "DHCP",
  "Após escolher uma oferta, o cliente envia:",
  "Request",
  ["Offer", "Echo Reply", "Router Advertisement"],
  "DHCPREQUEST solicita a configuração escolhida."
);

addQuestion(
  "DHCP",
  "A confirmação final do servidor no DORA é:",
  "ACK",
  ["Discover", "ARP", "ICMP"],
  "DHCPACK confirma a concessão."
);

addQuestion(
  "DHCP",
  "Por que DHCP inicialmente utiliza broadcast?",
  "Porque o cliente ainda pode não possuir endereço IP e não conhece o servidor",
  [
    "Porque broadcast é obrigatório em toda comunicação IP",
    "Porque TCP exige broadcast",
    "Porque NAT bloqueia unicast"
  ],
  "O cliente começa sem configuração suficiente."
);

addQuestion(
  "DHCP",
  "DHCP Relay é útil quando:",
  "O servidor DHCP está em outra sub-rede",
  [
    "O host não possui placa de rede",
    "Todos os hosts estão na mesma interface do servidor",
    "É necessário substituir IPv4 por IPv6"
  ],
  "Roteadores normalmente não encaminham broadcasts DHCP diretamente."
);

addQuestion(
  "IPv4",
  "Qual é um bloco IPv4 privado?",
  "10.0.0.0/8",
  [
    "8.0.0.0/8",
    "200.0.0.0/8",
    "1.0.0.0/8"
  ],
  "10.0.0.0/8 é reservado para redes privadas."
);

addQuestion(
  "IPv4",
  "Qual intervalo pertence ao bloco privado 172.16.0.0/12?",
  "172.16.0.0 até 172.31.255.255",
  [
    "172.0.0.0 até 172.15.255.255",
    "172.32.0.0 até 172.63.255.255",
    "172.16.0.0 até 172.16.0.255 apenas"
  ],
  "O /12 cobre valores de 172.16 até 172.31."
);

addQuestion(
  "IPv4",
  "Qual é um bloco privado?",
  "192.168.0.0/16",
  [
    "192.169.0.0/16",
    "193.168.0.0/16",
    "192.0.0.0/8"
  ],
  "192.168.0.0/16 é reservado para uso privado."
);

addQuestion(
  "NAT",
  "A principal função do NAT é:",
  "Traduzir endereços entre redes",
  [
    "Criptografar todo o tráfego",
    "Resolver nomes DNS",
    "Criar VLANs"
  ],
  "NAT altera endereços IP ao atravessar o dispositivo."
);

addQuestion(
  "NAT",
  "NAPT/PAT também traduz:",
  "Portas de transporte",
  [
    "Somente endereços MAC",
    "Nomes DNS",
    "VLAN IDs"
  ],
  "Portas permitem distinguir vários fluxos compartilhando um IP público."
);

addQuestion(
  "NAT",
  "Por que as portas são importantes no NAPT?",
  "Permitem distinguir conexões de vários hosts internos usando o mesmo IP público",
  [
    "Definem a máscara de rede",
    "Substituem endereços MAC",
    "Determinam o TTL"
  ],
  "Cada mapeamento pode utilizar uma porta externa diferente."
);

addQuestion(
  "NAT",
  "Uma desvantagem do NAT é:",
  "Interferir no modelo fim a fim",
  [
    "Criar automaticamente IPv6",
    "Eliminar estado do roteador",
    "Tornar todos os hosts públicos"
  ],
  "O NAT mantém estado e altera cabeçalhos."
);

addQuestion(
  "NAT",
  "Para publicar um servidor atrás de NAT pode-se usar:",
  "Encaminhamento de porta",
  [
    "TTL=0",
    "ARP global",
    "Remoção da máscara"
  ],
  "Port forwarding cria um mapeamento para o servidor interno."
);

addQuestion(
  "NAT",
  "NAT é sinônimo de firewall?",
  "Não",
  ["Sim", "Somente no IPv6", "Somente em VLAN"],
  "NAT traduz endereços/portas; firewall aplica políticas de filtragem."
);


// ============================================================
// VLAN
// ============================================================

addQuestion(
  "VLAN",
  "Uma VLAN cria:",
  "Uma LAN lógica separada sobre a infraestrutura física",
  [
    "Um novo Sistema Autônomo",
    "Um circuito telefônico",
    "Um endereço IPv6"
  ],
  "VLANs permitem segmentação lógica."
);

addQuestion(
  "VLAN",
  "VLANs diferentes representam:",
  "Domínios de broadcast diferentes",
  [
    "O mesmo domínio de broadcast",
    "Obrigatoriamente o mesmo endereço IP",
    "Uma única porta física"
  ],
  "Cada VLAN constitui um domínio de broadcast lógico."
);

addQuestion(
  "VLAN",
  "Uma porta access normalmente pertence a:",
  "Uma única VLAN",
  [
    "Todas as VLANs obrigatoriamente",
    "Nenhuma VLAN",
    "Somente VLAN IPv6"
  ],
  "Portas access são usadas para conectar hosts finais."
);

addQuestion(
  "VLAN",
  "Um host conectado a uma porta access normalmente recebe quadros:",
  "Sem tag 802.1Q",
  [
    "Com cinco tags",
    "Sem endereço MAC",
    "Somente IPv6"
  ],
  "A marcação é tratada pelo switch."
);

addQuestion(
  "VLAN",
  "Uma porta trunk normalmente:",
  "Transporta várias VLANs",
  [
    "Transporta apenas uma VLAN sem identificação",
    "Substitui roteamento",
    "Remove endereços IP"
  ],
  "Trunks transportam quadros identificados por VLAN."
);

addQuestion(
  "VLAN",
  "O padrão utilizado para tagging VLAN em Ethernet é:",
  "IEEE 802.1Q",
  ["IEEE 802.11", "RFC 1918", "ICMP"],
  "802.1Q adiciona informação de VLAN ao quadro."
);

addQuestion(
  "VLAN",
  "A tag 802.1Q permite:",
  "Identificar a VLAN à qual o quadro pertence",
  [
    "Determinar o TTL",
    "Resolver nomes DNS",
    "Distribuir endereço DHCP"
  ],
  "Essa identificação permite transportar múltiplas VLANs no mesmo enlace."
);

addQuestion(
  "VLAN",
  "Dois switches transportando VLAN 10 e VLAN 20 pelo mesmo cabo normalmente usam:",
  "Trunk",
  ["Access", "NAT", "ARP"],
  "O trunk carrega várias VLANs."
);

addQuestion(
  "VLAN",
  "Hosts em VLANs diferentes precisam de:",
  "Roteamento de camada 3",
  [
    "Apenas switching L2",
    "ARP global",
    "NAT obrigatoriamente"
  ],
  "Switching L2 não encaminha tráfego entre VLANs distintas."
);

addQuestion(
  "VLAN",
  "Router-on-a-stick utiliza:",
  "Um trunk entre switch e roteador com subinterfaces",
  [
    "Um circuito dedicado por pacote",
    "Nenhuma VLAN",
    "Somente portas access"
  ],
  "Cada subinterface do roteador representa uma VLAN."
);

addQuestion(
  "VLAN",
  "Em router-on-a-stick, uma subinterface normalmente recebe:",
  "O endereço de gateway de uma VLAN",
  [
    "Somente um endereço MAC sem IP",
    "O DNS raiz",
    "Um ASN"
  ],
  "Cada VLAN possui uma sub-rede e um gateway."
);

addQuestion(
  "VLAN",
  "Se VLAN 2 usa 192.168.2.0/24, um possível gateway é:",
  "192.168.2.1",
  [
    "192.168.3.1",
    "192.168.2.255",
    "255.255.255.0"
  ],
  "O gateway deve pertencer à própria sub-rede."
);

addQuestion(
  "VLAN",
  "Um AP oferecendo SSIDs corporativo e guest em VLANs diferentes normalmente utiliza:",
  "Trunk no uplink",
  [
    "Uma única porta access sem VLAN",
    "NAT obrigatório no switch",
    "ICMP Redirect"
  ],
  "O trunk permite carregar as VLANs dos diferentes SSIDs."
);

addQuestion(
  "VLAN",
  "VLAN e sub-rede IP:",
  "São conceitos de camadas diferentes",
  [
    "São exatamente o mesmo conceito",
    "Não podem coexistir",
    "Só existem em IPv6"
  ],
  "VLAN é camada 2; sub-rede IP é camada 3."
);

addQuestion(
  "VLAN",
  "Em projetos comuns:",
  "Uma VLAN costuma ser associada a uma sub-rede IP",
  [
    "Toda VLAN obrigatoriamente usa o mesmo IP",
    "VLAN elimina o uso de IP",
    "Sub-rede e VLAN são sinônimos formais"
  ],
  "A associação uma VLAN ↔ uma sub-rede é comum, embora os conceitos sejam distintos."
);

addQuestion(
  "VLAN",
  "Um broadcast Ethernet da VLAN 10 normalmente alcança:",
  "Portas pertencentes à VLAN 10",
  [
    "Todas as VLANs",
    "Toda a Internet",
    "Somente servidores DNS"
  ],
  "VLAN delimita o domínio de broadcast."
);

addQuestion(
  "VLAN",
  "Ao receber um quadro sem tag em porta access VLAN 4, o switch associa o quadro a:",
  "VLAN 4",
  ["VLAN 1 sempre", "Todas as VLANs", "Nenhuma VLAN"],
  "O tráfego ingressa na VLAN configurada para aquela porta."
);

addQuestion(
  "VLAN",
  "Inter-VLAN routing pode ser realizado por:",
  "Roteador ou switch de camada 3",
  [
    "Hub passivo",
    "ARP sozinho",
    "DNS"
  ],
  "É necessário um dispositivo capaz de rotear."
);

addQuestion(
  "VLAN",
  "Qual afirmação está incorreta?",
  "Um trunk elimina a necessidade de roteamento entre VLANs",
  [
    "802.1Q identifica VLANs",
    "VLANs diferentes são domínios de broadcast diferentes",
    "Um trunk pode transportar múltiplas VLANs"
  ],
  "O trunk transporta as VLANs, mas não realiza roteamento entre elas."
);

addQuestion(
  "VLAN",
  "A segmentação em VLANs pode ajudar em:",
  "Isolamento e organização do tráfego",
  [
    "Eliminar todos os roteadores da Internet",
    "Transformar IPv4 em IPv6",
    "Aumentar automaticamente a MTU"
  ],
  "VLANs auxiliam administração, segurança e segmentação."
);


// ============================================================
// IPv6 / SLAAC / NDP
// ============================================================

addQuestion(
  "IPv6",
  "A principal motivação histórica do IPv6 foi:",
  "O esgotamento do espaço de endereços IPv4",
  [
    "Criar VLANs",
    "Substituir Ethernet",
    "Eliminar a camada de enlace"
  ],
  "O IPv6 aumentou o endereço de 32 para 128 bits."
);

addQuestion(
  "IPv6",
  "Um endereço IPv6 possui:",
  "128 bits",
  ["32 bits", "64 bits", "256 bits"],
  "IPv6 possui 128 bits."
);

addQuestion(
  "IPv6",
  "Um endereço IPv6 completo possui normalmente:",
  "8 grupos hexadecimais",
  [
    "4 grupos",
    "6 grupos",
    "16 grupos"
  ],
  "Cada grupo possui 16 bits: 8 × 16 = 128."
);

addQuestion(
  "IPv6",
  "Qual caractere não é hexadecimal válido?",
  "G",
  ["A", "F", "9"],
  "Hexadecimal usa 0–9 e A–F."
);

addQuestion(
  "IPv6",
  "O grupo 0db8 pode ser abreviado como:",
  "db8",
  ["d8", "0db", "::db8 obrigatoriamente"],
  "Zeros à esquerda de cada hexteto podem ser removidos."
);

addQuestion(
  "IPv6",
  "O símbolo :: pode aparecer:",
  "No máximo uma vez em um endereço",
  [
    "Duas vezes",
    "Oito vezes",
    "Somente em multicast"
  ],
  "Duas ocorrências deixariam a expansão ambígua."
);

addQuestion(
  "IPv6",
  "Qual endereço é inválido?",
  "2001:db8::1::10",
  [
    "2001:db8::10",
    "::1",
    "fe80::abcd"
  ],
  ":: aparece duas vezes."
);

addQuestion(
  "IPv6",
  "IPv6 possui broadcast?",
  "Não",
  [
    "Sim, usando FF:FF:FF:FF",
    "Sim, somente em /64",
    "Sim, usando ::ffff"
  ],
  "IPv6 usa multicast em lugar de broadcast."
);

addQuestion(
  "IPv6",
  "Global Unicast pertence de forma geral a:",
  "2000::/3",
  [
    "FE80::/10",
    "FC00::/7",
    "FF00::/8"
  ],
  "2000::/3 cobre o espaço Global Unicast."
);

addQuestion(
  "IPv6",
  "Link-local utiliza:",
  "FE80::/10",
  [
    "FF00::/8",
    "FC00::/7",
    "2000::/3"
  ],
  "Endereços link-local são utilizados apenas no enlace local."
);

addQuestion(
  "IPv6",
  "Unique Local utiliza:",
  "FC00::/7",
  [
    "FE80::/10",
    "FF00::/8",
    "2000::/3"
  ],
  "Unique Local corresponde a FC00::/7."
);

addQuestion(
  "IPv6",
  "Multicast IPv6 utiliza:",
  "FF00::/8",
  [
    "FC00::/7",
    "FE80::/10",
    "2000::/3"
  ],
  "Multicast começa em FF."
);

addQuestion(
  "IPv6",
  "O prefixo padrão normalmente usado em LANs IPv6 é:",
  "/64",
  ["/24", "/32", "/128"],
  "Sub-redes IPv6 normalmente usam /64."
);

addQuestion(
  "IPv6",
  "Dividir um /48 em 16 blocos iguais resulta em:",
  "/52",
  ["/49", "/56", "/64"],
  "16 = 2⁴, então quatro bits são acrescentados ao prefixo."
);

addQuestion(
  "IPv6",
  "O cabeçalho base IPv6 possui:",
  "40 bytes fixos",
  [
    "20 bytes fixos",
    "20 a 60 bytes",
    "128 bytes"
  ],
  "O cabeçalho base foi simplificado e tem 40 bytes."
);

const ipv6HeaderFields = [
  ["Version", "Indica a versão do protocolo"],
  ["Traffic Class", "Classifica/prioriza tráfego"],
  ["Flow Label", "Identifica um fluxo"],
  ["Payload Length", "Indica o tamanho da carga útil"],
  ["Next Header", "Indica próximo cabeçalho ou protocolo"],
  ["Hop Limit", "Limita a quantidade de saltos"],
  ["Source Address", "Contém o endereço IPv6 de origem"],
  ["Destination Address", "Contém o endereço IPv6 de destino"]
];

ipv6HeaderFields.forEach(([field, purpose]) => {
  addQuestion(
    "IPv6",
    `No cabeçalho IPv6, qual é a função de ${field}?`,
    purpose,
    ipv6HeaderFields
      .filter(([other]) => other !== field)
      .slice(0, 3)
      .map(([, otherPurpose]) => otherPurpose),
    `${field}: ${purpose}.`
  );
});

addQuestion(
  "IPv6",
  "O equivalente funcional ao TTL no IPv6 é:",
  "Hop Limit",
  [
    "Flow Label",
    "Payload Length",
    "Traffic Class"
  ],
  "Hop Limit é decrementado a cada roteador."
);

addQuestion(
  "IPv6",
  "O IPv6 possui Header Checksum no cabeçalho base?",
  "Não",
  [
    "Sim, 16 bits",
    "Sim, 32 bits",
    "Somente em link-local"
  ],
  "O checksum foi removido do cabeçalho base para simplificar o processamento."
);

addQuestion(
  "IPv6",
  "Quem pode fragmentar um pacote IPv6?",
  "A origem",
  [
    "Qualquer roteador intermediário",
    "O switch Ethernet",
    "O servidor DNS"
  ],
  "Roteadores IPv6 não realizam fragmentação intermediária."
);

addQuestion(
  "IPv6",
  "Se um pacote IPv6 é grande demais para o próximo enlace, o roteador pode enviar:",
  "ICMPv6 Packet Too Big",
  [
    "ARP Reply",
    "DHCP Offer",
    "TCP SYN"
  ],
  "A origem ajusta o tamanho do pacote."
);

addQuestion(
  "SLAAC",
  "SLAAC significa:",
  "Stateless Address Autoconfiguration",
  [
    "Static Local Address Control",
    "Secure Link Address Configuration",
    "Stateful LAN Address Control"
  ],
  "SLAAC é o mecanismo stateless de autoconfiguração."
);

addQuestion(
  "SLAAC",
  "No SLAAC, o host obtém informações de prefixo através de:",
  "Router Advertisement",
  [
    "ARP Reply",
    "TCP SYN",
    "BGP Update"
  ],
  "RA anuncia prefixos e parâmetros."
);

addQuestion(
  "SLAAC",
  "Router Solicitation é enviada normalmente por:",
  "Um host solicitando anúncio de roteador",
  [
    "IANA",
    "Servidor DNS",
    "Switch sem IP"
  ],
  "RS permite solicitar uma RA imediatamente."
);

addQuestion(
  "SLAAC",
  "DAD significa:",
  "Duplicate Address Detection",
  [
    "Dynamic Address Distribution",
    "Data Address Discovery",
    "Default Address Database"
  ],
  "DAD verifica se o endereço pretendido já está em uso."
);

addQuestion(
  "SLAAC",
  "SLAAC exige obrigatoriamente um servidor DHCPv6 stateful?",
  "Não",
  ["Sim", "Somente para link-local", "Somente em /48"],
  "SLAAC pode configurar o endereço sem servidor mantendo concessões."
);

addQuestion(
  "NDP",
  "O NDP é baseado em:",
  "ICMPv6",
  [
    "ARP IPv4",
    "TCP",
    "BGP"
  ],
  "Neighbor Discovery utiliza mensagens ICMPv6."
);

addQuestion(
  "NDP",
  "Quantas mensagens NDP principais são estudadas?",
  "5",
  ["3", "4", "8"],
  "RS, RA, NS, NA e Redirect."
);

const ndpMessages = [
  ["Router Solicitation", "133", "Host solicita anúncio de roteador"],
  ["Router Advertisement", "134", "Roteador anuncia presença e parâmetros"],
  ["Neighbor Solicitation", "135", "Descobre vizinho/endereço de enlace e participa do DAD"],
  ["Neighbor Advertisement", "136", "Responde a Neighbor Solicitation"],
  ["Redirect", "137", "Indica um próximo salto mais adequado"]
];

ndpMessages.forEach(([name, type, purpose]) => {
  addQuestion(
    "NDP",
    `Qual é o tipo ICMPv6 da mensagem ${name}?`,
    type,
    ndpMessages
      .filter(([other]) => other !== name)
      .slice(0, 3)
      .map(([, otherType]) => otherType),
    `${name} utiliza tipo ${type}.`
  );

  addQuestion(
    "NDP",
    `Qual é a função principal de ${name}?`,
    purpose,
    ndpMessages
      .filter(([other]) => other !== name)
      .slice(0, 3)
      .map(([, , otherPurpose]) => otherPurpose),
    `${name}: ${purpose}.`
  );
});

addQuestion(
  "NDP",
  "As mensagens NDP estudadas usam Hop Limit:",
  "255",
  ["1", "64", "128"],
  "O valor 255 ajuda a assegurar que a mensagem foi originada no mesmo enlace."
);

addQuestion(
  "NDP",
  "No IPv6, Neighbor Solicitation e Neighbor Advertisement substituem principalmente funções do:",
  "ARP",
  [
    "BGP",
    "DNS",
    "TCP"
  ],
  "NS e NA realizam descoberta de vizinhos/endereço de enlace."
);

addQuestion(
  "NDP",
  "NDP utiliza broadcast Ethernet como o ARP?",
  "Não",
  [
    "Sim, sempre",
    "Somente para RA",
    "Somente para Redirect"
  ],
  "O IPv6 utiliza multicast para descoberta de vizinhos."
);


// ============================================================
// FUNÇÕES DE IPv4 / SUBNETTING
// ============================================================

function ipToInt(ip) {
  const parts = ip.split(".").map(Number);

  if (
    parts.length !== 4 ||
    parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    throw new Error(`Endereço IPv4 inválido: ${ip}`);
  }

  return (
    (((parts[0] * 256 + parts[1]) * 256 + parts[2]) * 256 + parts[3])
    >>> 0
  );
}


function intToIp(value) {
  const n = value >>> 0;

  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255
  ].join(".");
}


function maskInt(prefix) {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
    throw new Error(`Prefixo IPv4 inválido: /${prefix}`);
  }

  if (prefix === 0) return 0;

  return (0xFFFFFFFF << (32 - prefix)) >>> 0;
}


function prefixToMask(prefix) {
  return intToIp(maskInt(prefix));
}


function networkInfo(ip, prefix) {
  const ipInt = ipToInt(ip);
  const mask = maskInt(prefix);
  const network = (ipInt & mask) >>> 0;
  const inverse = (~mask) >>> 0;
  const broadcast = (network | inverse) >>> 0;

  return {
    ip,
    prefix,
    mask: prefixToMask(prefix),
    ipInt,
    network,
    broadcast,
    first: prefix < 31 ? (network + 1) >>> 0 : network,
    last: prefix < 31 ? (broadcast - 1) >>> 0 : broadcast,
    total: 2 ** (32 - prefix),
    usable: prefix < 31 ? 2 ** (32 - prefix) - 2 : 2 ** (32 - prefix)
  };
}


function calculateIpv4Fragments(totalLength, mtu, headerLength = 20) {
  if (
    ![totalLength, mtu, headerLength].every(Number.isInteger) ||
    headerLength < 20 ||
    totalLength <= headerLength ||
    mtu <= headerLength
  ) {
    throw new Error("Parâmetros inválidos para fragmentação IPv4.");
  }

  const originalData = totalLength - headerLength;
  const maxData = Math.floor((mtu - headerLength) / 8) * 8;

  if (maxData <= 0) {
    throw new Error("A MTU não comporta dados IPv4 fragmentáveis.");
  }

  const fragments = [];
  let remaining = originalData;
  let consumed = 0;

  while (remaining > 0) {
    const dataLength = Math.min(maxData, remaining);
    remaining -= dataLength;

    fragments.push({
      dataLength,
      totalLength: dataLength + headerLength,
      offset: consumed / 8,
      mf: remaining > 0 ? 1 : 0
    });

    consumed += dataLength;
  }

  return {
    totalLength,
    mtu,
    headerLength,
    originalData,
    maxData,
    fragments
  };
}


function addressDistractors(info, correctInt) {
  const values = [
    info.network,
    info.broadcast,
    info.first,
    info.last,
    info.ipInt,
    (info.network - info.total) >>> 0,
    (info.broadcast + 1) >>> 0
  ];

  const unique = [];

  values.forEach(value => {
    const ip = intToIp(value);

    if (value !== correctInt && !unique.includes(ip)) {
      unique.push(ip);
    }
  });

  return unique.slice(0, 3);
}


// ============================================================
// QUESTÕES AUTOMÁTICAS DE SUBNETTING
// ============================================================

const subnetCases = [
  ["101.100.50.172", 28],
  ["192.168.222.150", 27],
  ["10.235.32.191", 20],
  ["172.31.128.245", 22],
  ["172.20.221.17", 23],
  ["192.168.23.36", 26],
  ["200.100.128.130", 25],
  ["192.168.50.199", 27],
  ["10.200.65.10", 20],
  ["172.16.63.200", 21],
  ["192.0.2.249", 29],
  ["198.51.100.70", 29],
  ["203.0.113.6", 30],
  ["10.10.129.9", 23],
  ["192.168.1.201", 25],
  ["172.16.31.10", 20],
  ["192.168.77.222", 28],
  ["10.0.3.14", 30]
];

const subnetQuestions = [];

subnetCases.forEach(([ip, prefix]) => {
  const info = networkInfo(ip, prefix);

  subnetQuestions.push(
    makeQuestion(
      "Subnetting",
      `Qual é o endereço de rede da sub-rede que contém ${ip}/${prefix}?`,
      intToIp(info.network),
      addressDistractors(info, info.network),
      `/${prefix} = ${info.mask}. A rede é ${intToIp(info.network)}, o broadcast é ${intToIp(info.broadcast)} e os hosts válidos vão de ${intToIp(info.first)} até ${intToIp(info.last)}.`
    )
  );

  subnetQuestions.push(
    makeQuestion(
      "Subnetting",
      `Qual é o broadcast direcionado da sub-rede que contém ${ip}/${prefix}?`,
      intToIp(info.broadcast),
      addressDistractors(info, info.broadcast),
      `A sub-rede vai de ${intToIp(info.network)} até ${intToIp(info.broadcast)}. Portanto o broadcast é ${intToIp(info.broadcast)}.`
    )
  );

  subnetQuestions.push(
    makeQuestion(
      "Subnetting",
      `Qual é o primeiro endereço IPv4 válido da sub-rede que contém ${ip}/${prefix}?`,
      intToIp(info.first),
      addressDistractors(info, info.first),
      `A rede é ${intToIp(info.network)}. O primeiro endereço válido é rede + 1 = ${intToIp(info.first)}.`
    )
  );

  subnetQuestions.push(
    makeQuestion(
      "Subnetting",
      `Qual é o maior endereço IPv4 válido da sub-rede que contém ${ip}/${prefix}?`,
      intToIp(info.last),
      addressDistractors(info, info.last),
      `O broadcast é ${intToIp(info.broadcast)}. O último endereço válido é broadcast − 1 = ${intToIp(info.last)}.`
    )
  );
});

extraPool.push(...subnetQuestions);


// ============================================================
// MÁSCARA E QUANTIDADE DE HOSTS
// ============================================================

for (let prefix = 20; prefix <= 30; prefix += 1) {
  const usable = 2 ** (32 - prefix) - 2;

  const alternatives = [
    2 ** (32 - prefix),
    Math.max(0, usable - 2),
    prefix < 30
      ? 2 ** (32 - (prefix + 1)) - 2
      : 6
  ];

  extraPool.push(
    makeQuestion(
      "Subnetting",
      `No modelo tradicional cobrado, quantos endereços válidos para interfaces existem em uma sub-rede /${prefix}?`,
      String(usable),
      alternatives.map(String),
      `/${prefix} deixa ${32 - prefix} bits para host. 2^${32 - prefix} = ${2 ** (32 - prefix)} endereços totais; retirando rede e broadcast, restam ${usable}.`
    )
  );

  const mask = prefixToMask(prefix);

  const nearbyMasks = [
    prefix > 20 ? prefixToMask(prefix - 1) : prefixToMask(19),
    prefix < 30 ? prefixToMask(prefix + 1) : prefixToMask(31),
    prefix < 29 ? prefixToMask(prefix + 2) : prefixToMask(prefix - 2)
  ];

  extraPool.push(
    makeQuestion(
      "IPv4",
      `Qual máscara decimal corresponde ao prefixo /${prefix}?`,
      mask,
      nearbyMasks,
      `/${prefix} corresponde à máscara ${mask}.`
    )
  );
}


// ============================================================
// ESCOLHA DA MENOR MÁSCARA POR QUANTIDADE DE HOSTS
// ============================================================

function minPrefixForHosts(hosts) {
  for (let prefix = 30; prefix >= 1; prefix -= 1) {
    const usable = 2 ** (32 - prefix) - 2;

    if (usable >= hosts) {
      return prefix;
    }
  }

  return 0;
}


const hostRequirements = [
  2,
  5,
  6,
  10,
  14,
  20,
  30,
  50,
  60,
  100,
  120,
  126,
  150,
  200,
  250,
  400,
  500,
  700,
  1000,
  2000
];

hostRequirements.forEach(hosts => {
  const prefix = minPrefixForHosts(hosts);

  // Usa prefixos próximos, mas elimina o gabarito e repetições.
  // O limite em /30 fazia os casos de 2, 5 e 6 hosts gerarem
  // alternativas duplicadas e interromperem a inicialização do app.
  const distractors = [1, -1, 2, -2, 3, -3]
    .map(offset => prefix + offset)
    .filter(candidate => candidate >= 1 && candidate <= 30)
    .filter(candidate => candidate !== prefix)
    .filter((candidate, index, values) =>
      values.indexOf(candidate) === index
    )
    .slice(0, 3)
    .map(candidate => `/${candidate}`);

  extraPool.push(
    makeQuestion(
      "Subnetting",
      `Qual é o maior prefixo CIDR que comporta pelo menos ${hosts} hosts válidos, com o menor desperdício?`,
      `/${prefix}`,
      distractors,
      `A menor quantidade de bits de host que satisfaz 2^h − 2 ≥ ${hosts} leva ao prefixo /${prefix}. Esse bloco suporta ${2 ** (32 - prefix) - 2} hosts válidos.`
    )
  );
});


// ============================================================
// VLSM
// ============================================================

addQuestion(
  "VLSM",
  "No exercício 200.101.192.0/22 com demandas 400, 150 e 150 hosts, as máscaras são:",
  "/23, /24 e /24",
  [
    "/24, /24 e /24",
    "/22, /25 e /25",
    "/23, /25 e /25"
  ],
  "400 hosts exigem /23; 150 hosts exigem /24."
);

addQuestion(
  "VLSM",
  "Uma rede para 400 hosts precisa de pelo menos:",
  "/23",
  ["/24", "/25", "/26"],
  "/23 oferece 510 hosts válidos."
);

addQuestion(
  "VLSM",
  "Uma rede para 150 hosts precisa de pelo menos:",
  "/24",
  ["/25", "/26", "/27"],
  "/25 fornece apenas 126 hosts; /24 fornece 254."
);

addQuestion(
  "VLSM",
  "Em VLSM, uma estratégia recomendada é:",
  "Alocar primeiro as maiores sub-redes",
  [
    "Alocar aleatoriamente",
    "Sempre começar pelas menores",
    "Usar obrigatoriamente /24"
  ],
  "Começar pelos maiores blocos reduz problemas de fragmentação e alinhamento."
);

addQuestion(
  "VLSM",
  "No exercício 200.101.192.0/22, a primeira sub-rede de 400 hosts é:",
  "200.101.192.0/23",
  [
    "200.101.192.0/24",
    "200.101.193.0/23",
    "200.101.194.0/24"
  ],
  "O primeiro bloco /23 ocupa 200.101.192.0 até 200.101.193.255."
);

addQuestion(
  "VLSM",
  "Após 200.101.192.0/23, a próxima sub-rede de 150 hosts pode começar em:",
  "200.101.194.0/24",
  [
    "200.101.193.0/24",
    "200.101.192.128/24",
    "200.101.195.128/24"
  ],
  "O /23 anterior ocupa os terceiros octetos 192 e 193."
);

addQuestion(
  "VLSM",
  "O maior endereço válido da sub-rede 200.101.192.0/23 é:",
  "200.101.193.254",
  [
    "200.101.193.255",
    "200.101.192.254",
    "200.101.194.0"
  ],
  "O broadcast é 200.101.193.255."
);

addQuestion(
  "VLSM",
  "O broadcast de 200.101.194.0/24 é:",
  "200.101.194.255",
  [
    "200.101.194.254",
    "200.101.195.255",
    "200.101.193.255"
  ],
  "Um /24 ocupa todo o quarto octeto."
);

addQuestion(
  "VLSM",
  "Se uma /23 tem 510 hosts válidos e 400 são usados, quantos ficam disponíveis?",
  "110",
  ["112", "108", "254"],
  "510 − 400 = 110."
);

addQuestion(
  "VLSM",
  "No exercício 400/150/150, o total de endereços válidos ainda livres dentro das três sub-redes é:",
  "318",
  ["324", "214", "0"],
  "510−400 = 110; 254−150 = 104; 104 novamente. Total = 318."
);


// ============================================================
// QUESTÕES DA REVISÃO 2026 — 60 EXIGIDAS + REFORÇOS
// ============================================================

const fragmentationCases = [
  [4000, 1500, 20],
  [3200, 1400, 20],
  [2500, 1000, 20],
  [5000, 1500, 20],
  [2000, 620, 20],
  [3600, 1280, 20],
  [1800, 576, 20],
  [4096, 1492, 20],
  [3000, 800, 20],
  [6200, 1280, 20]
];

fragmentationCases.forEach(([totalLength, mtu, headerLength], caseIndex) => {
  const result = calculateIpv4Fragments(totalLength, mtu, headerLength);
  const last = result.fragments.at(-1);
  const correct = `${result.fragments.length} fragmentos; último com ${last.totalLength} bytes, offset ${last.offset} e MF=${last.mf}`;
  const wrong = [
    `${result.fragments.length} fragmentos; último com ${last.dataLength} bytes, offset ${last.offset} e MF=1`,
    `${result.fragments.length + 1} fragmentos; último com ${last.totalLength} bytes, offset ${last.offset + 1} e MF=0`,
    `${result.fragments.length} fragmentos; último com ${last.totalLength} bytes, offset ${last.offset * 8} e MF=0`
  ];
  const detail = result.fragments
    .map((fragment, index) =>
      `F${index + 1}: ${fragment.totalLength} bytes (${fragment.dataLength} de dados), offset ${fragment.offset}, MF=${fragment.mf}`
    )
    .join("; ");

  addStructuredQuestion(
    "ipv4_geral",
    "fragmentacao_ipv4",
    "Fragmentação IPv4",
    `Um datagrama IPv4 de ${totalLength} bytes, com cabeçalho de ${headerLength} bytes, atravessa enlace de MTU ${mtu}. Qual alternativa descreve corretamente a fragmentação?`,
    correct,
    wrong,
    `MTU=${mtu}; cabeçalho=${headerLength}. Dados máximos por fragmento não final: floor((${mtu}−${headerLength})/8)×8 = ${result.maxData} bytes, um múltiplo de 8. O datagrama leva ${result.originalData} bytes de dados. ${detail}. O offset é medido em blocos de 8 bytes e somente o último usa MF=0.`,
    `fragmentacao_calculo_${caseIndex + 1}`
  );
});


const routingPracticeQuestions = [
  [
    "R1 liga a LAN 192.168.10.0/24 pela eth0 e o enlace 10.0.0.0/30 pela eth1 (R1=10.0.0.1, R2=10.0.0.2). R2 liga a LAN 192.168.20.0/24. Qual rota estática R1 precisa?",
    "192.168.20.0/24 via 10.0.0.2",
    ["192.168.10.0/24 via 10.0.0.2", "10.0.0.0/30 via 192.168.20.1", "192.168.20.0/24 via 10.0.0.1"],
    "A rede destino é a LAN B, 192.168.20.0/24, e o próximo salto visto por R1 é a interface 10.0.0.2 de R2.",
    "rota_r1_lan_b"
  ],
  [
    "Na mesma topologia, qual deve ser o gateway padrão de um host 192.168.10.50/24 da LAN A?",
    "192.168.10.1",
    ["10.0.0.1", "10.0.0.2", "192.168.20.1"],
    "O gateway precisa estar na mesma sub-rede do host e corresponde à interface de R1 na LAN A: 192.168.10.1.",
    "gateway_host_lan_a"
  ],
  [
    "R2 alcança diretamente 10.0.0.0/30 e 192.168.20.0/24. Para chegar a 192.168.10.0/24, qual next hop deve usar?",
    "10.0.0.1",
    ["10.0.0.2", "192.168.20.1", "192.168.10.1"],
    "10.0.0.1 é a interface de R1 no enlace diretamente conectado entre os roteadores.",
    "next_hop_r2_lan_a"
  ],
  [
    "Uma tabela possui 10.0.0.0/8→eth0, 10.20.0.0/16→eth1, 10.20.30.0/24→eth2 e 0.0.0.0/0→eth3. Por qual interface sai 10.20.30.45?",
    "eth2",
    ["eth0", "eth1", "eth3"],
    "O destino combina com /8, /16 e /24. Pelo casamento do prefixo mais longo, /24 é a rota mais específica e vence.",
    "lpm_10_20_30"
  ],
  [
    "Na tabela 10.0.0.0/8→eth0, 10.20.0.0/16→eth1, 10.20.30.0/24→eth2 e 0.0.0.0/0→eth3, por onde sai 10.20.50.10?",
    "eth1",
    ["eth0", "eth2", "eth3"],
    "10.20.50.10 combina com /8 e /16, mas não com 10.20.30.0/24. A rota /16 via eth1 é a mais específica.",
    "lpm_10_20_50"
  ],
  [
    "Na tabela 10.0.0.0/8→eth0, 10.20.0.0/16→eth1, 10.20.30.0/24→eth2 e 0.0.0.0/0→eth3, por onde sai 200.1.1.1?",
    "eth3",
    ["eth0", "eth1", "eth2"],
    "Nenhuma das três rotas 10.x combina. A rota padrão 0.0.0.0/0 via eth3 é usada.",
    "lpm_rota_padrao"
  ],
  [
    "Um host 172.16.4.20/23 quer enviar para 172.16.5.200. O que ele faz primeiro?",
    "Trata o destino como local e usa ARP para ele",
    ["Envia ao gateway porque o terceiro octeto mudou", "Usa a rota padrão sem aplicar a máscara", "Descarta porque /23 aceita somente o terceiro octeto 4"],
    "/23 = 255.255.254.0. O bloco iniciado em 172.16.4.0 cobre os terceiros octetos 4 e 5; ambos os endereços estão na mesma sub-rede.",
    "decisao_mesma_rede_23"
  ],
  [
    "Um roteador tem 192.168.30.0/24 diretamente conectada e rota padrão via 203.0.113.1. Para 192.168.30.77, qual entrada vence?",
    "A rota conectada 192.168.30.0/24",
    ["A rota padrão /0", "As duas empatam", "Nenhuma, pois falta rota /32"],
    "As duas entradas podem combinar, mas /24 é mais específica que /0.",
    "conectada_vence_default"
  ],
  [
    "R1 possui saída serial0 para R2 e precisa alcançar 198.51.100.0/24. Qual informação identifica corretamente o destino da rota?",
    "A rede 198.51.100.0 com prefixo /24",
    ["Um host qualquer 198.51.100.1/32", "O MAC de R2", "A porta TCP do serviço remoto"],
    "Uma rota representa um prefixo de destino; next hop ou interface de saída indicam como alcançá-lo.",
    "componentes_rota_estatica"
  ],
  [
    "Qual rota resume o envio de destinos desconhecidos para o roteador 192.0.2.1?",
    "0.0.0.0/0 via 192.0.2.1",
    ["255.255.255.255/32 via 192.0.2.1", "192.0.2.0/0 via 255.255.255.0", "0.0.0.0/32 via 192.0.2.255"],
    "A rota padrão IPv4 é 0.0.0.0/0; ela combina quando nenhuma rota mais específica vence.",
    "rota_padrao_pratica"
  ]
];

routingPracticeQuestions.forEach(([text, correct, wrong, explanation, concept], index) => {
  addStructuredQuestion(
    "subredes_roteamento",
    index < 3 || index === 6 ? "gateway_subredes" : "roteamento_estatico_tabelas",
    index < 3 || index === 6 ? "Gateway e sub-redes" : "Roteamento estático",
    text,
    correct,
    wrong,
    explanation,
    concept
  );
});


const addressDistributionQuestions = [
  ["Qual sequência representa melhor a distribuição hierárquica de blocos IP?", "IANA → RIR (como LACNIC) → ISP/organização → rede do usuário", ["Host → DNS → IANA → RIR", "ISP → IANA → host → LACNIC", "LACNIC → switch → IANA → organização"], "A IANA coordena globalmente; os RIRs administram regiões; provedores ou organizações recebem blocos e os distribuem em suas redes.", "hierarquia_blocos_ip"],
  ["Qual RIR atende a América Latina e o Caribe?", "LACNIC", ["ARIN", "RIPE NCC", "APNIC"], "LACNIC é o Registro Regional da Internet para a América Latina e o Caribe.", "rir_lacnic"],
  ["Qual é o papel da IANA na distribuição de endereços?", "Coordenar globalmente recursos numéricos e alocar grandes blocos aos RIRs", ["Entregar via DHCP um IP a cada notebook", "Resolver nomes de domínio para cada host", "Manter a tabela ARP de todos os ISPs"], "IANA atua na coordenação global, não na configuração cotidiana de hosts.", "papel_iana"],
  ["Como um host normalmente recebe sua configuração IPv4 em uma rede de usuário?", "Por configuração manual ou por DHCP", ["Solicitando diretamente um /8 à IANA", "Recebendo um ASN do LACNIC", "Executando BGP com um RIR"], "A obtenção de um endereço por um host é diferente da obtenção de um bloco por uma organização.", "host_obtem_ip"],
  ["Como uma organização normalmente obtém um bloco público, em vez de um único endereço de host?", "Por alocação de um ISP ou, conforme políticas aplicáveis, de um RIR", ["Por ARP Request na LAN", "Por ICMP Echo Reply", "Por uma tag 802.1Q"], "Blocos seguem políticas de alocação; ARP, ICMP e VLAN não distribuem recursos globais.", "organizacao_obtem_bloco"],
  ["NIC.br e LACNIC possuem exatamente o mesmo papel?", "Não; LACNIC é o RIR regional e o NIC.br exerce funções nacionais no Brasil", ["Sim; ambos são servidores DHCP de usuários", "Sim; ambos são a própria IANA", "Não; NIC.br é um fabricante de roteadores"], "As instituições atuam em escopos distintos dentro do ecossistema da Internet.", "lacnic_nicbr"],
  ["Por que a distribuição hierárquica de prefixos é importante para o roteamento?", "Favorece agregação de rotas e unicidade dos endereços", ["Elimina a necessidade de endereços IP", "Faz todos os hosts pertencerem ao mesmo AS", "Transforma endereços públicos em MAC"], "A hierarquia ajuda a evitar sobreposição e permite anunciar prefixos agregados.", "hierarquia_agregacao"],
  ["Qual afirmação diferencia corretamente ISP e RIR?", "O ISP fornece conectividade e pode delegar endereços; o RIR administra recursos numéricos de uma região", ["O ISP administra todos os endereços globais e o RIR configura Wi-Fi", "O RIR fornece acesso residencial e o ISP registra ASNs globais", "Ambos apenas resolvem nomes DNS"], "ISP e RIR ocupam papéis diferentes na arquitetura e na distribuição de recursos.", "isp_vs_rir"]
];

addressDistributionQuestions.forEach(spec => addStructuredQuestion(
  "ipv4_geral", "distribuicao_enderecos", "Distribuição de endereços", ...spec
));


const ipv4TypeQuestions = [
  ["O endereço 255.255.255.255 é classificado como:", "Broadcast limitado", ["Multicast", "Broadcast direcionado de qualquer /24", "Unicast público"], "255.255.255.255 é o broadcast limitado, usado no enlace local e não encaminhado como um broadcast comum por roteadores.", "broadcast_limitado"],
  ["Qual faixa identifica endereços multicast IPv4?", "224.0.0.0/4", ["240.0.0.0/4", "192.168.0.0/16", "255.255.255.255/32 apenas"], "Multicast IPv4 ocupa 224.0.0.0 a 239.255.255.255, isto é, 224.0.0.0/4.", "multicast_ipv4"],
  ["Em 192.168.40.0/26, qual é o broadcast direcionado?", "192.168.40.63", ["255.255.255.255", "192.168.40.64", "192.168.40.255"], "/26 tem blocos de 64. O bloco 0–63 termina em .63, seu broadcast direcionado.", "broadcast_direcionado_40_26"],
  ["O que caracteriza o endereço de rede de uma sub-rede IPv4?", "Todos os bits da parte de host iguais a zero", ["Todos os bits da parte de host iguais a um", "Primeiro octeto entre 224 e 239", "Sempre ser 255.255.255.255"], "Aplicar a máscara zera os bits de host e produz o endereço de rede.", "bits_endereco_rede"],
  ["Qual alternativa contém somente blocos privados IPv4?", "10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16", ["10.0.0.0/8, 172.0.0.0/8 e 192.168.0.0/16", "10.0.0.0/10, 172.16.0.0/16 e 192.168.0.0/24", "100.0.0.0/8, 172.16.0.0/12 e 192.0.0.0/8"], "Os três blocos privados definidos para uso interno são exatamente 10/8, 172.16/12 e 192.168/16.", "tres_blocos_privados"],
  ["Qual endereço é privado?", "172.31.255.200", ["172.32.0.1", "172.15.255.254", "173.16.0.1"], "172.16.0.0/12 vai de 172.16.0.0 a 172.31.255.255; 172.32.0.1 já está fora.", "limite_privado_172"],
  ["Qual descrição corresponde a tráfego unicast?", "Um emissor envia para uma interface de destino específica", ["Um emissor envia para todos no enlace", "Um emissor envia obrigatoriamente ao grupo 224.0.0.0/4 inteiro", "O destino sempre tem bits de host iguais a um"], "Unicast identifica comunicação destinada a uma interface individual.", "unicast_ipv4"],
  ["Qual alternativa NÃO deve ser atribuída como endereço unicast comum a uma interface da rede 198.51.100.0/24?", "198.51.100.255", ["198.51.100.1", "198.51.100.100", "198.51.100.254"], ".255 é o broadcast direcionado do /24; os endereços .1 a .254 são utilizáveis no modelo tradicional.", "host_vs_broadcast_24"]
];

ipv4TypeQuestions.forEach((spec, index) => addStructuredQuestion(
  index === 4 || index === 5 ? "ipv4_nat" : "ipv4_geral",
  index === 4 || index === 5 ? "ipv4_privado" : "tipos_ipv4",
  "Tipos de endereços IPv4",
  ...spec
));


const routerOutputQuestions = [
  ["Qual é uma função central da porta de saída de um roteador?", "Armazenar pacotes em buffer e transmiti-los pelo enlace de saída", ["Calcular todos os caminhos BGP para cada bit", "Resolver nomes DNS", "Distribuir blocos da IANA"], "A porta de saída recebe pacotes do elemento de comutação, pode enfileirá-los e executa funções de enlace/transmissão.", "funcao_porta_saida"],
  ["Quando várias entradas enviam pacotes para a mesma porta de saída mais rapidamente do que o enlace transmite, ocorre:", "Formação de fila no buffer de saída", ["Reserva automática de circuito", "Aumento automático da MTU", "Conversão dos pacotes em ARP"], "A disputa por uma saída pode gerar enfileiramento; se o buffer lotar, haverá perda.", "fila_porta_saida"],
  ["Se o buffer de uma porta de saída está cheio quando chega outro pacote, qual consequência é possível?", "O pacote ser descartado", ["O TTL ser restaurado", "O prefixo de destino ser ampliado", "O quadro atravessar sem transmissão"], "Buffers são finitos; overflow pode causar descarte de pacotes.", "perda_porta_saida"],
  ["Qual mecanismo decide a ordem em que pacotes enfileirados deixam uma porta de saída?", "A disciplina de escalonamento da fila", ["A IANA", "O servidor DNS", "A máscara do endereço de origem apenas"], "A porta de saída aplica uma disciplina de escalonamento para selecionar o próximo pacote a transmitir.", "escalonamento_saida"],
  ["Em um roteador, o processador de roteamento pertence principalmente a qual plano?", "Plano de controle", ["Plano físico de modulação apenas", "Plano de aplicação do host", "Plano de tagging 802.1Q"], "O processador executa protocolos e funções de controle; o encaminhamento por pacote ocorre no plano de dados.", "processador_roteamento"],
  ["Qual arquitetura interna tende a permitir transferências simultâneas entre pares distintos de entrada e saída?", "Crossbar ou rede de interconexão", ["Barramento único compartilhado", "Memória com uma única operação por vez", "Uma fila FIFO sem elemento de comutação"], "Uma crossbar oferece caminhos internos paralelos quando as transferências não disputam a mesma saída.", "crossbar_paralelismo"]
];

routerOutputQuestions.forEach(spec => addStructuredQuestion(
  "camada_rede_roteadores", "porta_saida", "Roteadores — porta de saída", ...spec
));


const ipv6AssignmentQuestions = [
  ["Qual mecanismo permite ao host formar um endereço IPv6 sem um servidor DHCPv6 stateful?", "SLAAC", ["ARP", "NAT44", "BGP"], "SLAAC usa informações anunciadas pelo roteador e não exige servidor mantendo concessões de endereço.", "slaac_sem_stateful"],
  ["Qual mensagem NDP normalmente fornece prefixo e informações de autoconfiguração ao host?", "Router Advertisement (RA)", ["Neighbor Advertisement (NA)", "Redirect", "Echo Reply"], "RA, ICMPv6 tipo 134, anuncia prefixos e outros parâmetros do enlace.", "ra_fornece_prefixo"],
  ["Qual endereço o host normalmente aprende como gateway padrão IPv6 por Router Advertisement?", "O endereço link-local do roteador", ["O endereço multicast solicited-node do próprio host", "Um broadcast IPv6", "O endereço do servidor DHCPv6"], "A rota padrão é associada ao roteador anunciante, normalmente por seu endereço link-local.", "gateway_ipv6_link_local"],
  ["No DHCPv6 stateful, o servidor:", "Atribui endereços e mantém estado das concessões", ["Somente anuncia o MAC do gateway", "Nunca fornece endereços", "Substitui todas as mensagens RA"], "Stateful significa que o servidor participa da atribuição e registra o estado das concessões.", "dhcpv6_stateful"],
  ["No uso de DHCPv6 stateless com SLAAC, o host normalmente:", "Forma o endereço via SLAAC e obtém outros parâmetros via DHCPv6", ["Recebe obrigatoriamente o endereço do servidor DHCPv6", "Deixa de processar Router Advertisement", "Usa ARP para descobrir o prefixo"], "No modo stateless, DHCPv6 pode fornecer informações como DNS, enquanto o endereço é formado via SLAAC.", "dhcpv6_stateless"],
  ["Qual alternativa diferencia configuração manual de SLAAC?", "Na manual, o administrador define os parâmetros; no SLAAC, o host usa informações de RA", ["Na manual, a IANA configura cada host", "SLAAC exige sempre DHCPv6 stateful", "Configuração manual só existe em IPv4"], "IPv6 admite configuração manual, SLAAC e combinações com DHCPv6.", "manual_vs_slaac"],
  ["Um host pode usar SLAAC e DHCPv6 ao mesmo tempo?", "Sim; SLAAC pode formar o endereço e DHCPv6 fornecer outros parâmetros", ["Não; são sempre mutuamente exclusivos", "Sim, mas somente sem Router Advertisement", "Não, porque DHCPv6 usa ARP"], "A combinação SLAAC + DHCPv6 stateless é prevista para complementar a configuração.", "slaac_mais_dhcpv6"],
  ["Qual afirmação sobre Router Advertisement é correta?", "Pode ser periódica ou enviada em resposta a Router Solicitation", ["É um ARP Reply IPv6", "Sempre atribui endereço por concessão stateful", "Usa broadcast, que é obrigatório no IPv6"], "Roteadores anunciam sua presença por RA; hosts podem solicitar o anúncio enviando RS.", "ra_periodica_solicitada"]
];

ipv6AssignmentQuestions.forEach(spec => addStructuredQuestion(
  "ipv6", "atribuicao_ipv6", "Atribuição IPv6", ...spec
));


const newVlanQuestions = [
  ["Um switch recebe quadro sem tag em uma porta access configurada na VLAN 30. A qual VLAN associa o quadro?", "VLAN 30", ["VLAN nativa do trunk vizinho obrigatoriamente", "Todas as VLANs", "Nenhuma VLAN"], "O PVID/configuração access classifica o tráfego sem tag na VLAN 30.", "access_ingresso_vlan30"],
  ["Um enlace entre dois switches precisa transportar VLANs 10, 20 e 30. Qual configuração é apropriada?", "Trunk 802.1Q permitindo as três VLANs", ["Access somente na VLAN 10", "Rota padrão sem tagging", "NAT entre os switches"], "O trunk identifica quadros de múltiplas VLANs com 802.1Q.", "trunk_tres_vlans"],
  ["No router-on-a-stick, por que o enlace switch–roteador é trunk?", "Porque uma interface física transporta tráfego de várias VLANs para subinterfaces", ["Porque o trunk realiza NAT", "Porque elimina os gateways das VLANs", "Porque quadros trunk não possuem MAC"], "Cada subinterface atende uma VLAN e normalmente atua como seu gateway.", "router_on_a_stick_trunk"],
  ["VLAN 10 usa 192.168.10.0/24 e VLAN 20 usa 192.168.20.0/24. Para um host da VLAN 10 falar com a VLAN 20, é necessário:", "Roteamento inter-VLAN por roteador ou switch de camada 3", ["Somente estender a porta access", "Um ARP broadcast que atravesse todas as VLANs", "Remover os prefixos IP"], "VLANs são domínios L2 distintos; a comunicação entre suas sub-redes exige camada 3.", "intervlan_duas_subredes"],
  ["Qual alternativa está INCORRETA sobre VLAN e sub-rede?", "VLAN e sub-rede são o mesmo conceito e pertencem à mesma camada", ["VLAN segmenta domínios de broadcast L2", "Uma VLAN costuma ser associada a uma sub-rede IP", "O gateway de uma VLAN deve ter endereço de sua sub-rede"], "VLAN é conceito de camada 2; sub-rede IP é de camada 3, embora seja comum associá-las.", "vlan_vs_subrede_incorreta"]
];

newVlanQuestions.forEach(spec => addStructuredQuestion(
  "vlan", "vlan_intervlan", "VLAN", ...spec
));


const newIcmpQuestions = [
  ["A saída do ping mostra 10 pacotes transmitidos, 8 recebidos. Qual foi a perda?", "20%", ["2%", "8%", "80%"], "Dois de dez pacotes não retornaram: 2/10 × 100 = 20%.", "ping_perda_10_8"],
  ["Em um traceroute, o salto 4 mostra '* * *', mas saltos posteriores respondem. Qual interpretação é mais adequada?", "O roteador do salto 4 não respondeu às sondas, embora possa ter encaminhado os pacotes", ["O caminho terminou definitivamente no salto 4", "O TTL deixou de ser decrementado", "O destino necessariamente perdeu todos os pacotes"], "A ausência de resposta pode decorrer de filtro ou limitação ICMP; respostas posteriores provam que houve encaminhamento.", "traceroute_asteriscos_intermediario"],
  ["Uma sonda do traceroute enviada com TTL=3 expira no terceiro roteador. Qual mensagem é esperada?", "ICMP Time Exceeded", ["ICMP Echo Reply do primeiro roteador", "ARP Reply do destino", "DHCP ACK"], "Cada roteador decrementa o TTL; quando ele chega a zero, o roteador descarta o pacote e normalmente envia Time Exceeded.", "traceroute_ttl3"],
  ["O ping relata tempos 12 ms, 15 ms, 11 ms e 14 ms. Esses valores medem:", "RTT, o tempo de ida e volta de cada sonda", ["Somente o atraso de ida", "A quantidade de saltos", "O tempo restante do TTL"], "Ping mede o intervalo entre o envio do Echo Request e o recebimento do Echo Reply.", "ping_interpretacao_rtt"],
  ["Ao tentar alcançar uma rede sem rota, qual mensagem ICMP pode ser retornada?", "Destination Unreachable", ["Echo Request", "Router Advertisement", "Neighbor Solicitation"], "Destination Unreachable sinaliza que a entrega não foi possível na condição indicada.", "icmp_destination_unreachable_pratico"]
];

newIcmpQuestions.forEach(spec => addStructuredQuestion(
  "icmp", "ping_traceroute", "ICMP / ping / traceroute", ...spec
));


const ipv4HeaderFields = [
  ["Version", "Indica a versão do IP; em IPv4, o valor é 4"],
  ["IHL", "Indica o comprimento do cabeçalho IPv4"],
  ["DS/TOS", "Transporta informações para diferenciação de serviço"],
  ["Total Length", "Indica o tamanho total do datagrama, cabeçalho mais dados"],
  ["Identification", "Associa fragmentos ao mesmo datagrama original"],
  ["Flags", "Contém controles de fragmentação, incluindo DF e MF"],
  ["DF", "Indica que o datagrama não deve ser fragmentado"],
  ["MF", "Indica que ainda existem fragmentos depois deste"],
  ["Fragment Offset", "Indica a posição dos dados do fragmento em unidades de 8 bytes"],
  ["TTL", "Limita a vida do datagrama em saltos"],
  ["Protocol", "Identifica o protocolo transportado, como TCP, UDP ou ICMP"],
  ["Header Checksum", "Verifica erros no cabeçalho IPv4"],
  ["Source Address", "Contém o endereço IPv4 de origem"],
  ["Destination Address", "Contém o endereço IPv4 de destino"]
];

ipv4HeaderFields.forEach(([field, purpose], index) => {
  const distractors = [1, 5, 9]
    .map(offset => ipv4HeaderFields[(index + offset) % ipv4HeaderFields.length][1]);

  addStructuredQuestion(
    "ipv4_geral",
    "cabecalho_ipv4",
    "Cabeçalho IPv4",
    `No cabeçalho IPv4, qual é a função do campo ${field}?`,
    purpose,
    distractors,
    `${field}: ${purpose}.`,
    `cabecalho_ipv4_${normalizeConceptPart(field)}`
  );
});


[
  ["Um endereço IPv4 possui quantos bits?", "32 bits", ["16 bits", "64 bits", "128 bits"], "IPv4 possui quatro octetos, totalizando 4 × 8 = 32 bits.", "ipv4_32_bits"],
  ["No CIDR, o prefixo /20 informa que:", "Os primeiros 20 bits identificam a parte de rede", ["Existem exatamente 20 hosts", "Os últimos 20 bits são sempre de host", "A máscara possui 20 octetos"], "O número após a barra é a quantidade de bits 1 contíguos da máscara, isto é, bits de rede.", "cidr_significado_20"],
  ["Historicamente, quais eram as máscaras padrão das classes A, B e C?", "/8, /16 e /24", ["/8, /12 e /16", "/16, /24 e /32", "/1, /2 e /3"], "No endereçamento classful, classes A, B e C usavam respectivamente /8, /16 e /24; CIDR removeu essa rigidez.", "classes_abc_prefixos"],
  ["Qual foi uma vantagem do CIDR em relação ao endereçamento por classes?", "Permitir prefixos de tamanho variável e alocação mais eficiente", ["Transformar IPv4 em 128 bits", "Eliminar tabelas de roteamento", "Reservar circuitos por prefixo"], "CIDR permite adequar o tamanho do bloco à necessidade e agregar rotas.", "cidr_vs_classes"],
  ["Na arquitetura da Internet, a borda é formada principalmente por:", "Sistemas finais e redes de acesso", ["Somente roteadores do núcleo", "Apenas servidores raiz DNS", "Circuitos reservados entre todos os hosts"], "Hosts e redes de acesso ficam na borda; o núcleo interliga redes por roteadores e enlaces.", "borda_internet"],
  ["O núcleo da Internet é caracterizado principalmente por:", "Roteadores e enlaces que encaminham tráfego entre redes", ["Somente aplicações nos sistemas finais", "Uma única LAN mundial", "Um único Sistema Autônomo"], "A Internet é uma rede de redes: seu núcleo realiza o transporte entre redes e sua borda abriga sistemas finais.", "nucleo_internet"]
].forEach((spec, index) => addStructuredQuestion(
  index < 4 ? "ipv4_geral" : "fundamentos",
  index < 2 ? "enderecamento_ipv4" : index < 4 ? "classes_cidr" : "arquitetura_internet",
  index < 4 ? "IPv4 e CIDR" : "Arquitetura da Internet",
  ...spec
));


[
  ["fundamentos", "pilha_protocolos", "Pilha de protocolos", "No destino, o desencapsulamento ocorre quando:", "Cada camada remove e interpreta suas informações antes de entregar os dados à camada superior", ["A aplicação adiciona todos os cabeçalhos novamente", "O quadro é transformado em circuito reservado", "O roteador remove o cabeçalho de transporte em cada salto"], "No destino, bits são interpretados como quadro, depois datagrama, segmento e mensagem conforme os cabeçalhos são processados.", "desencapsulamento"],
  ["ipv4_geral", "dhcp", "DHCP", "O que representa o lease no DHCP?", "O período pelo qual a configuração é concedida ao cliente", ["Uma rota estática permanente", "A tabela ARP do servidor", "A tag VLAN do cliente"], "A concessão DHCP possui duração e normalmente é renovada antes de expirar.", "dhcp_lease"],
  ["ipv4_nat", "nat_pat", "NAT/PAT", "Por que um NAT/PAT consulta sua tabela quando chega a resposta da Internet?", "Para mapear o IP e a porta públicos de volta ao host e à porta internos", ["Para escolher uma VLAN aleatória", "Para recalcular o endereço de rede do servidor", "Para obter um bloco novo da IANA"], "Na ida, o NAT registra a tradução; na volta, esse estado permite entregar a resposta ao fluxo interno correto.", "nat_tabela_ida_volta"],
  ["ipv4_geral", "path_mtu", "Fragmentação IPv4", "Com DF=1, um datagrama IPv4 é maior que a MTU do próximo enlace. O comportamento esperado é:", "O roteador descarta o datagrama e pode sinalizar que a fragmentação é necessária", ["O roteador ignora DF e fragmenta", "O roteador aumenta a MTU do enlace", "O destino remonta um datagrama que nunca foi enviado"], "DF proíbe fragmentação. A sinalização ICMP permite à origem reduzir o tamanho, fundamento da descoberta de Path MTU.", "df_path_mtu"],
  ["ipv6", "ipv6_geral", "Histórico do IPv6", "CIDR, DHCP e NAT ajudaram a prolongar o uso do IPv4, mas o IPv6 é considerado solução estrutural porque:", "Amplia o espaço de endereços para 128 bits", ["Transforma cada VLAN em um AS", "Reserva circuitos entre todos os hosts", "Remove a necessidade de protocolos de enlace"], "As medidas anteriores mitigaram alocação e escassez; o IPv6 amplia diretamente o espaço de endereçamento.", "ipv6_solucao_estrutural"],
  ["ipv6", "ipv6_geral", "Tipos IPv6", "Qual prefixo é normalmente usado na prática para endereços Unique Local gerados localmente?", "FD00::/8", ["FE80::/10", "FF00::/8", "2000::/3"], "Unique Local ocupa FC00::/7; a parte normalmente usada para atribuição local é FD00::/8.", "ula_fd00"],
  ["ipv6", "ipv6_geral", "Tipos IPv6", "O que caracteriza o anycast IPv6?", "O mesmo endereço é atribuído a múltiplas interfaces e o roteamento entrega a uma delas, normalmente a mais próxima", ["Entrega obrigatoriamente a todas as interfaces do enlace", "Substitui o multicast FF00::/8", "Cria broadcast, inexistente no IPv6"], "Anycast usa formato unicast, mas pode existir em várias interfaces; a infraestrutura de roteamento escolhe uma instância.", "anycast_ipv6"],
  ["ipv6", "ndp", "NDP", "Para resolver um vizinho IPv6, uma Neighbor Solicitation é normalmente enviada a:", "Um endereço multicast solicited-node derivado do alvo", ["255.255.255.255", "Um broadcast IPv6", "O endereço Global Unicast da IANA"], "NDP usa ICMPv6 e multicast solicited-node, evitando o broadcast usado pelo ARP no IPv4.", "ndp_solicited_node"],
  ["ipv4_geral", "tipos_ipv4", "Tipos de endereços IPv4", "Qual afirmação diferencia corretamente um endereço público de um privado?", "O público pode ser roteado globalmente quando atribuído e anunciado; o privado não é roteado na Internet pública", ["O privado sempre pertence a 224.0.0.0/4", "O público dispensa prefixo e gateway", "O privado possui 128 bits"], "Endereços privados pertencem a 10/8, 172.16/12 ou 192.168/16 e normalmente usam NAT para acesso externo.", "publico_vs_privado"]
].forEach(([group, subtopic, topic, text, correct, wrong, explanation, concept]) =>
  addStructuredQuestion(group, subtopic, topic, text, correct, wrong, explanation, concept)
);


// ============================================================
// QUESTIONÁRIOS MOODLE DE IPv6 — PARTES 1 E 2
// ============================================================

function addMoodleIpv6Question(source, studyTopic, subtopic, spec) {
  const [text, correct, wrong, explanation, concept] = spec;

  addQuestion(studyTopic === "ipv6_moodle_extras" ? "IPv6 — Conteúdos extras do Moodle" : {
    ipv6_history: "IPv6 — histórico e implantação",
    ipv6_addressing: "IPv6 — endereçamento e notação",
    ipv6_header: "IPv6 — cabeçalho",
    ipv6_slaac_dhcp: "IPv6 — SLAAC / DHCPv6",
    ipv6_ndp: "IPv6 — NDP",
    ipv6_transition: "IPv6 — transição"
  }[studyTopic], text, correct, wrong, explanation, {
    group: studyTopic === "ipv6_moodle_extras" ? "ipv6_moodle_extras" : "ipv6",
    subtopic,
    studyTopic,
    source,
    concept
  });
}


const moodleIpv6Part1 = [
  ["ipv6_history", "ipv6_implantacao", ["Na hierarquia de distribuição de recursos numéricos da Internet, qual sequência está correta?", "IANA → RIR → entidade nacional/operadora → usuário final", ["RIR → IANA → usuário final → NIC.br", "NIC.br → usuário final → IANA → RIR", "Usuário final → RIR → IANA → operadora"], "A IANA coordena globalmente os recursos e os distribui aos RIRs; na América Latina e Caribe, o RIR é o LACNIC, com atuação nacional do NIC.br no Brasil.", "iana_rir_hierarquia"]],
  ["ipv6_history", "ipv6_implantacao", ["Qual organização exerce a função de Registro Regional da Internet para a América Latina e o Caribe?", "LACNIC", ["IANA", "NIC.br", "ICANN DNS Root apenas"], "O LACNIC é o RIR da América Latina e do Caribe. A IANA coordena o topo da hierarquia e o NIC.br atua no Brasil.", "lacnic_rir"]],
  ["ipv6_history", "ipv6_implantacao", ["Assinale a alternativa INCORRETA sobre o planejamento de IPv6.", "A implantação dispensa testes quando os equipamentos declaram suporte a IPv6", ["Deve-se verificar o suporte dos equipamentos", "Treinamento da equipe faz parte do planejamento", "Pode ser necessário solicitar um bloco IPv6 ao provedor ou registro competente"], "Suporte declarado não elimina testes. Inventário, capacitação, endereçamento, testes e implantação gradual reduzem riscos.", "ipv6_planejamento_testes"]],
  ["ipv6_history", "ipv6_implantacao", ["Por que NAT não é considerado a solução definitiva para o esgotamento do IPv4?", "Porque conserva endereços, mas introduz estado e limita o modelo fim a fim sem ampliar o espaço de 32 bits", ["Porque NAT transforma cada IPv4 em 128 bits", "Porque NAT somente funciona com IPv6", "Porque NAT impede qualquer acesso à Internet"], "NAT foi uma medida paliativa importante, mas não cria novos endereços IPv4 e pode dificultar aplicações que dependem de conectividade fim a fim.", "nat_paliativo_ipv6"]],
  ["ipv6_history", "ipv6_implantacao", ["Considere: I. CIDR tornou a alocação mais eficiente. II. DHCP permite reutilização temporal de endereços. III. NAT permite compartilhar endereços públicos. IV. Essas medidas eliminaram definitivamente a necessidade do IPv6. Quais estão corretas?", "I, II e III apenas", ["I e IV apenas", "II, III e IV apenas", "I, II, III e IV"], "CIDR, DHCP e NAT retardaram os efeitos da escassez, mas não alteraram o limite estrutural de 32 bits do IPv4.", "mitigacoes_esgotamento_ipv4"]],
  ["ipv6_history", "ipv6_implantacao", ["Qual afirmação diferencia corretamente IPv4 e IPv6?", "IPv4 usa endereços de 32 bits e IPv6 usa endereços de 128 bits", ["IPv4 usa 64 bits e IPv6 usa 128 bits", "Ambos usam exatamente 32 bits", "IPv4 usa decimal e, por isso, possui 128 bits"], "O tamanho do endereço é 32 bits no IPv4 e 128 bits no IPv6; a forma textual de representação não altera esse tamanho.", "ipv4_32_ipv6_128"]],
  ["ipv6_history", "ipv6_implantacao", ["No contexto de redes, um protocolo define principalmente:", "Regras, formatos e ordem das mensagens trocadas entre entidades", ["Somente a velocidade física do enlace", "A marca obrigatória dos roteadores", "Um endereço IP permanente para cada processo"], "Um protocolo especifica sintaxe, semântica e sequenciamento das mensagens, além das ações associadas ao envio e recebimento.", "conceito_protocolo"]],

  ["ipv6_header", "cabecalho_ipv6", ["O cabeçalho base do IPv6 possui:", "40 bytes de tamanho fixo", ["20 bytes obrigatoriamente", "Tamanho variável entre 20 e 60 bytes", "128 bytes de tamanho fixo"], "O cabeçalho base IPv6 foi simplificado e tem 40 bytes fixos. Informações opcionais ficam em cabeçalhos de extensão.", "ipv6_header_40_bytes"]],
  ["ipv6_header", "cabecalho_ipv6", ["Qual mapeamento de campo IPv4 para IPv6 está correto?", "TTL → Hop Limit", ["TTL → Flow Label", "Protocol → Traffic Class", "Total Length → Source Address"], "Hop Limit exerce no IPv6 o papel do TTL: é decrementado a cada roteador e limita a vida do pacote em saltos.", "ipv4_ipv6_ttl_hop_limit"]],
  ["ipv6_header", "cabecalho_ipv6", ["No cabeçalho IPv6, o campo equivalente funcional a Protocol do IPv4 é:", "Next Header", ["Flow Label", "Payload Length", "Traffic Class"], "Next Header identifica o cabeçalho de extensão seguinte ou o protocolo de camada superior, como TCP ou UDP.", "ipv4_ipv6_protocol_next_header"]],
  ["ipv6_header", "cabecalho_ipv6", ["A que corresponde o campo Total Length do IPv4 no cabeçalho IPv6?", "Payload Length", ["Flow Label", "Hop Limit", "Version"], "Payload Length informa o tamanho do conteúdo posterior ao cabeçalho base IPv6, incluindo cabeçalhos de extensão.", "ipv4_ipv6_total_payload"]],
  ["ipv6_header", "cabecalho_ipv6", ["Por que opções e algumas funções foram retiradas do cabeçalho base IPv6?", "Para simplificar o processamento nos roteadores, usando cabeçalhos de extensão quando necessário", ["Para impedir protocolos de transporte", "Para reduzir os endereços a 32 bits", "Para obrigar fragmentação em todos os roteadores"], "Um cabeçalho base fixo e mais simples torna o encaminhamento mais eficiente; recursos opcionais são encadeados por Next Header.", "ipv6_header_simplificacao"]],
  ["ipv6_header", "fragmentacao_ipv6", ["Um roteador recebe um pacote IPv6 maior que a MTU do próximo enlace. O que ele faz?", "Descarta o pacote e pode enviar ICMPv6 Packet Too Big à origem", ["Fragmenta o pacote como um roteador IPv4", "Remove o endereço de origem", "Converte automaticamente o pacote em IPv4"], "Roteadores IPv6 não fragmentam. A origem ajusta o tamanho e, se necessário, usa o cabeçalho de extensão Fragment.", "ipv6_fragmentacao_origem"]],

  ["ipv6_addressing", "enderecamento_ipv6", ["Quantas redes /64 podem ser formadas a partir de um bloco /48?", "65.536", ["256", "4.096", "16.777.216"], "Entre /48 e /64 há 16 bits: 2¹⁶ = 65.536 redes /64.", "ipv6_48_para_64"]],
  ["ipv6_addressing", "enderecamento_ipv6", ["Quantas redes /64 podem ser formadas a partir de um bloco /56?", "256", ["8", "65.536", "16.384"], "Entre /56 e /64 há 8 bits: 2⁸ = 256 redes /64.", "ipv6_56_para_64"]],
  ["ipv6_addressing", "notacao_ipv6", ["Qual dos endereços IPv6 abaixo é sintaticamente válido?", "2001:db8::10", ["2001::abcd::1", "2001:db8:GG::1", "2001:db8:12345::1"], "2001:db8::10 usa uma única compressão. Os demais têm dois '::', caractere não hexadecimal ou grupo com mais de quatro algarismos.", "ipv6_notacao_valida"]],
  ["ipv6_addressing", "notacao_ipv6", ["Por que 2001::abcd::1 é inválido?", "Porque a abreviação :: aparece duas vezes", ["Porque letras minúsculas são proibidas", "Porque todo endereço deve terminar em ::", "Porque o primeiro grupo deveria ser decimal"], "A compressão :: pode aparecer no máximo uma vez, pois duas ocorrências tornam ambígua a quantidade de grupos omitidos.", "ipv6_duplo_dois_pontos_unico"]],
  ["ipv6_addressing", "notacao_ipv6", ["Um endereço IPv6 completo, sem abreviação, é escrito como:", "8 grupos de 16 bits representados em hexadecimal", ["4 grupos de 8 bits em decimal", "16 grupos de 16 bits em binário obrigatório", "8 grupos de 32 bits em decimal"], "O formato textual usual tem oito grupos hexadecimais; cada grupo representa 16 bits, totalizando 128 bits.", "ipv6_oito_grupos_hex"]],
  ["ipv6_addressing", "tipos_ipv6", ["Qual tipo de endereço IPv6 é usado para comunicação no enlace local e não é roteado globalmente?", "Link-local", ["Global Unicast", "Anycast global", "Multicast global"], "Endereços link-local, normalmente em FE80::/10, valem somente no enlace e são fundamentais para NDP.", "ipv6_link_local_escopo"]],
  ["ipv6_addressing", "tipos_ipv6", ["No IPv6, qual mecanismo atende a comunicação com todas as interfaces integrantes de um grupo?", "Multicast", ["Broadcast", "NAT", "Unicast"], "IPv6 não define broadcast. Multicast entrega o pacote às interfaces que participam do grupo de destino.", "ipv6_multicast_sem_broadcast"]],
  ["ipv6_addressing", "tipos_ipv6", ["Um endereço Global Unicast IPv6 destina-se principalmente a:", "Comunicação roteável na Internet pública", ["Uso exclusivo dentro do mesmo enlace", "Identificar todos os membros de um grupo", "Substituir o endereço MAC"], "Global Unicast é o tipo de endereço unicast globalmente roteável, equivalente conceitual aos endereços IPv4 públicos.", "ipv6_global_unicast_publico"]],

  ["ipv6_header", "qos_ipv6", ["Quantos bits possui o campo Traffic Class do cabeçalho IPv6?", "8 bits", ["4 bits", "16 bits", "20 bits"], "Traffic Class possui 8 bits e permite classificar o tráfego, inclusive para tratamento de prioridade e congestionamento.", "traffic_class_8_bits"]],
  ["ipv6_header", "qos_ipv6", ["Qual campo IPv6 permite identificar pacotes pertencentes a um mesmo fluxo?", "Flow Label", ["Hop Limit", "Payload Length", "Source Address"], "O Flow Label possui 20 bits e pode marcar pacotes de um fluxo para tratamento consistente.", "flow_label_fluxo"]],
  ["ipv6_header", "qos_ipv6", ["Assinale a associação correta sobre QoS no IPv6.", "Traffic Class distingue classes; Flow Label identifica fluxos", ["Traffic Class guarda o MAC; Flow Label guarda a MTU", "Traffic Class substitui o endereço; Flow Label substitui o DNS", "Traffic Class conta saltos; Flow Label fragmenta nos roteadores"], "Traffic Class carrega informações de classe/prioridade; Flow Label permite reconhecer um fluxo.", "qos_traffic_flow_associacao"]],
  ["ipv6_header", "qos_ipv6", ["Qual afirmação sobre Traffic Class e Flow Label é INCORRETA?", "Flow Label é decrementado a cada roteador como o Hop Limit", ["Traffic Class possui 8 bits", "Flow Label auxilia na identificação de fluxos", "Ambos ficam no cabeçalho base IPv6"], "Quem é decrementado em cada salto é Hop Limit. Flow Label não exerce a função de TTL.", "flow_label_nao_hop_limit"]],

  ["ipv6_transition", "transicao_ipv6", ["O que caracteriza a Pilha Dupla?", "O dispositivo implementa IPv4 e IPv6 e usa o protocolo adequado ao destino", ["Todo pacote IPv6 é fragmentado em IPv4", "Somente endereços privados podem coexistir", "IPv4 é desligado mundialmente em uma data única"], "Na Pilha Dupla, ambos os protocolos estão disponíveis: com um nó IPv6 usa-se IPv6; com um nó IPv4 usa-se IPv4.", "transicao_pilha_dupla"]],
  ["ipv6_transition", "transicao_ipv6", ["Um túnel IPv6 sobre IPv4 permite:", "Transportar pacotes IPv6 encapsulados através de uma infraestrutura IPv4", ["Converter todo endereço IPv6 em registro A", "Eliminar os cabeçalhos IP", "Criar broadcast nativo no IPv6"], "O tunelamento encapsula um protocolo dentro de outro para atravessar uma região que ainda não oferece conectividade IPv6 nativa.", "transicao_tunel"]],
  ["ipv6_transition", "transicao_ipv6", ["Qual mecanismo de transição altera representações entre IPv4 e IPv6 para permitir comunicação entre pilhas diferentes?", "Tradução", ["Pilha Dupla", "Tunelamento", "SLAAC"], "Tradução adapta cabeçalhos e, conforme o mecanismo, endereços. Pilha Dupla implementa ambos; túnel transporta um protocolo sobre outro.", "transicao_traducao"]],
  ["ipv6_transition", "transicao_ipv6", ["Sobre a migração mundial para IPv6, é correto afirmar que:", "A coexistência é gradual e não há uma data mundial obrigatória para desligar todo IPv4", ["Todos os países desligam IPv4 simultaneamente", "Pilha Dupla impede qualquer transição gradual", "IPv6 somente funciona após o esgotamento de cada rede privada"], "Redes migram em ritmos diferentes e usam mecanismos de coexistência durante uma transição prolongada.", "transicao_sem_data_mundial"]]
];

moodleIpv6Part1.forEach(([studyTopic, subtopic, spec]) =>
  addMoodleIpv6Question("moodle_ipv6_parte_1", studyTopic, subtopic, spec)
);


const moodleIpv6Part2 = [
  ["ipv6_ndp", "ndp", ["NDP é a sigla de:", "Neighbor Discovery Protocol", ["Network Delivery Process", "Neighbor Detection Program", "Next Datagram Protocol"], "NDP significa Neighbor Discovery Protocol e reúne funções essenciais de descoberta e configuração no enlace IPv6.", "ndp_nome"]],
  ["ipv6_ndp", "ndp", ["Qual protocolo transporta as mensagens do NDP?", "ICMPv6", ["TCP", "UDP", "ARP"], "As cinco mensagens principais do NDP são tipos de ICMPv6.", "ndp_icmpv6"]],
  ["ipv6_ndp", "ndp", ["Qual mensagem um host envia para solicitar imediatamente informações de um roteador IPv6?", "Router Solicitation (tipo 133)", ["Router Advertisement (tipo 134)", "Neighbor Solicitation (tipo 135)", "Redirect (tipo 137)"], "Router Solicitation é enviada pelo host; um roteador pode responder com Router Advertisement.", "ndp_rs_133"]],
  ["ipv6_ndp", "ndp", ["Qual mensagem anuncia a presença do roteador, prefixos e parâmetros de autoconfiguração?", "Router Advertisement (tipo 134)", ["Router Solicitation (tipo 133)", "Neighbor Advertisement (tipo 136)", "Redirect (tipo 137)"], "Router Advertisement é emitida periodicamente ou em resposta a uma Router Solicitation.", "ndp_ra_134"]],
  ["ipv6_ndp", "ndp", ["Qual mensagem participa da descoberta do endereço de enlace de um vizinho?", "Neighbor Solicitation (tipo 135)", ["Router Solicitation (tipo 133)", "Router Advertisement (tipo 134)", "Redirect (tipo 137)"], "Neighbor Solicitation consulta o vizinho alvo e também é usada em DAD.", "ndp_ns_135"]],
  ["ipv6_ndp", "ndp", ["Qual mensagem normalmente responde a uma Neighbor Solicitation?", "Neighbor Advertisement (tipo 136)", ["Router Solicitation (tipo 133)", "Router Advertisement (tipo 134)", "Redirect (tipo 137)"], "Neighbor Advertisement anuncia informações sobre o vizinho e pode ser solicitada ou espontânea.", "ndp_na_136"]],
  ["ipv6_ndp", "ndp", ["Qual mensagem permite a um roteador indicar ao host um próximo salto mais adequado?", "Redirect (tipo 137)", ["Router Solicitation (tipo 133)", "Neighbor Solicitation (tipo 135)", "Neighbor Advertisement (tipo 136)"], "Redirect informa que existe no enlace um primeiro salto melhor para determinado destino.", "ndp_redirect_137"]],
  ["ipv6_ndp", "ndp", ["Qual alternativa NÃO corresponde a uma das cinco mensagens principais do NDP?", "Detection", ["Router Solicitation", "Neighbor Advertisement", "Redirect"], "As cinco mensagens são RS, RA, NS, NA e Redirect. 'Detection' não é um tipo de mensagem NDP.", "ndp_mensagem_inexistente"]],
  ["ipv6_ndp", "ndp", ["Qual Hop Limit deve estar presente nas mensagens NDP válidas?", "255", ["1", "64", "128"], "NDP usa Hop Limit 255. Como um roteador o decrementaria, um valor recebido diferente de 255 indica que a mensagem pode não ter se originado no mesmo enlace.", "ipv6:ndp:255"]],
  ["ipv6_ndp", "ndp", ["Considere as funções: I. descobrir roteadores; II. descobrir prefixos; III. verificar alcançabilidade de vizinhos; IV. resolver endereços de enlace. Quais pertencem ao NDP?", "I, II, III e IV", ["I e II apenas", "III e IV apenas", "I, II e IV apenas"], "NDP cobre descoberta de roteadores e prefixos, resolução de endereços de enlace e detecção de inacessibilidade de vizinhos.", "ndp_funcoes_conjunto"]],
  ["ipv6_ndp", "ndp", ["No IPv6, a função de descobrir o endereço MAC de um vizinho é realizada principalmente por:", "Neighbor Solicitation e Neighbor Advertisement", ["DNS A e AAAA", "Router Solicitation e Redirect", "NAT e ARP broadcast"], "NS e NA, mensagens ICMPv6 do NDP, substituem a resolução de enlace feita pelo ARP no IPv4.", "ndp_resolucao_enlace"]],
  ["ipv6_ndp", "ndp", ["A detecção de vizinho inacessível no NDP serve para:", "Verificar se um vizinho continua alcançável pelo enlace", ["Alocar blocos pela IANA", "Converter registros AAAA em A", "Escolher o número de uma VLAN"], "Neighbor Unreachability Detection acompanha a alcançabilidade do próximo salto e permite reagir a falhas.", "ndp_nud"]],
  ["ipv6_ndp", "ndp", ["Qual associação está INCORRETA?", "Router Solicitation — anunciar espontaneamente o MAC de um vizinho", ["Router Advertisement — anunciar prefixos", "Neighbor Solicitation — consultar um vizinho", "Redirect — indicar primeiro salto melhor"], "Router Solicitation é enviada por hosts para solicitar Router Advertisement; ela não anuncia o MAC de um vizinho.", "ndp_associacao_incorreta"]],
  ["ipv6_ndp", "ndp", ["Por que o NDP usa multicast em vez do broadcast empregado pelo ARP no IPv4?", "Para direcionar a mensagem a grupos relevantes, pois IPv6 não possui broadcast", ["Porque multicast somente existe no IPv4", "Para atravessar obrigatoriamente vários roteadores", "Para substituir os endereços Global Unicast"], "Grupos como solicited-node reduzem o conjunto de interfaces que precisa processar a solicitação.", "ndp_multicast_sem_broadcast"]],

  ["ipv6_slaac_dhcp", "slaac_dhcpv6_dns", ["SLAAC permite que um host:", "Configure automaticamente um endereço IPv6 sem um servidor DHCPv6 stateful", ["Obtenha somente um endereço IPv4 privado", "Ignore Router Advertisement", "Use um endereço duplicado sem verificação"], "SLAAC usa informações de Router Advertisement para formar o endereço e não exige servidor de concessões stateful.", "slaac_autoconfiguracao"]],
  ["ipv6_slaac_dhcp", "slaac_dhcpv6_dns", ["Qual afirmação sobre DAD está correta?", "DAD verifica se o endereço IPv6 pretendido já está em uso no enlace", ["DAD distribui blocos IPv6 aos RIRs", "DAD substitui o DNS reverso", "DAD traduz pacotes IPv6 em IPv4"], "Duplicate Address Detection usa NDP antes de o endereço ser empregado normalmente, ajudando a garantir sua unicidade no enlace.", "slaac_dad_unicidade"]],
  ["ipv6_slaac_dhcp", "slaac_dhcpv6_dns", ["Qual alternativa diferencia corretamente DHCPv6 stateful e stateless?", "Stateful pode atribuir endereços; stateless fornece outros parâmetros enquanto o endereço pode vir do SLAAC", ["Stateless sempre atribui o endereço e stateful nunca o faz", "Ambos são nomes para ARP", "Stateful funciona somente com IPv4"], "No modo stateful o servidor mantém concessões; no stateless ele complementa SLAAC com informações como DNS.", "dhcpv6_stateful_stateless"]],
  ["ipv6_slaac_dhcp", "slaac_dhcpv6_dns", ["Qual registro DNS armazena um endereço IPv6?", "AAAA", ["A", "MX", "PTR4"], "Registros A representam IPv4; registros AAAA representam IPv6.", "dns_aaaa_ipv6"]],
  ["ipv6_slaac_dhcp", "slaac_dhcpv6_dns", ["A resolução reversa de endereços IPv6 utiliza o domínio:", "ip6.arpa", ["in-addr.arpa", "ipv6.local", "aaaa.root"], "A árvore ip6.arpa é usada para mapear a representação reversa de um endereço IPv6 para nomes via PTR.", "dns_reverso_ip6_arpa"]],
  ["ipv6_slaac_dhcp", "slaac_dhcpv6_dns", ["Assinale a afirmação INCORRETA.", "SLAAC obrigatoriamente depende de um servidor DHCPv6 stateful", ["SLAAC usa informações de Router Advertisement", "DAD verifica duplicidade no enlace", "DHCPv6 stateless pode fornecer parâmetros adicionais"], "SLAAC é justamente uma autoconfiguração sem servidor stateful; DHCPv6 pode complementar ou substituir a atribuição conforme a política.", "slaac_nao_exige_dhcpv6"]],
  ["ipv6_slaac_dhcp", "slaac_dhcpv6_dns", ["Os servidores DNS usam exatamente o mesmo tipo de registro para endereços IPv4 e IPv6. Essa afirmação é:", "Incorreta: IPv4 usa A e IPv6 usa AAAA", ["Correta: ambos usam somente A", "Correta: ambos usam somente AAAA", "Incorreta: DNS não armazena endereços IP"], "Os tipos de registro distinguem as famílias: A para 32 bits (IPv4) e AAAA para 128 bits (IPv6).", "dns_a_vs_aaaa"]],
  ["ipv6_slaac_dhcp", "slaac_dhcpv6_dns", ["Um host recebeu um prefixo por Router Advertisement e informações de DNS por DHCPv6, sem receber endereço do servidor. Qual combinação foi usada?", "SLAAC com DHCPv6 stateless", ["DHCPv6 stateful sem NDP", "NAT64 com ARP", "Somente DNS reverso"], "SLAAC forma o endereço a partir do prefixo; DHCPv6 stateless entrega parâmetros adicionais sem manter concessão do endereço.", "slaac_com_dhcpv6_stateless"]],

  ["ipv6_moodle_extras", "seguranca_ipv6", ["Qual associação do conjunto IPSec está correta?", "AH fornece autenticação/integridade; ESP pode fornecer confidencialidade; IKE negocia chaves e associações", ["AH faz DNS; ESP faz SLAAC; IKE faz ARP", "AH e ESP são protocolos de roteamento", "IKE substitui todo o NDP"], "Authentication Header, Encapsulating Security Payload e Internet Key Exchange cumprem papéis complementares na arquitetura IPSec.", "ipsec_ah_esp_ike"]],
  ["ipv6_moodle_extras", "seguranca_ipv6", ["Qual é a finalidade do SEND no IPv6?", "Adicionar mecanismos de segurança ao Neighbor Discovery Protocol", ["Distribuir horário por NTP", "Criar rotas BGP", "Converter registros A em AAAA"], "SEND significa Secure Neighbor Discovery e protege operações do NDP com mecanismos criptográficos.", "send_protege_ndp"]],
  ["ipv6_moodle_extras", "seguranca_ipv6", ["Por que uma varredura sequencial ingênua tende a ser menos viável em uma sub-rede IPv6?", "O espaço potencial de endereços é muito maior", ["IPv6 bloqueia todo ICMPv6", "Cada host muda para IPv4 durante a varredura", "Endereços IPv6 não podem ser alcançados"], "Uma LAN /64 possui um espaço enorme de identificadores. Isso dificulta varredura exaustiva, embora atacantes ainda usem DNS, padrões e outras fontes.", "ipv6_scanning_espaco"]],
  ["ipv6_moodle_extras", "seguranca_ipv6", ["Em uma rede de Pilha Dupla, a política de segurança deve:", "Proteger e monitorar tanto IPv4 quanto IPv6", ["Ignorar IPv6 enquanto IPv4 funcionar", "Filtrar somente registros DNS A", "Desativar ICMPv6 integralmente"], "Duas pilhas significam duas superfícies de exposição. Regras, inventário e monitoramento precisam cobrir ambas.", "pilha_dupla_seguranca"]],
  ["ipv6_moodle_extras", "seguranca_ipv6", ["Assinale a alternativa INCORRETA sobre segurança IPv6.", "O tamanho de 128 bits elimina a necessidade de firewall e monitoramento", ["SEND foi projetado para proteger NDP", "Pilha Dupla exige políticas para as duas famílias", "IPSec inclui AH, ESP e mecanismos de negociação como IKE"], "Um espaço maior dificulta certas varreduras, mas não elimina vulnerabilidades, erros de configuração ou a necessidade de controles.", "ipv6_seguranca_nao_automatica"]],

  ["ipv6_moodle_extras", "roteamento_ipv6", ["Qual protocolo de roteamento IPv6 é derivado do RIPv2, usa vetor de distância e o algoritmo Bellman-Ford?", "RIPng", ["OSPFv3", "MBGP", "NTP"], "RIPng adapta a família RIP ao IPv6 e mantém a abordagem distance-vector baseada em Bellman-Ford.", "ripng_caracteristicas"]],
  ["ipv6_moodle_extras", "roteamento_ipv6", ["Qual endereço multicast é usado pelo RIPng?", "FF02::9", ["FF02::5", "FF02::6", "FF02::1"], "RIPng envia atualizações ao grupo multicast de escopo de enlace FF02::9.", "ripng_multicast"]],
  ["ipv6_moodle_extras", "roteamento_ipv6", ["Quais grupos multicast são associados ao OSPFv3?", "FF02::5 e FF02::6", ["FF02::8 e FF02::9", "FF00::1 e FF00::2", "2001:db8::5 e 2001:db8::6"], "OSPFv3 usa FF02::5 para AllSPFRouters e FF02::6 para AllDRouters.", "ospfv3_multicast"]],
  ["ipv6_moodle_extras", "roteamento_ipv6", ["Qual alternativa lista apenas protocolos internos com suporte a roteamento IPv6?", "RIPng, OSPFv3 e IS-IS", ["NTP, DNS e DHCPv6", "ARP, NAT e ICMPv4", "MBGP, HTTP e Ethernet"], "RIPng, OSPFv3 e IS-IS podem operar como IGPs em redes IPv6.", "igp_ipv6"]],
  ["ipv6_moodle_extras", "roteamento_ipv6", ["Para anunciar rotas IPv6 entre Sistemas Autônomos, utiliza-se tipicamente:", "BGP com extensões multiprotocolo (MP-BGP/MBGP)", ["RIPng como protocolo externo mundial", "NDP Redirect", "NTP sobre multicast"], "As extensões multiprotocolo permitem ao BGP carregar informações de alcançabilidade de diferentes famílias, incluindo IPv6.", "mbgp_ipv6"]],

  ["ipv6_moodle_extras", "mobilidade_ipv6", ["Na mobilidade IP, o dispositivo que muda seu ponto de conexão mantendo sua identidade é chamado de:", "Nó Móvel", ["Nó Correspondente", "Agente de Origem", "Roteador Designado OSPF"], "O Nó Móvel desloca-se entre redes; o Nó Correspondente comunica-se com ele.", "mobilidade_no_movel"]],
  ["ipv6_moodle_extras", "mobilidade_ipv6", ["Qual associação está correta em mobilidade IP?", "Agente de Origem — auxilia o Nó Móvel a manter alcançabilidade a partir de sua rede de origem", ["Nó Correspondente — distribui blocos da IANA", "Nó Móvel — protocolo de roteamento externo", "Agente de Origem — servidor NTP obrigatório"], "O Agente de Origem acompanha a localização do Nó Móvel e participa da entrega durante a mobilidade.", "mobilidade_agente_origem"]],

  ["ipv6_moodle_extras", "ntp_ipv6", ["Qual afirmação sobre NTP e IPv6 é correta?", "Existem servidores NTP públicos acessíveis por IPv6", ["NTP é um protocolo de roteamento IPv6", "NTP substitui o DNS AAAA", "NTP funciona somente sobre IPv4 privado"], "NTP sincroniza relógios e pode operar sobre IPv4 ou IPv6; serviços públicos podem oferecer ambas as famílias.", "ntp_suporte_ipv6"]],
  ["ipv6_moodle_extras", "ntp_ipv6", ["Qual alternativa NÃO descreve o NTP?", "Protocolo que calcula rotas IPv6 entre Sistemas Autônomos", ["Protocolo de sincronização de relógios", "Serviço que pode ser oferecido via IPv6", "Protocolo distinto de RIPng e OSPFv3"], "Roteamento externo é função do BGP; NTP sincroniza tempo.", "ntp_nao_roteamento"]]
];

moodleIpv6Part2.forEach(([studyTopic, subtopic, spec]) =>
  addMoodleIpv6Question("moodle_ipv6_parte_2", studyTopic, subtopic, spec)
);


// ============================================================
// BANCO FINAL: PRESERVA TODAS AS QUESTÕES ÚNICAS E CLASSIFICADAS
// ============================================================

function uniqueQuestions(questionList) {
  const seen = new Set();

  return questionList.filter(question => {
    const key = question.q.trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


const STUDY_TOPICS = Object.freeze([
  { id: "architecture", label: "Arquitetura da Internet", official: true },
  { id: "switching", label: "Comutação", official: true },
  { id: "protocols", label: "Pilha de protocolos / PDU", official: true },
  { id: "network_layer", label: "Camada de rede / roteadores", official: true },
  { id: "icmp", label: "ICMP / ping / traceroute", official: true },
  { id: "ipv4", label: "IPv4 / cabeçalho / fragmentação", official: true },
  { id: "subnetting", label: "Subnetting / CIDR / VLSM", official: true },
  { id: "gateway_routing", label: "Gateway / roteamento", official: true },
  { id: "arp", label: "ARP", official: true },
  { id: "dhcp", label: "DHCP", official: true },
  { id: "nat", label: "NAT / IPv4 privados", official: true },
  { id: "vlan", label: "VLAN", official: true },
  { id: "ipv6_history", label: "IPv6 — histórico e implantação", official: true },
  { id: "ipv6_addressing", label: "IPv6 — endereçamento e notação", official: true },
  { id: "ipv6_header", label: "IPv6 — cabeçalho", official: true },
  { id: "ipv6_slaac_dhcp", label: "IPv6 — SLAAC / DHCPv6", official: true },
  { id: "ipv6_ndp", label: "IPv6 — NDP", official: true },
  { id: "ipv6_transition", label: "IPv6 — transição", official: true },
  { id: "ipv6_moodle_extras", label: "IPv6 — Conteúdos extras do Moodle", official: false }
]);


const OFFICIAL_STUDY_TOPIC_IDS = Object.freeze(
  STUDY_TOPICS.filter(topic => topic.official).map(topic => topic.id)
);


function inferStudyTopic(question) {
  if (question.studyTopic) return question.studyTopic;

  const directGroups = {
    comutacao: "switching",
    camada_rede_roteadores: "network_layer",
    icmp: "icmp",
    subnetting: "subnetting",
    subredes_roteamento: "gateway_routing",
    arp: "arp",
    ipv4_nat: "nat",
    vlan: "vlan",
    ipv6_moodle_extras: "ipv6_moodle_extras"
  };

  if (directGroups[question.group]) return directGroups[question.group];

  if (question.group === "fundamentos") {
    return question.subtopic === "arquitetura_internet"
      ? "architecture"
      : "protocols";
  }

  if (question.group === "ipv4_geral") {
    return question.subtopic === "dhcp" ? "dhcp" : "ipv4";
  }

  if (question.group === "ipv6") {
    if (question.subtopic === "ndp") return "ipv6_ndp";
    if (["atribuicao_ipv6", "slaac_dhcpv6_dns"].includes(question.subtopic)) {
      return "ipv6_slaac_dhcp";
    }

    const searchable = normalizeConceptPart(
      `${question.topic} ${question.subtopic} ${question.q}`
    );

    if (/transicao|pilha_dupla|tunel|traducao/.test(searchable)) {
      return "ipv6_transition";
    }
    if (/cabecalho|fragment|hop_limit|ttl|traffic|flow_label|payload|next_header|40_bytes/.test(searchable)) {
      return "ipv6_header";
    }
    if (/historico|esgotamento|implantacao|iana|rir|lacnic|nic_br|32_bits/.test(searchable)) {
      return "ipv6_history";
    }

    return "ipv6_addressing";
  }

  throw new Error(`Questão sem tema selecionável: ${question.q}`);
}


const questions = uniqueQuestions([
  ...originalQuestions.map(normalizeExistingQuestion),
  ...extraPool.map(normalizeExistingQuestion)
]).map((question, index) => ({
  ...question,
  studyTopic: inferStudyTopic(question),
  id: `q_${String(index + 1).padStart(4, "0")}`
}));


const extraQuestions = questions.filter(question =>
  !originalQuestions.some(original => original.q === question.q)
);


// ============================================================
// CONFIGURAÇÃO DO SIMULADO
// ============================================================

const SIMULATION_SIZE = 30;


// Mantém a divisão temática em todos os simulados.
const QUIZ_BLUEPRINT = [
  { group: "fundamentos", name: "Internet / ISP / AS / classificação / pilha / PDU", count: 3 },
  { group: "camada_rede_roteadores", name: "Camada de rede / repasse / roteamento / roteadores", count: 3 },
  { group: "comutacao", name: "Comutação de pacotes × circuitos", count: 2 },
  { group: "icmp", name: "ICMP / ping / traceroute", count: 2 },
  { group: "subredes_roteamento", name: "Sub-redes / gateway / roteamento estático", count: 3 },
  { group: "arp", name: "ARP", count: 1 },
  { group: "ipv4_geral", name: "IPv4 geral / cabeçalho / fragmentação / DHCP / blocos", count: 5 },
  { group: "ipv4_nat", name: "IPv4 privado / NAT", count: 2 },
  { group: "subnetting", name: "Subnetting / máscaras / VLSM", count: 3 },
  { group: "vlan", name: "VLAN", count: 2 },
  { group: "ipv6", name: "IPv6 / atribuição / SLAAC / DHCPv6 / NDP", count: 4 }
];


const REQUIRED_SUBTOPICS = [
  "arquitetura_internet",
  "pacotes_circuitos",
  "pilha_protocolos",
  "servicos_camada_rede",
  "arquitetura_roteador",
  "porta_saida",
  "ping_traceroute",
  "gateway_subredes",
  "roteamento_estatico_tabelas",
  "arp",
  "enderecamento_ipv4",
  "cabecalho_ipv4",
  "fragmentacao_ipv4",
  "path_mtu",
  "calculo_subnetting",
  "vlsm",
  "distribuicao_enderecos",
  "tipos_ipv4",
  "dhcp",
  "ipv4_privado",
  "nat_pat",
  "vlan_intervlan",
  "ipv6_geral",
  "atribuicao_ipv6",
  "ndp"
];


// ============================================================
// ESTADO
// ============================================================

const state = {
  order: [],
  position: 0,
  answers: {},
  locked: false,
  lastQuizOrder: [],
  selectedTopicIds: [...OFFICIAL_STUDY_TOPIC_IDS]
};


const hasDocument = typeof document !== "undefined";
const $ = selector => hasDocument ? document.querySelector(selector) : null;


const screens = {
  start: $("#start-screen"),
  quiz: $("#quiz-screen"),
  results: $("#results-screen")
};


const letters = ["a", "b", "c", "d"];


// ============================================================
// MONTA UM SIMULADO BALANCEADO
// ============================================================

function buildQuizCandidate() {
  const selected = [];
  const usedIds = new Set();
  const usedConcepts = new Set();

  QUIZ_BLUEPRINT.forEach(blueprintGroup => {
    const candidates = shuffle(
      questions
        .map((question, index) => ({ question, index }))
        .filter(({ question }) => question.group === blueprintGroup.group)
    );

    const chosen = [];

    for (const candidate of candidates) {
      if (
        usedIds.has(candidate.question.id) ||
        usedConcepts.has(candidate.question.concept)
      ) {
        continue;
      }

      chosen.push(candidate);
      usedIds.add(candidate.question.id);
      usedConcepts.add(candidate.question.concept);

      if (chosen.length === blueprintGroup.count) break;
    }

    if (chosen.length !== blueprintGroup.count) {
      throw new Error(
        `Questões/conceitos insuficientes para "${blueprintGroup.name}": ` +
        `${chosen.length} de ${blueprintGroup.count}.`
      );
    }

    selected.push(...chosen.map(({ index }) => index));
  });

  return shuffle(selected);
}


function quizOverlap(firstOrder, secondOrder) {
  const firstIds = new Set(firstOrder.map(index => questions[index].id));
  return secondOrder.reduce(
    (total, index) => total + Number(firstIds.has(questions[index].id)),
    0
  );
}


function buildBalancedQuiz(previousOrder = [], attempts = 30) {
  let best = buildQuizCandidate();
  let bestOverlap = quizOverlap(previousOrder, best);

  for (let attempt = 1; attempt < attempts && bestOverlap > 0; attempt += 1) {
    const candidate = buildQuizCandidate();
    const overlap = quizOverlap(previousOrder, candidate);

    if (overlap < bestOverlap) {
      best = candidate;
      bestOverlap = overlap;
    }
  }

  return best;
}


function normalizedStudyTopicIds(selectedTopicIds) {
  const validIds = new Set(STUDY_TOPICS.map(topic => topic.id));
  return [...new Set(selectedTopicIds)].filter(id => validIds.has(id));
}


function isOfficialSelection(selectedTopicIds) {
  const selected = new Set(normalizedStudyTopicIds(selectedTopicIds));
  return selected.size === OFFICIAL_STUDY_TOPIC_IDS.length &&
    OFFICIAL_STUDY_TOPIC_IDS.every(id => selected.has(id));
}


function countAvailableQuestions(selectedTopicIds) {
  const selected = new Set(normalizedStudyTopicIds(selectedTopicIds));
  const concepts = new Set();

  questions.forEach(question => {
    if (selected.has(question.studyTopic)) concepts.add(question.concept);
  });

  return concepts.size;
}


function buildCustomQuiz(selectedTopicIds, size = SIMULATION_SIZE) {
  const topicIds = shuffle(normalizedStudyTopicIds(selectedTopicIds));

  if (!topicIds.length) return [];

  const pools = new Map(topicIds.map(topicId => [
    topicId,
    shuffle(
      questions
        .map((question, index) => ({ question, index }))
        .filter(({ question }) => question.studyTopic === topicId)
    )
  ]));
  const cursors = new Map(topicIds.map(topicId => [topicId, 0]));
  const selected = [];
  const usedIds = new Set();
  const usedConcepts = new Set();

  while (selected.length < size) {
    let addedThisRound = 0;

    for (const topicId of topicIds) {
      const pool = pools.get(topicId);
      let cursor = cursors.get(topicId);
      let candidate = null;

      while (cursor < pool.length && !candidate) {
        const current = pool[cursor];
        cursor += 1;

        if (
          !usedIds.has(current.question.id) &&
          !usedConcepts.has(current.question.concept)
        ) {
          candidate = current;
        }
      }

      cursors.set(topicId, cursor);

      if (candidate) {
        selected.push(candidate.index);
        usedIds.add(candidate.question.id);
        usedConcepts.add(candidate.question.concept);
        addedThisRound += 1;
      }

      if (selected.length === size) break;
    }

    if (!addedThisRound) break;
  }

  return selected;
}


// ============================================================
// TELAS
// ============================================================

function showScreen(name) {

  Object.entries(screens)
    .forEach(([key, element]) => {

      if (element) {
        element.classList.toggle(
          "is-hidden",
          key !== name
        );
      }

    });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ============================================================
// REINICIALIZAÇÃO
// ============================================================

function resetState(order) {

  state.order = [...order];

  state.position = 0;

  state.answers = {};

  state.locked = false;

}


// ============================================================
// INÍCIO DO SIMULADO
// ============================================================

function startQuiz(order = null) {

  // Sem argumento:
  // cria um novo simulado aleatório de 30 questões.

  // Com argumento:
  // usa a lista fornecida, como no botão "refazer erradas".

  const quizOrder = Array.isArray(order)
    ? shuffle(order)
    : isOfficialSelection(state.selectedTopicIds)
      ? buildBalancedQuiz(state.lastQuizOrder)
      : buildCustomQuiz(state.selectedTopicIds);

  if (!quizOrder.length) return;

  if (!Array.isArray(order)) {
    state.lastQuizOrder = [...quizOrder];
  }


  resetState(quizOrder);

  buildQuestionMap();

  showScreen("quiz");

  renderQuestion();

}


// ============================================================
// MAPA DAS QUESTÕES
// ============================================================

function buildQuestionMap() {

  const grid = $("#question-grid");

  if (!grid) return;


  grid.innerHTML = state.order
    .map((questionIndex, displayIndex) => {

      const question = questions[questionIndex];

      return `
        <span
          class="question-dot"
          data-index="${displayIndex}"
          title="Questão ${displayIndex + 1} — ${question.topic}"
        >
          ${displayIndex + 1}
        </span>
      `;

    })
    .join("");

}


// ============================================================
// RENDERIZA QUESTÃO
// ============================================================

function renderQuestion() {

  state.locked = false;


  const questionIndex =
    state.order[state.position];


  const question =
    questions[questionIndex];


  $("#question-topic").textContent =
    question.topic;


  $("#question-count").textContent =
    `Questão ${state.position + 1} de ${state.order.length}`;


  $("#question-text").textContent =
    question.q;


  $("#options-list").innerHTML =
    question.o
      .map((option, index) => `

        <label
          class="option"
          data-option="${index}"
        >

          <input
            type="radio"
            name="answer"
            value="${index}"
          />

          <span class="option-content">

            <span class="option-letter">
              ${letters[index]}
            </span>

            <span class="option-text">
              ${option}
            </span>

          </span>

        </label>

      `)
      .join("");


  $("#feedback").className =
    "feedback is-hidden";


  $("#feedback").innerHTML = "";


  $("#confirm-button")
    .classList
    .remove("is-hidden");


  $("#confirm-button").disabled = true;


  $("#next-button")
    .classList
    .add("is-hidden");


  $("#next-button").textContent =
    state.position === state.order.length - 1
      ? "Ver resultado"
      : "Próxima questão";


  updateProgress();

}


// ============================================================
// PROGRESSO
// ============================================================

function updateProgress() {

  const answered =
    Object.keys(state.answers).length;


  const percent =
    Math.round(
      (answered / state.order.length) * 100
    );


  $("#progress-percent").textContent =
    `${percent}%`;


  $("#progress-bar").style.width =
    `${percent}%`;


  document
    .querySelectorAll(".question-dot")
    .forEach((dot, displayIndex) => {

      const questionIndex =
        state.order[displayIndex];


      const answer =
        state.answers[questionIndex];


      dot.className =
        "question-dot";


      if (displayIndex === state.position) {
        dot.classList.add("is-current");
      }


      if (answer) {

        dot.classList.add(
          answer.correct
            ? "is-correct"
            : "is-wrong"
        );

      }

    });

}


const TOPIC_SELECTION_STORAGE_KEY = "redes-simulado-selected-topics-v1";


function studyTopicLabel(topicId) {
  return STUDY_TOPICS.find(topic => topic.id === topicId)?.label || topicId;
}


function persistTopicSelection() {
  if (!hasDocument) return;

  try {
    localStorage.setItem(
      TOPIC_SELECTION_STORAGE_KEY,
      JSON.stringify(state.selectedTopicIds)
    );
  } catch (error) {
    console.warn("Não foi possível salvar a seleção de conteúdos.", error);
  }
}


function restoreTopicSelection() {
  if (!hasDocument) return;

  try {
    const saved = JSON.parse(localStorage.getItem(TOPIC_SELECTION_STORAGE_KEY));
    if (Array.isArray(saved)) {
      state.selectedTopicIds = normalizedStudyTopicIds(saved);
    }
  } catch (error) {
    console.warn("A seleção salva de conteúdos foi ignorada.", error);
  }
}


function updateTopicSelectionUi({ persist = true } = {}) {
  if (!hasDocument) return;

  const selected = new Set(state.selectedTopicIds);
  const allOfficialSelected = OFFICIAL_STUDY_TOPIC_IDS.every(id => selected.has(id));
  const officialCheckbox = $("#official-selection");
  const startButton = $("#start-button");

  if (officialCheckbox) officialCheckbox.checked = allOfficialSelected;

  document.querySelectorAll("[data-study-topic]").forEach(input => {
    input.checked = selected.has(input.dataset.studyTopic);
  });

  const selectedCount = selected.size;
  const available = countAvailableQuestions(state.selectedTopicIds);
  const officialMode = isOfficialSelection(state.selectedTopicIds);
  const countMessage = $("#available-question-count");
  const visualTopicCount = $("#selected-topic-count");
  const visualNumber = $(".visual-number");

  if (visualTopicCount) {
    visualTopicCount.textContent = `${selectedCount} ${selectedCount === 1 ? "TEMA" : "TEMAS"}`;
  }

  if (startButton) startButton.disabled = selectedCount === 0 || available === 0;

  if (countMessage) {
    countMessage.classList.toggle("selection-warning", selectedCount === 0);
    countMessage.textContent = selectedCount === 0
      ? "Selecione pelo menos um conteúdo para iniciar."
      : officialMode
        ? "30 questões serão sorteadas com o blueprint oficial balanceado."
        : `${available} ${available === 1 ? "questão disponível" : "questões disponíveis"} para os conteúdos selecionados; ${Math.min(SIMULATION_SIZE, available)} entrarão nesta tentativa.`;
  }

  if (visualNumber) {
    visualNumber.textContent = selectedCount === 0
      ? "0"
      : String(officialMode ? SIMULATION_SIZE : Math.min(SIMULATION_SIZE, available));
  }

  if (persist) persistTopicSelection();
}


function renderTopicSelector() {
  if (!hasDocument) return;

  const grid = $("#topic-grid");
  if (!grid) return;

  const byStudyTopic = countBy(questions, "studyTopic");
  grid.innerHTML = STUDY_TOPICS.map(topic => `
    <label class="topic-option ${topic.official ? "" : "is-extra"}">
      <input type="checkbox" data-study-topic="${topic.id}" />
      <span class="selector-check" aria-hidden="true"></span>
      <span>${topic.label}</span>
      <span class="topic-count">${byStudyTopic[topic.id] || 0}</span>
    </label>
  `).join("");

  grid.addEventListener("change", event => {
    const topicId = event.target.dataset.studyTopic;
    if (!topicId) return;

    const selected = new Set(state.selectedTopicIds);
    if (event.target.checked) selected.add(topicId);
    else selected.delete(topicId);
    state.selectedTopicIds = normalizedStudyTopicIds([...selected]);
    updateTopicSelectionUi();
  });

  restoreTopicSelection();
  updateTopicSelectionUi({ persist: false });
}


// ============================================================
// HABILITA O BOTÃO CONFIRMAR
// ============================================================

if (hasDocument) {

renderTopicSelector();

$("#official-selection").addEventListener("change", event => {
  const selected = new Set(state.selectedTopicIds);
  OFFICIAL_STUDY_TOPIC_IDS.forEach(id => {
    if (event.target.checked) selected.add(id);
    else selected.delete(id);
  });
  state.selectedTopicIds = normalizedStudyTopicIds([...selected]);
  updateTopicSelectionUi();
});

$("#select-all-button").addEventListener("click", () => {
  state.selectedTopicIds = STUDY_TOPICS.map(topic => topic.id);
  updateTopicSelectionUi();
});

$("#clear-selection-button").addEventListener("click", () => {
  state.selectedTopicIds = [];
  updateTopicSelectionUi();
});

$("#options-list")
  .addEventListener("change", () => {

    if (!state.locked) {
      $("#confirm-button").disabled = false;
    }

  });


// ============================================================
// CONFIRMA RESPOSTA
// ============================================================

$("#answer-form")
  .addEventListener("submit", event => {

    event.preventDefault();


    if (state.locked) return;


    const selected =
      document.querySelector(
        'input[name="answer"]:checked'
      );


    if (!selected) return;


    state.locked = true;


    const questionIndex =
      state.order[state.position];


    const question =
      questions[questionIndex];


    const selectedIndex =
      Number(selected.value);


    const correct =
      selectedIndex === question.a;


    state.answers[questionIndex] = {
      selected: selectedIndex,
      correct
    };


    document
      .querySelectorAll(".option")
      .forEach((option, index) => {

        option.classList.add("is-locked");


        option
          .querySelector("input")
          .disabled = true;


        if (index === question.a) {

          option.classList.add(
            "is-correct"
          );

        }


        if (
          index === selectedIndex &&
          !correct
        ) {

          option.classList.add(
            "is-wrong"
          );

        }

      });


    const feedback =
      $("#feedback");


    feedback.className =
      `feedback ${
        correct
          ? "correct"
          : "wrong"
      }`;


    feedback.innerHTML = `

      <strong>
        ${
          correct
            ? "Resposta correta."
            : `Resposta incorreta. A correta é ${letters[question.a].toUpperCase()}.`
        }
      </strong>

      <br>

      ${question.e}

    `;


    $("#confirm-button")
      .classList
      .add("is-hidden");


    $("#next-button")
      .classList
      .remove("is-hidden");


    updateProgress();

  });


// ============================================================
// PRÓXIMA QUESTÃO
// ============================================================

$("#next-button")
  .addEventListener("click", () => {

    if (
      state.position <
      state.order.length - 1
    ) {

      state.position += 1;

      renderQuestion();


      $("#quiz-screen")
        .scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    } else {

      renderResults();

    }

  });


// ============================================================
// RESULTADO FINAL
// ============================================================

function renderResults() {

  const entries =
    state.order.map(
      (index, displayIndex) => ({
        index,
        displayIndex,
        ...state.answers[index]
      })
    );


  const correct =
    entries
      .filter(entry => entry.correct)
      .length;


  const wrong =
    entries.length - correct;


  const percent =
    Math.round(
      (correct / entries.length) * 100
    );


  $("#score-number").textContent =
    correct;


  $(".score-block small").textContent =
    `de ${entries.length}`;


  $("#correct-total").textContent =
    correct;


  $("#wrong-total").textContent =
    wrong;


  $("#score-percent").textContent =
    `${percent}%`;


  const resultsByTopic = entries.reduce((summary, entry) => {
    const topicId = questions[entry.index].studyTopic;
    if (!summary[topicId]) summary[topicId] = { correct: 0, total: 0 };
    summary[topicId].total += 1;
    summary[topicId].correct += Number(entry.correct);
    return summary;
  }, {});


  $("#topic-result-list").innerHTML = Object.entries(resultsByTopic)
    .sort(([first], [second]) => studyTopicLabel(first).localeCompare(studyTopicLabel(second), "pt-BR"))
    .map(([topicId, result]) => {
      const topicPercent = Math.round((result.correct / result.total) * 100);
      return `
        <div class="topic-result-row">
          <span>${studyTopicLabel(topicId)}</span>
          <strong>${result.correct}/${result.total}</strong>
          <small>${topicPercent}%</small>
        </div>
      `;
    })
    .join("");


  $("#result-title").textContent =
    percent >= 85
      ? "Ótimo domínio."
      : percent >= 70
        ? "Bom caminho."
        : percent >= 50
          ? "A base está montada."
          : "Hora de revisar.";


  $("#result-message").textContent =

    percent >= 85

      ? "Você demonstrou segurança nos principais tópicos. Revise os poucos erros para fechar as lacunas."

      : percent >= 70

        ? "Seu resultado é consistente. Use a revisão abaixo para reforçar os assuntos em que houve erro."

        : percent >= 50

          ? "Você já domina parte importante do conteúdo. Refaça as questões erradas e acompanhe os cálculos com atenção."

          : "Volte às explicações e priorize subnetting, IPv6 e decisões de encaminhamento antes de tentar novamente.";


  $("#retry-wrong-button")
    .classList
    .toggle(
      "is-hidden",
      wrong === 0
    );


  $("#review-list").innerHTML =
    entries
      .map(entry =>
        reviewMarkup(
          entry.index,
          entry,
          entry.displayIndex
        )
      )
      .join("");


  setReviewFilter("all");


  showScreen("results");

}


// ============================================================
// REVISÃO
// ============================================================

function reviewMarkup(
  index,
  answer,
  displayIndex
) {

  const question =
    questions[index];


  const status =
    answer.correct
      ? "correct"
      : "wrong";


  const label =
    answer.correct
      ? "Acerto"
      : "Erro";


  return `

    <details
      class="review-item"
      data-status="${status}"
      ${answer.correct ? "" : "open"}
    >

      <summary>

        <span class="review-number">
          ${String(displayIndex + 1).padStart(2, "0")}
        </span>

        <span class="review-status ${status}">
          ${label}
        </span>

        <span class="review-question">
          ${question.q}
        </span>

        <span class="review-toggle">
          Ver explicação
        </span>

      </summary>


      <div class="review-detail">

        <p>
          <strong>Sua resposta:</strong>
          ${letters[answer.selected].toUpperCase()}.
          ${question.o[answer.selected]}
        </p>

        ${
          answer.correct
            ? ""
            : `
              <p>
                <strong>Resposta correta:</strong>
                ${letters[question.a].toUpperCase()}.
                ${question.o[question.a]}
              </p>
            `
        }

        <p>
          <strong>Explicação:</strong>
          ${question.e}
        </p>

      </div>

    </details>

  `;

}


// ============================================================
// FILTRO DA REVISÃO
// ============================================================

function setReviewFilter(filter) {

  document
    .querySelectorAll(".filter-button")
    .forEach(button => {

      button
        .classList
        .toggle(
          "is-active",
          button.dataset.filter === filter
        );

    });


  document
    .querySelectorAll(".review-item")
    .forEach(item => {

      item
        .classList
        .toggle(
          "is-hidden",
          filter !== "all" &&
          item.dataset.status !== filter
        );

    });

}


// ============================================================
// BOTÕES DE FILTRO
// ============================================================

document
  .querySelectorAll(".filter-button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () =>
        setReviewFilter(
          button.dataset.filter
        )
    );

  });


// ============================================================
// BOTÃO COMEÇAR
// ============================================================

$("#start-button")
  .addEventListener(
    "click",
    () => startQuiz()
  );


// ============================================================
// NOVO SIMULADO
// ============================================================

$("#restart-button")
  .addEventListener(
    "click",
    () => startQuiz()
  );


// Cada clique em "Novo simulado":
//
// 1. sorteia novas questões;
// 2. mantém 30 perguntas;
// 3. mantém a divisão temática;
// 4. não repete uma questão dentro da própria tentativa.


// ============================================================
// REFAZER SOMENTE AS ERRADAS
// ============================================================

$("#retry-wrong-button")
  .addEventListener(
    "click",
    () => {

      const wrongIndexes =
        state.order.filter(
          index =>
            !state.answers[index].correct
        );


      if (wrongIndexes.length > 0) {
        startQuiz(wrongIndexes);
      }

    }
  );


// ============================================================
// VOLTAR AO INÍCIO CLICANDO NA MARCA
// ============================================================

const brand = $(".brand");

if (brand) {

  brand.addEventListener(
    "click",
    event => {

      event.preventDefault();

      showScreen("start");

    }
  );

}

}


// ============================================================
// VALIDAÇÃO DO BANCO E DO BLUEPRINT
// ============================================================

function countBy(questionList, property) {
  return questionList.reduce((counts, question) => {
    const key = question[property];
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}


function validateQuiz(order) {
  const errors = [];
  const ids = order.map(index => questions[index]?.id);
  const concepts = order.map(index => questions[index]?.concept);

  if (order.length !== SIMULATION_SIZE) {
    errors.push(`simulado com ${order.length} questões, esperado: ${SIMULATION_SIZE}`);
  }

  if (new Set(ids).size !== order.length) {
    errors.push("questão repetida dentro do simulado");
  }

  if (new Set(concepts).size !== order.length) {
    errors.push("conceito/variante repetido dentro do simulado");
  }

  QUIZ_BLUEPRINT.forEach(blueprintGroup => {
    const actual = order.filter(index =>
      questions[index]?.group === blueprintGroup.group
    ).length;

    if (actual !== blueprintGroup.count) {
      errors.push(
        `${blueprintGroup.name}: ${actual}, esperado: ${blueprintGroup.count}`
      );
    }
  });

  return errors;
}


function validateCustomQuiz(order, selectedTopicIds, size = SIMULATION_SIZE) {
  const errors = [];
  const allowed = new Set(normalizedStudyTopicIds(selectedTopicIds));
  const expectedLength = Math.min(size, countAvailableQuestions(selectedTopicIds));
  const ids = order.map(index => questions[index]?.id);
  const concepts = order.map(index => questions[index]?.concept);

  if (order.length !== expectedLength) {
    errors.push(`simulado personalizado com ${order.length} questões, esperado: ${expectedLength}`);
  }
  if (new Set(ids).size !== order.length) {
    errors.push("questão repetida no simulado personalizado");
  }
  if (new Set(concepts).size !== order.length) {
    errors.push("conceito repetido no simulado personalizado");
  }

  order.forEach(index => {
    const question = questions[index];
    if (!question) {
      errors.push(`índice de questão inválido: ${index}`);
      return;
    }
    if (!allowed.has(question.studyTopic)) {
      errors.push(`questão fora da seleção: ${question.id} (${question.studyTopic})`);
    }
    if (!Number.isInteger(question.a) || question.a < 0 || question.a >= question.o.length) {
      errors.push(`gabarito inválido: ${question.id}`);
    }
  });

  return errors;
}


function validateQuestionBank({ simulationRuns = 1, log = true } = {}) {
  const errors = [];
  const normalizedTexts = new Set();

  questions.forEach((question, index) => {
    const label = question.id || `índice ${index}`;
    const textKey = String(question.q || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");

    if (!question.q?.trim()) errors.push(`${label}: pergunta ausente`);
    if (!question.topic?.trim()) errors.push(`${label}: topic ausente`);
    if (!question.group?.trim()) errors.push(`${label}: group ausente`);
    if (!question.subtopic?.trim()) errors.push(`${label}: subtopic ausente`);
    if (!question.source?.trim()) errors.push(`${label}: source ausente`);
    if (!question.concept?.trim()) errors.push(`${label}: concept ausente`);
    if (!question.studyTopic?.trim()) errors.push(`${label}: studyTopic ausente`);
    if (!STUDY_TOPICS.some(topic => topic.id === question.studyTopic)) {
      errors.push(`${label}: studyTopic desconhecido: ${question.studyTopic}`);
    }
    if (!Array.isArray(question.o) || question.o.length !== 4) {
      errors.push(`${label}: deve possuir exatamente quatro alternativas`);
    } else if (new Set(question.o.map(option => String(option).trim().toLocaleLowerCase("pt-BR"))).size !== 4) {
      errors.push(`${label}: alternativas repetidas`);
    }
    if (!Number.isInteger(question.a) || question.a < 0 || question.a > 3) {
      errors.push(`${label}: resposta correta fora do intervalo 0–3`);
    } else if (!question.o[question.a]?.trim()) {
      errors.push(`${label}: resposta correta não corresponde a uma alternativa`);
    } else if (question.o[question.a] !== question.correctOption) {
      errors.push(`${label}: gabarito não acompanha o embaralhamento das alternativas`);
    }
    if (!question.e?.trim()) errors.push(`${label}: explicação ausente`);

    if (normalizedTexts.has(textKey)) {
      errors.push(`${label}: pergunta duplicada: "${question.q}"`);
    }
    normalizedTexts.add(textKey);
  });

  const blueprintTotal = QUIZ_BLUEPRINT.reduce(
    (sum, blueprintGroup) => sum + blueprintGroup.count,
    0
  );

  if (blueprintTotal !== SIMULATION_SIZE) {
    errors.push(`blueprint soma ${blueprintTotal}, esperado: ${SIMULATION_SIZE}`);
  }

  QUIZ_BLUEPRINT.forEach(blueprintGroup => {
    const candidates = questions.filter(question =>
      question.group === blueprintGroup.group
    );
    const concepts = new Set(candidates.map(question => question.concept));

    if (candidates.length < blueprintGroup.count) {
      errors.push(`${blueprintGroup.name}: banco insuficiente`);
    }
    if (concepts.size < blueprintGroup.count) {
      errors.push(`${blueprintGroup.name}: conceitos distintos insuficientes`);
    }
  });

  const subtopicCounts = countBy(questions, "subtopic");
  REQUIRED_SUBTOPICS.forEach(subtopic => {
    if (!subtopicCounts[subtopic]) {
      errors.push(`subtópico oficial sem questão: ${subtopic}`);
    }
  });

  const studyTopicCounts = countBy(questions, "studyTopic");
  STUDY_TOPICS.forEach(topic => {
    if (!studyTopicCounts[topic.id]) {
      errors.push(`conteúdo selecionável sem questões: ${topic.label}`);
    }
  });

  const requiredNewQuestions = questions.filter(question =>
    question.source === "revisao_2026"
  );

  if (requiredNewQuestions.length < 60) {
    errors.push(`somente ${requiredNewQuestions.length} questões da revisão; esperado: pelo menos 60`);
  }

  const moodleQuestions = questions.filter(question =>
    ["moodle_ipv6_parte_1", "moodle_ipv6_parte_2"].includes(question.source)
  );

  if (moodleQuestions.length < 50) {
    errors.push(`somente ${moodleQuestions.length} questões dos questionários Moodle; esperado: pelo menos 50`);
  }

  let previous = [];
  for (let run = 0; run < simulationRuns; run += 1) {
    const order = buildBalancedQuiz(previous, simulationRuns > 1 ? 3 : 1);
    validateQuiz(order).forEach(error => errors.push(`simulado ${run + 1}: ${error}`));
    previous = order;
  }

  if (errors.length) {
    errors.forEach(error => console.error(`[Banco de questões] ${error}`));
  } else if (log) {
    console.info(`Banco validado: ${questions.length} questões; ${simulationRuns} simulado(s) verificado(s).`);
  }

  return {
    valid: errors.length === 0,
    errors,
    total: questions.length,
    newQuestions: requiredNewQuestions.length,
    byGroup: countBy(questions, "group"),
    bySubtopic: subtopicCounts,
    bySource: countBy(questions, "source"),
    byStudyTopic: studyTopicCounts
  };
}


const validationReport = validateQuestionBank({ log: hasDocument });

if (hasDocument) {
  const bankSize = $("#bank-size");
  if (bankSize) bankSize.textContent = questions.length;

  console.table(
    QUIZ_BLUEPRINT.map(blueprintGroup => ({
      tema: blueprintGroup.name,
      disponiveisNoBanco: validationReport.byGroup[blueprintGroup.group] || 0,
      porSimulado: blueprintGroup.count
    }))
  );
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SIMULATION_SIZE,
    QUIZ_BLUEPRINT,
    REQUIRED_SUBTOPICS,
    STUDY_TOPICS,
    OFFICIAL_STUDY_TOPIC_IDS,
    questions,
    buildBalancedQuiz,
    buildCustomQuiz,
    calculateIpv4Fragments,
    countBy,
    intToIp,
    ipToInt,
    maskInt,
    networkInfo,
    prefixToMask,
    countAvailableQuestions,
    isOfficialSelection,
    validateQuestionBank,
    validateQuiz,
    validateCustomQuiz
  };
}
