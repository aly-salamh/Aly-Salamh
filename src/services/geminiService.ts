export async function getStylistRecommendation(preferences: any, brands: any) {
  const response = await fetch('/api/stylist/recommendation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferences, brands })
  });
  if (!response.ok) throw new Error('Failed to get recommendation');
  return response.json();
}

export async function getChatResponse(messages: { role: 'user' | 'model', content: string }[], mode: 'b2c' | 'b2b') {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, mode })
  });
  if (!response.ok) throw new Error('Failed to get chat response');
  const data = await response.json();
  return data.text;
}
