import { GigaChat } from 'gigachat-node';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { thoughts } = req.body;
  if (!thoughts || !Array.isArray(thoughts)) return res.status(400).json({ error: 'No thoughts provided' });

  try {
    const client = new GigaChat({
      clientSecretKey: process.env.GIGACHAT_CLIENT_SECRET,
      isPersonal: true,
      autoRefreshToken: true
    });

    await client.createToken();

    const systemPrompt = `
Ты — квалифицированный психолог-аналитик. Тебе предоставлены короткие мысли человека...
(сюда вставь твой полный промт)
`;

    const response = await client.completion({
      model: 'GigaChat-2-Pro',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: thoughts.join('\n') }
      ]
    });

    res.status(200).json({ analysis: response.choices[0].message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get analysis', details: err.message });
  }
}
