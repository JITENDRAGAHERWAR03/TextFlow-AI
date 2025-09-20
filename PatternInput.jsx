import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Search, Replace } from "lucide-react";
import { motion } from "framer-motion";

export default function PatternInput({
  findPattern,
  setFindPattern,
  replaceWith,
  setReplaceWith,
  isRegex,
  setIsRegex,
  caseSensitive,
  setCaseSensitive,
  wholeWordsOnly,
  setWholeWordsOnly
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Card className="h-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-5 h-5 text-emerald-600" />
            Find & Replace Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="find-pattern" className="text-sm font-medium text-slate-700">
              Find Pattern *
            </Label>
            <Input
              id="find-pattern"
              placeholder={isRegex ? "e.g., \\b[A-Z][a-z]+\\b" : "e.g., Old Company Name"}
              value={findPattern}
              onChange={(e) => setFindPattern(e.target.value)}
              className="font-mono border-slate-200 focus:border-emerald-500 transition-colors"
            />
            {isRegex && (
              <Badge variant="outline" className="text-xs">
                Regex Mode Active
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="replace-with" className="text-sm font-medium text-slate-700">
              Replace With *
            </Label>
            <Input
              id="replace-with"
              placeholder={isRegex ? "e.g., $1 replacement" : "e.g., New Company Name"}
              value={replaceWith}
              onChange={(e) => setReplaceWith(e.target.value)}
              className="font-mono border-slate-200 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800">Options</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="regex-switch" className="text-sm font-medium text-slate-700">
                  Regular Expression
                </Label>
                <p className="text-xs text-slate-500">Use regex patterns for advanced matching</p>
              </div>
              <Switch
                id="regex-switch"
                checked={isRegex}
                onCheckedChange={setIsRegex}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="case-switch" className="text-sm font-medium text-slate-700">
                  Case Sensitive
                </Label>
                <p className="text-xs text-slate-500">Match exact case</p>
              </div>
              <Switch
                id="case-switch"
                checked={caseSensitive}
                onCheckedChange={setCaseSensitive}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="words-switch" className="text-sm font-medium text-slate-700">
                  Whole Words Only
                </Label>
                <p className="text-xs text-slate-500">Match complete words only</p>
              </div>
              <Switch
                id="words-switch"
                checked={wholeWordsOnly}
                onCheckedChange={setWholeWordsOnly}
                disabled={isRegex}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
