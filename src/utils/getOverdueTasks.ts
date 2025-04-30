import dbConnect from '@/lib/db';
import Task from '@/models/Task';

export async function getOverdueTasks() {
  await dbConnect();
  const now = new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  const overdueTasks = await Task.find({
    completed: false,
    createdAt: { $lt: cutoff },
  });

  return overdueTasks;
}
