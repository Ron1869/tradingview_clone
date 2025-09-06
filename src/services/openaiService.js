import OpenAI from 'openai';

/**
 * OpenAI client configuration for Black Trading AI Assistant
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

/**
 * Generates market analysis and predictions using GPT-5
 * @param {string} userMessage - The user's input message
 * @param {Object} settings - AI settings configuration
 * @returns {Promise<string>} The AI response
 */
export async function getMarketAnalysis(userMessage, settings = {}) {
  try {
    const systemPrompt = settings?.systemPrompt || `
      Ты эксперт по техническому анализу финансовых рынков и трейдингу криптовалют. 
      Твоя задача - предоставлять точные, обоснованные прогнозы и рекомендации на русском языке.
      
      Настройки анализа:
      - Тип анализа: ${settings?.analysisType || 'technical'}
      - Толерантность к риску: ${settings?.riskTolerance || 'medium'}  
      - Таймфрейм: ${settings?.timeframe || '1h'}
      
      Всегда включай:
      1. Конкретные уровни поддержки/сопротивления
      2. Технические индикаторы (RSI, MACD, объемы)
      3. Уровень доверия к прогнозу (в процентах)
      4. Потенциальные риски
      5. Рекомендации по входу/выходу
    `;

    const response = await openai?.chat?.completions?.create({
      model: settings?.model || 'gpt-5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      reasoning_effort: settings?.reasoningEffort || 'medium',
      verbosity: settings?.verbosity || 'medium',
      max_completion_tokens: settings?.maxTokens || 2000,
    });

    return response?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error('Error in market analysis:', error);
    throw new Error('Ошибка при получении анализа рынка. Проверьте настройки API.');
  }
}

/**
 * Generates structured market predictions using GPT-5
 * @param {string} symbol - Trading symbol (e.g., 'BTCUSDT')
 * @param {Object} settings - AI configuration settings
 * @returns {Promise<Object>} Structured prediction object
 */
export async function generateMarketPrediction(symbol, settings = {}) {
  try {
    const prompt = `
      Проведи детальный анализ ${symbol} и создай структурированный прогноз.
      
      Параметры анализа:
      - Тип: ${settings?.analysisType || 'technical'}
      - Таймфрейм: ${settings?.timeframe || '1h'}
      - Толерантность к риску: ${settings?.riskTolerance || 'medium'}
    `;

    const response = await openai?.chat?.completions?.create({
      model: settings?.model || 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: 'Ты эксперт по анализу криптовалютных рынков. Создавай структурированные прогнозы на русском языке с конкретными рекомендациями.'
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'market_prediction',
          schema: {
            type: 'object',
            properties: {
              symbol: { type: 'string' },
              prediction: { type: 'string' },
              direction: { type: 'string', enum: ['bullish', 'bearish', 'neutral'] },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              timeframe: { type: 'string' },
              target_price: { type: 'string' },
              support_level: { type: 'string' },
              resistance_level: { type: 'string' },
              key_factors: { type: 'array', items: { type: 'string' } },
              risks: { type: 'array', items: { type: 'string' } },
              recommendations: {
                type: 'object',
                properties: {
                  entry_point: { type: 'string' },
                  stop_loss: { type: 'string' },
                  take_profit: { type: 'string' }
                }
              }
            },
            required: ['symbol', 'prediction', 'direction', 'confidence', 'timeframe'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: settings?.reasoningEffort || 'high',
      verbosity: settings?.verbosity || 'medium',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating market prediction:', error);
    throw new Error('Ошибка при создании прогноза. Попробуйте еще раз.');
  }
}

/**
 * Streams AI responses for real-time chat experience
 * @param {string} userMessage - User's message
 * @param {Object} settings - AI settings
 * @param {Function} onChunk - Callback for each chunk
 */
export async function streamMarketAnalysis(userMessage, settings = {}, onChunk) {
  try {
    const systemPrompt = settings?.systemPrompt || `
      Ты эксперт по техническому анализу финансовых рынков. 
      Отвечай на русском языке, предоставляй конкретные данные и рекомендации.
      Настройки: ${settings?.analysisType || 'technical'} анализ, 
      риск: ${settings?.riskTolerance || 'medium'}, 
      таймфрейм: ${settings?.timeframe || '1h'}
    `;

    const stream = await openai?.chat?.completions?.create({
      model: settings?.model || 'gpt-5-mini', // Use mini for faster streaming
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      stream: true,
      reasoning_effort: 'minimal', // For faster streaming
      verbosity: settings?.verbosity || 'medium',
    });

    for await (const chunk of stream) {
      const content = chunk?.choices?.[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error in streaming analysis:', error);
    throw error;
  }
}

/**
 * Validates AI settings configuration
 * @param {Object} settings - Settings to validate
 * @returns {Object} Validated settings with defaults
 */
export function validateAISettings(settings) {
  const validModels = ['gpt-5', 'gpt-5-mini', 'gpt-4o', 'gpt-4o-mini'];
  const validAnalysisTypes = ['technical', 'fundamental', 'sentiment', 'mixed'];
  const validRiskLevels = ['conservative', 'medium', 'aggressive'];
  const validTimeframes = ['15m', '1h', '4h', '1d', '1w'];
  const validReasoningEfforts = ['minimal', 'low', 'medium', 'high'];
  const validVerbosityLevels = ['low', 'medium', 'high'];

  return {
    model: validModels?.includes(settings?.model) ? settings?.model : 'gpt-5',
    analysisType: validAnalysisTypes?.includes(settings?.analysisType) ? settings?.analysisType : 'technical',
    riskTolerance: validRiskLevels?.includes(settings?.riskTolerance) ? settings?.riskTolerance : 'medium',
    timeframe: validTimeframes?.includes(settings?.timeframe) ? settings?.timeframe : '1h',
    reasoningEffort: validReasoningEfforts?.includes(settings?.reasoningEffort) ? settings?.reasoningEffort : 'medium',
    verbosity: validVerbosityLevels?.includes(settings?.verbosity) ? settings?.verbosity : 'medium',
    confidence: Math.max(0.5, Math.min(1, settings?.confidence || 0.75)),
    maxTokens: Math.max(500, Math.min(4000, settings?.maxTokens || 2000)),
    enablePredictions: Boolean(settings?.enablePredictions),
    autoRefresh: Boolean(settings?.autoRefresh),
    systemPrompt: settings?.systemPrompt || ''
  };
}

export default openai;