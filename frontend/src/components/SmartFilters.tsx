import { Search, Filter, Calendar, Layers, X } from 'lucide-react';
import { Input } from './ui/input';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  selectedType: 'all' | 'income' | 'expense';
  onTypeChange: (value: 'all' | 'income' | 'expense') => void;
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function SmartFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedType,
  onTypeChange,
  selectedPeriod,
  onPeriodChange,
  onClearFilters,
  hasActiveFilters,
}: Props) {
  return (
    <div className="flex flex-col gap-4 w-full p-5 bg-card border border-border rounded-[2rem] shadow-sm mb-6 transition-all duration-300">
      
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
        {/* Busca por texto */}
        <div className="relative w-full lg:flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <Input 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por descrição ou categoria..." 
            className="pl-11 h-11 bg-muted/40 border-border/80 focus-visible:bg-transparent rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
          {/* Seletor de Categoria */}
          <div className="relative w-full sm:w-48 flex items-center">
            <Filter className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/80 bg-muted/40 px-10 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-card appearance-none font-medium"
            >
              <option value="">Todas Categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Seletor de Tipo */}
          <div className="relative w-full sm:w-44 flex items-center">
            <Layers className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value as any)}
              className="flex h-11 w-full rounded-xl border border-border/80 bg-muted/40 px-10 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-card appearance-none font-medium"
            >
              <option value="all">Todos Tipos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Seletor de Período */}
          <div className="relative w-full sm:w-44 flex items-center">
            <Calendar className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/80 bg-muted/40 px-10 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-card appearance-none font-medium"
            >
              <option value="all">Todo Período</option>
              <option value="7days">Últimos 7 dias</option>
              <option value="30days">Últimos 30 dias</option>
              <option value="month">Este Mês</option>
              <option value="year">Este Ano</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Badges de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground font-semibold mr-1">Filtros ativos:</span>
          
          {searchTerm && (
            <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
              Busca: "{searchTerm}"
              <button onClick={() => onSearchChange('')} className="hover:text-destructive text-muted-foreground"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedCategory && (
            <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
              Cat: {selectedCategory}
              <button onClick={() => onCategoryChange('')} className="hover:text-destructive text-muted-foreground"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedType !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
              Tipo: {selectedType === 'income' ? 'Receitas' : 'Despesas'}
              <button onClick={() => onTypeChange('all')} className="hover:text-destructive text-muted-foreground"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedPeriod !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
              Período: {
                selectedPeriod === '7days' ? '7 dias' :
                selectedPeriod === '30days' ? '30 dias' :
                selectedPeriod === 'month' ? 'Este Mês' : 'Este Ano'
              }
              <button onClick={() => onPeriodChange('all')} className="hover:text-destructive text-muted-foreground"><X className="w-3 h-3" /></button>
            </span>
          )}

          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-primary hover:underline ml-auto"
          >
            Limpar todos
          </button>
        </div>
      )}

    </div>
  );
}
