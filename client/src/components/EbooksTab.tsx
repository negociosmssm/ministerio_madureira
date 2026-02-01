import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";

export function EbooksTab() {
  const { data: ebooks = [], refetch } = trpc.content.getEbooks.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    sinopse: "",
    url_capa: "",
    gratuito: 1,
    url_arquivo: "",
  });

  const createMutation = trpc.admin.createEbook.useMutation();
  const updateMutation = trpc.admin.updateEbook.useMutation();
  const deleteMutation = trpc.admin.deleteEbook.useMutation();

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

      setFormData({
        titulo: "",
        sinopse: "",
        url_capa: "",
        gratuito: 1,
        url_arquivo: "",
      });
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleEdit = (ebook: any) => {
    setFormData({
      titulo: ebook.titulo,
      sinopse: ebook.sinopse || "",
      url_capa: ebook.url_capa,
      gratuito: ebook.gratuito,
      url_arquivo: ebook.url_arquivo || "",
    });
    setEditingId(ebook.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este ebook?")) {
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
        <h2 className="text-2xl font-bold">Ebooks</h2>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({
              titulo: "",
              sinopse: "",
              url_capa: "",
              gratuito: 1,
              url_arquivo: "",
            });
            setShowForm(!showForm);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Ebook
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
                placeholder="Título do ebook"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Sinopse
              </label>
              <textarea
                value={formData.sinopse}
                onChange={(e) =>
                  setFormData({ ...formData, sinopse: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg"
                placeholder="Descrição do ebook"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                URL da Capa
              </label>
              <input
                type="url"
                required
                value={formData.url_capa}
                onChange={(e) =>
                  setFormData({ ...formData, url_capa: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Tipo</label>
              <select
                value={formData.gratuito}
                onChange={(e) =>
                  setFormData({ ...formData, gratuito: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-border rounded-lg"
              >
                <option value={1}>Gratuito</option>
                <option value={0}>Pago</option>
              </select>
            </div>
            {formData.gratuito === 1 && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  URL do PDF (Gratuito)
                </label>
                <input
                  type="url"
                  value={formData.url_arquivo}
                  onChange={(e) =>
                    setFormData({ ...formData, url_arquivo: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg"
                  placeholder="https://..."
                />
              </div>
            )}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ebooks.length === 0 ? (
          <p className="text-muted-foreground">Nenhum ebook cadastrado.</p>
        ) : (
          ebooks.map((ebook) => (
            <div key={ebook.id} className="bg-card rounded-lg overflow-hidden border">
              <img
                src={ebook.url_capa}
                alt={ebook.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2">{ebook.titulo}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {ebook.sinopse}
                </p>
                <span className="inline-block mb-4 px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-semibold">
                  {ebook.gratuito === 1 ? "Gratuito" : "Pago"}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(ebook)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-destructive"
                    onClick={() => handleDelete(ebook.id)}
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
