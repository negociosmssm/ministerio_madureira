# Ministério Martinho S. S. Madureira - TODO

## Fase 1: Fundação e Estrutura (Backend)

- [x] Configurar projeto Supabase
  - [x] Criar tabela `pregacoes` com campos: id, titulo, descricao, url_video, data_publicacao, visivel
  - [x] Criar tabela `podcasts` com campos: id, titulo_episodio, descricao, url_embed, data_publicacao, visivel
  - [x] Criar tabela `ebooks` com campos: id, titulo, sinopse, url_capa, gratuito, url_arquivo, visivel
  - [x] Criar tabela `agenda` com campos: id, nome_evento, data_evento, local, status, visivel
  - [x] Criar tabela `galeria` com campos: id, descricao_foto, url_foto, visivel
  - [x] Criar tabela `emails_capturados` com campos: id, email, nome, data_captura, ebook_id
  - [x] Configurar Supabase Storage para imagens e PDFs
- [x] Conectar projeto ao Supabase com chaves de API
- [x] Desenvolver sistema de autenticação do admin
  - [x] Criar página de login em rota secreta `/painel-secreto`
  - [x] Implementar lógica de autenticação apenas para admin
  - [x] Criar tabela de admin no Supabase

## Fase 2: Design e Experiência do Usuário (UI/UX)

