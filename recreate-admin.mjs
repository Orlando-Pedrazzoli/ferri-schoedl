import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Cola aqui a tua connection string (a mesma do teu .env, variável MONGODB_URI)
const MONGODB_URI =
  'mongodb+srv://pedrazzoliorlando:pedrazzoliorlando123@cluster0.ms6ujpg.mongodb.net/ferri-schoedl?retryWrites=true&w=majority&appName=Cluster0';

// 2. Define os dados do admin
const EMAIL = 'thales@ferrischoedl.adv.br';
const PASSWORD = 'Marinalva10#'; // <- escolhe uma senha (mín. 6 caracteres)
const NAME = 'Thales Ferri Schoedl';

const run = async () => {
  await mongoose.connect(MONGODB_URI);

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(PASSWORD, salt);

  const users = mongoose.connection.collection('users');
  await users.updateOne(
    { email: EMAIL },
    {
      $set: {
        name: NAME,
        email: EMAIL,
        password: hash,
        role: 'admin',
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  console.log('✅ Admin criado/atualizado:', EMAIL);
  await mongoose.disconnect();
};

run().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
