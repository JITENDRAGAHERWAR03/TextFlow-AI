import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PreviewPane({
  originalText,
  previewText,
  matchesFound,
  findPattern,
  replaceWith
}) {
  const highlightChanges = (text, pattern, replacement) => {
    if (!pattern || !text) return text;

    try {
      let flags = 'gi';
      let searchPattern;
      
      try {
        searchPattern = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
      } catch {
        return text;
      }

      return text.split(searchPattern).reduce((result, part, index, array) => {
        if (index === array.length - 1) {
          return result + part;
        }
        
        return result + part + 
          `<mark class="bg-yellow-200 px-1 rounded">${replacement}</mark>`;
      }, '');
    } catch {
      return text;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Preview Changes</h2>
          {matchesFound > 0 && (
            <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
              {matchesFound} replacement{matchesFound !== 1 ? 's' : ''} found
            </Badge>
          )}
        </div>
        
        {findPattern && replaceWith && (
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
            <span className="font-mono bg-white px-2 py-1 rounded border">
              {findPattern}
            </span>
            <ArrowRight className="w-4 h-4" />
            <span className="font-mono bg-white px-2 py-1 rounded border">
              {replaceWith}
            </span>
          </div>
        )}
      </div>

      <Tabs defaultValue="side-by-side" className="w-full">
        <TabsList className="bg-white shadow-sm border">
          <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
          <TabsTrigger value="highlighted">Highlighted Changes</TabsTrigger>
          <TabsTrigger value="diff">Diff View</TabsTrigger>
        </TabsList>

        <TabsContent value="side-by-side">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-4 h-4 text-slate-600" />
                  Original
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-auto bg-slate-50 p-4 rounded-lg font-mono text-sm leading-relaxed">
                  {originalText || "No content to preview"}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  After Changes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-auto bg-emerald-50 p-4 rounded-lg font-mono text-sm leading-relaxed">
                  {previewText || originalText || "No content to preview"}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="highlighted">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-600" />
                Highlighted Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="max-h-96 overflow-auto bg-white p-4 rounded-lg border font-mono text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: highlightChanges(previewText || originalText, findPattern, replaceWith) 
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diff">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Diff View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-auto">
                {originalText && previewText && originalText !== previewText ? (
                  <>
                    <div className="font-mono text-sm bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <span className="text-red-600 font-semibold">- </span>
                      {originalText.substring(0, 200)}...
                    </div>
                    <div className="font-mono text-sm bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <span className="text-green-600 font-semibold">+ </span>
                      {previewText.substring(0, 200)}...
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 text-center py-8">
                    No changes detected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
