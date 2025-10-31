import mongoose from 'mongoose';

const HorseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Horse = mongoose.models.Horse || mongoose.model('Horse', HorseSchema);
