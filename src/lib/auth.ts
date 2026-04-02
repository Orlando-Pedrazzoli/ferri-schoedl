import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e password são obrigatórios');
        }

        await dbConnect();

        // 1) Tentar encontrar como Admin/Editor (model User)
        const adminUser = await User.findOne({
          email: credentials.email,
        }).select('+password');
        if (adminUser) {
          const isPasswordValid = await adminUser.comparePassword(
            credentials.password,
          );
          if (!isPasswordValid) throw new Error('Credenciais inválidas');

          return {
            id: adminUser._id.toString(),
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
          };
        }

        // 2) Tentar encontrar como Customer
        const customer = await Customer.findOne({
          email: credentials.email,
        }).select('+password');

        if (!customer) {
          throw new Error('Credenciais inválidas');
        }

        const isPasswordValid = await customer.comparePassword(
          credentials.password,
        );
        if (!isPasswordValid) {
          throw new Error('Credenciais inválidas');
        }

        // Verificar se o email foi verificado
        if (!customer.emailVerified) {
          throw new Error(
            'Verifique seu email antes de fazer login. Confira sua caixa de entrada.',
          );
        }

        return {
          id: customer._id.toString(),
          name: customer.name,
          email: customer.email,
          role: 'customer' as const,
          cpf: customer.cpf,
          phone: customer.phone,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        // Campos extras para customers
        if (user.role === 'customer') {
          token.cpf = (user as { cpf?: string }).cpf;
          token.phone = (user as { phone?: string }).phone;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;

        if (token.role === 'customer') {
          session.user.cpf = token.cpf;
          session.user.phone = token.phone;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
