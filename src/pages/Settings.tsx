
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image } from 'lucide-react';

const Settings = () => {
  const [logo, setLogo] = useState<string | null>(localStorage.getItem('companyLogo'));
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName') || 'Minha Empresa de Brownies');
  const [companyDescription, setCompanyDescription] = useState(
    localStorage.getItem('companyDescription') || 'Brownies artesanais para todos os gostos'
  );

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogo(result);
        localStorage.setItem('companyLogo', result);
        toast({
          title: "Logo atualizada",
          description: "A logo da empresa foi atualizada com sucesso.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCompanyInfo = () => {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('companyDescription', companyDescription);
    toast({
      title: "Informações salvas",
      description: "As informações da empresa foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-2">
            Personalize as configurações do seu sistema de brownies.
          </p>
        </motion.div>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          </TabsList>
          
          <TabsContent value="geral">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-6">
                <CardHeader>
                  <CardTitle>Informações da Empresa</CardTitle>
                  <CardDescription>
                    Configure as informações básicas da sua empresa.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Empresa</Label>
                    <Input 
                      id="name" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveCompanyInfo}>Salvar Alterações</Button>
                </CardFooter>
              </GlassCard>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="aparencia">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-6">
                <CardHeader>
                  <CardTitle>Logo da Empresa</CardTitle>
                  <CardDescription>
                    Faça o upload da logo da sua empresa.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center gap-6">
                    <div className="border rounded-lg p-2 w-48 h-48 flex items-center justify-center bg-background">
                      {logo ? (
                        <img 
                          src={logo} 
                          alt="Logo da empresa" 
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground">
                          <Image size={48} />
                          <span className="text-sm mt-2">Sem logo</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <Label 
                        htmlFor="logo-upload" 
                        className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors"
                      >
                        <Upload size={16} />
                        <span>Upload da Logo</span>
                      </Label>
                      <Input 
                        id="logo-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      
                      {logo && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setLogo(null);
                            localStorage.removeItem('companyLogo');
                            toast({
                              title: "Logo removida",
                              description: "A logo da empresa foi removida com sucesso.",
                            });
                          }}
                        >
                          Remover Logo
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
