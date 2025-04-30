// imports
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import next from 'next';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cron from 'node-cron';
import dbConnect from './src/lib/db';
import Task from './src/models/Task';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);

  const io = new SocketIOServer(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
  (global as any).io = io;

  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id);
  });

  cron.schedule('* * * * *', async () => {
    console.log('⏰ Running daily task reminder cron job...');
    await dbConnect();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const overdueTasks = await Task.find({
      completed: false,
      createdAt: { $lt: twentyFourHoursAgo },
    });

    overdueTasks.forEach((task) => {
      console.log(`• ${task.title}: ${task.description}`);
    });
  });

  app.use((req, res) => handle(req, res));

  server.listen(3000, () => {
    console.log(`🚀 Server running at http://localhost:3000`);
  });
});
