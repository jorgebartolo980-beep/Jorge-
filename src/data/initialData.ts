import { Pet, Task, DiaryEntry, Expense, AcademyModule, HealthArticle, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'user_default',
  name: 'Tutor PetCare',
  email: 'tutor@petcare360.pt',
  plan: 'gratuito',
  joinedDate: '2025-01-15',
  notificationsEnabled: true,
};

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet_pipoca',
    name: 'Pipoca',
    species: 'cão',
    breed: 'Sem Raça Definida (SRD)',
    birthDate: '2023-04-12',
    approxAge: '3 anos',
    gender: 'macho',
    weightKg: 14.2,
    arrivalDate: '2023-08-20',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    traits: ['Muito meigo', 'Brincalhão', 'Sensível a trovoadas', 'Sociável com pessoas'],
    allergies: 'Sensibilidade alimentar a subprodutos de milho',
    specialNeeds: 'Necessita de passeios olfativos tranquilos',
    notes: 'Adotado na associação local. Chip registado no SIAC.',
    microchip: '642098100123456',
    vetContact: 'Hospital Veterinário Central (+351 210 000 000)',
    createdAt: '2023-08-20T10:00:00Z',
  },
  {
    id: 'pet_simba',
    name: 'Simba',
    species: 'gato',
    breed: 'Europeu Comum',
    birthDate: '2024-02-10',
    approxAge: '2 anos',
    gender: 'macho',
    weightKg: 4.6,
    arrivalDate: '2024-05-15',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    traits: ['Curioso', 'Observador de janelas', 'Ronrona facilmente', 'Adora caixas'],
    allergies: 'Nenhuma alergia conhecida',
    specialNeeds: 'Gosta de fonte de água fresca e arranhadores verticais',
    notes: 'Castrado. Vacinas em dia.',
    microchip: '642098100789012',
    vetContact: 'Clínica Veterinária Felina (+351 220 000 000)',
    createdAt: '2024-05-15T14:30:00Z',
  },
  {
    id: 'pet_luna',
    name: 'Luna',
    species: 'cão',
    breed: 'Golden Retriever',
    birthDate: '2021-09-05',
    approxAge: '5 anos',
    gender: 'fêmea',
    weightKg: 28.5,
    arrivalDate: '2021-11-12',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    traits: ['Calma', 'Paciente com crianças', 'Excelente nadadora', 'Focada em treinos'],
    allergies: 'Otites de repetição em época balnear (necessita de limpeza pós-banho)',
    specialNeeds: 'Suplementação articular recomendada pelo veterinário',
    notes: 'Esterilizada. Faz hidroterapia ligeira.',
    microchip: '642098100345678',
    vetContact: 'Dra. Margarida Silva (+351 219 888 777)',
    createdAt: '2021-11-12T09:15:00Z',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    petId: 'pet_pipoca',
    title: 'Passeio matinal e treino olfativo (30 min)',
    category: 'passeio',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    recurrence: 'diaria',
    completed: true,
    completedAt: new Date().toISOString(),
    notes: 'Focar em deixar cheirar postes e relva com calma sem puxar a trela.',
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'task_2',
    petId: 'pet_simba',
    title: 'Limpeza e renovação da caixa de areia',
    category: 'higiene',
    date: new Date().toISOString().split('T')[0],
    time: '09:30',
    recurrence: 'diaria',
    completed: false,
    notes: 'Verificar consistência das fezes e aglomerado urinário.',
    createdAt: '2025-01-01T09:30:00Z',
  },
  {
    id: 'task_3',
    petId: 'pet_pipoca',
    title: 'Desparasitação interna preventiva prescrita',
    category: 'desparasitacao',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    recurrence: 'mensal',
    completed: false,
    notes: 'Comprimido palatável receitado na última consulta veterinária.',
    createdAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'task_4',
    petId: 'pet_luna',
    title: 'Limpeza auricular preventiva com loção recomendada',
    category: 'higiene',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '18:30',
    recurrence: 'semanal',
    completed: false,
    notes: 'Secar suavemente a entrada do canal auditivo com compressa.',
    createdAt: '2025-01-01T11:00:00Z',
  },
  {
    id: 'task_5',
    petId: 'pet_simba',
    title: 'Sessão de brincadeira com cana e penas (15 min)',
    category: 'treino',
    date: new Date().toISOString().split('T')[0],
    time: '20:30',
    recurrence: 'diaria',
    completed: false,
    notes: 'Estimular a sequência natural predatória: espreitar, perseguir, capturar e petisco.',
    createdAt: '2025-01-01T12:00:00Z',
  },
  {
    id: 'task_6',
    petId: 'pet_luna',
    title: 'Consulta Anual de Vacinação e Check-up',
    category: 'veterinario',
    date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    time: '11:00',
    recurrence: 'nenhuma',
    completed: false,
    notes: 'Levar boletim sanitário, rever peso e avaliar mobilidade articular.',
    createdAt: '2025-01-01T13:00:00Z',
  },
];

