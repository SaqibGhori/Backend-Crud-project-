import jwt from 'jsonwebtoken';
import { NextRequest} from 'next/server';

export function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { userId: string; role: string };
  } catch  {
    return null;
  }
}
