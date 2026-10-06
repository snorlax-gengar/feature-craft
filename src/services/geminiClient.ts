export async function callGemini(
  prompt: string,
  apiKey: string,
  systemInstruction?: string,
): Promise<string> {
  // Use gemini-2.5-flash which is standard and supported on current Gemini developer API keys
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

  const requestBody: {
    contents: Array<{ role: string; parts: Array<{ text: string }> }>
    systemInstruction?: { parts: Array<{ text: string }> }
    generationConfig: { temperature: number; topP: number }
  } = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      topP: 0.95,
    },
  }

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }],
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    try {
      const errJson = JSON.parse(errorText)
      throw new Error(errJson.error?.message || `API Error (${response.status})`)
    } catch {
      throw new Error(`Gemini API 호출 실패 (${response.status}): ${errorText.slice(0, 150)}`)
    }
  }

  const data = await response.json()
  const candidate = data.candidates?.[0]
  const text = candidate?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Gemini API에서 텍스트 응답을 받지 못했습니다.')
  }
  return text
}
