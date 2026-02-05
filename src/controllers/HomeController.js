import Chamado from '../models/Chamado.js';
import Usuario from '../models/Usuario.js';
import Setor from '../models/Setor.js';

class HomeController {
  async index(req, res) {
    try {
      // Busca contagens para o Dashboard
      const [
        totalChamados,
        abertos,
        emAtendimento,
        concluidos,
        totalUsuarios,
        totalSetores
      ] = await Promise.all([
        Chamado.count(),
        Chamado.count({ where: { status: 'aberto' } }),
        Chamado.count({ where: { status: 'em_atendimento' } }),
        Chamado.count({ where: { status: 'concluido' } }),
        Usuario.count(),
        Setor.count()
      ]);

      // Busca os últimos 5 chamados
      const ultimosChamados = await Chamado.findAll({
        limit: 5,
        // CORREÇÃO: Usando 'created_at' em vez de 'createdAt' para alinhar com o banco
        order: [['created_at', 'DESC']], 
        include: [
          { model: Usuario, as: 'cliente', attributes: ['nome'] },
          { model: Setor, as: 'setor', attributes: ['nome'] }
        ],
        nest: true,
        raw: true
      });

      return res.render('home', {
        title: 'Painel de Controle',
        stats: {
          total: totalChamados,
          abertos,
          emAtendimento,
          concluidos,
          usuarios: totalUsuarios,
          setores: totalSetores
        },
        ultimosChamados
      });
    } catch (error) {
      console.error('Erro no HomeController:', error);
      return res.status(500).send('Erro ao carregar o Dashboard.');
    }
  }
}

export default new HomeController();