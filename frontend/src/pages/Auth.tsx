import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, User, ArrowRight, Wallet } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const { login, register, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-card rounded-[2rem] shadow-premium dark:shadow-premium-dark border border-border p-8 sm:p-10 transition-all duration-500 overflow-hidden relative">
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6 shadow-md">
             <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center text-foreground">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {isLogin ? 'Insira suas credenciais para acessar seu painel' : 'Comece a organizar suas finanças hoje mesmo'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive text-sm rounded-2xl border border-destructive/20 flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300 relative z-10">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {!isLogin && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <label className="text-sm font-medium text-foreground ml-1">Nome completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-muted/40 border border-border outline-none rounded-2xl text-sm transition-all focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  placeholder="Seu nome"
                />
              </div>
            </div>
          )}

          <div className="space-y-2 transition-all">
            <label className="text-sm font-medium text-foreground ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-muted/40 border border-border outline-none rounded-2xl text-sm transition-all focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="space-y-2 transition-all">
            <label className="text-sm font-medium text-foreground ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-muted/40 border border-border outline-none rounded-2xl text-sm transition-all focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isAuthLoading}
            className="w-full bg-primary text-primary-foreground py-4 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="font-semibold">{isLogin ? 'Entrar no sistema' : 'Criar conta gratuita'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <button
            type="button"
            onClick={toggleMode}
            disabled={isSubmitting}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium border-b border-transparent hover:border-foreground pb-0.5"
          >
            {isLogin ? 'Ainda não tem conta? Crie uma agora' : 'Já possui conta? Fazer login'}
          </button>
        </div>

      </div>
    </div>
  );
};
