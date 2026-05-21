import { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';
import api from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: Props) {
  const { addTransaction, isLoading } = useTransactions();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [existingCategories, setExistingCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const response = await api.get('/categories');
          setExistingCategories(response.data);
        } catch (error) {
          console.error('Erro ao buscar categorias para autocompletar:', error);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;
    
    await addTransaction({
      description,
      amount: Number(amount),
      category,
      date: new Date().toISOString(),
      type,
    });
    
    // Reset Form
    setDescription('');
    setAmount('');
    setCategory('');
    setType('expense');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay (Solid without blur as per rules) */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden shadow-black/10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Nova Transação</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="flex bg-muted p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${type === 'expense' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${type === 'income' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'}`}
            >
              Receita
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Descrição</label>
              <Input 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex: Salário Mensal..."
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Valor (R$)</label>
              <Input 
                type="number"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Categoria</label>
              <Input 
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Ex: Alimentação"
                list="categories-suggestions"
                required
              />
              <datalist id="categories-suggestions">
                {existingCategories.map(cat => (
                  <option key={cat.id} value={cat.name} />
                ))}
              </datalist>
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Adicionar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
