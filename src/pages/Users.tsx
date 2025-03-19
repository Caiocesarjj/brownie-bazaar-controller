
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db, User } from '@/lib/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash, UserRound, Edit } from 'lucide-react';

const UserDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  userToEdit 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSave: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  userToEdit: User | null;
}) => {
  const [name, setName] = useState(userToEdit?.name || '');
  const [username, setUsername] = useState(userToEdit?.username || '');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      name,
      username,
      password: password || (userToEdit?.password || ''),
      role: 'user',
    });
    
    onOpenChange(false);
  };
  
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{userToEdit ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nome Completo
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do usuário"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Nome de Usuário
          </label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Login de acesso"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            {userToEdit ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={userToEdit ? "Nova senha (opcional)" : "Senha de acesso"}
            required={!userToEdit}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit">
            {userToEdit ? 'Salvar Alterações' : 'Criar Usuário'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

const Users = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(db.getUsers());
  
  // Redirecionar se não for admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  const handleDeleteUser = (userId: string) => {
    const deleted = db.deleteUser(userId);
    if (deleted) {
      setUsers(db.getUsers());
      toast({
        title: "Usuário removido",
        description: "O usuário foi excluído com sucesso.",
      });
    }
  };
  
  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setDialogOpen(true);
  };
  
  const handleAddUser = () => {
    setUserToEdit(null);
    setDialogOpen(true);
  };
  
  const handleSaveUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      if (userToEdit) {
        db.updateUser(userToEdit.id, userData);
        toast({
          title: "Usuário atualizado",
          description: `${userData.name} foi atualizado com sucesso.`,
        });
      } else {
        db.addUser(userData);
        toast({
          title: "Usuário adicionado",
          description: `${userData.name} foi adicionado com sucesso.`,
        });
      }
      setUsers(db.getUsers());
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    }
  };
  
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie contas de usuários para acesso ao sistema
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser}>
              <Plus size={16} className="mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          
          <UserDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSave={handleSaveUser}
            userToEdit={userToEdit}
          />
        </Dialog>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserRound size={20} className="text-primary" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              <CardTitle className="mt-3">{user.name}</CardTitle>
              <CardDescription>@{user.username}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Criado em {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Users;