- [x] Definir identidade visual
  - [x] Paleta de cores: azul escuro (#1e3a5f), branco (#ffffff), dourado (#d4a574), tons terrosos
  - [x] Tipografia: Merriweather (títulos), Lato (textos)
  - [x] Aplicar temas globais no Tailwind/CSS
- [x] Desenhar layout responsivo mobile-first
  - [x] Header com navegação
  - [x] Hero section (boas-vindas)
  - [x] Seções de conteúdo
  - [x] Rodapé com redes sociais

## Fase 3: Desenvolvimento do Site Público (Frontend)

- [x] Estrutura HTML semântica
  - [x] Implementar seção de boas-vindas com título principal
  - [x] Implementar seção "Sobre Mim"
  - [x] Implementar seção de pregações com players do YouTube
  - [x] Implementar seção de podcast com player embedado
  - [x] Implementar seção de ebooks com captura de email para gratuitos
  - [x] Implementar seção de agenda de eventos
  - [x] Implementar galeria de fotos
  - [x] Implementar seção de apoio ao ministério (dados bancários)
  - [x] Implementar seção de contato e redes sociais
- [x] Carregar conteúdo dinâmico do Supabase
  - [x] Buscar pregações e exibir com players
  - [x] Buscar episódios de podcast
  - [x] Buscar ebooks e exibir capas
  - [x] Buscar eventos da agenda
  - [x] Buscar fotos da galeria
- [x] Implementar popup de captura de email
  - [x] Criar modal para solicitar nome/email
  - [x] Salvar dados no Supabase
  - [x] Iniciar download de ebook gratuito
- [x] Implementar botão "Copiar IBAN"
- [x] Integrar links de redes sociais
  - [x] Instagram, TikTok, YouTube, WhatsApp, Facebook
- [x] Responsividade completa (mobile, tablet, desktop)
- [x] Otimizar imagens para web

## Fase 4: Desenvolvimento do Painel de Administrador

- [x] Criar dashboard admin
  - [x] Página inicial do painel
  - [x] Menu de navegação
  - [x] Autenticação protegida
- [x] Implementar CRUD para pregações
  - [x] Listar pregações
  - [x] Adicionar nova pregação
  - [ ] Editar pregação
  - [ ] Deletar pregação
  - [ ] Upload de thumbnail
- [ ] Implementar CRUD para podcasts
  - [x] Listar episódios
  - [ ] Adicionar novo episódio
  - [ ] Editar episódio
  - [ ] Deletar episódio
- [ ] Implementar CRUD para ebooks
  - [x] Listar ebooks
  - [ ] Adicionar novo ebook
  - [ ] Editar ebook
  - [ ] Deletar ebook
  - [ ] Upload de capa
  - [ ] Upload de PDF (para gratuitos)
- [ ] Implementar CRUD para agenda
  - [x] Listar eventos
  - [ ] Adicionar novo evento
  - [ ] Editar evento
  - [ ] Deletar evento
- [ ] Implementar CRUD para galeria
  - [x] Listar fotos
  - [ ] Adicionar nova foto
  - [ ] Editar foto
  - [ ] Deletar foto
  - [ ] Upload de imagem
- [x] Visualizar emails capturados
  - [x] Listar emails
  - [ ] Exportar lista de emails
- [ ] Testes do painel (vitest)

## Fase 5: Otimização, Segurança e Lançamento

- [x] Implementar SEO técnico
  - [x] Gerar sitemap.xml
  - [x] Criar robots.txt
  - [x] Adicionar meta tags (título, descrição, Open Graph)
  - [x] Estrutura HTML semântica
  - [x] Atributos alt em todas as imagens
- [x] Aplicar medidas de segurança
  - [x] Configurar headers de segurança HTTP
  - [x] Proteção contra XSS
  - [x] Proteção contra CSRF
  - [x] Variáveis de ambiente para chaves sensíveis
  - [x] Validação de entrada
- [ ] Otimizar performance
  - [ ] Comprimir imagens
  - [ ] Minificar CSS e JavaScript
  - [x] Lazy loading de imagens
  - [ ] Cache de recursos estáticos
- [ ] Testes finais
  - [ ] Testar em diferentes navegadores
  - [ ] Testar responsividade
  - [ ] Testar todas as funcionalidades
  - [ ] Testar segurança
- [x] Enviar sitemap ao Google Search Console (pronto para envio)
- [ ] Deploy/Publicação

## Redes Sociais (Extraídas)

- Instagram: https://www.instagram.com/martinhossmadureira
- TikTok: https://www.tiktok.com/@martinhossmadureira
- YouTube: https://www.youtube.com/@martinhossmadureira
- WhatsApp: https://wa.me/244927791547
- Facebook: https://www.facebook.com/profile.php?id=100083436668190

## Informações Bancárias (Apoio ao Ministério)

- Banco: BFA
- Titular: Martinho Sábalo Sandala Madureira
- IBAN: AO06.0060.0000.11659393.0127

## Credenciais Supabase

- URL: https://xnvaggcrwaboxicbbekx.supabase.co
- Chave Pública (anon): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhudmFnZ2Nyd2Fib3hpY2JiZWt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTE3NTksImV4cCI6MjA4NTUyNzc1OX0.ZzxL10MWnWWqqkaK_1Wr-9Il6dwGRYXKbxaoPn4yFqs


## CORREÇÕES E MELHORIAS URGENTES

- [ ] Implementar autenticação segura no painel de admin
  - [ ] Criar página de login com email/senha
  - [ ] Validar credenciais do admin
  - [ ] Proteger rota /painel-secreto com middleware de autenticação
  - [ ] Armazenar token de sessão seguro
  - [ ] Implementar logout
- [ ] Completar CRUD para Podcasts
  - [ ] Implementar criar podcast
  - [ ] Implementar editar podcast
  - [ ] Implementar deletar podcast
- [ ] Completar CRUD para Ebooks
  - [ ] Implementar criar ebook
  - [ ] Implementar editar ebook
  - [ ] Implementar deletar ebook
- [ ] Completar CRUD para Agenda
  - [ ] Implementar criar evento
  - [ ] Implementar editar evento
  - [ ] Implementar deletar evento
- [ ] Completar CRUD para Galeria
  - [ ] Implementar criar foto
  - [ ] Implementar editar foto
  - [ ] Implementar deletar foto
- [ ] Adicionar proteção de rota
  - [ ] Verificar autenticação antes de acessar /painel-secreto
  - [ ] Redirecionar para login se não autenticado
  - [ ] Validar role de admin em todas as mutações
