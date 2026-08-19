export default {
  async fetch(request, env, ctx) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    if (request.method !== 'POST') {
      return new Response('Método no permitido', { status: 405, headers });
    }
    
    try {
      const { prompt, lang = 'es' } = await request.json();
      
      if (!prompt || prompt.length > 500) {
        return new Response('Texto inválido (máx 500 caracteres)', { status: 400, headers });
      }
      
      // MeloTTS - documentación oficial:
      // Parámetros: prompt (texto a hablar), lang (código de idioma)
      // Devuelve: blob MP3 binario directamente
      const result = await env.AI.run('@cf/myshell-ai/melotts', {
        prompt: prompt,
        lang: lang,
      });
      
      // Devolver audio MP3 directamente
      return new Response(result, {
        headers: {
          ...headers,
          'Content-Type': 'audio/mpeg',
        }
      });
    } catch (error) {
      console.error('TTS error:', error);
      return new Response(`Error TTS: ${error.message}`, { status: 500, headers });
    }
  }
};
