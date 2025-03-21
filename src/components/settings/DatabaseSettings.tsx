
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Database, Server } from 'lucide-react';
import { setDatabaseProvider } from '@/lib/database/index';

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
  
  return (
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
                  <Label htmlFor="http" className="font-medium">API HTTP (C#)</Label>
                  <p className="text-sm text-muted-foreground leading-snug">
                    Conecta a uma API HTTP externa, como uma API C# ASP.NET Core.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          {dbProvider === 'http' && (
            <div className="space-y-2">
              <Label htmlFor="apiUrl">URL da API</Label>
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
                URL base da API C# que fornecerá os dados para a aplicação.
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
  );
};

export default DatabaseSettings;
