import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

class UsuarioController {
  // Renderiza a lista de utilizadores (Apenas Admin)
  async index(req, res) {
    try {
      // Verificação de permissão: Apenas administradores podem gerir utilizadores
      if (req.session.user.cargo !== "admin") {
        req.flash(
          "error",
          "Acesso negado. Apenas administradores podem aceder a esta área.",
        );
        return res.redirect("/");
      }

      const usuarios = await Usuario.findAll({
        attributes: ["id", "nome", "email", "cargo"],
        raw: true,
      });

      return res.render("usuarios/index", {
        usuarios,
        title: "Gestão de Utilizadores",
      });
    } catch (error) {
      return res.status(500).send("Erro ao listar utilizadores.");
    }
  }

  // Renderiza o formulário de criação (Apenas Admin)
  async create(req, res) {
    if (req.session.user.cargo !== "admin") {
      req.flash("error", "Permissão insuficiente.");
      return res.redirect("/");
    }
    return res.render("usuarios/create", { title: "Novo Utilizador" });
  }

  // Processa a criação com encriptação de senha
  async store(req, res) {
    try {
      if (req.session.user.cargo !== "admin") {
        return res.status(403).send("Não autorizado.");
      }

      const { nome, email, senha, cargo } = req.body;

      const userExists = await Usuario.findOne({ where: { email } });
      if (userExists) {
        return res.render("usuarios/create", {
          error: "Este e-mail já está em uso.",
          oldData: req.body,
          title: "Novo Utilizador",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        cargo,
      });

      req.flash("success", "Utilizador criado com sucesso!");
      return res.redirect("/usuarios");
    } catch (error) {
      console.error(error);
      return res.render("usuarios/create", {
        error: "Erro ao criar utilizador.",
        title: "Novo Utilizador",
      });
    }
  }

  // Renderiza formulário de edição (Apenas Admin)
  async edit(req, res) {
    try {
      if (req.session.user.cargo !== "admin") {
        req.flash("error", "Acesso restrito.");
        return res.redirect("/");
      }

      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, { raw: true });

      if (!usuario) return res.redirect("/usuarios");

      return res.render("usuarios/edit", {
        usuario,
        title: "Editar Utilizador",
      });
    } catch (error) {
      return res.redirect("/usuarios");
    }
  }

  // Processa a atualização dos dados do utilizador
  async update(req, res) {
    try {
      if (req.session.user.cargo !== "admin") {
        return res.status(403).send("Não autorizado.");
      }

      const { id } = req.params;
      const { nome, email, cargo } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        req.flash("error", "Utilizador não encontrado.");
        return res.redirect("/usuarios");
      }

      await usuario.update({ nome, email, cargo });

      req.flash("success", "Utilizador atualizado com sucesso!");
      return res.redirect("/usuarios");
    } catch (error) {
      console.error(error);
      req.flash("error", "Erro ao atualizar o utilizador.");
      return res.redirect(`/usuarios/editar/${req.params.id}`);
    }
  }

  // Remove um utilizador do sistema (Apenas Admin)
  async delete(req, res) {
    try {
      if (req.session.user.cargo !== "admin") {
        req.flash("error", "Operação não permitida.");
        return res.redirect("/");
      }

      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        req.flash("error", "Utilizador não encontrado.");
        return res.redirect("/usuarios");
      }

      await usuario.destroy();

      req.flash("success", "Utilizador removido com sucesso!");
      return res.redirect("/usuarios");
    } catch (error) {
      console.error(error);
      req.flash(
        "error",
        "Não foi possível remover o utilizador. Verifique se ele possui chamados vinculados.",
      );
      return res.redirect("/usuarios");
    }
  }
}

export default new UsuarioController();
