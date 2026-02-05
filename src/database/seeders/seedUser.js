import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import '../index.js'; // Inicializa a conexão e os modelos
import Usuario from '../../models/Usuario.js';

dotenv.config();

/**
 * Script para criar um utilizador administrador inicial via linha de comandos
 */
async function createInitialUser() {
  try {
    console.log('--- Iniciando criação de utilizador ---');

    // Dados do utilizador (podes alterar aqui antes de executar)
    const nome = 'Administrador Geral';
    const email = 'user@servicedesk.com';
    const senhaPlana = 'user123';
    const cargo = 'admin';
    

    // 1. Verificar se o utilizador já existe
    const userExists = await Usuario.findOne({ where: { email } });
    if (userExists) {
      console.log('ERRO: Este e-mail já está registado na base de dados.');
      process.exit();
    }

    // 2. Encriptar a palavra-passe
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senhaPlana, salt);

    // 3. Criar o utilizador
    await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      cargo
    });

    console.log('---------------------------------------');
    console.log('SUCESSO: Utilizador criado com êxito!');
    console.log(`E-mail: ${email}`);
    console.log(`Senha: ${senhaPlana}`);
    console.log('---------------------------------------');

  } catch (error) {
    console.error('ERRO ao criar utilizador:', error);
  } finally {
    // Fecha o processo
    process.exit();
  }
}

// Executa a função
createInitialUser();