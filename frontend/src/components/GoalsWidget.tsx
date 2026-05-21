import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Calendar, PiggyBank } from 'lucide-react';
import api from '../services/api';
import { Goal } from '../types';
import { Button } from './ui/button';

export const GoalsWidget: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para Criação
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [deadline, setDeadline] = useState('');

  // Estados para Depósito Inline
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Erro ao buscar metas financeiras:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target) return;

    try {
      await api.post('/goals', {
        title,
        target: parseFloat(target),
        current: current ? parseFloat(current) : 0,
        deadline: deadline || undefined,
      });

      // Limpar formulário
      setTitle('');
      setTarget('');
      setCurrent('');
      setDeadline('');
      setIsAdding(false);

      // Recarregar metas
      await fetchGoals();
    } catch (error) {
      console.error('Erro ao criar meta financeiro:', error);
    }
  };

  const handleAddSavings = async (goal: Goal) => {
    if (!depositAmount) return;
    const amountToAdd = parseFloat(depositAmount);
    if (isNaN(amountToAdd) || amountToAdd <= 0) return;

    try {
      const newCurrent = goal.current + amountToAdd;
      await api.put(`/goals/${goal.id}`, { current: newCurrent });

      setDepositGoalId(null);
      setDepositAmount('');
      await fetchGoals();
    } catch (error) {
      console.error('Erro ao depositar fundos na meta:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta meta financeira?')) return;
    try {
      await api.delete(`/goals/${id}`);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex flex-col bg-white border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold font-sans tracking-tight">Metas de Economia</h3>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-1.5 rounded-xl hover:bg-muted text-primary transition-colors flex items-center justify-center border border-border"
            title="Criar nova meta"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Formulário de Criação Integrado */}
      {isAdding && (
        <form onSubmit={handleCreateGoal} className="flex flex-col gap-3 bg-muted/40 border border-border p-4 rounded-2xl mb-6 transition-all duration-300">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nova Meta Financeira</h4>
          
          <input
            type="text"
            placeholder="Título (ex: Viagem de Férias)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full text-xs bg-white border border-border rounded-xl px-3 py-2.5 outline-none focus:border-primary transition-colors"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="0.01"
              placeholder="Alvo (R$)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
              className="w-full text-xs bg-white border border-border rounded-xl px-3 py-2.5 outline-none focus:border-primary transition-colors"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Já tenho (R$)"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full text-xs bg-white border border-border rounded-xl px-3 py-2.5 outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="text-xs bg-transparent outline-none w-full text-muted-foreground"
            />
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="text-xs rounded-xl h-8 px-3"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="text-xs rounded-xl h-8 px-3"
            >
              Criar Meta
            </Button>
          </div>
        </form>
      )}

      {/* Lista de Metas */}
      {isLoading && goals.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <span className="text-xs text-muted-foreground">Carregando metas...</span>
        </div>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/20 border border-dashed border-border rounded-2xl">
          <PiggyBank className="w-8 h-8 text-muted-foreground/60 mb-2" />
          <p className="text-xs text-muted-foreground max-w-[200px]">
            Nenhuma meta cadastrada. Defina objetivos para começar a poupar!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[320px] overflow-y-auto pr-1">
          {goals.map((goal) => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            const isCompleted = percentage >= 100;

            return (
              <div key={goal.id} className="flex flex-col border border-border p-3.5 rounded-2xl hover:border-foreground/20 transition-all duration-200">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col truncate max-w-[80%]">
                    <span className="font-semibold text-sm text-foreground flex items-center gap-1.5 truncate">
                      {goal.title}
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    </span>
                    {goal.deadline && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                        <Calendar className="w-3 h-3" />
                        Prazo: {formatDate(goal.deadline)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-muted-foreground hover:text-red-500 p-1 rounded-lg transition-colors"
                    title="Excluir meta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-end justify-between text-xs font-sans mb-1.5 mt-1">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{formatCurrency(goal.current)}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold">Economizado</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-muted-foreground">{formatCurrency(goal.target)}</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-semibold">Alvo</span>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${
                      isCompleted ? 'from-emerald-400 to-emerald-500' : 'from-primary/80 to-primary'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Ação de Depósito Inline */}
                {depositGoalId === goal.id ? (
                  <div className="flex gap-1.5 items-center bg-muted/40 p-1.5 rounded-xl transition-all duration-300">
                    <input
                      type="number"
                      placeholder="Valor (R$)"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="text-xs bg-white border border-border rounded-lg px-2.5 py-1.5 outline-none w-full text-foreground"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddSavings(goal)}
                      className="text-[10px] h-7 rounded-lg px-2"
                    >
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDepositGoalId(null);
                        setDepositAmount('');
                      }}
                      className="text-[10px] h-7 rounded-lg px-2"
                    >
                      X
                    </Button>
                  </div>
                ) : (
                  !isCompleted && (
                    <button
                      onClick={() => setDepositGoalId(goal.id)}
                      className="text-xs font-semibold text-primary hover:text-primary-foreground border border-primary/20 hover:bg-primary py-1.5 px-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-1 bg-primary/5 font-sans"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Depositar Economias
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
