import React, { useState } from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'privacidade' | 'termos'>('privacidade');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#FAF9F5] border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-100 text-[#154734]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-[#154734]">
                Privacidade, RGPD & Termos de Utilização
              </h3>
              <p className="text-xs text-slate-500">
                Transparência total sobre a proteção de dados e o âmbito de responsabilidade da plataforma.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 px-6 pt-3 bg-white">
          <button
            onClick={() => setActiveTab('privacidade')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'privacidade'
                ? 'border-[#154734] text-[#154734]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Política de Privacidade (RGPD)
          </button>
          <button
            onClick={() => setActiveTab('termos')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'termos'
                ? 'border-[#154734] text-[#154734]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Termos & Limites de Responsabilidade
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto space-y-4">
          {activeTab === 'privacidade' ? (
            <>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-[#154734]">
                <p className="font-bold mb-1">Princípio da Minimização e Armazenamento Local:</p>
                <p>
                  O PetCare 360 opera segundo os princípios do Regulamento Geral sobre a Proteção de Dados (RGPD - Regulamento UE 2016/679). Não recolhemos dados sensíveis de localização por GPS, telemetria oculta nem vendemos informações a terceiros.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Dados Recolhidos</h4>
                <p>
                  A aplicação recolhe estritamente os dados inseridos voluntariamente pelo utilizador para o acompanhamento dos seus animais de companhia:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                  <li>Identificação do animal (nome, espécie, raça, idade aproximada, peso, fotografias selecionadas);</li>
                  <li>Registos de rotinas, alimentação, higiene e histórico de cuidados inseridos;</li>
                  <li>Notas de saúde preventiva e despesas em euros para controlo financeiro pessoal;</li>
                  <li>Histórico temporário de conversação com o Assistente PetCare AI para manter o contexto da sessão.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Finalidade do Tratamento</h4>
                <p>
                  Os dados destinam-se exclusivamente à prestação dos serviços da plataforma: organização da agenda de cuidados, visualização de evolução de peso, cálculo de despesas e personalização de sugestões educativas.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Direitos do Titular dos Dados (Acesso, Exportação e Esquecimento)</h4>
                <p>
                  Em total conformidade com os Artigos 15.º a 20.º do RGPD, tem a qualquer momento o direito de:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                  <li><strong>Exportar todos os seus dados:</strong> Pode descarregar um ficheiro JSON estruturado e completo através do botão "Exportar Meus Dados" a qualquer momento;</li>
                  <li><strong>Eliminar permanentemente todos os registos:</strong> Pode apagar todos os dados guardados localmente com efeito imediato através do painel de gestão;</li>
                  <li><strong>Retificar informações:</strong> Todos os campos de perfis, tarefas, notas e despesas são editáveis diretamente na interface.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">4. Utilização da Inteligência Artificial</h4>
                <p>
                  As interações com o Assistente Gemini são transmitidas de forma segura através do servidor da aplicação sem identificadores pessoais do tutor. Apenas o contexto biológico estrito do animal (espécie, peso, idade, notas de comportamento) é utilizado para tornar a resposta cientificamente relevante.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900">
                <p className="font-bold mb-1">Aviso Fundamental sobre Cuidados Veterinários:</p>
                <p>
                  O PetCare 360 é uma ferramenta estritamente pedagógica e de gestão doméstica. Em nenhuma circunstância deve ser interpretado como substituto de uma consulta veterinária presencial, diagnóstico clínico ou prescrição terapêutica.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Objeto e Natureza dos Conteúdos</h4>
                <p>
                  Todos os módulos da Academia e artigos do Centro de Saúde baseiam-se em orientações de bem-estar animal e reforço positivo. No entanto, cada animal é um indivíduo biológico com necessidades singulares. Recomenda-se sempre a validação de planos de alimentação, vacinação ou tratamentos com o médico veterinário assistente.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Limitação de Responsabilidade em Situações de Emergência</h4>
                <p>
                  A plataforma disponibiliza avisos de emergência claros. A equipa do PetCare 360 e os criadores da aplicação não se responsabilizam por atrasos na procura de cuidados clínicos urgentes decorrentes do uso da plataforma. Em situações de suspeita de intoxicação, colapso, hemorragia ou insuficiência respiratória, dirija-se de imediato a um serviço de urgência veterinária 24h.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Métodos Éticos e Bem-Estar Animal</h4>
                <p>
                  O PetCare 360 promove exclusivamente métodos sem violência, baseados na ciência moderna do reforço positivo (force-free). Repudiamos veementemente o uso de castigos corporais, coleiras de estrangulamento ou choques elétricos, bem como desungulação ou qualquer prática que coloque em causa a integridade física e emocional do animal.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">4. Contacto com o Encarregado de Proteção de Dados</h4>
                <p>
                  Para quaisquer questões relacionadas com termos ou privacidade, contacte o nosso canal em: <code>privacidade@petcare360.pt</code>.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF9F5] border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Última atualização: Janeiro de 2025 • Versão 1.2 pt-PT</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#154734] hover:bg-[#0f3426] text-white shadow-xs transition-colors"
          >
            Compreendido e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
