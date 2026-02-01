import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";

export function PodcastsTab() {
  const { data: podcasts = [], refetch } = trpc.content.getPodcasts.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titulo_episodio: "",
    descricao: "",
    url_embed: "",
  });

  const createMutation = trpc.admin.createPodcast.useMutation();
  const updateMutation = trpc.admin.updatePodcast.useMutation();
  const deleteMutation = trpc.admin.deletePodcast.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync({
          ...formData,
          visivel: 1,
        });
      }

      setFormData({ titulo_episodio: "", descricao: "", url_embed: "" });
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleEdit = (podcast: any) => {
    setFormData({
      titulo_episodio: podcast.titulo_episodio,
      descricao: podcast.descricao || "",
      url_embed: podcast.url_embed,
    });
    setEditingId(podcast.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este episódio?")) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Podcasts</h2>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({ titulo_episodio: "", descricao: "", url_embed: "" });
            setShowForm(!showForm);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Episódio
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Título do Episódio
              </label>
              <input
                type="text"
                required
                value={formData.titulo_episodio}
                onChange={(e) =>
                  setFormData({ ...formData, titulo_episodio: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg"
                placeholder="Ex: Ep. 15: Respondendo Dúvidas Sobre Oração"
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
                placeholder="Descrição do episódio"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                URL de Embed (Spotify/Apple Podcasts)
              </label>
              <input
                type="url"
                required
                value={formData.url_embed}
                onChange={(e) =>
                  setFormData({ ...formData, url_embed: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg"
                placeholder="https://open.spotify.com/embed/episode/..."
              />
            </div>
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="btn-primary"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Salvando..."
                  : editingId
                    ? "Atualizar"
                    : "Salvar"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      )}

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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(podcast)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() => handleDelete(podcast.id)}
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