export const INITIAL_DIARY: DiaryEntry[] = [
  {
    id: 'diary_1',
    petId: 'pet_pipoca',
    date: new Date().toISOString().split('T')[0],
    time: '08:30',
    weightKg: 14.2,
    mood: 'alegre',
    dietNotes: 'Comeu a porção matinal com bom apetite. Bebeu água normal.',
    exerciseMinutes: 40,
    hygieneNotes: 'Pêlo escovado.',
    notes: 'Muito bem disposto no passeio no parque da cidade.',
    createdAt: '2025-01-01T08:30:00Z',
  },
  {
    id: 'diary_2',
    petId: 'pet_pipoca',
    date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    time: '10:00',
    weightKg: 14.1,
    mood: 'calmo',
    dietNotes: 'Alimentação habitual sem sobras.',
    exerciseMinutes: 35,
    notes: 'Excelente foco no exercício da chamada com queijo magro.',
    createdAt: '2025-01-01T09:00:00Z',
  },
  {
    id: 'diary_3',
    petId: 'pet_pipoca',
    date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    time: '09:00',
    weightKg: 14.0,
    mood: 'excelente',
    dietNotes: 'Transição alimentar concluída com sucesso.',
    exerciseMinutes: 45,
    notes: 'Peso estável e boa disposição.',
    createdAt: '2025-01-01T09:00:00Z',
  },
  {
    id: 'diary_4',
    petId: 'pet_simba',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    weightKg: 4.6,
    mood: 'calmo',
    dietNotes: 'Ração húmida de manhã e ração seca calibrada no dispensador.',
    exerciseMinutes: 20,
    hygieneNotes: 'Caixa de areia limpa.',
    notes: 'Dormiu a sesta habitual no cimo do arranhador.',
    createdAt: '2025-01-01T12:00:00Z',
  },
  {
    id: 'diary_5',
    petId: 'pet_simba',
    date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    time: '11:00',
    weightKg: 4.5,
    mood: 'excelente',
    dietNotes: 'Boa hidratação comprovada na fonte.',
    exerciseMinutes: 25,
    notes: 'Brincou intensamente com o brinquedo de penas.',
    createdAt: '2025-01-01T11:00:00Z',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_1',
    petId: 'pet_pipoca',
    date: new Date().toISOString().split('T')[0],
    amountEuro: 54.90,
    category: 'alimentacao',
    description: 'Saco 12kg ração hipoalergénica de cordeiro e arroz',
    receiptNotes: 'Fatura FT 2025/1043 - PetShop Lisboa',
    createdAt: '2025-01-01T10:00:00Z',
  },
  {
    id: 'exp_2',
    petId: 'pet_simba',
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    amountEuro: 22.50,
    category: 'higiene',
    description: 'Areia aglomerante vegetal 20L + recarga de filtro de fonte',
    receiptNotes: 'Comprado na loja online',
    createdAt: '2025-01-01T11:00:00Z',
  },
  {
    id: 'exp_3',
    petId: 'pet_pipoca',
    date: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0],
    amountEuro: 45.00,
    category: 'veterinario',
    description: 'Consulta de acompanhamento dermatológico de rotina',
    receiptNotes: 'Hospital Veterinário Central',
    createdAt: '2025-01-01T12:00:00Z',
  },
  {
    id: 'exp_4',
    petId: 'pet_pipoca',
    date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
    amountEuro: 18.40,
    category: 'medicacao',
    description: 'Desparasitante interno e externo prescrito pelo veterinário',
    receiptNotes: 'Farmácia Veterinária',
    createdAt: '2025-01-01T13:00:00Z',
  },
  {
    id: 'exp_5',
    petId: 'pet_luna',
    date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
    amountEuro: 32.00,
    category: 'acessorios',
    description: 'Peitoral ergonómico anti-tração em Y para passeios confortáveis',
    receiptNotes: 'Garantia de 2 anos incluída',
    createdAt: '2025-01-01T14:00:00Z',
  },
];

