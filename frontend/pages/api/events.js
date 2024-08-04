import connectDB from '../../../backend/db';
import Event from '../../../backend/Event';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const events = await Event.find({});
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching events', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
