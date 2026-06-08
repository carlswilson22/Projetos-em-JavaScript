import React, { useState, useEffect, useCallback } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { formatCurrency } from '../lib/format';
import { Edit2, ShieldAlert, Award, DollarSign, Check } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  budget: number | null;
}

export function BudgetManager() {
  const { transactions } = useTransactions();
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias para orçamento:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, transactions]); // recarrega quando houver novas transações para manter sincronizado

  // Calcular o gasto mensal por categoria para o mês atual
  const categoryExpenses = React.useMemo(() => {
    const expenses: Record<string, number> = {};
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    transactions
      .filter(t => t.type === 'expense')
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .forEach(t => {
        expenses[t.category] = (expenses[t.category] || 0) + t.amount;
      });

    return expenses;
  }, [transactions]);

  const handleEditBudget = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setEditValue(cat.budget ? cat.budget.toString() : '');
  };

  const handleSaveBudget = async (catId: string) => {
    setIsSaving(true);
    const budgetVal = editValue === '' ? null : Number(editValue);
    
    if (budgetVal !== null && (isNaN(budgetVal) || budgetVal < 0)) {
      addToast('Valor de orçamento inválido.', 'error');
      setIsSaving(false);
      return;
    }

    try {
      await api.put(`/categories/${catId}`, { budget: budgetVal });
      addToast('Orçamento atualizado!', 'success');
      setEditingCategoryId(null);
      fetchCategories();
    } catch (error) {
      addToast('Erro ao salvar orçamento.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtrar apenas categorias que têm orçamentos ou que aparecem nos gastos recentes
  const activeCategories = React.useMemo(() => {
    return categories.filter(c => c.budget !== null || (categoryExpenses[c.name] || 0) > 0);
  }, [categories, categoryExpenses]);

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-6 shadow-premium dark:shadow-premium-dark flex flex-col gap-6 transition-all duration-300">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-foreground">Orçamentos Mensais</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Defina limites de despesas por categoria e evite surpresas</p>
      </div>

      {activeCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
          <DollarSign className="w-10 h-10 text-muted-foreground/30 mb-2" />
          <span className="text-sm font-medium">Nenhum orçamento configurado</span>
          <p className="text-xs max-w-[200px] mt-1">Defina limites para suas categorias no painel abaixo</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {activeCategories.map(cat => {
            const spent = categoryExpenses[cat.name] || 0;
            const budget = cat.budget;
            const hasBudget = budget !== null && budget > 0;
            const percentage = hasBudget ? Math.min((spent / budget) * 100, 100) : 0;
            
            // Definição de status e cores de alerta
            let progressColor = 'bg-primary';
            let alertStyle = '';
            
            if (hasBudget) {
              if (spent >= budget) {
                progressColor = 'bg-destructive animate-pulse';
                alertStyle = 'text-destructive font-bold';
              } else if (spent >= budget * 0.8) {
                progressColor = 'bg-amber-500';
                alertStyle = 'text-amber-500 font-bold';
              }
            }

            const isEditing = editingCategoryId === cat.id;

            return (
              <div key={cat.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-foreground">{cat.name}</span>
                  
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                      <input
                        type="number"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        placeholder="Sem limite"
                        className="w-20 text-xs bg-muted/60 border border-border rounded-lg px-2 py-1 outline-none focus:border-primary text-foreground"
                        disabled={isSaving}
                      />
                      <button 
                        onClick={() => handleSaveBudget(cat.id)}
                        disabled={isSaving}
                        className="p-1 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg transition-colors shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {hasBudget ? (
                          <>
                            <span className={alertStyle}>{formatCurrency(spent)}</span>
                            <span> / {formatCurrency(budget)}</span>
                          </>
                        ) : (
                          <>
                            <span>{formatCurrency(spent)}</span>
                            <span className="text-[10px] font-normal italic"> (Sem limite)</span>
                          </>
                        )}
                      </span>
                      <button 
                        onClick={() => handleEditBudget(cat)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground rounded transition-opacity"
                        title="Definir orçamento"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {hasBudget && (
                  <div className="space-y-1">
                    {/* Barra de Progresso */}
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${progressColor}`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Alertas Visuais */}
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium">
                      <span>{percentage.toFixed(0)}% consumido</span>
                      {spent >= budget ? (
                        <span className="flex items-center gap-1 text-destructive font-bold">
                          <ShieldAlert className="w-3 h-3" /> Limite excedido!
                        </span>
                      ) : spent >= budget * 0.8 ? (
                        <span className="flex items-center gap-1 text-amber-500 font-bold">
                          <AlertTriangle className="w-3 h-3" /> Próximo ao limite
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-500">
                          <Award className="w-3 h-3" /> Dentro do limite
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rápido link para gerenciar todas as categorias sem limite configurado */}
      {categories.length > activeCategories.length && (
        <div className="pt-2 border-t border-border/50 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Outras categorias ativas:</span>
          <div className="flex flex-wrap gap-1.5 max-w-[200px] justify-end">
            {categories
              .filter(c => c.budget === null && !(categoryExpenses[c.name] > 0))
              .slice(0, 3)
              .map(c => (
                <button
                  key={c.id}
                  onClick={() => handleEditBudget(c)}
                  className="text-[10px] bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-0.5 rounded-md transition-colors"
                >
                  + {c.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
// Importações adicionais de Lucide para suporte de ícones no widget
import { AlertTriangle } from 'lucide-react';
