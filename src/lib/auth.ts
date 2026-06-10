// src/lib/auth.ts
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';

export function generateOtpSignature(
  customerId: string,
  email: string,
): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('NEXTAUTH_SECRET não configurado');
  return crypto
    .createHmac('sha256', secret)
    .update(`${customerId}:${email.toLowerCase()}`)
    .digest('hex');
}

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

        // Bloquear o login enquanto o email não estiver verificado.
        // Assim, quem digitou um email errado no registo percebe que não
        // recebeu a verificação e pode corrigir o endereço.
        if (!customer.emailVerified) {
          throw new Error(
            'Confirme seu email antes de entrar. Enviámos um link de verificação para o endereço registado — verifique a caixa de entrada e o spam. Se não recebeu, o email pode estar incorreto.',
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

    // Provider separado para login via OTP após verificação de código no checkout.
    // Aqui não checamos emailVerified: receber e digitar o código OTP já prova
    // a posse do email, logo a verificação está implícita.
    CredentialsProvider({
      id: 'otp-login',
      name: 'OTP Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        customerId: { label: 'Customer ID', type: 'text' },
        otpSignature: { label: 'OTP Signature', type: 'text' },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.customerId ||
          !credentials?.otpSignature
        ) {
          throw new Error('Dados de autenticação incompletos');
        }

        await dbConnect();

        const customer = await Customer.findById(credentials.customerId);
        if (
          !customer ||
          customer.email !== credentials.email.toLowerCase().trim()
        ) {
          throw new Error('Credenciais inválidas');
        }

        const expected = generateOtpSignature(
          customer._id.toString(),
          customer.email,
        );
        if (expected !== credentials.otpSignature) {
          throw new Error('Assinatura inválida');
        }

        // Verificação por OTP já confirma a posse do email — login liberado.

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
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
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
    signIn: '/conta/login',
    error: '/conta/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
