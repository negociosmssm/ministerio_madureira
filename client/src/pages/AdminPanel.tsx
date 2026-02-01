import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminPanel() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("pregacoes");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  // Verificar autenticação ao carregar
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    const email = sessionStorage.getItem("adminEmail");

    if (!token || !email) {
      navigate("/painel-login");
      return;
    }

    setIsAuthenticated(true);
    setAdminEmail(email);
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminEmail");
    navigate("/painel-login");
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirecionar se não estiver autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-6">
            Você precisa fazer login para acessar esta área.
          </p>
          <Button onClick={() => navigate("/painel-login")} className="btn-primary">
            Ir para Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header do Admin */}
      <header className="bg-primary text-white py-4 shadow-lg">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Painel de Administrador</h1>
            <p className="text-white/80">Bem-vindo, {adminEmail.split('@')[0]}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/20 text-white hover:bg-white/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
          <p className="text-white/80 text-sm ml-4">Logado como: {adminEmail}</p>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pregacoes">Pregações</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="ebooks">Ebooks</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
            <TabsTrigger value="galeria">Galeria</TabsTrigger>
          </TabsList>

          {/* Pregações */}
          <TabsContent value="pregacoes" className="mt-6">
            <PregacoesTab />
          </TabsContent>

          {/* Podcasts */}
          <TabsContent value="podcasts" className="mt-6">
            <PodcastsTab />
          </TabsContent>

          {/* Ebooks */}
          <TabsContent value="ebooks" className="mt-6">
            <EbooksTab />
          </TabsContent>

          {/* Agenda */}
          <TabsContent value="agenda" className="mt-6">
            <AgendaTab />
          </TabsContent>

          {/* Galeria */}
          <TabsContent value="galeria" className="mt-6">
            <GaleriaTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Componente para Pregações
function PregacoesTab() {
  const { data: pregacoes = [] } = trpc.content.getPregacoes.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    url_video: "",
  });

  const createMutation = trpc.admin.createPregacao.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...formData,
        visivel: 1,
      });
      setFormData({ titulo: "", descricao: "", url_video: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao criar pregação:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pregações</h2>
        <Button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nova Pregação
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Título</label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg"
                placeholder="Título da pregação"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg"
                placeholder="Descrição da pregação"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                URL do Vídeo (YouTube)
              </label>
              <input
                type="url"
                required
                value={formData.url_video}
                onChange={(e) =>
                  setFormData({ ...formData, url_video: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg"
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="btn-primary"
              >
                {createMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
          <Button
            type="button"
            onClick={() => setShowForm(false)}
            variant="outline"
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {pregacoes.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma pregação cadastrada.</p>
        ) : (
          pregacoes.map((pregacao) => (
            <div key={pregacao.id} className="bg-card p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold">{pregacao.titulo}</h3>
                  <p className="text-sm text-muted-foreground">
                    {pregacao.descricao}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Componente para Podcasts
function PodcastsTab() {
  const { data: podcasts = [] } = trpc.content.getPodcasts.useQuery();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Podcasts</h2>
        <Button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Episódio
        </Button>
      </div>

      <div className="grid gap-4">
        {podcasts.length === 0 ? (
          <p className="text-muted-foreground">Nenhum episódio cadastrado.</p>
        ) : (
          podcasts.map((podcast) => (
            <div key={podcast.id} className="bg-card p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold">{podcast.titulo_episodio}</h3>
                  <p className="text-sm text-muted-foreground">
                    {podcast.descricao}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Componente para Ebooks
function EbooksTab() {
  const { data: ebooks = [] } = trpc.content.getEbooks.useQuery();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ebooks</h2>
        <Button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Ebook
        </Button>
      </div>

      <div className="grid gap-4">
        {ebooks.length === 0 ? (
          <p className="text-muted-foreground">Nenhum ebook cadastrado.</p>
        ) : (
          ebooks.map((ebook) => (
            <div key={ebook.id} className="bg-card p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold">{ebook.titulo}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ebook.sinopse}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-semibold">
                    {ebook.gratuito === 1 ? "Gratuito" : "Pago"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Componente para Agenda
function AgendaTab() {
  const { data: eventos = [] } = trpc.content.getEventos.useQuery();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Agenda de Eventos</h2>
        <Button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <div className="grid gap-4">
        {eventos.length === 0 ? (
          <p className="text-muted-foreground">Nenhum evento cadastrado.</p>
        ) : (
          eventos.map((evento) => (
            <div key={evento.id} className="bg-card p-4 rounded-lg border">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold">{evento.nome_evento}</h3>
                  <p className="text-sm text-muted-foreground">
                    {evento.local} -{" "}
                    {new Date(evento.data_evento).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Componente para Galeria
function GaleriaTab() {
  const { data: fotos = [] } = trpc.content.getFotos.useQuery();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Galeria de Fotos</h2>
        <Button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nova Foto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fotos.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma foto cadastrada.</p>
        ) : (
          fotos.map((foto) => (
            <div key={foto.id} className="bg-card rounded-lg overflow-hidden border">
              <img
                src={foto.url_foto}
                alt={foto.descricao_foto || "Foto"}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  {foto.descricao_foto}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
