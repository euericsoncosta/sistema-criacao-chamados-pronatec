import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';

class AuthController {
  // Renderiza a página de login
  renderLogin(req, res) {
    // Se já estiver logado, vai direto para a home
    if (req.session.user) {
      return res.redirect('/');
    }
    return res.render('auth/login', { layout: false, title: 'Login - Service Desk' });
  }

  // Processa o login
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        req.flash('error', 'Utilizador não encontrado.');
        return res.redirect('/login');
      }

      // Comparar a senha (usando bcrypt para segurança)
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        req.flash('error', 'Senha incorreta.');
        return res.redirect('/login');
      }

      // Iniciar a sessão de utilizador guardando os dados necessários
      req.session.user = {
        id: usuario.id,
        nome: usuario.nome,
        cargo: usuario.cargo
      };

      req.flash('success', `Bem-vindo, ${usuario.nome}!`);
      return res.redirect('/');
    } catch (error) {
      req.flash('error', 'Erro ao realizar login.');
      return res.redirect('/login');
    }
  }

  // Terminar a sessão (Logout)
  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
}

export default new AuthController();