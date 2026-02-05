import Setor from "../models/Setor.js";

class SetorController {
  // Apenas Admin e Técnico vêem a lista de setores
  async index(req, res) {
    try {
      if (req.session.user.cargo === "cliente") {
        req.flash("error", "Acesso negado.");
        return res.redirect("/");
      }

      const setores = await Setor.findAll({ raw: true });

      return res.render("setores/index", {
        setores,
        title: "Gestão de Setores",
      });
    } catch (error) {
      return res.status(500).send("Erro ao listar setores.");
    }
  }

  async create(req, res) {
    if (req.session.user.cargo !== "admin") {
      req.flash("error", "Apenas administradores podem criar setores.");
      return res.redirect("/setores");
    }
    return res.render("setores/create", { title: "Novo Setor" });
  }

  async store(req, res) {
    try {
      if (req.session.user.cargo !== "admin")
        return res.status(403).send("Não autorizado.");

      const { nome } = req.body;
      if (!nome) {
        return res.render("setores/create", {
          error: "O nome é obrigatório.",
          title: "Novo Setor",
        });
      }

      await Setor.create({ nome });
      req.flash("success", "Setor criado com sucesso!");
      return res.redirect("/setores");
    } catch (error) {
      return res.render("setores/create", {
        error: "Erro ao criar setor.",
        title: "Novo Setor",
      });
    }
  }

  async edit(req, res) {
    try {
      if (req.session.user.cargo !== "admin") {
        req.flash("error", "Acesso negado.");
        return res.redirect("/setores");
      }

      const { id } = req.params;
      const setor = await Setor.findByPk(id, { raw: true });

      if (!setor) return res.redirect("/setores");

      return res.render("setores/edit", { setor, title: "Editar Setor" });
    } catch (error) {
      return res.redirect("/setores");
    }
  }

  async update(req, res) {
    try {
      if (req.session.user.cargo !== "admin")
        return res.status(403).send("Não autorizado.");

      const { id } = req.params;
      const { nome } = req.body;

      const setor = await Setor.findByPk(id);
      if (!setor) return res.redirect("/setores");

      await setor.update({ nome });
      req.flash("success", "Setor atualizado com sucesso!");
      return res.redirect("/setores");
    } catch (error) {
      req.flash("error", "Erro ao atualizar setor.");
      return res.redirect("/setores");
    }
  }
}

export default new SetorController();
