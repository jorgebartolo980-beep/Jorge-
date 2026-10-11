import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  Building2,
  Euro,
  Clock,
  Home,
  Check,
} from 'lucide-react';

export const AdoptionView: React.FC = () => {
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    time: false,
    budget: false,
    space: false,
    lifelong: false,
    familyAgreement: false,
    travelPlan: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecked = Object.values(checklist).filter(Boolean).length;
  const isReady = totalChecked === 6;

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#154734] via-[#0f3426] to-[#1b4332] text-white p-8 sm:p-12 shadow-xl border border-emerald-800/40">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-600/40 text-emerald-200 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Guia Ético & Prevenção do Abandono</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Adoção Responsável: Um Compromisso para a Vida
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Adotar um animal de companhia transforma vidas. Conhece o que implica verdadeiramente receber um companheiro, os custos reais e a regra de ouro dos 3-3-3 para uma transição sem traumas.
          </p>
        </div>
      </div>

      {/* The 3-3-3 Rule */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Cronograma Biológico
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            A Regra 3-3-3 na Chegada a Casa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Animais resgatados de canis ou associações necessitam de tempo para se sentirem seguros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 3 Days */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-extrabold text-lg">
                3D
              </span>
              <h3 className="text-lg font-bold text-slate-900">Primeiros 3 Dias: Descompressão</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                O animal está em choque com a mudança drástica. Pode recusar comer, esconder-se ou parecer assustado.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <li>• Não forces abraços nem festas contínuas</li>
              <li>• Evita visitas de amigos nos primeiros dias</li>
              <li>• Mantém um espaço calmo e previsível</li>
            </ul>
          </div>

          {/* 3 Weeks */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="w-10 h-10 rounded-2xl bg-teal-50 text-[#154734] flex items-center justify-center font-extrabold text-lg">
                3S
              </span>
              <h3 className="text-lg font-bold text-slate-900">Primeiras 3 Semanas: Aprender a Rotina</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Começa a sentir-se confortável e a compreender os horários de alimentação e passeios. A verdadeira personalidade começa a surgir.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <li>• Estabelece limites gentis com consistência</li>
              <li>• Inicia treinos curtos de reforço positivo</li>
              <li>• Cria rotinas rigorosas de sono e refeições</li>
            </ul>
          </div>

          {/* 3 Months */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-extrabold text-lg">
                3M
              </span>
              <h3 className="text-lg font-bold text-slate-900">Primeiros 3 Meses: Confiança e Vínculo</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                O animal sente que este é o seu lar definitivo. Cria um laço profundo de lealdade e segurança com toda a família.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <li>• Sentimento de pertença consolidado</li>
              <li>• Redução acentuada de medos e sobressaltos</li>
              <li>• Companheiro fiel para toda a vida</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Real Financial & Time Costs */}
      <section className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Transparência Financeira
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Custos Reais de Manter um Animal com Qualidade
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Muitos abandonos ocorrem por falta de planeamento orçamental. Abaixo apresentamos uma estimativa realista em Portugal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200">
            <span className="font-bold text-slate-900 block text-sm">Alimentação Saudável</span>
            <span className="text-lg font-extrabold text-[#154734] block my-1">30 € a 70 € / mês</span>
            <p className="text-slate-500">
              Ração de qualidade com proteína adequada para prevenir doenças renais e articulares a longo prazo.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200">
            <span className="font-bold text-slate-900 block text-sm">Saúde Preventiva</span>
            <span className="text-lg font-extrabold text-[#154734] block my-1">150 € a 300 € / ano</span>
            <p className="text-slate-500">
              Vacinação anual obrigatória, desparasitação interna periódica e externa (pulgas, carraças e flebótomos).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200">
            <span className="font-bold text-slate-900 block text-sm">Fundo de Emergência</span>
            <span className="text-lg font-extrabold text-[#154734] block my-1">300 € a 800 €</span>
            <p className="text-slate-500">
              Reserva recomendada para cirurgias, internamentos ou exames laboratoriais inesperados.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-slate-200">
            <span className="font-bold text-slate-900 block text-sm">Identificação & Legislação</span>
            <span className="text-lg font-extrabold text-[#154734] block my-1">30 € a 50 €</span>
            <p className="text-slate-500">
              Microchip obrigatório por lei em Portugal (registo SIAC) e licença anual na junta de freguesia (cães).
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Compatibility Questionnaire */}
      <section className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#154734]">
            Autoavaliação Pré-Adoção
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Estou Realmente Pronto Para Adotar?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Responde com honestidade a esta checklist de compatibilidade:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            {
              key: 'time',
              title: 'Disponibilidade de Tempo Diário',
              desc: 'Tenho pelo menos 1 a 2 horas todos os dias para passeios, alimentação, brincadeira e atenção sem pressas.',
            },
            {
              key: 'budget',
              title: 'Orçamento Financeiro Estável',
              desc: 'Consigo suportar a despesa mensal de alimentação, cuidados veterinários e eventuais imprevistos clínicos.',
            },
            {
              key: 'space',
              title: 'Habitação Segura & Autorizada',
              desc: 'O senhorio ou condomínio permite animais e tenho janelas com rede de proteção (para gatos) ou vedações seguras.',
            },
            {
              key: 'lifelong',
              title: 'Compromisso a Longo Prazo (12 a 18 anos)',
              desc: 'Estou ciente de que um cão ou gato pode viver mais de 15 anos e acompanhará mudanças de casa ou família.',
            },
            {
              key: 'familyAgreement',
              title: 'Acordo Total de Todos os Membros da Casa',
              desc: 'Todos os que vivem comigo concordam plenamente e estão dispostos a partilhar o carinho e tarefas.',
            },
            {
              key: 'travelPlan',
              title: 'Plano para Férias & Ausências',
              desc: 'Tenho solução pensada (pet sitter de confiança, hotel familiar ou levá-lo comigo) quando for de férias.',
            },
          ].map((item) => {
            const checked = checklist[item.key];
            return (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  checked
                    ? 'bg-white border-emerald-600 shadow-xs'
                    : 'bg-white/60 border-emerald-200/60 hover:bg-white text-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    checked ? 'bg-[#154734] text-white' : 'border-2 border-slate-300'
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback Bar */}
        <div className="p-4 rounded-2xl bg-white border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-800">
              Pontuação: {totalChecked} de 6 critérios cumpridos
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isReady
                ? 'Parabéns! Reuniste as condições ideais para proporcionar uma vida plena a um animal adotado.'
                : 'Ainda existem aspetos a ponderar. Dedica tempo a preparar a tua rotina antes de dar o passo.'}
            </p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] self-start sm:self-auto ${
              isReady ? 'bg-emerald-100 text-[#154734]' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isReady ? '✓ Pronto para Adotar' : 'Em Preparação'}
          </span>
        </div>
      </section>

      {/* Association Partnership Architecture Notice */}
      <section className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <Building2 className="w-4 h-4 text-[#154734]" />
          <span>Futuras Parcerias com Associações e Centros Oficiais de Recolha (CRO)</span>
        </div>
        <p className="leading-relaxed">
          O PetCare 360 foi desenhado com arquitetura aberta para integrar protocolos institucionais com associações de proteção animal legalmente constituídas em Portugal. Não publicamos anúncios comerciais nem listas fictícias de animais: o nosso compromisso é apoiar o tutor na preparação e encaminhar diretamente para as entidades legítimas de resgate.
        </p>
        <span className="text-[11px] text-slate-400 block">
          És uma associação de bem-estar animal? Contacta-nos em <code>parcerias@petcare360.pt</code>.
        </span>
      </section>
    </div>
  );
};