export const ACADEMY_MODULES: AcademyModule[] = [
  // CÃES
  {
    id: 'mod_cao_1',
    title: 'Primeiros passos em casa: A chegada tranquila',
    species: 'cão',
    ageGroup: 'todos',
    level: 'iniciante',
    theme: 'Adaptação e Segurança',
    summary: 'Como criar um ambiente acolhedor, previsível e seguro nos primeiros dias de um cão em casa.',
    estimatedMinutes: 10,
    isEssential: true,
    objectives: [
      'Compreender a regra 3-3-3 de descompressão emocional',
      'Configurar a zona de refúgio com cama, água e brinquedos adequados',
      'Evitar a sobrecarga sensorial e visitas excessivas na fase inicial',
    ],
    explanation: 'A chegada a um novo lar representa uma mudança drástica na vida do animal. Mesmo os cães mais sociáveis necessitam de tempo para processar novos cheiros, rotinas e pessoas. Forçar o animal a cumprimentar visitas ou passear em locais ruidosos nas primeiras 48 horas pode desencadear ansiedade e stress prolongado.',
    stepByStep: [
      'Prepara um espaço sossegado (cama confortável, manta familiar, tigela de água fresca) longe de passagens ruidosas.',
      'Apresenta a casa divisória a divisória, mantendo portas fechadas para não assoberbar o cão.',
      'Mantém uma voz suave e movimentos previsíveis. Deixa o cão aproximar-se por iniciativa própria.',
      'Estabelece desde o primeiro dia os horários fixos das refeições e saídas higiénicas.',
      'Limita as visitas de familiares e amigos durante a primeira semana para permitir a vinculação com a família principal.',
    ],
    commonMistakes: [
      'Convidar dezenas de amigos para "conhecer o novo cão" logo no primeiro fim de semana.',
      'Castigar o cão se urinar por nervosismo ou medo dentro de casa.',
      'Forçar contacto físico (abraços apertados ou beijos na cara) quando o cão demonstra rigidez corporal.',
    ],
    safetyTips: [
      'Garante que janelas, varandas e portões estão devidamente vedados.',
      'Retira cabos elétricos expostos, sapatos e plantas tóxicas do alcance.',
      'Utiliza coleira com medalha de identificação telefónica mesmo dentro de casa no período de adaptação.',
    ],
    practicalExercise: {
      title: 'O Exercício do Refúgio Seguro',
      instructions: 'Coloca um tapete ou cama num canto calmo da sala. Lança um petisco delicioso para cima do tapete sem exigir qualquer comando. Quando o cão for buscar, elogia calmamente ("Muito bem"). Repete 5 vezes ao dia para associar aquele local a tranquilidade e segurança absoluta.',
      evaluationTip: 'O teu cão deita-se espontaneamente no tapete quando quer relaxar? Isso indica sucesso na associação positiva!',
    },
    sources: ['American Veterinary Society of Animal Behavior (AVSAB)', 'Associação Portuguesa de Terapia Comportamental Animal'],
  },
  {
    id: 'mod_cao_2',
    title: 'Educação com Reforço Positivo: A ciência da cooperação',
    species: 'cão',
    ageGroup: 'todos',
    level: 'iniciante',
    theme: 'Aprendizagem e Comunicação',
    summary: 'Aprende a ensinar comportamentos desejados recompensando o acerto, sem recorrer a medo ou castigos.',
    estimatedMinutes: 12,
    isEssential: true,
    objectives: [
      'Dominar o princípio do reforço positivo (R+)',
      'Aprender a marcar o comportamento no momento exato (timing)',
      'Substituir a frustração por estratégias de redirecionamento',
    ],
    explanation: 'O reforço positivo baseia-se na psicologia da aprendizagem: comportamentos que geram consequências vantajosas (comida saborosa, elogio genuíno, acesso a brincadeira) tendem a repetir-se com maior frequência. Métodos baseados em intimidação geram animais ansiosos e aumentam o risco de agressividade por medo.',
    stepByStep: [
      'Identifica o que o teu cão realmente valoriza (frango cozido desfiado, maçã sem sementes, bola, festinhas no peito).',
      'Usa um marcador verbal claro (como a palavra "Sim!" dita com tom alegre) no segundo exato em que o cão faz o que pretendes.',
      'Entrega a recompensa imediatamente (até 1 a 2 segundos após o marcador).',
      'Treina em sessões muito curtas de 3 a 5 minutos, sempre terminando com uma experiência positiva.',
      'Se o cão falhar, não grites. Reduz a dificuldade do exercício e tenta novamente.',
    ],
    commonMistakes: [
      'Dar o petisco demasiado tarde, quando o cão já se mexeu ou começou a ladrar.',
      'Utilizar petiscos secos e pouco atrativos em ambientes com muitas distrações.',
      'Fazer sessões de treino de 30 minutos contínuos, esgotando a concentração do animal.',
    ],
    safetyTips: [
      'Desconta a quantidade de calorias dos petiscos na ração diária para evitar excesso de peso.',
      'Nunca uses coleiras de estrangulamento, bicos ou choques elétricos — causam lesões físicas e danos comportamentais graves.',
    ],
    practicalExercise: {
      title: 'Capturar o Olhar (Eye Contact)',
      instructions: 'Fica em pé com um petisco escondido na mão atrás das costas. Espera em silêncio. Quando o cão olhar espontaneamente para os teus olhos, diz "Sim!" de imediato e entrega a recompensa. Faz 10 repetições.',
      evaluationTip: 'Em poucas repetições, o cão começará a procurar o teu olhar antes de tomar decisões na rua.',
    },
    sources: ['Karen Pryor Academy', 'Universidade de Bristol - Estudos de Comportamento Canino'],
  },
  {
    id: 'mod_cao_3',
    title: 'Habituação à Trela sem puxar',
    species: 'cão',
    ageGroup: 'todos',
    level: 'intermedio',
    theme: 'Passeios e Mobilidade',
    summary: 'Técnicas gentis para passear em harmonia com trela comprida e peitoral ergonómico em Y.',
    estimatedMinutes: 15,
    objectives: [
      'Escolher o equipamento correto (peitoral em Y e trela de 2 a 3 metros)',
      'Ensinar o cão que puxar não dá acesso ao cheiro desejado',
      'Valorizar a caminhada fluida e o ritmo confortável para ambos',
    ],
    explanation: 'Os cães caminham naturalmente mais depressa do que os humanos e são guiados pelo olfato. Quando usamos trelas curtas de 1 metro e puxamos de volta, criamos uma reação reflexa de oposição (o cão puxa ainda com mais força). A solução passa por dar margem com trelas adequadas e recompensar a proximidade.',
    stepByStep: [
      'Equipa o cão com um peitoral em formato Y que não bloqueie os ombros nem aperte a traqueia.',
      'Começa a praticar dentro de casa ou num corredor sem distrações.',
      'Dá passos lentos; sempre que a trela estiver frouxa (com uma curva relaxada em "U"), elogia e entrega um petisco junto à tua perna.',
      'Se a trela esticar, para suavemente como um poste. Não dês puxões bruscos.',
      'Quando o cão aliviar a tensão e olhar para ti, retoma o passo e recompensa.',
    ],
    commonMistakes: [
      'Puxar a trela violentamente com trancos.',
      'Usar trelas extensíveis tipo "flexi" na cidade (ensinam o cão a puxar continuamente para ganhar corda e apresentam riscos graves de acidentes).',
      'Apressar o cão quando ele está a fazer leitura olfativa.',
    ],
    safetyTips: [
      'Verifica os fechos e costuras da trela e do peitoral antes de cada saída.',
      'Nunca prendas a trela a uma coleira de pescoço para praticar puxões.',
    ],
    practicalExercise: {
      title: 'O Jogo da Mudança de Direção',
      instructions: 'No jardim, quando o cão estiver prestes a esticar a trela para a frente, dá meia-volta com entusiasmo dizendo "Aqui!". Quando ele se virar e te acompanhar, diz "Sim!" e oferece um petisco delicioso.',
      evaluationTip: 'O cão aprende que a atenção ao tutor é divertida e rende recompensas.',
    },
    sources: ['Turid Rugaas - On Talking Terms with Dogs', 'APDT (Association of Professional Dog Trainers)'],
  },
  {
    id: 'mod_cao_4',
    title: 'Resposta Fiável à Chamada ("Vem cá")',
    species: 'cão',
    ageGroup: 'todos',
    level: 'intermedio',
    theme: 'Segurança e Liberdade',
    summary: 'Como construir uma chamada sólida que pode salvar a vida do teu cão em situações de emergência.',
    estimatedMinutes: 14,
    objectives: [
      'Nunca associar a palavra de chamada a algo desagradável',
      'Treinar progressivamente com linha longa (long-line)',
      'Garantir uma taxa de sucesso de 99% antes de soltar o animal',
    ],
    explanation: 'A chamada é o comportamento mais vital na vida de um cão. No entanto, muitos tutores estragam o comando ao chamar o cão para lhe dar um banho, limpar os ouvidos ou prendê-lo para ir embora do parque. O cão aprende rapidamente que atender à chamada significa o fim da diversão.',
    stepByStep: [
      'Escolhe uma palavra clara (ex.: "Vem!") dita com tom alegre e convidativo.',
      'Chama apenas quando tiveres a certeza razoável de que o cão vai responder (começa a 1 metro de distância dentro de casa).',
      'Quando ele chegar até ti, segura suavemente o peitoral e faz uma "festa jackpot" (vários petiscos seguidos).',
      'Após a festa, liberta o cão de novo com "Vai brincar!". Desta forma, a chamada não significa prisão.',
      'Aumenta as distrações gradualmente com uma trela longa de 5 a 10 metros num campo aberto.',
    ],
    commonMistakes: [
      'Gritar a palavra de chamada repetidamente 10 vezes enquanto o cão ignora.',
      'Zangar-se ou ralhar com o cão quando ele finalmente regressa após ter fugido (o cão associa o ralhete ao ato de voltar).',
    ],
    safetyTips: [
      'Nunca soltes um cão sem trela perto de estradas ou em locais não vedados se a chamada não estiver 100% consolidada.',
    ],
    practicalExercise: {
      title: 'Ping-Pong Humano da Chamada',
      instructions: 'Junta duas pessoas da família em lados opostos da sala. Uma pessoa diz o nome e "Vem!", recompensa com entusiasmo. De seguida, a outra pessoa chama. Façam 8 repetições.',
      evaluationTip: 'O cão corre com alegria genuína e expressão facial relaxada.',
    },
    sources: ['Patricia McConnell - The Other End of the Leash'],
  },
  {
    id: 'mod_cao_5',
    title: 'Enriquecimento Ambiental e Olfativo Canino',
    species: 'cão',
    ageGroup: 'todos',
    level: 'iniciante',
    theme: 'Bem-Estar Mental',
    summary: 'Como satisfazer as necessidades cognitivas e biológicas do cão com brinquedos interativos e farejo.',
    estimatedMinutes: 10,
    objectives: [
      'Compreender os 5 tipos de enriquecimento: olfativo, cognitivo, alimentar, físico e social',
      'Aprender a preparar brinquedos recheáveis e tapetes de farejo caseiros',
      'Reduzir a ansiedade e o tédio dentro de casa',
    ],
    explanation: 'Vinte minutos de farejo intenso cansam mais a mente de um cão de forma saudável do que uma hora de corrida repetitiva a atirar a bola. Cães entediados desenvolvem frequentemente comportamentos destrutivos, ladrar excessivo e estereotipias.',
    stepByStep: [
      'Substitui a tigela tradicional de comida por dispensadores interativos (Kongs, tapetes de farejo, garrafas plásticas adaptadas sem tampas).',
      'Congela comida húmida ou iogurte natural sem açúcar no interior de brinquedos de borracha para lamber prolongado (o ato de lamber liberta endorfinas calmantes).',
      'Espalha uma mão-cheia de ração na relva do jardim e deixa o cão procurar com o nariz.',
      'Permite "passeios de cheiro" diários onde o cão escolhe a direção e para para investigar cada poste.',
    ],
    commonMistakes: [
      'Exigir apenas exercício físico extenuante e ignorar o cansaço mental.',
      'Dar desafios demasiado difíceis que causam frustração ao animal.',
    ],
    safetyTips: [
      'Supervisiona sempre brinquedos novos para garantir que o cão não engole pedaços de borracha ou tecido.',
    ],
    practicalExercise: {
      title: 'A Caixa Surpresa de Cartão',
      instructions: 'Pega numa caixa de sapatos de cartão limpa. Coloca lá dentro rolos de papel higiénico vazios e pedaços de papel vegetal com alguns grãos de ração escondidos. Deixa o cão rasgar o papel e investigar.',
      evaluationTip: 'O cão fica entretido durante 10 a 15 minutos e depois suspira e vai dormir relaxado.',
    },
    sources: ['Shay Kelly - Canine Enrichment for the Real World'],
  },
  {
    id: 'mod_cao_6',
    title: 'Compreensão da Linguagem Corporal Canina: Sinais de Calma',
    species: 'cão',
    ageGroup: 'todos',
    level: 'intermedio',
    theme: 'Comunicação e Prevenção de Mordeduras',
    summary: 'Descobre os sinais subtis que o teu cão transmite antes de sentir medo ou desconforto.',
    estimatedMinutes: 15,
    isEssential: true,
    objectives: [
      'Identificar sinais de apaziguamento: lamber os lábios, bocejar fora de contexto, virar a cara, olhar de baleia',
      'Reconhecer a "escada de agressividade" antes de ocorrer rosnar ou morder',
      'Nunca castigar o rosnar (o rosnar é um aviso preventivo indispensável)',
    ],
    explanation: 'Os cães não falam por palavras, mas comunicam de forma expressiva através de micro-movimentos de orelhas, olhos, cauda e postura corporal. Quando um cão lambe o focinho repetidamente enquanto uma criança o abraça, ele está a pedir espaço. Respeitar estes sinais previne 95% das mordeduras domésticas.',
    stepByStep: [
      'Observa os olhos do teu cão: ver o branco do olho (olhar de baleia) indica tensão e medo.',
      'Repara na boca: boca entreaberta com língua relaxada significa calma; boca cerrada com tensão nos lábios indica alerta.',
      'Atenção ao bocejo: bocejar durante uma interação não significa sono, mas sim tentativa de acalmar a situação.',
      'Cauda a abanar nem sempre significa alegria: cauda alta, rígida e a oscilar rápido indica excitação ou tensão elevada.',
    ],
    commonMistakes: [
      'Repreender o cão por rosnar. Se castigares o rosnar, o cão deixará de avisar e morderá diretamente na próxima vez.',
      'Acreditar que abanar a cauda é sempre sinónimo de amizade.',
    ],
    safetyTips: [
      'Se o cão congelar e ficar completamente imóvel, afasta-te lentamente sem movimentos bruscos e dá-lhe espaço imediato.',
    ],
    practicalExercise: {
      title: 'Teste de Consentimento para Festas',
      instructions: 'Faz festas suaves no peito ou pescoço do cão durante 3 segundos e para completamente as mãos. Espera pela reação. Se ele te empurrar com o focinho ou pedir mais, continua. Se ele se afastar ou lamber o focinho, ele preferiu o fim da carícia.',
      evaluationTip: 'Permite ao teu cão ter voz nas suas interações diárias!',
    },
    sources: ['Turid Rugaas - Calming Signals', 'Dra. Sophia Yin - Canine Body Language Charts'],
  },

  // GATOS
  {
    id: 'mod_gato_1',
    title: 'Adaptação a uma Nova Casa: O método do quarto seguro',
    species: 'gato',
    ageGroup: 'todos',
    level: 'iniciante',
    theme: 'Adaptação e Segurança Felina',
    summary: 'Como receber um gato novo reduzindo o pânico territorial e estabelecendo confiança mútua.',
    estimatedMinutes: 12,
    isEssential: true,
    objectives: [
      'Preparar a "sala de base" (quarto seguro com todos os recursos essenciais)',
      'Compreender o ritmo cauteloso da espécie felina',
      'Expandir o território gradualmente sem forçar contactos',
    ],
    explanation: 'Ao contrário dos cães, os felinos são animais territoriais estritos. Colocar um gato novo diretamente numa casa grande com 5 divisões faz com que ele se sinta vulnerável a predadores invisíveis. A abordagem correta começa num único quarto tranquilo com todos os recursos.',
    stepByStep: [
      'Escolhe um quarto sossegado da casa e coloca aí a cama, a caixa de areia, a comida e a água (mantendo a comida a pelo menos 2 metros da caixa de areia).',
      'Deixa a transportadora aberta dentro do quarto com uma manta macia. Não puxes o gato para fora à força.',
      'Senta-te no chão a ler um livro ou olhar para o telemóvel, falando ocasionalmente em sussurro suave.',
      'Deixa o gato explorar à sua vontade. Quando ele se aproximar, oferece um petisco líquido (churu) na ponta do dedo.',
      'Abre as restantes divisões da casa apenas após 3 a 7 dias, quando o gato estiver confiante na sala de base.',
    ],
    commonMistakes: [
      'Soltar o gato na sala com a televisão ligada e crianças a correr.',
      'Tirar o gato do esconderijo debaixo da cama puxando-o pela cauda ou pernas.',
      'Colocar a comida colada à caixa de areia (os gatos recusam comer perto das suas dejeções por instinto higiénico).',
    ],
    safetyTips: [
      'Protege todas as janelas e varandas com redes de proteção próprias para gatos ANTES da chegada.',
      'Verifica plantas tóxicas fatais (lírios, túlipas, poinsétia, comigo-ninguém-pode) e remove-as de casa.',
    ],
    practicalExercise: {
      title: 'O Piscar de Olhos Lento (Slow Blink)',
      instructions: 'Quando o teu gato estiver a olhar para ti a uma distância confortável, semicerra os olhos devagar e pisca de forma muito lenta, virando ligeiramente o rosto. Espera pela resposta dele.',
      evaluationTip: 'Se o gato responder piscando lentamente de volta, acabaste de partilhar a maior declaração felina de confiança e afeto.',
    },
    sources: ['International Cat Care (iCatCare)', 'AAFP (American Association of Feline Practitioners)'],
  },
  {
    id: 'mod_gato_2',
    title: 'Caixa de Areia Sem Erros: Higiene e prevenção de problemas',
    species: 'gato',
    ageGroup: 'todos',
    level: 'iniciante',
    theme: 'Comportamento e Higiene',
    summary: 'A regra de ouro das caixas, localização estratégica e tipos de areia que garantem sucesso higiénico.',
    estimatedMinutes: 10,
    isEssential: true,
    objectives: [
      'Aplicar a regra N+1 para caixas de areia (número de gatos + 1 caixa)',
      'Escolher o tamanho correto e modelo aberto',
      'Identificar sinais de desconforto urinário precoce',
    ],
    explanation: 'A eliminação fora da caixa de areia é a principal causa de queixas comportamentais em gatos. Na esmagadora maioria dos casos, deve-se a dor física (cistite, cálculos urinários) ou a insatisfação com a caixa (areia com cheiro artificial, caixa tapada que retém odores, caixa pequena ou suja).',
    stepByStep: [
      'Garante que tens 1 caixa por cada gato mais 1 adicional (ex.: 2 gatos = 3 caixas de areia).',
      'Prefere caixas abertas e grandes (comprimento de pelo menos 1,5 vezes o tamanho do gato da cabeça à cauda).',
      'Usa areia fina, aglomerante e SEM fragrâncias artificiais de lavanda ou perfume.',
      'Coloca as caixas em locais acessíveis, mas privados e longe de eletrodomésticos ruidosos (máquinas de lavar roupa).',
      'Retira dejetos sólidos e bolas de urina pelo menos 1 a 2 vezes por dia.',
    ],
    commonMistakes: [
      'Colocar a caixa ao lado da máquina de lavar que centrifuga e assusta o animal.',
      'Comprar caixas tapadas fechadas muito pequenas onde o gato tem de se dobrar.',
      'Limpar a caixa apenas uma vez por semana.',
      'Castigar o gato se urinar fora (aumenta o stress e agrava a cistite idiopática).',
    ],
    safetyTips: [
      'Atenção médica urgente: Se um gato macho for à caixa repetidamente, miar de dor e não conseguir urinar, trata-se de uma emergência de obstrução urinária de risco de vida imediato!',
    ],
    practicalExercise: {
      title: 'Auditoria às Caixas de Areia',
      instructions: 'Avalia a tua casa hoje: quantas caixas tens? Estão separadas em divisões diferentes? A areia tem pelo menos 5 cm de profundidade para permitir ao gato escavar e enterrar confortavelmente?',
      evaluationTip: 'Um gato satisfeito com a caixa escava tranquilamente, elimina e enterra sem fugir disparado da caixa.',
    },
    sources: ['Journal of Feline Medicine and Surgery', 'ISFM (International Society of Feline Medicine)'],
  },
  {
    id: 'mod_gato_3',
    title: 'Arranhadores e Enriquecimento Vertical Felino',
    species: 'gato',
    ageGroup: 'todos',
    level: 'intermedio',
    theme: 'Território e Comportamento Natural',
    summary: 'Como satisfazer a necessidade inata de arranhar, marcar território e ter rotas nas alturas.',
    estimatedMinutes: 11,
    objectives: [
      'Compreender porque é que os gatos arranham (manutenção de unhas, alongamento e marcação visual/feromonal)',
      'Posicionar arranhadores estáveis nas zonas certas',
      'Criar autoestradas felinas verticais em apartamentos',
    ],
    explanation: 'Arranhar não é vingança nem maldade: é uma necessidade fisiológica básica de todos os felinos. Se não disponibilizares arranhadores altos e estáveis junto aos locais onde a família passa tempo, o gato recorrerá naturalmente ao sofá, que é estável, macio e cheira à família.',
    stepByStep: [
      'Escolhe arranhadores com postes altos (mínimo 70-80 cm) para o gato conseguir esticar todo o corpo na vertical.',
      'Verifica que a base é pesada e não abana quando o gato apoia as patas (se abanar, o gato rejeitará o arranhador).',
      'Coloca arranhadores perto dos locais onde o gato dorme e junto à entrada das salas mais frequentadas.',
      'Instala prateleiras de parede forradas a alcatifa ou pontes para permitir ao gato observar a sala de cima.',
      'Experimenta também pranchas de cartão canelado horizontal no chão.',
    ],
    commonMistakes: [
      'Esconder o arranhador atrás de uma porta num quarto onde ninguém vai.',
      'Comprar arranhadores minúsculos de 30 cm que tombam com o peso do gato.',
      'Desungulação (cirurgia de remoção de unhas): é uma mutilação cruel e ilegal em Portugal.',
    ],
    safetyTips: [
      'Fixa prateleiras de parede com buchas fortes adequadas ao peso do animal.',
    ],
    practicalExercise: {
      title: 'A Redireção do Sofá com Erva-Gateira',
      instructions: 'Coloca um arranhador vertical estável exatamente colado ao canto do sofá que o gato tem preferência em usar. Esfrega um pouco de catnip orgânico no poste de sisal. Sempre que o vires a arranhar o poste, elogia com carinho.',
      evaluationTip: 'Em poucos dias o gato adotará o poste como o seu ponto oficial de marcação.',
    },
    sources: ['Jackson Galaxy - Catification', 'iCatCare Feline Environmental Needs Guidelines'],
  },
  {
    id: 'mod_gato_4',
    title: 'Brincadeira Estruturada e Estimulação Mental',
    species: 'gato',
    ageGroup: 'todos',
    level: 'iniciante',
    theme: 'Brincadeira e Caça Simulada',
    summary: 'A rotina perfeita de brincadeira que simula a caça e reduz a hiperatividade noturna.',
    estimatedMinutes: 10,
    objectives: [
      'Dominar o ciclo natural: Caçar -> Capturar -> Comer -> Lavar-se -> Dormir',
      'Utilizar brinquedos de cana com penas de forma realista',
      'Evitar brincar diretamente com as mãos para prevenir arranhões',
    ],
    explanation: 'Gatos que atacam os pés dos tutores durante a noite ou saltam para as pernas no corredor estão frequentemente a expressar energia predatória reprimida. Duas sessões diárias de 10 a 15 minutos de caça interativa resolvem a grande maioria destes comportamentos.',
    stepByStep: [
      'Usa brinquedos do tipo cana de pesca com penas ou fio resistente.',
      'Move o brinquedo imitando a presa: faz com que ele se afaste do gato, se esconda atrás de almofadas e faça pausas.',
      'Permite que o gato consiga capturar fisicamente a "presa" várias vezes para evitar frustração acumulada.',
      'No final da sessão de brincadeira, oferece uma pequena refeição de ração húmida ou petiscos para fechar o ciclo predatório.',
      'Guarda a cana de pesca num armário fechado após a sessão por motivos de segurança.',
    ],
    commonMistakes: [
      'Mover o brinquedo diretamente contra a cara do gato (as presas na natureza nunca correm em direção ao predador).',
      'Usar luzes laser sem dar um objeto físico no final para o gato agarrar (provoca ansiedade obsessiva).',
      'Usar os dedos das mãos ou pés para brincar quando o gato é pequeno.',
    ],
    safetyTips: [
      'Nunca deixes canas com fios compridos ou fitas soltas sem vigilância (risco gravíssimo de ingestão de corpos estranhos lineares).',
    ],
    practicalExercise: {
      title: 'A Sessão Pré-Sono de 15 Minutos',
      instructions: 'Uma hora antes da hora de deitar, faz uma sessão ativa de brincadeira com a cana de pesca durante 10 a 12 minutos até o gato se deitar a respirar mais fundo. Logo a seguir, serve uma colher de ração húmida.',
      evaluationTip: 'O gato lava-se meticulosamente e dorme a noite inteira muito mais sossegado.',
    },
    sources: ['Pam Johnson-Bennett - Think Like a Cat'],
  },
];

