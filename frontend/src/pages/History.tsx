import { useState, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { SmartFilters } from '../components/SmartFilters';
import { formatCurrency, formatDate } from '../lib/format';
import { ArrowDownRight, ArrowUpRight, Trash2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export function History() {
  const { transactions, deleteTransaction, isLoading } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(t => selectedCategory === '' || t.category === selectedCategory)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, selectedCategory]);

  return (
    <>
      <header className="flex flex-col w-full mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Extrato Completo</h2>
        <p className="text-sm text-muted-foreground mt-1">Busque e filtre todo o seu histórico financeiro.</p>
      </header>

      <SmartFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <section className="flex flex-col gap-2 w-full max-w-4xl">
        {filteredTransactions.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-12 mt-4 text-center bg-transparent border border-dashed border-border rounded-3xl min-h-[200px]">
             <span className="text-muted-foreground">Nenhuma transação encontrada com estes filtros.</span>
           </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            return (
              <div 
                key={transaction.id} 
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 px-5 rounded-2xl bg-white border border-border hover:shadow-sm hover:border-accent transition-all duration-200"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isIncome ? 'bg-success/5 text-success' : 'bg-destructive/5 text-destructive'}`}>
                    {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex flex-col flex-1 gap-1">
                    <div className="flex justify-between w-full">
                      <span className="font-semibold text-foreground">{transaction.description}</span>
                      <span className={`font-semibold tabular-nums ${isIncome ? 'text-success' : 'text-foreground'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium">
                        {transaction.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteTransaction(transaction.id)}
                  disabled={isLoading}
                  className="opacity-0 group-hover:opacity-100 sm:ml-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all self-end sm:self-auto disabled:opacity-50 mt-2 sm:mt-0"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
        
        {isLoading && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 px-5 rounded-2xl bg-white border border-border opacity-50 mt-2">
             <div className="flex items-center gap-4 w-full">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex flex-col flex-1 gap-2">
                   <div className="flex justify-between w-full">
                      <Skeleton className="w-32 h-5" />
                      <Skeleton className="w-24 h-5" />
                   </div>
                   <Skeleton className="w-20 h-4" />
                </div>
             </div>
          </div>
        )}
      </section>
    </>
  );
}
