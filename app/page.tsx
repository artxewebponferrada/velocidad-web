"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ResultsChart } from "@/components/results-chart";
import { Footer } from "@/components/footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateAndFormatUrl = (input: string) => {
    let formattedUrl = input.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    try {
      new URL(formattedUrl);
      return { isValid: true, url: formattedUrl };
    } catch {
      return { isValid: false, url: formattedUrl };
    }
  };

  const analyzeUrl = async () => {
    const { isValid, url: formattedUrl } = validateAndFormatUrl(url);
    if (!formattedUrl) return;
    if (!isValid) {
      setError("Por favor, introduce una URL válida (ejemplo: ejemplo.com)");
      return;
    }

    setError(null);
    setLoading(true);
    setResults([]);
    
    try {
      const results = [];
      for (const strategy of ["mobile", "desktop"]) {
        const response = await fetch(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
            formattedUrl
          )}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo&locale=es&key=AIzaSyDzN1uEd92Kipu004tkOHaXF6lnt3B_EOk`
        );
        
        if (!response.ok) {
          throw new Error("Error al analizar la URL: " + response.statusText);
        }

        const data = await response.json();
        
        if (!data.lighthouseResult?.categories) {
          throw new Error("No se pudieron obtener los resultados del análisis");
        }

        const categories = data.lighthouseResult.categories;
        results.push({
          device: strategy,
          performance: Math.round(categories.performance.score * 100),
          accessibility: Math.round(categories.accessibility.score * 100),
          bestPractices: Math.round(categories["best-practices"].score * 100),
          seo: Math.round(categories.seo.score * 100),
        });
      }
      setResults(results);
    } catch (error) {
      console.error("Error al analizar la URL:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error al analizar la página. Por favor, verifica la URL e inténtalo de nuevo."
      );
      setResults([]);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeUrl();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <main className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center space-y-8 max-w-5xl mx-auto"
        >
          <div className="text-center space-y-4 w-full">
            <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Velocidad Web
            </h1>
            <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
              Analiza la velocidad y rendimiento de cualquier página web utilizando
              Google PageSpeed Insights
            </p>
          </div>

          <Card className="w-full p-6 shadow-lg border-2">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Introduce la URL de la página web (ej: ejemplo.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 text-lg flex-1"
              />
              <Button
                type="submit"
                disabled={loading || !url}
                className="h-12 px-8 text-lg"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analizando...
                  </span>
                ) : (
                  "Analizar"
                )}
              </Button>
            </form>
          </Card>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <ResultsChart results={results} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}