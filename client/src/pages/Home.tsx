import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Mail, Download, MapPin, Calendar, Copy, Check } from "lucide-react";

export default function Home() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedEbook, setSelectedEbook] = useState<number | null>(null);
  const [emailForm, setEmailForm] = useState({ nome: "", email: "" });
  const [copiedIban, setCopiedIban] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar conteúdo do banco de dados
  const { data: pregacoes = [] } = trpc.content.getPregacoes.useQuery();
  const { data: podcasts = [] } = trpc.content.getPodcasts.useQuery();
  const { data: ebooks = [] } = trpc.content.getEbooks.useQuery();
  const { data: eventos = [] } = trpc.content.getEventos.useQuery();
  const { data: fotos = [] } = trpc.content.getFotos.useQuery();

  // Mutation para capturar email
  const captureEmailMutation = trpc.content.captureEmail.useMutation();

  // Função para abrir modal de email
  const handleDownloadClick = (ebookId: number) => {
    setSelectedEbook(ebookId);
    setShowEmailModal(true);
  };

  // Função para enviar email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await captureEmailMutation.mutateAsync({
        email: emailForm.email,
        nome: emailForm.nome,
        ebookId: selectedEbook || undefined,
      });

      // Encontrar o ebook e fazer download
      const ebook = ebooks.find((e) => e.id === selectedEbook);
      if (ebook && ebook.url_arquivo) {
        window.location.href = ebook.url_arquivo;
      }

      setEmailForm({ nome: "", email: "" });
      setShowEmailModal(false);
    } catch (error) {
      console.error("Erro ao capturar email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para copiar IBAN
  const handleCopyIban = () => {
    const iban = "AO06.0060.0000.11659393.0127";
    navigator.clipboard.writeText(iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  // Função para extrair ID do vídeo do YouTube
  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header/Navegação */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-primary">
            Ministério Martinho
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#sobre" className="hover:text-secondary transition-colors">
              Sobre
            </a>
            <a
              href="#pregacoes"
              className="hover:text-secondary transition-colors"
            >
              Pregações
            </a>
            <a
              href="#podcast"
              className="hover:text-secondary transition-colors"
            >
              Podcast
            </a>
            <a href="#ebooks" className="hover:text-secondary transition-colors">
              Ebooks
            </a>
            <a href="#agenda" className="hover:text-secondary transition-colors">
              Agenda
            </a>
            <a href="#contato" className="hover:text-secondary transition-colors">
              Contato
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">MINISTÉRIO MARTINHO S. S. MADUREIRA</h1>
            <p className="hero-subtitle">
              Pregador do Evangelho, Escritor e Apresentador do Podcast VOZ DA FÉ
            </p>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Bem-vindo ao meu espaço de fé, conhecimento e inspiração. Aqui você
              encontra pregações, podcasts, ebooks e muito mais para fortalecer sua
              jornada espiritual.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="#pregacoes">
                <Button className="btn-primary">Ouça as Pregações</Button>
              </a>
              <a href="#podcast">
                <Button className="btn-secondary">Podcast VOZ DA FÉ</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Sobre */}
      <section id="sobre" className="section">
        <div className="container">
          <h2 className="section-title">Sobre Mim</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-center mb-6">
              Sou Martinho Sábalo Sandala Madureira, pregador do evangelho
              dedicado a compartilhar a palavra de Deus com autenticidade e
              profundidade. Meu ministério é baseado na fé, na busca constante
              de conhecimento bíblico e na vontade de servir.
            </p>
            <p className="text-lg text-center mb-6">
              Como escritor, tenho o privilégio de colocar em palavras as
              revelações que Deus me concede. Através do podcast VOZ DA FÉ,
              respondo dúvidas diversas e abordo temas que tocam o coração das
              pessoas em sua caminhada espiritual.
            </p>
            <p className="text-lg text-center">
              Este espaço é dedicado a você, que busca crescimento espiritual,
              respostas às suas questões e inspiração para viver uma vida de fé
              genuína.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Pregações */}
      <section id="pregacoes" className="section bg-muted/30">
        <div className="container">
          <h2 className="section-title">Pregações</h2>
          {pregacoes.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma pregação disponível no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pregacoes.map((pregacao) => (
                <div key={pregacao.id} className="card-content">
                  <div className="video-container">
                    <iframe
                      src={getYoutubeEmbedUrl(pregacao.url_video)}
                      title={pregacao.titulo}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="text-xl font-bold mt-4">{pregacao.titulo}</h3>
                  <p className="text-muted-foreground mt-2">
                    {pregacao.descricao}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    {new Date(pregacao.data_publicacao).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção Podcast */}
      <section id="podcast" className="section">
        <div className="container">
          <h2 className="section-title">Podcast VOZ DA FÉ</h2>
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-center text-lg">
              Respondendo suas dúvidas e explorando temas profundos da fé através
              de conversas inspiradoras.
            </p>
          </div>
          {podcasts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum episódio disponível no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {podcasts.map((podcast) => (
                <div key={podcast.id} className="card-content">
                  <h3 className="text-xl font-bold mb-4">{podcast.titulo_episodio}</h3>
                  <div className="mb-4">
                    <iframe
                      src={podcast.url_embed}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    />
                  </div>
                  <p className="text-muted-foreground">{podcast.descricao}</p>
                  <p className="text-sm text-muted-foreground mt-4">
                    {new Date(podcast.data_publicacao).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção Ebooks */}
      <section id="ebooks" className="section bg-muted/30">
        <div className="container">
          <h2 className="section-title">Ebooks</h2>
          {ebooks.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum ebook disponível no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ebooks.map((ebook) => (
                <div key={ebook.id} className="ebook-card">
                  <img
                    src={ebook.url_capa}
                    alt={ebook.titulo}
                    className="ebook-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{ebook.titulo}</h3>
                    <p className="text-muted-foreground mb-4">
                      {ebook.sinopse}
                    </p>
                    {ebook.gratuito === 1 ? (
                      <Button
                        onClick={() => handleDownloadClick(ebook.id)}
                        className="w-full btn-primary"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Grátis
                      </Button>
                    ) : (
                      <a href="https://wa.me/244927791547" target="_blank" rel="noopener noreferrer">
                        <Button className="w-full btn-secondary">
                          Comprar Agora
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção Agenda */}
      <section id="agenda" className="section">
        <div className="container">
          <h2 className="section-title">Agenda de Eventos</h2>
          {eventos.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhum evento agendado no momento.
            </p>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              {eventos.map((evento) => (
                <div key={evento.id} className="event-item">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{evento.nome_evento}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground mt-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(evento.data_evento).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{evento.local}</span>
                      </div>
                      <span className="inline-block mt-3 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold">
                        {evento.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção Galeria */}
      <section id="galeria" className="section bg-muted/30">
        <div className="container">
          <h2 className="section-title">Galeria de Fotos</h2>
          {fotos.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma foto disponível no momento.
            </p>
          ) : (
            <div className="gallery-grid">
              {fotos.map((foto) => (
                <div key={foto.id} className="gallery-item">
                  <img
                    src={foto.url_foto}
                    alt={foto.descricao_foto || "Foto do evento"}
                    loading="lazy"
                  />
                  {foto.descricao_foto && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-center px-4">
                        {foto.descricao_foto}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seção Apoio ao Ministério */}
      <section className="section bg-primary text-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Apoie Este Ministério
          </h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg mb-8">
              Sua contribuição ajuda a expandir o alcance deste ministério,
              permitindo a produção de mais conteúdo, eventos e ações que
              transformam vidas através da palavra de Deus.
            </p>
            <div className="bg-white/10 backdrop-blur rounded-lg p-8 mb-8">
              <p className="text-sm text-white/80 mb-2">Banco</p>
              <p className="text-xl font-bold mb-6">BFA</p>

              <p className="text-sm text-white/80 mb-2">Titular da Conta</p>
              <p className="text-lg font-bold mb-6">
                Martinho Sábalo Sandala Madureira
              </p>

              <p className="text-sm text-white/80 mb-2">IBAN</p>
              <div className="flex items-center justify-center gap-4">
                <p className="text-lg font-mono font-bold">
                  AO06.0060.0000.11659393.0127
                </p>
                <button
                  onClick={handleCopyIban}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {copiedIban ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-white/90">
              Que Deus abençoe sua generosidade e multiplique suas bênçãos!
            </p>
          </div>
        </div>
      </section>

      {/* Seção Contato */}
      <section id="contato" className="section">
        <div className="container">
          <h2 className="section-title">Contato e Redes Sociais</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg mb-8">
              Conecte-se comigo através das redes sociais ou envie uma mensagem
              para convites, parcerias e dúvidas.
            </p>

            <div className="flex justify-center gap-6 flex-wrap mb-8">
              <a
                href="https://www.instagram.com/martinhossmadureira"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="Instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@martinhossmadureira"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="TikTok"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.66 1.94 2.89 2.89 0 015.66-1.94V9.75a6.32 6.32 0 015.23 6.16V11a6.31 6.31 0 01-5.23-6.16V6.69z" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@martinhossmadureira"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="YouTube"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://wa.me/244927791547"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="WhatsApp"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.734.732 5.41 2.124 7.738L.929 23.5l8.272-2.737a9.857 9.857 0 004.618 1.176h.004c5.44 0 9.902-4.467 9.903-9.923 0-2.65-.675-5.159-1.96-7.44-1.285-2.283-3.12-4.171-5.359-5.471-2.24-1.3-4.721-2.009-7.318-2.009z" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=100083436668190"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                title="Facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

            <div className="bg-muted rounded-lg p-6">
              <Mail className="w-8 h-8 mx-auto mb-4 text-primary" />
              <p className="text-lg font-semibold mb-2">Entre em Contato</p>
              <p className="text-muted-foreground">
                Para convites, parcerias e dúvidas, entre em contato através do
                WhatsApp ou das redes sociais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container">
          <div className="text-center">
            <p className="mb-2">
              &copy; 2026 Ministério Martinho S. S. Madureira. Todos os direitos
              reservados.
            </p>
            <p className="text-white/80">
              Desenvolvido com fé e dedicação para expandir o reino de Deus.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Captura de Email */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Baixar Ebook
            </h2>
            <p className="text-muted-foreground mb-6">
              Preencha seus dados para receber o ebook gratuitamente.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nome</label>
                <input
                  type="text"
                  required
                  value={emailForm.nome}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, nome: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={emailForm.email}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Enviando..." : "Baixar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
