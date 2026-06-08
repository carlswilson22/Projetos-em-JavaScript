import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, List, Settings, HelpCircle, BarChart3, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AppLayout = () => {
  const { user } = useAuth();
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-background font-sans text-foreground transition-colors duration-300">
      
      {/* Sidebar para desktop */}
      <nav className="hidden md:flex flex-col items-center justify-between w-20 py-8 border-r border-border bg-card sticky top-0 h-screen flex-shrink-0 z-20">
        <div className="flex flex-col items-center gap-8 w-full">
          <NavLink 
            to="/profile"
            className={({ isActive }) => `w-10 h-10 rounded-2xl flex items-center justify-center font-bold font-sans text-lg cursor-pointer flex-shrink-0 transition-all duration-300 overflow-hidden ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : 'hover:scale-105'}`}
            title="Perfil"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {initial}
              </div>
            )}
          </NavLink>
          
          <div className="flex flex-col gap-6 w-full items-center">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `p-3 rounded-2xl transition-colors ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
              title="Dashboard"
            >
              <LayoutGrid className="w-5 h-5" />
            </NavLink>

            <NavLink 
              to="/relatorios" 
              className={({ isActive }) => `p-3 rounded-2xl transition-colors ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
              title="Relatórios"
            >
              <BarChart3 className="w-5 h-5" />
            </NavLink>
            
            <NavLink 
              to="/historico" 
              className={({ isActive }) => `p-3 rounded-2xl transition-colors ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
              title="Extrato Completo"
            >
              <List className="w-5 h-5" />
            </NavLink>
          </div>
        </div>
        
        <div className="flex flex-col gap-6 text-muted-foreground items-center">
          <button className="p-3 hover:bg-muted/50 hover:text-foreground rounded-2xl transition-colors" title="Ajuda">
            <HelpCircle className="w-5 h-5" />
          </button>
          <NavLink 
            to="/settings"
            className={({ isActive }) => `p-3 rounded-2xl transition-colors ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </NavLink>
        </div>
      </nav>

      {/* Navegação Mobile Inferior (Bottom Navigation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center py-2 px-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Painel</span>
        </NavLink>

        <NavLink 
          to="/relatorios" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Análises</span>
        </NavLink>

        <NavLink 
          to="/historico" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <List className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Extrato</span>
        </NavLink>

        <NavLink 
          to="/settings" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">Config</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover border border-border" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] font-medium mt-1">Perfil</span>
        </NavLink>
      </nav>

      {/* Main Content Stream */}
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 md:p-12 pb-24 md:pb-12 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
