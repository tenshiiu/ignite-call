import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { api } from '../../lib/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, username } = req.body;

  if (!name || !username) {
    return res.status(400).json({ message: 'Name and username are required.' });
  }

  // Verifica se o username já existe
  const userExists = await prisma.user.findUnique({
    where: { username },
  });

  if (userExists) {
    return res.status(400).json({ message: 'Usuário já existe.' });
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        username,
      },
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar usuário.' });
  }
}