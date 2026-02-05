import { Router } from "express";

// Importação dos Controladores
import HomeController from "../controllers/HomeController.js";
import ChamadoController from "../controllers/ChamadoController.js";
import SetorController from "../controllers/SetorController.js";
import UsuarioController from "../controllers/UsuarioController.js";
import AuthController from "../controllers/AuthController.js";

const routes = new Router();

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
// Verifica se o utilizador tem uma sessão ativa antes de permitir o acesso
const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    // Se estiver logado, disponibiliza os dados do utilizador para todas as vistas
    res.locals.user = req.session.user;
    return next();
  }
  // Se não estiver logado, redireciona para o login com uma mensagem de erro
  req.flash("error", "Por favor, faça login para aceder ao sistema.");
  return res.redirect("/login");
};

// --- ROTAS PÚBLICAS (AUTENTICAÇÃO) ---
routes.get("/login", AuthController.renderLogin);
routes.post("/login", AuthController.login);
routes.get("/logout", AuthController.logout);

// --- ROTAS PROTEGIDAS (REQUEREM LOGIN) ---
// A partir daqui, todas as rotas utilizam o authMiddleware
routes.use(authMiddleware);

// Rota da Home / Dashboard
routes.get("/", HomeController.index);

// Rotas de Chamados (Tickets)
routes.get("/chamados", ChamadoController.index); // Listagem
routes.get("/chamados/novo", ChamadoController.create); // Formulário de criação
routes.post("/chamados", ChamadoController.store); // Processar criação
routes.get("/chamados/editar/:id", ChamadoController.edit); // Detalhes/Edição
routes.post("/chamados/update/:id", ChamadoController.update); // Processar atualização

// Rotas de Setores (Departamentos)
routes.get("/setores", SetorController.index);
routes.get("/setores/novo", SetorController.create);
routes.post("/setores", SetorController.store);
routes.get("/setores/editar/:id", SetorController.edit);
routes.post("/setores/update/:id", SetorController.update);

// Rotas de Utilizadores
routes.get("/usuarios", UsuarioController.index);
routes.get("/usuarios/novo", UsuarioController.create);
routes.post("/usuarios", UsuarioController.store);
routes.get("/usuarios/editar/:id", UsuarioController.edit);

routes.put("/usuarios/update/:id", UsuarioController.update);
routes.delete("/usuarios/delete/:id", UsuarioController.delete);
export default routes;
