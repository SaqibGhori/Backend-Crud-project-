import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.User || mongoose.model<IUser>('User', UserSchema);
