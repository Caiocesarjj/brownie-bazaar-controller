
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Database, Server, FileText } from 'lucide-react';
import { setDatabaseProvider } from '@/lib/database/index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DatabaseSettings = () => {
  const [dbProvider, setDbProvider] = useState<'memory' | 'http'>(
    (localStorage.getItem('dbProvider') as 'memory' | 'http') || 'memory'
  );
  const [apiUrl, setApiUrl] = useState(
    localStorage.getItem('apiUrl') || 'http://localhost:5000/api'
  );
  
  const handleSaveSettings = () => {
    try {
      setDatabaseProvider(dbProvider, { apiUrl });
      toast({
        title: "Configurações salvas",
        description: "As configurações do banco de dados foram atualizadas. A aplicação usará o novo provedor após recarregar.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações do banco de dados.",
        variant: "destructive",
      });
    }
  };
  
  const downloadCSharpApiTemplate = () => {
    // Aqui você pode implementar a lógica para baixar um modelo de projeto C# ASP.NET Core
    // Por enquanto, apenas mostramos uma mensagem
    toast({
      title: "Função em desenvolvimento",
      description: "O download do modelo de API C# estará disponível em breve.",
    });
  };
  
  return (
    <Tabs defaultValue="connection" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="connection">Conexão</TabsTrigger>
        <TabsTrigger value="csharp">Integração C#</TabsTrigger>
      </TabsList>
      
      <TabsContent value="connection">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Configurações do Banco de Dados</CardTitle>
            </div>
            <CardDescription>
              Configure o provedor de dados que será utilizado pela aplicação.
              Mudanças podem causar perda de dados não sincronizados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dbProvider">Provedor de Banco de Dados</Label>
                <RadioGroup
                  value={dbProvider}
                  onValueChange={(value) => setDbProvider(value as 'memory' | 'http')}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
                >
                  <div className="flex items-start space-x-3 space-y-0 rounded-md border border-input p-3">
                    <RadioGroupItem value="memory" id="memory" />
                    <div className="space-y-1">
                      <Label htmlFor="memory" className="font-medium">Em Memória</Label>
                      <p className="text-sm text-muted-foreground leading-snug">
                        Armazena dados apenas na memória do navegador. Os dados são perdidos ao recarregar a página.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-y-0 rounded-md border border-input p-3">
                    <RadioGroupItem value="http" id="http" />
                    <div className="space-y-1">
                      <Label htmlFor="http" className="font-medium">API C# ASP.NET</Label>
                      <p className="text-sm text-muted-foreground leading-snug">
                        Conecta a uma API ASP.NET Core que pode usar SQL Server, PostgreSQL ou outra base de dados.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              {dbProvider === 'http' && (
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">URL da API C#</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="apiUrl"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="http://localhost:5000/api"
                        className="pl-9"
                      />
                      <Server className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <Button variant="outline" type="button" onClick={() => setApiUrl('http://localhost:5000/api')}>
                      Padrão
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    URL base da API C# ASP.NET Core que fornecerá os dados para a aplicação.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Salvar Configurações
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="csharp">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Integração com C# ASP.NET</CardTitle>
            </div>
            <CardDescription>
              Informações sobre como integrar esta aplicação React com um backend C# ASP.NET Core.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 border border-muted rounded-md bg-muted/10 space-y-3">
                <h3 className="font-medium">Instruções para Integração</h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-5">
                  <li>Crie uma API ASP.NET Core usando C# com os mesmos endpoints esperados por este frontend.</li>
                  <li>Configure o CORS na sua API para permitir requisições deste frontend.</li>
                  <li>Implemente autenticação JWT para proteger seus endpoints.</li>
                  <li>Configure sua base de dados (SQL Server, PostgreSQL, etc) no backend C#.</li>
                  <li>Implemente as rotas de exportação de relatórios PDF e Excel.</li>
                </ol>
              </div>
              
              <div className="p-4 border border-muted rounded-md bg-muted/10">
                <h3 className="font-medium mb-3">Endpoints Principais</h3>
                <div className="text-sm text-muted-foreground font-mono bg-background p-3 rounded border overflow-auto">
                  <p>GET /api/clients</p>
                  <p>GET, PUT, DELETE /api/clients/{'{id}'}</p>
                  <p>POST /api/clients</p>
                  <p>--</p>
                  <p>GET /api/products</p>
                  <p>GET, PUT, DELETE /api/products/{'{id}'}</p>
                  <p>POST /api/products</p>
                  <p>--</p>
                  <p>POST /api/auth/login</p>
                  <p>--</p>
                  <p>GET /api/reports/{'{reportType}'}/pdf</p>
                  <p>GET /api/reports/{'{reportType}'}/excel</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button onClick={downloadCSharpApiTemplate} className="w-full md:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  Download Modelo API C#
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DatabaseSettings;
