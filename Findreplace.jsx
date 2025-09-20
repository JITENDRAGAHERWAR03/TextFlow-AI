
import React, { useState, useEffect } from "react";
import { ReplaceJob } from "@/entities/ReplaceJob";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Sparkles, Search, Replace, Eye, Save, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

import TextInput from "../components/replace/TextInput";
import PatternInput from "../components/replace/PatternInput";
import PreviewPane from "../components/replace/PreviewPane";
import AISuggestions from "../components/replace/AISuggestions";

export default function FindReplacePage() {
  const [jobName, setJobName] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [findPattern, setFindPattern] = useState("");
  const [replaceWith, setReplaceWith] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWordsOnly, setWholeWordsOnly] = useState(false);
  
  const [previewText, setPreviewText] = useState("");
  const [matchesFound, setMatchesFound] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("input");

  useEffect(() => {
    const generatePreview = () => {
      if (!originalText || !findPattern) {
        setPreviewText(originalText);
        setMatchesFound(0);
        return;
      }

      try {
        let flags = 'g';
        if (!caseSensitive) flags += 'i';
        
        let searchPattern;
        if (isRegex) {
          searchPattern = new RegExp(findPattern, flags);
        } else {
          let escapedPattern = findPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          if (wholeWordsOnly) {
            escapedPattern = `\\b${escapedPattern}\\b`;
          }
          searchPattern = new RegExp(escapedPattern, flags);
        }

        const matches = originalText.match(searchPattern) || [];
        setMatchesFound(matches.length);
        
        const processed = originalText.replace(searchPattern, replaceWith);
        setPreviewText(processed);
        setError(null);
      } catch (err) {
        setError(`Invalid pattern: ${err.message}`);
        setPreviewText(originalText);
        setMatchesFound(0);
      }
    };

    const debounceTimer = setTimeout(generatePreview, 300);
    return () => clearTimeout(debounceTimer);
  }, [originalText, findPattern, replaceWith, isRegex, caseSensitive, wholeWordsOnly]);

  const getAISuggestions = async () => {
    if (!originalText || !findPattern) return;
    
    setIsProcessing(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze this text replacement task and provide intelligent suggestions:

Original text: "${originalText.substring(0, 500)}..."
Find pattern: "${findPattern}"
Replace with: "${replaceWith}"

Please provide 3-5 contextually appropriate replacement suggestions that:
1. Maintain the meaning and flow of the text
2. Consider grammatical correctness
3. Account for different contexts where the pattern appears
4. Suggest variations that might be more appropriate`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  original: { type: "string" },
                  suggested: { type: "string" },
                  context: { type: "string" },
                  confidence: { type: "number" }
                }
              }
            }
          }
        }
      });

      setAiSuggestions(response.suggestions || []);
    } catch (err) {
      console.error('Error getting AI suggestions:', err);
    }
    setIsProcessing(false);
  };

  const applyReplacement = async () => {
    if (!jobName.trim()) {
      setError("Please enter a job name");
      return;
    }

    setIsProcessing(true);
    try {
      await ReplaceJob.create({
        name: jobName,
        original_text: originalText,
        find_pattern: findPattern,
        replace_with: replaceWith,
        is_regex: isRegex,
        case_sensitive: caseSensitive,
        whole_words_only: wholeWordsOnly,
        processed_text: previewText,
        matches_found: matchesFound,
        replacements_made: matchesFound,
        status: "completed",
        ai_suggestions: aiSuggestions
      });

      setError(null);
      // Reset form
      setJobName("");
      setOriginalText("");
      setFindPattern("");
      setReplaceWith("");
      setPreviewText("");
      setMatchesFound(0);
      setAiSuggestions([]);
      setActiveTab("input");
      
    } catch (err) {
      setError("Failed to save replacement job");
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Smart Find & Replace</h1>
          <p className="text-slate-600">AI-powered text processing with intelligent suggestions</p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Input
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
              {matchesFound > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {matchesFound}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Suggestions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <TextInput 
                originalText={originalText}
                setOriginalText={setOriginalText}
                jobName={jobName}
                setJobName={setJobName}
              />
              
              <PatternInput
                findPattern={findPattern}
                setFindPattern={setFindPattern}
                replaceWith={replaceWith}
                setReplaceWith={setReplaceWith}
                isRegex={isRegex}
                setIsRegex={setIsRegex}
                caseSensitive={caseSensitive}
                setCaseSensitive={setCaseSensitive}
                wholeWordsOnly={wholeWordsOnly}
                setWholeWordsOnly={setWholeWordsOnly}
              />
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <PreviewPane 
              originalText={originalText}
              previewText={previewText}
              matchesFound={matchesFound}
              findPattern={findPattern}
              replaceWith={replaceWith}
            />
          </TabsContent>

          <TabsContent value="ai">
            <AISuggestions
              suggestions={aiSuggestions}
              onGetSuggestions={getAISuggestions}
              isProcessing={isProcessing}
              onApplySuggestion={(suggestion) => {
                setReplaceWith(suggestion.suggested);
                setActiveTab("preview");
              }}
            />
          </TabsContent>
        </Tabs>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mt-8"
        >
          <div className="flex items-center gap-4">
            {matchesFound > 0 && (
              <Badge variant="outline" className="text-base py-2 px-4">
                {matchesFound} match{matchesFound !== 1 ? 'es' : ''} found
              </Badge>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={getAISuggestions}
              disabled={!originalText || !findPattern || isProcessing}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Get AI Suggestions
            </Button>
            
            <Button
              onClick={applyReplacement}
              disabled={!originalText || !findPattern || !jobName.trim() || isProcessing}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Job
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
