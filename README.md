# Guia Halloween: The Game

Site feito por um fã pra ajudar meus amigos (e quem mais quiser) a entender melhor **Halloween: The Game** — principalmente os mapas, os tipos de fuga e as diferenças entre jogar de Michael Myers ou de sobrevivente. A gente começou a jogar em grupo e sentiu falta de um lugar só, em português, pra consultar rápido "como é que eu saio daqui" no meio da partida.

**Isso não é um site oficial.** Não tem nenhuma ligação com os estúdios ou desenvolvedores do jogo — é só um projeto de fã, sem fins lucrativos.

## O que tem no site

- **Mapas** dos 4 cenários de lançamento, com visualizador responsivo (zoom, arraste e tela cheia) — funciona em celular, tablet e PC
- **Guias** traduzidos e organizados: primeira fuga, todas as rotas de fuga, visão geral do jogo
- **Guia completo em abas**: poderes e armas do Michael, skins, missões offline, itens e táticas dos sobreviventes, diferença entre NPCs, e o sistema de desafios

## Tecnologia

Projeto simples, sem framework de frontend nem build step:

- **Python 3 + Flask** no backend, servindo as páginas
- **HTML + Jinja2** pros templates
- **CSS puro** pro visual
- **JavaScript puro (vanilla)** pras interações (zoom do mapa, abas, animações)
- Guias escritos em **Markdown** (fica fácil adicionar novos sem mexer no código)

## Rodando localmente

```bash
pip install -r requirements.txt
python app.py
```

Depois é só abrir `http://localhost:5000`.

## Aviso sobre direitos autorais

As imagens dos mapas são capturas do próprio jogo, a logo é a logo oficial de *Halloween: The Game*, e há uma cena do filme *Halloween* (1978) usada como capa de um dos guias — tudo usado aqui só pra fins de referência/ilustração da comunidade, sem fins lucrativos. Os direitos são dos respectivos estúdios e desenvolvedores. Se algum conteúdo precisar ser removido a pedido dos detentores dos direitos, é só entrar em contato.
