import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Sun, Moon, Download, AlertTriangle, ShieldAlert, BadgeInfo, Eye, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Settings: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // Estado do Tema (Dark Mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved as 'light' | 'dark';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  const [isResetting, setIsResetting] = useState(false);
  const [alertLimit, setAlertLimit] = useState(() => {
    return localStorage.getItem('@FinanceApp:alertLimit') || '500';
  });

  // Estado para o modal de redefinição dupla
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    addToast(`Modo ${theme === 'light' ? 'Escuro' : 'Claro'} ativado!`, 'info');
  };

  const handleSaveAlertLimit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('@FinanceApp:alertLimit', alertLimit);
    addToast('Configuração de alerta salva com sucesso!', 'success');
  };

  // Estado da Moeda
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('@FinanceApp:currency') || 'BRL';
  });

  const handleToggleCurrency = (value: string) => {
    localStorage.setItem('@FinanceApp:currency', value);
    setCurrency(value);
    addToast(`Moeda alterada para ${value === 'BRL' ? 'Real (BRL)' : value === 'USD' ? 'Dólar (USD)' : 'Euro (EUR)'}! Recarregando...`, 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Exportar dados para JSON
  const handleExportJSON = () => {
    if (transactions.length === 0) {
      addToast('Nenhum dado disponível para exportar.', 'warning');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `financial-control_${user?.name.replace(/\s+/g, '_')}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Backup exportado em formato JSON!', 'success');
  };

  // Exportar dados para CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      addToast('Nenhum data disponível para exportar.', 'warning');
      return;
    }
    const headers = ['ID', 'Data', 'Descrição', 'Valor (R$)', 'Tipo', 'Categoria'];
    const rows = transactions.map((t) => [
      t.id,
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.description,
      t.amount.toString(),
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.category,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financial-control_${user?.name.replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    addToast('Dados exportados em formato CSV (Excel)!', 'success');
  };

  // Limpar Histórico Total
  const handleResetData = async () => {
    if (confirmText !== 'REDEFINIR') return;
    
    setIsWipeModalOpen(false);
    setIsResetting(true);
    addToast('Limpando histórico de transações...', 'info', 6000);
    
    try {
      // Deleta transações sequencialmente
      for (const t of transactions) {
        await deleteTransaction(t.id);
      }
      addToast('Seu histórico financeiro foi totalmente redefinido.', 'success');
      setConfirmText('');
    } catch (error) {
      console.error('Erro ao redefinir dados:', error);
      addToast('Ocorreu um erro ao excluir seus dados.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  if (!user) return null;
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Configurações Gerais</h2>
        <p className="text-sm text-muted-foreground mt-1">Ajuste preferências de interface, alertas e faça a portabilidade dos seus dados.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Menu / Resumo */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-[2rem] p-6 shadow-premium dark:shadow-premium-dark flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 border border-border">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                  {initial}
                </div>
              )}
            </div>
            <h3 className="font-bold text-base text-foreground leading-tight">{user.name}</h3>
            <span className="text-xs text-muted-foreground mt-1">{user.email}</span>
            <div className="mt-4 py-1.5 px-3 bg-muted rounded-xl text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Membro Ativo
            </div>
          </div>

          <div className="bg-card border border-border rounded-[2rem] p-6 shadow-premium dark:shadow-premium-dark text-xs text-muted-foreground flex flex-col gap-2.5">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 mb-1 text-xs">
              <BadgeInfo className="w-4 h-4 text-primary" />
              Segurança & Dados
            </h4>
            <p>Seus dados são encriptados e armazenados com criptografia de ponta a ponta em nossa API baseada em SQLite/Prisma.</p>
            <p>Nenhuma informação pessoal ou bancária real é compartilhada ou vendida para terceiros.</p>
          </div>
        </div>

        {/* Lado Direito: Seções de Ajuste */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Preferências Visuais */}
          <div className="bg-card border border-border rounded-[2rem] p-6 shadow-premium dark:shadow-premium-dark">
            <h3 className="font-bold text-base text-foreground tracking-tight mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Preferências de Interface
            </h3>
            
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Tema do Sistema</span>
                <span className="text-xs text-muted-foreground mt-0.5">Alterne entre o visual Claro e Escuro</span>
              </div>
              <button
                onClick={handleToggleTheme}
                className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground py-2 px-4 rounded-2xl transition-all border border-border font-medium text-xs shadow-sm"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4" />
                    Modo Escuro
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    Modo Claro
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Moeda Principal</span>
                <span className="text-xs text-muted-foreground mt-0.5">Defina a moeda de exibição dos valores</span>
              </div>
              <select
                value={currency}
                onChange={(e) => handleToggleCurrency(e.target.value)}
                className="flex h-10 w-28 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-semibold shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-card text-foreground cursor-pointer"
              >
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            {/* Configurar Alerta de Gastos Altos */}
            <form onSubmit={handleSaveAlertLimit} className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Limite de Transação Alta</span>
                <span className="text-xs text-muted-foreground mt-0.5">Destacar compras com valores acima de (R$)</span>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="number"
                  value={alertLimit}
                  onChange={(e) => setAlertLimit(e.target.value)}
                  className="w-full md:w-28 text-xs bg-muted/40 border border-border rounded-xl px-3 py-2 outline-none focus:border-primary focus:bg-card transition-all font-medium text-foreground"
                  required
                />
                <Button type="submit" size="sm" className="text-xs rounded-xl whitespace-nowrap h-9">
                  Salvar
                </Button>
              </div>
            </form>
          </div>

          {/* Exportação de Dados */}
          <div className="bg-card border border-border rounded-[2rem] p-6 shadow-premium dark:shadow-premium-dark">
            <h3 className="font-bold text-base text-foreground tracking-tight mb-2 flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Backup & Portabilidade
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Exporte todo o seu histórico financeiro e leve seus dados para planilhas ou outros sistemas.</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportCSV}
                className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-muted py-3 px-4 rounded-2xl transition-colors font-semibold text-xs text-foreground shadow-sm bg-card"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
                Exportar para Excel (CSV)
              </button>
              <button
                onClick={handleExportJSON}
                className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-muted py-3 px-4 rounded-2xl transition-colors font-semibold text-xs text-foreground shadow-sm bg-card"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
                Exportar Backup (JSON)
              </button>
            </div>
          </div>

          {/* Zona de Perigo */}
          <div className="bg-rose-50/10 dark:bg-rose-950/5 border border-rose-200/40 dark:border-rose-900/20 rounded-[2rem] p-6">
            <h3 className="font-bold text-base text-rose-500 tracking-tight mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Zona de Perigo
            </h3>
            <p className="text-xs text-rose-400/80 mb-4">Ações destrutivas que removem seus registros permanentemente do banco de dados.</p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card border border-rose-100 dark:border-rose-950 p-4 rounded-2xl gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-rose-900 dark:text-rose-200 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Redefinir Dados de Transações
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5 max-w-[340px]">
                  Limpar todo o extrato e categorias. Isso redefinirá suas finanças para o estado inicial.
                </span>
              </div>
              <button
                onClick={() => {
                  if (transactions.length === 0) {
                    addToast('Você não possui transações para redefinir.', 'warning');
                    return;
                  }
                  setIsWipeModalOpen(true);
                }}
                disabled={isResetting}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors whitespace-nowrap shadow-sm disabled:opacity-50"
              >
                {isResetting ? 'Limpando...' : 'Zerar Conta'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Personalizado de Wipe de Dados (Confirmação Dupla) */}
      {isWipeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => { setIsWipeModalOpen(false); setConfirmText(''); }} />
          
          <div className="relative bg-card text-card-foreground w-full max-w-md rounded-[2rem] border border-border shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setIsWipeModalOpen(false); setConfirmText(''); }}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-rose-100 dark:bg-rose-950/30 text-rose-600">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight">⚠️ Ação Altamente Destrutiva</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Isso apagará permanentemente todas as suas transações e categorias. Para confirmar, digite <span className="font-bold text-foreground">REDEFINIR</span> abaixo.
                </p>
              </div>

              <div className="w-full space-y-3 mt-2">
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Digite REDDEFINIR"
                  className="w-full text-center text-sm font-semibold uppercase tracking-widest bg-muted/40 border border-border rounded-xl px-4 py-3 outline-none focus:border-rose-500 focus:bg-card transition-all text-foreground"
                />

                <div className="flex gap-3 w-full pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setIsWipeModalOpen(false); setConfirmText(''); }}
                    className="flex-1 rounded-xl py-3 border-border hover:bg-muted"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleResetData}
                    disabled={confirmText !== 'REDEFINIR'}
                    className="flex-1 rounded-xl py-3 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Confirmar Zeramento
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
