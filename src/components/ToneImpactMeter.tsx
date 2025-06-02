
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { AIService } from '@/services/aiService';

interface ToneImpactMeterProps {
  message: string;
}

interface ToneAnalysis {
  tone: 'aggressive' | 'weak' | 'confusing' | 'neutral' | 'positive' | 'professional' | 'casual' | 'urgent';
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  suggestions?: string[];
  analysis?: string;
}

export const ToneImpactMeter: React.FC<ToneImpactMeterProps> = ({ message }) => {
  const [analysis, setAnalysis] = useState<ToneAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const analyzeMessage = async () => {
      if (!message.trim()) {
        setAnalysis(null);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Analyzing tone for message:', message);
        const response = await AIService.analyzeTone(message);
        console.log('Tone analysis response:', response);
        
        if (response.success && response.data) {
          // Handle different response formats
          let analysisData = response.data;
          
          // If the response is nested, extract the actual analysis
          if (analysisData.analysis && typeof analysisData.analysis === 'object') {
            analysisData = analysisData.analysis;
          }
          
          // Ensure we have the expected structure
          const finalAnalysis = {
            tone: analysisData.tone || 'neutral',
            impact: analysisData.impact || 'medium',
            confidence: analysisData.confidence || 75,
            suggestions: analysisData.suggestions || [],
            analysis: analysisData.analysis
          };
          
          setAnalysis(finalAnalysis);
        }
      } catch (error) {
        console.error('Failed to analyze tone:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(analyzeMessage, 500);
    return () => clearTimeout(debounceTimer);
  }, [message]);

  if (!message.trim()) return null;

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'aggressive': return 'bg-red-600';
      case 'weak': return 'bg-yellow-600';
      case 'confusing': return 'bg-orange-600';
      case 'positive': return 'bg-green-600';
      case 'professional': return 'bg-blue-600';
      case 'casual': return 'bg-purple-600';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-slate-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-white flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span>Tone & Impact Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center space-x-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing...</span>
          </div>
        ) : analysis ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={`${getToneColor(analysis.tone)} text-white text-xs`}>
                  {analysis.tone.toUpperCase()}
                </Badge>
                <div className={`flex items-center space-x-1 ${getImpactColor(analysis.impact)}`}>
                  {getImpactIcon(analysis.impact)}
                  <span className="text-xs font-medium">{analysis.impact.toUpperCase()} IMPACT</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Confidence</span>
                <span className="text-slate-300">{Math.round(analysis.confidence)}%</span>
              </div>
              <Progress value={analysis.confidence} className="h-1" />
            </div>

            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Suggestions:</span>
                <ul className="text-xs text-slate-300 space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-1">
                      <span className="text-purple-400">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.analysis && (
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Analysis:</span>
                <p className="text-xs text-slate-300">{analysis.analysis}</p>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
