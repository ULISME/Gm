// api/analyze.js
import fetch from 'node-fetch'; // ESM
// импорт gigachat если используешь библиотеку gigachat-node:
// import { GigachatClient } from 'gigachat-node';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  try {
    const { thoughts } = req.body;
    if (!thoughts) {
      return res.status(400).json({ error: 'No thoughts provided' });
    }

    // Здесь вставляешь свой prompt
    const prompt = `
Ты — квалифицированный психолог-аналитик.
Тебе даны мысли пользователя: ${thoughts.join(', ')}
Сделай структурный анализ без советов и оценок.
    `;

    // Пример запроса к Gigachat API через fetch
    const response = await fetch('https://api.gigachat.ru/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': process.env.GIGACHAT_CLIENT_ID,
        'X-Client-Secret': process.env.GIGACHAT_CLIENT_SECRET,
      },
      body: JSON.stringify({
        model: 'gigachat/gpt-4o-mini', // пример модели
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    return res.status(200).json({ analysis: data.choices?.[0]?.message?.content || 'Нет ответа' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error', details: e.message });
  }
}
