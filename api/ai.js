module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { prompt, context, apiKey } = req.body;
    const key = process.env.ANTHROPIC_API_KEY || apiKey;
    if (!key) return res.status(400).json({ error: 'API kalit topilmadi' });
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: "Sen Markaziy bank Toshkent viloyati ovozli yordamchisisan. Qisqa javob ber. O'zbek tilida gapir.\n\nKONTEKST:\n" + (context || ''),
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!response.ok) return res.status(response.status).json({ error: 'API xato: ' + response.status });
    const data = await response.json();
    return res.status(200).json({ text: data.content[0].text });
  } catch (err) { return res.status(500).json({ error: err.message }); }
};
