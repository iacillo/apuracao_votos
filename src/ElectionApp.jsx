import React, { useState, useEffect } from 'react';
import { Settings, Users, GraduationCap, RotateCcw, Minus, Plus, Trophy, AlertCircle, Info, X } from 'lucide-react';
import logo from './assets/faetec.png'

const ElectionApp = () => {
  // Estado para armazenar as configurações
  const [config, setConfig] = useState({
    chapa1Name: 'Chapa 1',
    chapa2Name: 'Chapa 2',
    totalStudents: 0,
    totalStaff: 0,
    isConfigured: false
  });

  // Estado para o Modal Sobre
  const [showAbout, setShowAbout] = useState(false);

  // Estado para armazenar os votos
  const [votes, setVotes] = useState({
    chapa1Students: 0,
    chapa1Staff: 0,
    chapa2Students: 0,
    chapa2Staff: 0
  });

  // Estado para formulário temporário
  const [tempConfig, setTempConfig] = useState({ ...config });

  // Função para calcular o resultado baseado na fórmula do usuário
  const calculateScore = (studentVotes, staffVotes) => {
    const studentWeight = config.totalStudents > 0 ? (50 * studentVotes) / config.totalStudents : 0;
    const staffWeight = config.totalStaff > 0 ? (50 * staffVotes) / config.totalStaff : 0;
    return (studentWeight + staffWeight).toFixed(2);
  };

  const score1 = calculateScore(votes.chapa1Students, votes.chapa1Staff);
  const score2 = calculateScore(votes.chapa2Students, votes.chapa2Staff);

  // Manipuladores de Voto
  const updateVote = (chapa, type, increment) => {
    const key = `${chapa}${type}`; // ex: chapa1Students
    setVotes(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + increment) // Evita números negativos
    }));
  };

  // Configuração
  const handleConfigSubmit = (e) => {
    e.preventDefault();
    setConfig({ ...tempConfig, isConfigured: true });
  };

  const resetAll = () => {
    if (confirm('Tem certeza que deseja zerar toda a contagem e voltar à configuração?')) {
      setVotes({ chapa1Students: 0, chapa1Staff: 0, chapa2Students: 0, chapa2Staff: 0 });
      setConfig(prev => ({ ...prev, isConfigured: false }));
    }
  };

  // Componente Modal Sobre
  const AboutModal = () => {
    if (!showAbout) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
          {/* Cabeçalho do Modal */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-lg">Sobre a Ferramenta</h2>
            </div>
            <button 
              onClick={() => setShowAbout(false)}
              className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Conteúdo do Modal */}
          <div className="p-6 space-y-4 text-slate-600 overflow-auto scroll-smooth h-[calc(100vh-10rem)]">
         
            <p> 
              Esta ferramenta foi desenvolvida para auxiliar na apuração de votos em eleições escolares que utilizam o sistema de <strong>voto paritário</strong>.
            </p>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wider">Como funciona o cálculo?</h3>
              <p className="text-sm mb-3">
                O sistema equilibra o peso dos votos de modo que a categoria de Alunos e a categoria de Servidores tenham a mesma influência (50% cada) no resultado final, independente da quantidade de pessoas em cada grupo.
              </p>
              <div className="font-mono text-xs bg-white p-2 rounded border border-slate-200 text-slate-500">
                (50 × Votos_Servidor / Total_Servidores) + (50 × Votos_Aluno / Total_Alunos)
              </div>
            </div>

            <div className="text-sm space-y-2">
              <p><strong>Instruções:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Configure os totais de eleitores antes de iniciar.</li>
                <li>Utilize os botões grandes para adicionar votos.</li>
                <li>Use o botão de subtração (-) apenas para corrigir erros.</li>
                <li>O resultado é atualizado em tempo real.</li>
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-center text-xs text-slate-400">
              Desenvolvido Desenvolvido por:<br/> Rafael Iacillo Saores <br/> rafael.iacillo@gmail.com  
            </div>
          </div>
          
          {/* Rodapé do Modal */}
          <div className="bg-slate-50 p-4 flex justify-end">
            <button 
              onClick={() => setShowAbout(false)}
              className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Cartão de Votação (Reutilizável)
  const VoteCard = ({ chapaKey, chapaName, score, colorClass, bgClass, borderClass }) => (
    <div className={`flex flex-col h-full border-2 ${borderClass} ${bgClass} rounded-2xl shadow-sm overflow-hidden`}>
      {/* Cabeçalho do Card */}
      <div className={`${colorClass} text-white p-4 text-center`}>
        <h2 className="text-xl font-bold truncate">{chapaName}</h2>
        <div className="mt-2 flex justify-center items-baseline">
          <span className="text-4xl font-black">{score}%</span>
          <span className="ml-1 text-sm opacity-90">total</span>
        </div>
      </div>

      {/* Área de Votação */}
      <div className="p-4 space-y-6 flex-grow">
        
        {/* Seção Alunos */}
        <div>
          <div className="flex items-center justify-between mb-2 text-gray-700">
            <span className="flex items-center text-sm font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 mr-2" /> Alunos
            </span>
            <span className="font-mono font-bold text-lg">{votes[`${chapaKey}Students`]}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => updateVote(chapaKey, 'Students', -1)}
              className="p-3 rounded-lg bg-gray-200 text-gray-600 active:bg-gray-300 transition-colors"
              aria-label="Remover voto aluno"
            >
              <Minus size={20} />
            </button>
            <button 
              onClick={() => updateVote(chapaKey, 'Students', 1)}
              className={`flex-grow py-4 rounded-xl ${colorClass} text-white font-bold shadow-md active:scale-95 active:shadow-none transition-all flex justify-center items-center gap-2`}
            >
              <Plus size={24} /> VOTAR
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-200 w-full"></div>

        {/* Seção Servidores */}
        <div>
          <div className="flex items-center justify-between mb-2 text-gray-700">
            <span className="flex items-center text-sm font-semibold uppercase tracking-wider">
              <Users className="w-4 h-4 mr-2" /> Servidores
            </span>
            <span className="font-mono font-bold text-lg">{votes[`${chapaKey}Staff`]}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => updateVote(chapaKey, 'Staff', -1)}
              className="p-3 rounded-lg bg-gray-200 text-gray-600 active:bg-gray-300 transition-colors"
              aria-label="Remover voto servidor"
            >
              <Minus size={20} />
            </button>
            <button 
              onClick={() => updateVote(chapaKey, 'Staff', 1)}
              className={`flex-grow py-4 rounded-xl ${colorClass} text-white font-bold shadow-md active:scale-95 active:shadow-none transition-all flex justify-center items-center gap-2`}
            >
              <Plus size={24} /> VOTAR
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  // TELA DE CONFIGURAÇÃO
  if (!config.isConfigured) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6 text-slate-800">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Configuração da Eleição</h1>
          </div>
          
          <form onSubmit={handleConfigSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nome da 1ª Chapa</label>
              <input 
                required
                type="text" 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={tempConfig.chapa1Name}
                onChange={e => setTempConfig({...tempConfig, chapa1Name: e.target.value})}
                placeholder="Ex: Chapa Renovação"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nome da 2ª Chapa</label>
              <input 
                required
                type="text" 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
                value={tempConfig.chapa2Name}
                onChange={e => setTempConfig({...tempConfig, chapa2Name: e.target.value})}
                placeholder="Ex: Chapa Ação"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                   <GraduationCap className="w-4 h-4 mr-2" /> Alunos Votantes
                </label>
                <input 
                  required
                  type="number" 
                  min="1"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={tempConfig.totalStudents}
                  onChange={e => setTempConfig({...tempConfig, totalStudents: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                    <Users className="w-4 h-4 mr-2" />Servidores Votantes
                </label>
                <input 
                  required
                  type="number" 
                  min="1"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={tempConfig.totalStaff}
                  onChange={e => setTempConfig({...tempConfig, totalStaff: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>O cálculo será feito com peso 50/50 entre categorias, baseado nos totais informados acima.</p>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg">
              Iniciar Apuração
            </button>
          </form>
        </div>
      </div>
    );
  }

  // TELA DE APURAÇÃO
  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <AboutModal />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500 w-6 h-6" />
            <img src={logo} className="w-20" />
            <h1 className="font-bold text-slate-800 text-lg hidden sm:block">Apuração em Tempo Real</h1>
            
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowAbout(true)}
              className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
              title="Sobre"
            >
              <Info size={20} />
            </button>
            <button 
              onClick={resetAll}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Reiniciar configuração"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        
      

        {/* Placar Geral - Barra de Progresso */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-end mb-2">
            <div className="text-blue-600 font-bold">{config.chapa1Name}</div>
            <div className="text-xs text-slate-400 font-mono">VS</div>
            <div className="text-green-600 font-bold text-right">{config.chapa2Name}</div>
          </div>
          
          {/* Barra Visual */}
          <div className="h-6 w-full bg-slate-200 rounded-full overflow-hidden flex relative">
            {/* Barra Chapa 1 (Cresce da esquerda) */}
            <div 
              className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-out flex items-center justify-start px-2 text-[10px] text-white font-bold whitespace-nowrap z-10"
              style={{ width: `${Math.min(parseFloat(score1), 100)}%` }}
            >
              {parseFloat(score1) > 5 && `${score1}%`}
            </div>
            
            {/* Marcador de 50% */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 z-20 border-l border-dashed border-slate-400 h-full"></div>

            {/* Barra Chapa 2 (Cresce da direita) */}
             <div 
              className="absolute right-0 top-0 h-full bg-green-500 transition-all duration-500 ease-out flex items-center justify-end px-2 text-[10px] text-white font-bold whitespace-nowrap z-10"
              style={{ width: `${Math.min(parseFloat(score2), 100)}%` }}
            >
              {parseFloat(score2) > 5 && `${score2}%`}
            </div>
          </div>
          
           <div className="mt-4 grid grid-cols-2 gap-4">
             <div>
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Total</span>
                    <span className="font-bold text-blue-600">{score1}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(parseFloat(score1), 100)}%` }}></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span className="font-bold text-green-600">{score2}%</span>
                    <span>Total</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 flex justify-end">
                    <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(parseFloat(score2), 100)}%` }}></div>
                </div>
             </div>
           </div>
        </div>

        {/* Cartões de Votação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <VoteCard 
            chapaKey="chapa1"
            chapaName={config.chapa1Name}
            score={score1}
            colorClass="bg-blue-600"
            bgClass="bg-white"
            borderClass="border-blue-100"
          />

          <VoteCard 
            chapaKey="chapa2"
            chapaName={config.chapa2Name}
            score={score2}
            colorClass="bg-green-600"
            bgClass="bg-white"
            borderClass="border-green-100"
          />

        </div>

        {/* Rodapé Informativo */}
        <div className="mt-8 text-center text-slate-400 text-xs max-w-md mx-auto">
          <p>Fórmula: (50 * Votos Chapa Servidores / {config.totalStaff || 'Total'}) + (50 * Votos Chapa Alunos / {config.totalStudents || 'Total'})</p>
          <p className="mt-2">Totais registrados: {config.totalStudents} Alunos, {config.totalStaff} Servidores.</p>
        </div>
      </main>
    </div>
  );
};

export default ElectionApp;