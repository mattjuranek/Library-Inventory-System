import connectDB from '../../../backend/db';
import Event from '../../../backend/Event';

export default async function handler(req, res) {
  await connectDB();

  try {
    const events = await Event.find({});
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
}
