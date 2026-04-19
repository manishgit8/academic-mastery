const DEFAULT_BASE_URL = 'https://api.x.ai/v1';

function getXaiApiKey() {
  return process.env.XAI_API_KEY || process.env.GROK_API_KEY || '';
}

export async function createXaiChatCompletion({
  messages,
  model,
  temperature = 0.2,
  maxTokens = 500,
}) {
  const apiKey = getXaiApiKey();
  if (!apiKey) {
    const err = new Error('XAI_API_KEY is not configured on the server');
    err.statusCode = 500;
    throw err;
  }

  const baseUrl = process.env.XAI_BASE_URL || DEFAULT_BASE_URL;
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || process.env.XAI_MODEL || 'grok-4.20-reasoning',
      messages,
      stream: false,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.error?.message ||
      data?.error ||
      `xAI request failed with status ${res.status}`;
    const err = new Error(message);
    err.statusCode = res.status;
    err.details = data;
    throw err;
  }

  const content = data?.choices?.[0]?.message?.content;
  return { raw: data, content: typeof content === 'string' ? content : '' };
}

