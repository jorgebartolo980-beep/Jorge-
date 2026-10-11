import React, { useState, useRef, useEffect } from 'react';
import { usePetCare } from '../../context/PetCareContext';
import { useAuth } from '../../context/AuthContext';
import { PaywallGate } from '../common/PaywallGate';
import { ChatMessage } from '../../types';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  User,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Info,
  PhoneCall,
  Lock,
} from 'lucide-react';

interface AssistantViewProps {
  onNavigateToPlans: () => void;
}

export const AssistantView: React.FC<AssistantViewProps> = ({ onNavigateToPlans }) => {
  const { activePet, pets, setActivePetId } = usePetCare();
  const { token, hasActiveAccess } = useAuth();

  // If user does not have active commercial license, display professional paywall gate (Section 5)
  if (!hasActiveAccess) {
    return (
      <div className="py-6">
        <PaywallGate
          onNavigateToPlans={onNavigateToPlans}
          title="Assistente PetCare AI Exclusivo"
          featureDescription="O Assistente com IA avançada, triagem comportamental e adaptação à biologia de cada animal é uma funcionalidade premium com licença ativa."
        />
      </div>
    );
  }

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome_1',
      role: 'assistant',
      content: `Olá! Sou o Assistente Inteligente do PetCare 360 com Licença Comercial Ativa.
Estou preparado para esclarecer dúvidas sobre educação com reforço positivo, enriquecimento ambiental, rotinas diárias e preparação para consultas veterinárias em português de Portugal.

${
  activePet
    ? `Estou contextualizado com os dados do teu companheiro **${activePet.name}** (${activePet.species === 'cão' ? 'Cão' : 'Gato'} • ${activePet.approxAge || 'Idade registada'} • ${activePet.weightKg ? `${activePet.weightKg} kg` : ''}).`
    : 'Podes selecionar um dos teus animais no topo para personalizar as respostas.'
}

Como posso ajudar-te hoje?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    activePet?.species === 'gato'
      ? 'Como posso preparar a casa para um gato tímido se sentir seguro?'
      : 'Como posso ajudar o meu cão a habituar-se à trela sem puxar?',
    'Que informações importantes devo levar anotadas à consulta veterinária?',
    'Como posso enriquecer o ambiente do meu animal em dias de chuva?',
    activePet?.species === 'gato'
      ? 'Qual é a melhor rotina para caixas de areia em casa?'
      : 'Qual é a melhor forma de responder à chamada no parque?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setApiError(null);
    const userMsg: ChatMessage = {
      id: 'user_' + Date.now().toString(36),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          petContext: activePet || null,
          conversationHistory: messages.slice(-5).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na comunicação com o assistente.');
      }

      const assistantMsg: ChatMessage = {
        id: 'assistant_' + Date.now().toString(36),
        role: 'assistant',
        content: data.reply,
        timestamp: data.timestamp || new Date().toISOString(),
        isEmergency: data.hasEmergencyTrigger,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Ocorreu uma falha ao contactar o servidor.');
      const errorMsg: ChatMessage = {
        id: 'error_' + Date.now().toString(36),
        role: 'assistant',
        content: `Pedimos desculpa, ocorreu uma dificuldade temporária na ligação: ${err.message || 'Verifica se a tua licença está ativa.'}
Se tiveres uma urgência médica veterinária, contacta de imediato o teu médico veterinário ou um hospital 24h.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_' + Date.now().toString(36),
        role: 'assistant',
        content: `Conversa reiniciada. Em que posso ser útil relativamente a **${activePet?.name || 'teu animal'}**?`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setApiError(null);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#154734] text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Gemini 3.8 Flash • Licença Comercial Ativa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assistente PetCare AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Apoio em educação animal, enriquecimento, rotinas e bem-estar em português de Portugal.
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Nova Conversa</span>
        </button>
      </div>

      {/* Active Pet Context Card */}
      {activePet && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={activePet.photoUrl}
              alt={activePet.name}
              className="w-8 h-8 rounded-full object-cover border border-emerald-700/40 shrink-0"
            />
            <div className="truncate">
              <span className="font-bold text-slate-800">
                Contexto ativo: {activePet.name} ({activePet.species === 'cão' ? 'Cão' : 'Gato'})
              </span>
              <span className="text-slate-400 block truncate text-[11px]">
                {activePet.breed || 'SRD'} • {activePet.weightKg ? `${activePet.weightKg} kg` : ''} • {activePet.traits.join(', ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {pets.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePetId(p.id)}
                className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                  p.id === activePet.id
                    ? 'bg-[#154734] text-white border-[#154734] font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-800 text-white'
                      : 'bg-[#154734] text-emerald-200 shadow-2xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1 min-w-0">
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-[#154734] text-white rounded-tr-xs shadow-xs'
                        : msg.isEmergency
                        ? 'bg-rose-50 text-rose-950 border border-rose-300 rounded-tl-xs shadow-xs'
                        : 'bg-[#FAF9F5] text-slate-800 border border-slate-200/70 rounded-tl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Message footer info & copy */}
                  <div
                    className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{new Date(msg.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="hover:text-slate-600 transition-colors inline-flex items-center gap-0.5"
                        title="Copiar resposta"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-[#154734] text-emerald-200 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-3xl bg-[#FAF9F5] border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#154734] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#154734] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#154734] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1">O assistente está a formular uma resposta segura...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts strip */}
        <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Sugestões:
          </span>
          {suggestedQuestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#154734] px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs transition-colors shrink-0 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            placeholder={
              activePet
                ? `Coloca uma pergunta sobre ${activePet.name}...`
                : 'Coloca a tua dúvida sobre cuidados ou comportamento...'
            }
            className="flex-1 p-3 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#154734] outline-none disabled:bg-slate-50"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 rounded-2xl bg-[#154734] hover:bg-[#0f3426] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Safety Notice Footer */}
      <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Diretrizes de Segurança da IA:</strong> O assistente distingue educação geral de diagnóstico clínico. Não recomenda medicamentos humanos nem métodos aversivos. Em situações de emergência médica, procure assistência veterinária imediatamente.
        </p>
      </div>
    </div>
  );
};
