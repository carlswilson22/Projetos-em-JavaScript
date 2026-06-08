import { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../lib/format';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: Props) {
  const { addTransaction, isLoading } = useTransactions();
  const { addToast } = useToast();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [existingCategories, setExistingCategories] = useState<{ id: string; name: string }[]>([]);

  // Estados de Moeda
  const defaultCurrency = localStorage.getItem('@FinanceApp:currency') || 'BRL';
  const [currency, setCurrency] = useState(defaultCurrency);
  const [exchangeRate, setExchangeRate] = useState('1');
  const [originalAmount, setOriginalAmount] = useState('');
  const [isFetchingRate, setIsFetchingRate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Sincroniza com a moeda do sistema atualizada
      const currentDefault = localStorage.getItem('@FinanceApp:currency') || 'BRL';
      setCurrency(currentDefault);
      setExchangeRate('1');
      setOriginalAmount('');

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

  // Busca cotação ao alterar moeda original
  useEffect(() => {
    if (currency === defaultCurrency) {
      setExchangeRate('1');
      return;
    }

    const loadRate = async () => {
      setIsFetchingRate(true);
      try {
        const apiCurrency = currency === 'BIT' ? 'BTC' : currency;
        const response = await fetch(`https://economia.awesomeapi.com.br/json/last/${apiCurrency}-${defaultCurrency}`);
        if (response.ok) {
          const data = await response.json();
          const pair = `${apiCurrency}${defaultCurrency}`;
          if (data[pair] && data[pair].bid) {
            const rate = parseFloat(data[pair].bid).toFixed(4);
            setExchangeRate(rate);
            addToast(`Cotação atualizada: 1 ${currency} = ${parseFloat(rate).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ${defaultCurrency}`, 'info');
          }
        } else {
          // Fallback para principais pares de câmbio
          let rate = '1';
          if (currency === 'USD' && defaultCurrency === 'BRL') rate = '5.50';
          else if (currency === 'EUR' && defaultCurrency === 'BRL') rate = '6.00';
          else if (currency === 'BIT' && defaultCurrency === 'BRL') rate = '380000.00';
          else if (currency === 'BIT' && defaultCurrency === 'USD') rate = '68000.00';
          else if (currency === 'BRL' && defaultCurrency === 'USD') rate = '0.18';
          else if (currency === 'BRL' && defaultCurrency === 'EUR') rate = '0.16';
          setExchangeRate(rate);
          addToast('Não foi possível obter a cotação automática. Cotação aproximada definida.', 'warning');
        }
      } catch (err) {
        console.error(err);
        let rate = '1';
        if (currency === 'USD' && defaultCurrency === 'BRL') rate = '5.50';
        else if (currency === 'EUR' && defaultCurrency === 'BRL') rate = '6.00';
        else if (currency === 'BIT' && defaultCurrency === 'BRL') rate = '380000.00';
        else if (currency === 'BIT' && defaultCurrency === 'USD') rate = '68000.00';
        setExchangeRate(rate);
        addToast('Erro de conexão com serviço de cotações. Cotação aproximada definida.', 'warning');
      } finally {
        setIsFetchingRate(false);
      }
    };

    loadRate();
  }, [currency, defaultCurrency, addToast]);

  // ESC key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !originalAmount || !category) return;

    const calculatedAmount = Number(originalAmount) * Number(exchangeRate);
    
    try {
      await addTransaction({
        description,
        amount: calculatedAmount,
        category,
        date: new Date().toISOString(),
        type,
        currency,
        exchangeRate: Number(exchangeRate)
      });
      
      addToast('Transação adicionada com sucesso!', 'success');
      
      // Reset Form
      setDescription('');
      setOriginalAmount('');
      setCategory('');
      setCurrency(defaultCurrency);
      setExchangeRate('1');
      setType('expense');
      onClose();
    } catch (error) {
      addToast('Erro ao adicionar transação.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay (Solid without blur as per rules) */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative bg-card text-card-foreground w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${type === 'expense' ? 'bg-card shadow-sm text-foreground font-semibold' : 'text-muted-foreground'}`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${type === 'income' ? 'bg-card shadow-sm text-foreground font-semibold' : 'text-muted-foreground'}`}
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
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 col-span-1">
                <label className="text-sm font-semibold text-foreground">Moeda</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground cursor-pointer"
                >
                  <option value="BRL">BRL (R$)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="BIT">BIT (₿)</option>
                </select>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-semibold text-foreground">Valor Original</label>
                <Input 
                  type="number"
                  step="0.01"
                  value={originalAmount}
                  onChange={e => setOriginalAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {currency !== defaultCurrency && (
              <div className="p-4 rounded-2xl bg-muted/30 border border-border flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Taxa de Câmbio</label>
                  {isFetchingRate && (
                    <span className="text-[10px] text-primary animate-pulse font-medium">Buscando cotação...</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    step="0.0001"
                    value={exchangeRate}
                    onChange={e => setExchangeRate(e.target.value)}
                    placeholder="Ex: 5.50"
                    required
                  />
                  <div className="flex items-center justify-center px-3 bg-card border border-border rounded-xl text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    1 {currency} = {Number(exchangeRate).toFixed(2)} {defaultCurrency}
                  </div>
                </div>
                {originalAmount && Number(originalAmount) > 0 && (
                  <div className="text-xs text-foreground font-medium flex items-center justify-between border-t border-border/40 pt-2.5 mt-0.5">
                    <span>Equivale a:</span>
                    <span className="font-bold text-sm text-primary">
                      {formatCurrency(Number(originalAmount) * Number(exchangeRate))}
                    </span>
                  </div>
                )}
              </div>
            )}
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
