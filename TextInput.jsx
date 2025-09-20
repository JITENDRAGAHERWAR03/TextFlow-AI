import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function TextInput({ 
  originalText, 
  setOriginalText, 
  jobName, 
  setJobName 
}) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            Original Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-name" className="text-sm font-medium text-slate-700">
              Job Name *
            </Label>
            <Input
              id="job-name"
              placeholder="e.g., Brand Update Q1 2024"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              className="border-slate-200 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="original-text" className="text-sm font-medium text-slate-700">
              Text Content
            </Label>
            <Textarea
              id="original-text"
              placeholder="Paste your content here or upload a text file..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              className="min-h-[300px] font-mono text-sm border-slate-200 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline" 
              onClick={() => document.getElementById('file-upload').click()}
              className="flex items-center gap-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Text File
            </Button>
            <span className="text-xs text-slate-500">
              {originalText.length.toLocaleString()} characters
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
