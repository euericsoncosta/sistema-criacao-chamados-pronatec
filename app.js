import dotenv from "dotenv";
dotenv.config();

import express from "express";
import methodOverride from "method-override";
import { resolve } from "path";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";

// Importando a conexão com o banco de dados
import "./src/database/index.js"; 

// Importando as rotas do sistema de chamados
import routes from "./src/routes/routes.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // 1. Configuração do engine Handlebars com Helpers
    this.app.engine(
      "handlebars",
      engine({
        helpers: {
          formatCurrency: (value) => {
            return new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value || 0);
          },
          formatDate: (date) => {
            if (!date) return "";
            return new Date(date).toLocaleDateString("pt-BR");
          },
          eq: (v1, v2) => v1 === v2,
        },
        defaultLayout: "main",
      }),
    );
    this.app.set("view engine", "handlebars");
    this.app.set("views", resolve(__dirname, "src", "views"));

    // 2. Pasta pública e Method Override
    this.app.use(express.static(resolve(__dirname, "public")));
    this.app.use(methodOverride("_method"));

    // 3. Parsing de JSON e URL-encoded
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // 4. Configuração de Sessão (Essencial para manter o usuário logado)
    this.app.use(session({
      secret: process.env.SESSION_SECRET || 'chave_segura_chamados_123',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 3600000 } // Sessão dura 1 hora
    }));

    // 5. Configuração do Connect Flash para alertas
    this.app.use(flash());

    // 6. Middleware para variáveis globais (Disponíveis em todas as views .handlebars)
    this.app.use((req, res, next) => {
      res.locals.success = req.flash('success');
      res.locals.error = req.flash('error');
      // Descomentado para que o layout 'main' saiba quem está logado
      res.locals.user = req.session.user || null; 
      next();
    });
  }

  routes() {
    // Centralizando todas as rotas
    this.app.use(routes);
  }
}

export default new App().app;