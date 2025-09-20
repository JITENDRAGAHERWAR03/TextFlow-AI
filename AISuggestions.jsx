import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AISuggestions({
  suggestions,
  onGetSuggestions,
  isProcessing,
  onApplySuggestion
}) {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">AI-Powered Suggestions</h2>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-purple-200">
            <Sparkles className="w-3 h-3 mr-1" />
            Smart Analysis
          </Badge>
        </div>
        
        <Button
          onClick={onGetSuggestions}
          disabled={isProcessing}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Get Suggestions
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getConfidenceColor(suggestion.confidence)}>
                            {suggestion.confidence}% confidence
                          </Badge>
                          <span className="text-sm text-slate-500">
                            Suggestion {index + 1}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                            {suggestion.original}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                          <span className="font-mono text-sm bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-emerald-700">
                            {suggestion.suggested}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          <strong>Context:</strong> {suggestion.context}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => onApplySuggestion(suggestion)}
                        className="shrink-0 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No suggestions yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Click "Get Suggestions" to analyze your text and receive AI-powered replacement recommendations
              </p>
            </CardContent>
          </Card>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
