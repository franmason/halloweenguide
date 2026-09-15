from flask import Flask, render_template, abort
import os
import markdown
import frontmatter

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
GUIAS_DIR = os.path.join(BASE_DIR, "content", "guias")

# Dados dos mapas: slug, nome de exibição e arquivo de imagem
MAPAS = [
    {
        "slug": "haddonfield-heights",
        "nome": "Haddonfield Heights",
        "imagem": "haddonfield-heights.png",
    },
    {
        "slug": "orange-grove-estates",
        "nome": "Orange Grove Estates",
        "imagem": "orange-grove-estates.png",
    },
    {
        "slug": "haddonfield-town-center",
        "nome": "Haddonfield Town Center",
        "imagem": "haddonfield-town-center.png",
    },
    {
        "slug": "east-haddonfield",
        "nome": "East Haddonfield",
        "imagem": "east-haddonfield.png",
    },
]


def get_mapa(slug):
    return next((m for m in MAPAS if m["slug"] == slug), None)


def listar_guias():
    guias = []
    if not os.path.isdir(GUIAS_DIR):
        return guias
    for arquivo in sorted(os.listdir(GUIAS_DIR)):
        if arquivo.endswith(".md"):
            caminho = os.path.join(GUIAS_DIR, arquivo)
            post = frontmatter.load(caminho)
            guias.append({
                "slug": arquivo[:-3],
                "titulo": post.get("titulo", arquivo[:-3]),
                "resumo": post.get("resumo", ""),
                "capa": post.get("capa"),
            })
    return guias


def carregar_guia(slug):
    caminho = os.path.join(GUIAS_DIR, f"{slug}.md")
    if not os.path.isfile(caminho):
        return None
    post = frontmatter.load(caminho)
    html = markdown.markdown(post.content, extensions=["extra"])
    return {
        "titulo": post.get("titulo", slug),
        "resumo": post.get("resumo", ""),
        "capa": post.get("capa"),
        "conteudo_html": html,
    }


@app.route("/")
def index():
    return render_template("index.html", mapas=MAPAS, guias=listar_guias())


@app.route("/mapas")
def mapas():
    return render_template("mapas.html", mapas=MAPAS)


@app.route("/mapas/<slug>")
def mapa_detalhe(slug):
    mapa = get_mapa(slug)
    if not mapa:
        abort(404)
    return render_template("mapa_detalhe.html", mapa=mapa, mapas=MAPAS)


@app.route("/guias")
def guias():
    return render_template("guias.html", guias=listar_guias())


@app.route("/guias/<slug>")
def guia_detalhe(slug):
    guia = carregar_guia(slug)
    if not guia:
        abort(404)
    return render_template("guia_detalhe.html", guia=guia)


@app.route("/estrategias")
def estrategias():
    return render_template("estrategias.html")


@app.errorhandler(404)
def nao_encontrado(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)
