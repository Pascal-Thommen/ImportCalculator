const ADMIN_KEY = 'importkalk_admin_v1'

function loadConfig() {
  try { return JSON.parse(localStorage.getItem(ADMIN_KEY) || '{}') } catch { return {} }
}

export async function suggestHsCode(productName) {
  const cfg = loadConfig()
  const baseUrl = (cfg.ollamaUrl || '').replace(/\/$/, '')
  if (!baseUrl || !productName?.trim()) return null

  const model = cfg.ollamaModel || 'llama3.2'
  const key   = cfg.ollamaKey || ''

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: `HS code (Harmonized System, 6 digits) for customs classification. Reply with ONLY the digits, nothing else.\n\nProduct: ${productName.trim()}`,
        }],
        temperature: 0.1,
        max_tokens: 20,
      }),
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const text  = (data.choices?.[0]?.message?.content || '').trim()
    const digits = text.replace(/\D/g, '').slice(0, 8)
    return digits.length >= 4 ? digits : null
  } catch {
    return null
  }
}
