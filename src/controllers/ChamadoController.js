import Chamado from "../models/Chamado.js";
import Usuario from "../models/Usuario.js";
import Setor from "../models/Setor.js";

class ChamadoController {
  // Lista os chamados (Clientes vêem apenas os seus, Admin/Técnico vêem todos)
  async index(req, res) {
    try {
      const { user } = req.session;
      const filter = {};

      // Se for cliente, filtra apenas pelos chamados dele
      if (user.cargo === "cliente") {
        filter.cliente_id = user.id;
      }

      const chamados = await Chamado.findAll({
        where: filter,
        include: [
          { model: Usuario, as: "cliente", attributes: ["nome", "email"] },
          { model: Setor, as: "setor", attributes: ["nome"] },
        ],
        order: [["created_at", "DESC"]],
        nest: true,
        raw: true,
      });

      return res.render("chamados/index", {
        chamados,
        title: "Meus Chamados",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro ao carregar a lista de chamados.");
    }
  }

  // Formulário de criação (Acessível a todos)
  async create(req, res) {
    try {
      const setores = await Setor.findAll({ raw: true });

      // Se for admin/tecnico, pode escolher o cliente. Se for cliente, o campo será automático.
      const clientes = await Usuario.findAll({
        where: { cargo: "cliente" },
        attributes: ["id", "nome", "email"],
        raw: true,
      });

      return res.render("chamados/create", {
        setores,
        clientes,
        title: "Abrir Novo Chamado",
      });
    } catch (error) {
      return res.status(500).send("Erro ao carregar o formulário.");
    }
  }

  // Processa a abertura (Acessível a todos)
  async store(req, res) {
    try {
      const { titulo, descricao, prioridade, setor_id } = req.body;
      let { cliente_id } = req.body;

      // Se for um cliente a criar, garantimos que o ID é o dele mesmo por segurança
      if (req.session.user.cargo === "cliente") {
        cliente_id = req.session.user.id;
      }

      if (!titulo || !descricao || !setor_id || !cliente_id) {
        req.flash("error", "Preencha todos os campos obrigatórios.");
        return res.redirect("/chamados/novo");
      }

      await Chamado.create({
        titulo,
        descricao,
        prioridade: prioridade || "baixa",
        setor_id,
        cliente_id,
      });

      req.flash("success", "Chamado aberto com sucesso!");
      return res.redirect("/chamados");
    } catch (error) {
      console.error(error);
      req.flash("error", "Erro ao processar o chamado.");
      return res.redirect("/chamados/novo");
    }
  }

  // Visualização/Edição (Bloqueado para Clientes)
  async edit(req, res) {
    try {
      // Bloqueio: Clientes não podem editar chamados (apenas visualizar ou criar)
      // Se quiser que eles visualizem mas não editem, teria de criar uma view de "show"
      // Por agora, bloqueamos o acesso à página de edição/gestão
      if (req.session.user.cargo === "cliente") {
        req.flash(
          "error",
          "Clientes não têm permissão para editar ou gerir chamados.",
        );
        return res.redirect("/chamados");
      }

      const { id } = req.params;
      const chamado = await Chamado.findByPk(id, {
        include: [
          { model: Usuario, as: "cliente", attributes: ["nome", "email"] },
          { model: Setor, as: "setor", attributes: ["nome"] },
        ],
        nest: true,
        raw: true,
      });

      if (!chamado) return res.redirect("/chamados");

      return res.render("chamados/edit", {
        chamado,
        title: "Gerir Chamado",
      });
    } catch (error) {
      return res.redirect("/chamados");
    }
  }

  // Atualização (Bloqueado para Clientes)
  async update(req, res) {
    try {
      // Segurança: Apenas técnicos e admins alteram status/prioridade
      if (req.session.user.cargo === "cliente") {
        return res.status(403).send("Acesso negado.");
      }

      const { id } = req.params;
      const { status, prioridade } = req.body;

      const chamado = await Chamado.findByPk(id);

      if (!chamado) {
        req.flash("error", "Chamado não encontrado.");
        return res.redirect("/chamados");
      }

      await chamado.update({ status, prioridade });

      req.flash("success", "Atendimento atualizado com sucesso!");
      return res.redirect("/chamados");
    } catch (error) {
      req.flash("error", "Erro ao atualizar o chamado.");
      return res.redirect(`/chamados/editar/${req.params.id}`);
    }
  }
}

export default new ChamadoController();
