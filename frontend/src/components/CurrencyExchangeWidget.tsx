import React, { useState, useEffect, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../lib/format';
import { ArrowLeftRight, Coins } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../context/ToastContext';

export function CurrencyExchangeWidget() {
  const { transactions, addTransaction, isLoading } = useTransactions();
  const { addToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState<'balances' | 'exchange'>('balances');

  // Cotações em tempo real (AwesomeAPI)
  const [usdRate, setUsdRate] = useState(5.50);
  const [bitRate, setBitRate] = useState(380000.00);
  const [isFetchingRates, setIsFetchingRates] = useState(false);

  // Estados do formulário de câmbio
  const [fromCurrency, setFromCurrency] = useState<'BRL' | 'USD' | 'BIT'>('BRL');
  const [toCurrency, setToCurrency] = useState<'BRL' | 'USD' | 'BIT'>('USD');
  const [fromAmount, setFromAmount] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // Carrega cotações reais da AwesomeAPI
  useEffect(() => {
    const fetchRates = async () => {
      setIsFetchingRates(true);
      try {
        const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,BTC-BRL');
        if (response.ok) {
          const data = await response.json();
          if (data.USDBRL && data.USDBRL.bid) {
            setUsdRate(parseFloat(data.USDBRL.bid));
          }
          if (data.BTCBRL && data.BTCBRL.bid) {
            setBitRate(parseFloat(data.BTCBRL.bid));
          }
        }
      } catch (error) {
        console.error('Erro ao buscar cotações em tempo real:', error);
        // Fallbacks mockados já estão ativos
      } finally {
        setIsFetchingRates(false);
      }
    };

    fetchRates();
    // Atualiza a cada 60 segundos
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calcular os saldos isolados
  const balances = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        const defaultCurrency = localStorage.getItem('@FinanceApp:currency') || 'BRL';
        const isBrl = !t.currency || t.currency === 'BRL';
        const isUsd = t.currency === 'USD';
        const isBit = t.currency === 'BIT' || t.currency === 'BTC';

        const originalValue = (t.currency && t.currency !== defaultCurrency && t.exchangeRate)
          ? t.amount / t.exchangeRate
          : t.amount;

        const isIncome = t.type === 'income';

        if (isBrl) {
          acc.BRL += isIncome ? originalValue : -originalValue;
        } else if (isUsd) {
          acc.USD += isIncome ? originalValue : -originalValue;
        } else if (isBit) {
          acc.BIT += isIncome ? originalValue : -originalValue;
        }
        return acc;
      },
      { BRL: 0, USD: 0, BIT: 0 }
    );
  }, [transactions]);

  // Taxa de câmbio cruzada calculada para conversão
  const currentCrossRate = useMemo(() => {
    if (fromCurrency === toCurrency) return 1.0;

    // BRL -> Outras
    if (fromCurrency === 'BRL') {
      if (toCurrency === 'USD') return 1 / usdRate;
      if (toCurrency === 'BIT') return 1 / bitRate;
    }
    // USD -> Outras
    if (fromCurrency === 'USD') {
      if (toCurrency === 'BRL') return usdRate;
      if (toCurrency === 'BIT') return usdRate / bitRate;
    }
    // BIT -> Outras
    if (fromCurrency === 'BIT') {
      if (toCurrency === 'BRL') return bitRate;
      if (toCurrency === 'USD') return bitRate / usdRate;
    }
    return 1.0;
  }, [fromCurrency, toCurrency, usdRate, bitRate]);

  // Valor calculado de destino
  const toAmount = useMemo(() => {
    if (!fromAmount || isNaN(Number(fromAmount))) return 0;
    return Number(fromAmount) * currentCrossRate;
  }, [fromAmount, currentCrossRate]);

  // Executar a conversão (criação automática de 2 transações de contrapartida)
  const handlePerformExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(fromAmount);
    if (!fromAmount || isNaN(value) || value <= 0) return;

    // Verificar se possui saldo suficiente na moeda de origem
    const availableBalance = balances[fromCurrency];
    if (value > availableBalance) {
      addToast(`Saldo insuficiente em ${fromCurrency} para realizar a conversão.`, 'error');
      return;
    }

    setIsConverting(true);
    try {
      // 1. Calcular o valor equivalente na moeda do sistema (BRL) para guardar no amount
      let amountInSystemCurrencyFrom = value;
      if (fromCurrency === 'USD') amountInSystemCurrencyFrom = value * usdRate;
      else if (fromCurrency === 'BIT') amountInSystemCurrencyFrom = value * bitRate;

      let amountInSystemCurrencyTo = toAmount;
      if (toCurrency === 'USD') amountInSystemCurrencyTo = toAmount * usdRate;
      else if (toCurrency === 'BIT') amountInSystemCurrencyTo = toAmount * bitRate;

      // 2. Criar a Despesa (Saída da moeda origem)
      await addTransaction({
        description: `Conversão de ${fromCurrency} para ${toCurrency}`,
        amount: amountInSystemCurrencyFrom,
        category: 'Câmbio/Conversão',
        date: new Date().toISOString(),
        type: 'expense',
        currency: fromCurrency,
        exchangeRate: fromCurrency === 'BRL' ? 1.0 : (fromCurrency === 'USD' ? usdRate : bitRate)
      });

      // 3. Criar a Receita (Entrada na moeda destino)
      await addTransaction({
        description: `Conversão de ${fromCurrency} para ${toCurrency}`,
        amount: amountInSystemCurrencyTo,
        category: 'Câmbio/Conversão',
        date: new Date().toISOString(),
        type: 'income',
        currency: toCurrency,
        exchangeRate: toCurrency === 'BRL' ? 1.0 : (toCurrency === 'USD' ? usdRate : bitRate)
      });

      addToast(`Conversão realizada com sucesso! ${formatCurrency(value, fromCurrency)} convertido em ${formatCurrency(toAmount, toCurrency)}.`, 'success');
      setFromAmount('');
    } catch (error) {
      addToast('Erro ao processar a conversão.', 'error');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col bg-card border border-border rounded-[2.5rem] p-6 shadow-premium dark:shadow-premium-dark transition-all duration-300 w-full h-[400px]">
      {/* Cabeçalho do Widget */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-bold font-sans tracking-tight text-foreground flex items-center gap-2">
          <Coins className="w-5 h-5 text-primary animate-pulse" />
          Cotações & Carteiras
        </h3>
        {isFetchingRates && (
          <span className="text-[10px] text-muted-foreground animate-pulse">Atualizando cotações...</span>
        )}
      </div>

      {/* Tabs Internas */}
      <div className="flex bg-muted p-1 rounded-2xl mb-4 flex-shrink-0">
        <button
          onClick={() => setActiveSubTab('balances')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${activeSubTab === 'balances' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Minhas Carteiras
        </button>
        <button
          onClick={() => setActiveSubTab('exchange')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${activeSubTab === 'exchange' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Câmbio Rápido
        </button>
      </div>

      {/* Conteúdo dinâmico das sub-tabs */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeSubTab === 'balances' ? (
          <div className="flex flex-col gap-4">
            {/* Cotações Atuais */}
            <div className="grid grid-cols-2 gap-3 bg-muted/40 border border-border/60 p-3 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Dólar Comercial</span>
                <span className="text-sm font-bold text-foreground mt-0.5">
                  {formatCurrency(usdRate, 'BRL')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Bitcoin (BTC)</span>
                <span className="text-sm font-bold text-foreground mt-0.5">
                  {formatCurrency(bitRate, 'BRL')}
                </span>
              </div>
            </div>

            {/* Saldos das Carteiras */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between p-3 px-4 bg-card border border-border/80 rounded-2xl hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                    BRL
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">Real Brasileiro</span>
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {formatCurrency(balances.BRL, 'BRL')}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 px-4 bg-card border border-border/80 rounded-2xl hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                    USD
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">Dólar Americano</span>
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {formatCurrency(balances.USD, 'USD')}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 px-4 bg-card border border-border/80 rounded-2xl hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                    BIT
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">Bitcoin Cripto</span>
                </div>
                <span className="text-sm font-bold text-foreground tabular-nums">
                  {formatCurrency(balances.BIT, 'BIT')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePerformExchange} className="flex flex-col gap-3.5">
            {/* Moeda Origem -> Moeda Destino */}
            <div className="flex items-center gap-3 bg-muted/30 p-2 border border-border rounded-2xl">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as any)}
                className="flex-1 h-9 rounded-xl border border-border bg-card px-2 text-xs font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="BRL">Origem: BRL</option>
                <option value="USD">Origem: USD</option>
                <option value="BIT">Origem: BIT</option>
              </select>
              <ArrowLeftRight className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as any)}
                className="flex-1 h-9 rounded-xl border border-border bg-card px-2 text-xs font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="BRL">Destino: BRL</option>
                <option value="USD">Destino: USD</option>
                <option value="BIT">Destino: BIT</option>
              </select>
            </div>

            {/* Input valor origem */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Valor de Venda ({fromCurrency})</label>
              <Input
                type="number"
                step="any"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder={`Saldo disponível: ${balances[fromCurrency].toLocaleString('pt-BR', { maximumFractionDigits: 6 })}`}
                required
              />
            </div>

            {/* Resultado pré-calculado */}
            {fromAmount && Number(fromAmount) > 0 && fromCurrency !== toCurrency && (
              <div className="p-3 bg-muted/40 border border-border/80 rounded-2xl flex flex-col gap-1.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Cotação Aplicada:</span>
                  <span className="font-semibold text-foreground">
                    1 {fromCurrency} = {currentCrossRate.toLocaleString('pt-BR', { maximumFractionDigits: 6 })} {toCurrency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-border/40 pt-1.5 mt-0.5">
                  <span className="font-medium text-foreground">Você receberá:</span>
                  <span className="font-bold text-sm text-primary">
                    {formatCurrency(toAmount, toCurrency)}
                  </span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="sm"
              className="w-full mt-1.5 rounded-xl h-10 text-xs font-bold"
              disabled={isLoading || isConverting || fromCurrency === toCurrency || !fromAmount}
            >
              {isConverting ? 'Processando câmbio...' : 'Confirmar Conversão'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
