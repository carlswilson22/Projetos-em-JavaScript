import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Camera, Mail, User as UserIcon, LogOut } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile({ name, email });
      addToast('Perfil atualizado com sucesso!', 'success');
    } catch (error: any) {
      addToast(error.message || 'Erro ao atualizar o perfil.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limite de 1.5MB para evitar lentidão no banco
    if (file.size > 1.5 * 1024 * 1024) {
      addToast('A imagem de perfil deve ter no máximo 1.5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        setIsSaving(true);
        await updateProfile({ avatar: base64String });
        addToast('Foto de perfil atualizada com sucesso!', 'success');
      } catch (error: any) {
        addToast(error.message || 'Erro ao atualizar foto de perfil.', 'error');
      } finally {
        setIsSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seu Perfil</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Gerencie suas informações pessoais e credenciais</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/30 rounded-2xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sair da conta</span>
          <span className="sm:hidden">Sair</span>
        </button>
      </div>

      <div className="bg-card rounded-[2rem] p-8 md:p-12 shadow-premium dark:shadow-premium-dark border border-border relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-12 relative z-10">

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-5">
            <div
              className="relative group cursor-pointer"
              onClick={handleAvatarClick}
              title="Mudar foto de perfil"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted flex items-center justify-center overflow-hidden border-[6px] border-card shadow-xl group-hover:border-muted transition-all duration-300 relative z-10">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {initial}
                  </span>
                )}
              </div>
              <div className="absolute bottom-1 right-1 p-3 bg-foreground text-background rounded-full shadow-lg transform group-hover:scale-110 transition-transform z-20">
                <Camera className="w-5 h-5 text-background" />
              </div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="text-center">
              <div className="text-xs font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                Membro desde {user.memberSince || 'esse mês'}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 mt-2">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-foreground ml-1">Nome de exibição</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-muted/40 border border-border outline-none rounded-2xl text-sm transition-all focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                    placeholder="Como você prefere ser chamado"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-foreground ml-1">Endereço de e-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
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

              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving || (name === user.name && email === user.email)}
                  className="bg-foreground text-background px-8 py-4 rounded-2xl font-semibold text-sm transition-all hover:bg-foreground/90 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:hover:shadow-md"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-[2.5px] border-background border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  {isSaving ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
