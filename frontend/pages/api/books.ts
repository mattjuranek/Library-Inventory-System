import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  const apiKey = process.env.BOOKS_API_KEY;

  console.log('Search query:', query);
  console.log('API key:', apiKey);

  if (!query) {
    return res.status(400).json({ error: 'Search parameter needed' });
  }

  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`);
    const data = await response.json();

    console.log('API response:', data);

    if (response.ok) {
      res.status(200).json(data);
    } 
    else {
      res.status(response.status).json({ message: data.error.message });
    }
  } 
  catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}