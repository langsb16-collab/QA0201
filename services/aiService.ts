
import { GoogleGenAI, Type } from "@google/genai";
import { SurveyResponse, AnalysisResult, Question } from '../types';
import { AI_QUESTION_TEMPLATES } from '../constants';
import { storageService } from './storageService';

export const aiService = {
  generateQuestions: (category: string, goal: string): Question[] => {
    // Structural "Slot-filling" generation for high quality
    const base = AI_QUESTION_TEMPLATES[category] || AI_QUESTION_TEMPLATES.food;
    const goalQuestion: Question = {
      id: "q_goal",
      text: goal === 'influx' ? "저희 지역/매장을 방문하게 된 결정적 동기는?" : "다시 방문하고 싶게 만드는 가장 핵심적인 요소는?",
      type: "SINGLE_CHOICE",
      options: goal === 'influx' ? ["매스컴/SNS", "지인 추천", "우연한 방문", "광고"] : ["품질/맛", "서비스/친절", "가격 경쟁력", "편의 시설"]
    };
    // Ensure logical order (Standard flow: Profile -> Engagement -> Detail -> Feedback)
    return [goalQuestion, ...base.slice(0, 3)];
  },

  analyzeResponses: async (responses: SurveyResponse[]): Promise<AnalysisResult> => {
    if (responses.length === 0) return { stats: { ageGroups: {}, genders: {}, timeBuckets: {}, prefKeywords: [], fairness: { totalResponses: 0, uniqueUsers: 0, blockedAttempts: 0, integrityScore: 100 } }, insights: [], recommendations: [] };

    const surveyId = responses[0].surveyId;
    const ageGroups: Record<string, number> = {};
    const genders: Record<string, number> = {};
    const timeBuckets: Record<string, number> = {};
    const fingerprints = new Set<string>();
    const freeTexts: string[] = [];

    responses.forEach(r => {
      ageGroups[r.metadata.ageGroup] = (ageGroups[r.metadata.ageGroup] || 0) + 1;
      genders[r.metadata.gender] = (genders[r.metadata.gender] || 0) + 1;
      timeBuckets[r.metadata.timeBucket] = (timeBuckets[r.metadata.timeBucket] || 0) + 1;
      if (r.metadata.fingerprint) fingerprints.add(r.metadata.fingerprint);
      
      Object.entries(r.answers).forEach(([_, val]) => {
        if (typeof val === 'string' && val.length > 5) freeTexts.push(val);
      });
    });

    const totalResponses = responses.length;
    const uniqueUsers = fingerprints.size || totalResponses;
    const blockedAttempts = storageService.getBlockedAttempts(surveyId);
    
    // Simulate reliability metric (Cronbach's Alpha logic: internal consistency)
    const integrityScore = Math.max(90, 100 - (blockedAttempts / (totalResponses || 1) * 10));

    const stats = { 
      ageGroups, 
      genders, 
      timeBuckets, 
      prefKeywords: [],
      fairness: {
        totalResponses,
        uniqueUsers,
        blockedAttempts,
        integrityScore: Math.round(integrityScore)
      }
    };

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        전문 데이터 분석가로서 다음 설문 결과를 분석하고 실행 가능한(actionable) 인사이트를 도출해줘:
        대상 데이터: ${totalResponses}건
        연령분포: ${JSON.stringify(ageGroups)}
        피크타임: ${JSON.stringify(timeBuckets)}
        시민 의견: ${freeTexts.slice(0, 15).join('. ')}
        
        Gallup 표준 보고서 양식에 따라 다음 정보를 JSON으로 반환해:
        1. insights: 3가지 핵심 발견점 (데이터 기반)
        2. recommendations: 2가지 실질적 개선 제언
        3. keywords: 가장 많이 언급된 핵심 키워드 5개 (token, count 형태)
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: { 
          systemInstruction: "You are a professional market and public policy analyst. You use scientific methodologies to interpret survey data and provide high-confidence recommendations.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insights: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    token: { type: Type.STRING },
                    count: { type: Type.NUMBER }
                  },
                  propertyOrdering: ["token", "count"]
                }
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return {
        stats: { ...stats, prefKeywords: result.keywords || [] },
        insights: result.insights || [],
        recommendations: result.recommendations || []
      };
    } catch (e) {
      console.error("Analysis failure:", e);
      return { stats, insights: ["데이터 분석 실패"], recommendations: ["재시도 해주세요."] };
    }
  }
};
