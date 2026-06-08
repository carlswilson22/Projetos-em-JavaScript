export function formatCurrency(value: number, overrideCurrency?: string): string {
  const currency = overrideCurrency || localStorage.getItem('@FinanceApp:currency') || 'BRL';
  
  if (currency === 'BIT' || currency === 'BTC') {
    return `₿ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 6, maximumFractionDigits: 8 })}`;
  }
  
  const configs: Record<string, { locale: string; currency: string }> = {
    BRL: { locale: 'pt-BR', currency: 'BRL' },
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'de-DE', currency: 'EUR' }
  };
  const config = configs[currency] || configs.BRL;
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(value);
}

export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(isoString));
}
