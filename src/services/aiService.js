import openai from './openaiClient';

/**
 * Market prediction AI service using GPT-5 for enhanced market analysis
 */
export class AIMarketService {
  
  /**
   * Predicts market trends based on symbol and custom parameters
   * @param {string} symbol - Stock symbol to analyze
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Market prediction analysis
   */
  async predictMarketTrends(symbol, options = {}) {
    try {
      const {
        timeframe = '1 day',
        analysisType = 'technical',
        reasoningDepth = 'medium',
        includeSentiment = true,
        customPrompt = null
      } = options;

      const systemPrompt = this.buildSystemPrompt(analysisType, includeSentiment);
      const userPrompt = customPrompt || this.buildUserPrompt(symbol, timeframe, analysisType);

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        reasoning_effort: reasoningDepth,
        verbosity: 'medium',
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'market_prediction',
            schema: {
              type: 'object',
              properties: {
                symbol: { type: 'string' },
                prediction: { type: 'string' },
                confidence: { 
                  type: 'number', 
                  minimum: 0, 
                  maximum: 1,
                  description: 'Confidence level (0-1)'
                },
                direction: { 
                  type: 'string',
                  enum: ['bullish', 'bearish', 'neutral'],
                  description: 'Market direction prediction'
                },
                key_factors: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Key factors influencing the prediction'
                },
                risk_level: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'Risk assessment level'
                },
                timeframe: { type: 'string' },
                targets: {
                  type: 'object',
                  properties: {
                    support: { type: 'number', description: 'Support level' },
                    resistance: { type: 'number', description: 'Resistance level' },
                    target_price: { type: 'number', description: 'Target price' }
                  }
                },
                reasoning: { 
                  type: 'string',
                  description: 'Detailed reasoning behind the prediction'
                }
              },
              required: ['symbol', 'prediction', 'confidence', 'direction', 'key_factors', 'risk_level'],
              additionalProperties: false
            }
          }
        }
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error in market prediction:', error);
      throw new Error('Failed to generate market prediction. Please try again.');
    }
  }

  /**
   * Custom AI analysis with user-defined prompts
   * @param {string} prompt - Custom user prompt
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} AI analysis response
   */
  async customAnalysis(prompt, options = {}) {
    try {
      const {
        reasoningDepth = 'medium',
        verbosity = 'medium',
        includeConfidence = true
      } = options;

      const systemPrompt = `You are an expert financial analyst and trading advisor with deep knowledge of market dynamics, technical analysis, and economic factors. You provide detailed, actionable insights while being transparent about limitations and risks. Always include confidence levels and risk assessments in your analysis.`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        reasoning_effort: reasoningDepth,
        verbosity: verbosity,
        response_format: includeConfidence ? {
          type: 'json_schema',
          json_schema: {
            name: 'custom_analysis',
            schema: {
              type: 'object',
              properties: {
                analysis: { 
                  type: 'string',
                  description: 'Detailed analysis response'
                },
                key_insights: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Key insights from the analysis'
                },
                confidence: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1,
                  description: 'Confidence in the analysis (0-1)'
                },
                risk_factors: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Potential risk factors to consider'
                },
                recommendations: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Actionable recommendations'
                }
              },
              required: ['analysis', 'confidence'],
              additionalProperties: false
            }
          }
        } : undefined
      });

      if (includeConfidence) {
        return JSON.parse(response?.choices?.[0]?.message?.content);
      } else {
        return {
          analysis: response?.choices?.[0]?.message?.content,
          confidence: 0.8 // Default confidence for non-structured responses
        };
      }
    } catch (error) {
      console.error('Error in custom analysis:', error);
      throw new Error('Failed to generate custom analysis. Please try again.');
    }
  }

  /**
   * Real-time market sentiment analysis
   * @param {string} symbol - Stock symbol
   * @param {Array} newsData - Recent news data (optional)
   * @returns {Promise<Object>} Sentiment analysis
   */
  async analyzeSentiment(symbol, newsData = []) {
    try {
      const newsContext = newsData?.length > 0 
        ? `Recent news: ${newsData?.map(news => news?.title)?.join('; ')}`
        : 'No recent news data provided';

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini', // Use mini for faster sentiment analysis
        messages: [
          { 
            role: 'system', 
            content: 'You are a market sentiment analyst. Analyze the overall sentiment for the given stock based on available information.' 
          },
          { 
            role: 'user', 
            content: `Analyze market sentiment for ${symbol}. ${newsContext}` 
          },
        ],
        reasoning_effort: 'low', // Fast analysis for sentiment
        verbosity: 'low',
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'sentiment_analysis',
            schema: {
              type: 'object',
              properties: {
                symbol: { type: 'string' },
                sentiment_score: {
                  type: 'number',
                  minimum: -1,
                  maximum: 1,
                  description: 'Sentiment score from -1 (very negative) to 1 (very positive)'
                },
                sentiment_label: {
                  type: 'string',
                  enum: ['very_positive', 'positive', 'neutral', 'negative', 'very_negative']
                },
                confidence: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1
                },
                key_factors: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              required: ['symbol', 'sentiment_score', 'sentiment_label', 'confidence'],
              additionalProperties: false
            }
          }
        }
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error in sentiment analysis:', error);
      throw new Error('Failed to analyze sentiment. Please try again.');
    }
  }

  /**
   * Build system prompt based on analysis type
   */
  buildSystemPrompt(analysisType, includeSentiment) {
    const basePrompt = `You are an expert financial analyst and trading advisor specializing in ${analysisType} analysis. You have deep knowledge of market dynamics, chart patterns, economic indicators, and risk management.`;
    
    const analysisPrompts = {
      technical: `Focus on technical indicators, chart patterns, support/resistance levels, volume analysis, and price action. Use technical analysis principles to make predictions.`,
      fundamental: `Focus on company fundamentals, earnings, revenue growth, market position, industry trends, and economic factors. Analyze financial health and intrinsic value.`,
      hybrid: `Combine both technical and fundamental analysis. Consider chart patterns alongside company fundamentals and market conditions.`
    };

    const sentimentAddition = includeSentiment 
      ? ` Also consider market sentiment, news impact, and social media trends in your analysis.`
      : '';

    return `${basePrompt} ${analysisPrompts?.[analysisType] || analysisPrompts?.hybrid}${sentimentAddition}

IMPORTANT GUIDELINES:
- Always provide realistic confidence levels
- Include specific risk factors and limitations
- Give actionable insights with clear reasoning
- Be transparent about uncertainties
- Focus on risk management alongside opportunities`;
  }

  /**
   * Build user prompt for market prediction
   */
  buildUserPrompt(symbol, timeframe, analysisType) {
    return `Analyze ${symbol} for the ${timeframe} timeframe using ${analysisType} analysis. 

Please provide:
1. Market direction prediction (bullish/bearish/neutral)
2. Confidence level with reasoning
3. Key factors supporting your analysis
4. Risk assessment and potential threats
5. Price targets if applicable (support/resistance levels)
6. Specific recommendations for traders/investors

Consider current market conditions, volatility, and any relevant economic factors.`;
  }
}

// Export singleton instance
export const aiMarketService = new AIMarketService();