export const HEALTH_ARTICLES: HealthArticle[] = [
  {
    id: 'art_1',
    title: 'Protocolo de Emergências e Sinais Vitais de Alerta Imediato',
    category: 'emergencias',
    species: 'todos',
    isEmergencyAlert: true,
    summary: 'Como identificar situações com risco de vida imediato e como agir nos primeiros minutos até chegar ao hospital veterinário.',
    content: `Em situações de emergência grave, cada minuto conta. O papel do tutor não é diagnosticar nem tratar em casa, mas sim reconhecer a gravidade, estabilizar com segurança e transportar o animal sem demora para o serviço de urgência veterinária 24 horas mais próximo.

SINAIS QUE EXIGEM ATENDIMENTO VETERINÁRIO IMEDIATO (SEM ESPERAR):
1. Dificuldade Respiratória Grave: Respiração de boca aberta em gatos, pieira intensa, esforço abdominal acentuado para respirar, língua ou gengivas azuladas ou arroxeadas (cianose).
2. Suspeita de Dilatação-Vólvulo Gástrico (Torção de Estômago em cães): Tentativas infrutíferas de vomitar, salivação abundante, abdómen subitamente distendido e rígido como um tambor, inquietação extrema.
3. Convulsões Repetidas ou Prolongadas: Crises que durem mais de 2 minutos ou episódios em série no mesmo dia.
4. Obstrução Urinária Felina: Gato macho que vai à caixa repetidamente, força, chora de dor e não liberta urina. Pode provocar falência renal e paragem cardíaca em poucas horas por excesso de potássio.
5. Ingestão de Toxinas Agudas: Raticidas (anticoagulantes), lírios (qualquer parte é mortal para gatos), chocolate preto em quantidade, uvas/passas, paracetamol ou medicamentos humanos.
6. Hemorragias Abundantes ou Trauma: Atropelamento, quedas de varandas ("síndrome do gato voador"), sangramento ativo pulsátil que não estanca com compressão suave.

O QUE NUNCA FAZER EM CASA:
- NUNCA administres paracetamol, aspirina, ibuprofeno ou pomadas humanas.
- NUNCA induzas o vómito sem ordem explícita do médico veterinário (se a substância ingerida for corrosiva ou ácida, queima o esófago de volta; em caso de óleos, pode causar aspiração pulmonar fatal).
- NUNCA dás leite em caso de intoxicação (o leite não anula venenos e pode acelerar a absorção de toxinas lipossolúveis).`,
    keyPoints: [
      'Telefona para a clínica de urgência a avisar que estás a caminho para a equipa preparar a sala de choque',
      'Transporta gatos e cães pequenos na transportadora coberta com uma toalha para reduzir o pânico',
      'Em caso de hemorragia externa, aplica compressão direta contínua com pano limpo',
      'Leva a embalagem ou fotografia do produto tóxico que o animal ingeriu',
    ],
    updateDate: '2025-01-10',
    sources: [
      'WSAVA Emergency and Critical Care Guidelines',
      'Ordem dos Médicos Veterinários de Portugal (OMV)',
      'Royal Veterinary College Emergency Protocols',
    ],
    canScheduleAction: {
      suggestedTaskTitle: 'Gravar Contacto de Urgência 24h na Agenda',
      category: 'veterinario',
    },
  },
  {
    id: 'art_2',
    title: 'Desparasitação Interna e Externa: Diretrizes Científicas ESCCAP',
    category: 'desparasitacao',
    species: 'todos',
    summary: 'A importância de proteger o animal e a família contra pulgas, carraças, flebótomos e parasitas intestinais zoonóticos.',
    content: `Os parasitas não causam apenas desconforto: são vetores de doenças graves como a Leishmaniose (transmitida pelo flebótomo), a Febre da Carraça (Erliquiose e Babesiose) e parasitas intestinais que podem contagiar crianças e humanos (zoonoses).

Em Portugal, devido ao clima mediterrânico ameno, os parasitas externos encontram-se ativos durante quase todo o ano, não existindo uma "época livre de risco".

DESPARASITAÇÃO INTERNA (Endoparasitas):
- A frequência varia entre mensal e trimestral consoante o estilo de vida do animal, se consome carne crua, se tem acesso a espaços rurais ou se convive com crianças pequenas e idosos.
- O médico veterinário assistente define o fármaco e o protocolo personalizado após análise coprológica ou histórico clínico.

DESPARASITAÇÃO EXTERNA (Ectoparasitas):
- Utilização de pipetas spot-on, coleiras repelentes de longa duração ou comprimidos mastigáveis aprovados.
- Em zonas endémicas de Leishmaniose (quase todo o território de Portugal continental), é imperativo usar produtos com ação repelente contra flebótomos a partir do início da primavera.`,
    keyPoints: [
      'A escolha do produto deve ter em conta a espécie (alguns desparasitantes para cães contêm permetrinas que são LETAIS para gatos)',
      'Pesagem correta antes de comprar para garantir a dose exata do fármaco',
      'Ambiente limpo: 95% da população de pulgas encontra-se em ovos e larvas na carpete e sofás',
    ],
    updateDate: '2025-01-05',
    sources: [
      'ESCCAP (European Scientific Counsel Companion Animal Parasites) Diretrizes 2024',
      'Faculdade de Medicina Veterinária da Universidade de Lisboa',
    ],
    canScheduleAction: {
      suggestedTaskTitle: 'Desparasitação Preventiva Prescrita',
      category: 'desparasitacao',
    },
  },
  {
    id: 'art_3',
    title: 'Saúde Oral e Doença Periodontal: Muito mais do que mau hálito',
    category: 'saude_oral',
    species: 'todos',
    summary: 'Mais de 80% dos cães e gatos com mais de 3 anos sofrem de doença periodontal. Como prevenir e tratar.',
    content: `A acumulação de placa bacteriana e tártaro nos dentes não é apenas um problema estético. As bactérias presentes na gengivite crónica entram na corrente sanguínea através das micro-feridas gengivais, atingindo e danificando a longo prazo órgãos vitais como as válvulas cardíacas (endocardiose), rins e fígado.

SINAIS DE PROBLEMAS DENTÁRIOS:
- Halitose pronunciada (mau hálito forte e persistente).
- Dificuldade ou recusa em mastigar alimentos secos.
- Salivação excessiva ou esfregaço do focinho com a pata.
- Gengivas vermelhas, inchadas ou com sangramento ao toque.
- Dentes soltos ou acumulação visível de placas amarelas/castanhas.

ESTRATÉGIAS PREVENTIVAS DE OURO:
1. Escovagem diária com escova macia e pasta dentífrica específica para animais (NUNCA usar pasta humana com flúor ou xilitol).
2. Mastigadores veterinários aprovados pelo VOHC (Veterinary Oral Health Council).
3. Destartarização profissional sob anestesia inalatória segura recomendada pelo veterinário quando o tártaro já estiver consolidado.`,
    keyPoints: [
      'A escovagem deve ser introduzida gradualmente com reforço positivo e pasta com sabor agradável',
      'Pastas de dentes humanas são tóxicas para cães e gatos se engolidas',
      'Uma limpeza dentária profissional a tempo salva dentes e prolonga a esperança de vida',
    ],
    updateDate: '2024-12-20',
    sources: [
      'WSAVA Global Dental Guidelines',
      'American Veterinary Dental College (AVDC)',
    ],
    canScheduleAction: {
      suggestedTaskTitle: 'Check-up Oral e Escovagem Dentária',
      category: 'higiene',
    },
  },
  {
    id: 'art_4',
    title: 'Controlo de Peso e Prevenção da Obesidade Animal',
    category: 'peso_atividade',
    species: 'todos',
    summary: 'A obesidade é a doença nutricional mais frequente em animais de companhia e reduz a longevidade em até 2,5 anos.',
    content: `O excesso de peso em cães e gatos não é sinal de "fofura", mas sim um estado inflamatório crónico de baixo grau. Animais com excesso de peso sofrem maior desgaste articular (artroses precoces), diabetes mellitus (especialmente comum em gatos), hipertensão arterial e dificuldades respiratórias.

COMO AVALIAR O SCORE DE CONDIÇÃO CORPORAL (1 a 9):
- Numa condição ideal (Score 4 ou 5): As costelas devem ser facilmente palpáveis ao deslizar as mãos suavemente pelo tórax, sem camada excessiva de gordura.
- Cintura visível: Quando visto de cima, o animal deve apresentar uma cintura evidente atrás das costelas.
- Abdómen recolhido: Quando visto de perfil, o ventre deve subir suavemente em direção às patas traseiras.

COMO CONTROLAR AS PORÇÕES:
- Usa sempre balança digital de cozinha para pesar a ração diária em gramas. Copos medidores podem induzir a erros de até 20 a 30% a mais por refeição.
- Tem em conta os petiscos dados durante o dia e desconta-os na ração principal.
- Em animais esterilizados, as necessidades calóricas diminuem em cerca de 20 a 30%, exigindo ajustes alimentares.`,
    keyPoints: [
      'Pesar a ração numa balança de cozinha em vez de estimar visualmente',
      'Evitar restos de comida humana à mesa (gordurosos e com excesso de sal/alho/cebola)',
      'Em caso de perda de peso em gatos, nunca fazer dietas radicais (risco de Lipidose Hepática fatal)',
    ],
    updateDate: '2024-12-15',
    sources: [
      'WSAVA Global Nutrition Committee',
      'FEDIAF Nutritional Guidelines for Pet Foods',
    ],
    canScheduleAction: {
      suggestedTaskTitle: 'Registo de Peso e Avaliação Corporal',
      category: 'outro',
    },
  },
  {
    id: 'art_5',
    title: 'Cuidados Especiais com Animais Idosos (Seniores)',
    category: 'seniores',
    species: 'todos',
    summary: 'Como proporcionar conforto, adaptar a casa e detetar doenças silenciosas na terceira idade do teu companheiro.',
    content: `Graças aos avanços da medicina veterinária preventiva, os nossos animais vivem hoje vidas consideravelmente mais longas. Cães de porte médio e gatos entram na fase sénior por volta dos 7 a 8 anos (cães gigantes aos 5 a 6 anos).

O envelhecimento não é uma doença, mas acarreta maior probabilidade de patologias crónicas: osteoartrite, insuficiência renal crónica, disfunção cognitiva (semelhante ao Alzheimer), doenças cardíacas e neoplasias.

ADAPTAÇÕES NO LAR:
- Coloca tapetes antiderrapantes em pisos lisos para evitar escorregadelas dolorosas.
- Fornece camas ortopédicas com espuma viscoelástica para aliviar articulações doridas.
- Em gatos idosos, usa caixas de areia com rebordos baixos para facilitar a entrada sem ter de saltar.
- Mantém comedouros e bebedouros ligeiramente elevados para não forçar a coluna cervical.
- Exames de rotina recomendados semestralmente: análises sanguíneas gerais, medição de pressão arterial e urina tipo II.`,
    keyPoints: [
      'Mudanças de comportamento ("ele está apenas mais calmo porque está velho") escondem frequentemente dor tratável',
      'Acompanhamento veterinário sénior a cada 6 meses',
      'Manter estímulo mental e passeios tranquilos adequados à capacidade física',
    ],
    updateDate: '2024-12-05',
    sources: [
      'AAHA Senior Care Guidelines for Dogs and Cats',
      'ISFM Guidelines on Feline Senility and Care',
    ],
    canScheduleAction: {
      suggestedTaskTitle: 'Check-up Sénior Semestral',
      category: 'veterinario',
    },
  },
  {
    id: 'art_6',
    title: 'Segurança em Casa: Plantas tóxicas, quedas e perigos ocultos',
    category: 'seguranca',
    species: 'todos',
    summary: 'Identifica e elimina os perigos domésticos mais frequentes para evitar acidentes graves.',
    content: `A nossa casa pode parecer um refúgio seguro, mas esconde perigos que os animais curiosos investigam com a boca e as patas.

PLANTAS COMUNS EXTREMAMENTE PERIGOSAS:
- Lírios (Lilium e Hemerocallis): EXTREMAMENTE letais para gatos. Mesmo lamber o pólen do pelo ou beber a água da jarra provoca falência renal aguda fulminante.
- Hortênsias, Azáleas e Rododendros: Contêm compostos cianogénicos e toxinas cardíacas.
- Comigo-ninguém-pode (Dieffenbachia): Provoca edema grave na boca, garganta e asfixia.
- Estrela-de-natal (Euphorbia pulcherrima): Seiva irritante cutânea e digestiva.

PERIGOS DE QUEDA E AMBIENTAIS:
- Janelas e Varandas sem proteção: Todos os anos centenas de gatos sofrem fraturas graves ou morte por caírem ao tentar apanhar um pássaro ou inseto.
- Cabos elétricos: Roer cabos pode causar eletrocussão e edema pulmonar agudo.
- Fitas, elásticos de cabelo e linhas de costura: Ingeridos por gatos, atuam como corpos estranhos lineares provocando corte no intestino que exige cirurgia urgente.`,
    keyPoints: [
      'Redes de proteção certificadas em todas as janelas acessíveis a gatos',
      'Substituir plantas tóxicas por opções seguras (erva-gateira, clorofito, calatéia)',
      'Guardar medicamentos humanos e detergentes em armários bem trancados',
    ],
    updateDate: '2024-11-28',
    sources: [
      'ASPCA Animal Poison Control Center',
      'Centro de Informação Antivenenos e Farmacovigilância Veterinária',
    ],
    canScheduleAction: {
      suggestedTaskTitle: 'Inspeção de Segurança Doméstica',
      category: 'outro',
    },
  },
];
