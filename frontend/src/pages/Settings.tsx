import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Sun, Moon, Download, AlertTriangle, ShieldAlert, BadgeInfo, Eye } from 'lucide-react';

export const Settings: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const { user } = useAuth();
  
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
  };

  const handleSaveAlertLimit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('@FinanceApp:alertLimit', alertLimit);
    alert('Configuração de alerta salva com sucesso!');
  };

  // Exportar dados para JSON
  const handleExportJSON = () => {
    if (transactions.length === 0) {
      alert('Nenhum dado disponível para exportar.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `financial-control_${user?.name.replace(/\s+/g, '_')}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Exportar dados para CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('Nenhum dado disponível para exportar.');
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
  };

  // Limpar Histórico Total
  const handleResetData = async () => {
    if (transactions.length === 0) {
      alert('Você não possui transações para redefinir.');
      return;
    }
    const confirm1 = window.confirm(
      '⚠️ ATENÇÃO EXTREMA:\n\nIsso irá apagar permanentemente todas as suas transações do sistema. Esta ação NÃO pode ser desfeita. Deseja prosseguir?'
    );
    if (!confirm1) return;

    const confirm2 = window.prompt(
      'Para confirmar a exclusão de todos os seus dados de transação, digite "REDEFINIR" no campo abaixo:'
    );
    if (confirm2 !== 'REDEFINIR') {
      alert('Confirmação incorreta. Operação cancelada.');
      return;
    }

    setIsResetting(true);
    try {
      // Deleta transações sequencialmente
      for (const t of transactions) {
        await deleteTransaction(t.id);
      }
      alert('Seu histórico financeiro foi totalmente redefinido com sucesso.');
    } catch (error) {
      console.error('Erro ao redefinir dados:', error);
      alert('Ocorreu um erro ao excluir seus dados.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-2xl font-bold font-sans tracking-tight text-foreground">Configurações Gerais</h2>
        <p className="text-sm text-muted-foreground mt-1">Ajuste preferências de interface, alertas e faça a portabilidade dos seus dados.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Menu / Resumo */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 border border-border">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-foreground text-background flex items-center justify-center font-bold text-xl">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="font-bold text-base text-foreground leading-tight">{user?.name}</h3>
            <span className="text-xs text-muted-foreground mt-1">{user?.email}</span>
            <div className="mt-4 py-1.5 px-3 bg-muted rounded-xl text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Membro Ativo
            </div>
          </div>

          <div className="bg-white border border-border rounded-3xl p-5 shadow-sm text-xs text-muted-foreground flex flex-col gap-2.5">
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
          <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
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
                  className="w-full md:w-28 text-xs bg-white border border-border rounded-xl px-3 py-2 outline-none focus:border-primary transition-colors font-medium text-foreground"
                  required
                />
                <Button type="submit" size="sm" className="text-xs rounded-xl whitespace-nowrap h-9">
                  Salvar
                </Button>
              </div>
            </form>
          </div>

          {/* Exportação de Dados */}
          <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-base text-foreground tracking-tight mb-2 flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Backup & Portabilidade
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Exporte todo o seu histórico financeiro e leve seus dados para planilhas ou outros sistemas.</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportCSV}
                className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-muted py-3 px-4 rounded-2xl transition-colors font-semibold text-xs text-foreground shadow-sm"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
                Exportar para Excel (CSV)
              </button>
              <button
                onClick={handleExportJSON}
                className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-muted py-3 px-4 rounded-2xl transition-colors font-semibold text-xs text-foreground shadow-sm"
              >
                <Download className="w-4 h-4 text-muted-foreground" />
                Exportar Backup (JSON)
              </button>
            </div>
          </div>

          {/* Zona de Perigo */}
          <div className="bg-red-50/20 border border-red-200/50 rounded-3xl p-6">
            <h3 className="font-bold text-base text-red-700 tracking-tight mb-2 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
              Zona de Perigo
            </h3>
            <p className="text-xs text-red-600/80 mb-4">Ações destrutivas que removem seus registros permanentemente do banco de dados.</p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-red-100 p-4 rounded-2xl gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-red-900 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Redefinir Dados de Transações
                </span>
                <span className="text-[11px] text-red-600/70 mt-0.5 max-w-[340px]">
                  Limpar todo o extrato e categorias. Isso redefinirá suas finanças para o estado inicial.
                </span>
              </div>
              <button
                onClick={handleResetData}
                disabled={isResetting}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors whitespace-nowrap"
              >
                {isResetting ? 'Limpando...' : 'Zerar Conta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
