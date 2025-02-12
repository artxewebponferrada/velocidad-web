"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Laptop, Smartphone } from "lucide-react";

const METRICS = [
  { key: "performance", name: "Rendimiento", color: "hsl(var(--chart-1))" },
  { key: "accessibility", name: "Accesibilidad", color: "hsl(var(--chart-2))" },
  {
    key: "bestPractices",
    name: "Mejores Prácticas",
    color: "hsl(var(--chart-3))",
  },
  { key: "seo", name: "SEO", color: "hsl(var(--chart-4))" },
];

interface CircleProgressProps {
  value: number;
  color: string;
  label: string;
}

function CircleProgress({ value, color, label }: CircleProgressProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (100 - value) * circumference / 100;

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm">
      <div className="relative">
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="transform -rotate-90"
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted opacity-25"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </motion.svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className="text-2xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {value}%
          </motion.span>
        </div>
      </div>
      <span className="text-base font-medium text-center">{label}</span>
    </div>
  );
}

export function ResultsChart({ results }: { results: any[] }) {
  const mobileResults = results.find(r => r.device === "mobile");
  const desktopResults = results.find(r => r.device === "desktop");

  return (
    <Card className="w-full p-8 backdrop-blur-sm bg-card/95">
      <h2 className="text-3xl font-bold text-center mb-8">Resultados del Análisis</h2>
      
      <Tabs defaultValue="mobile" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="mobile" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Móvil
          </TabsTrigger>
          <TabsTrigger value="desktop" className="gap-2">
            <Laptop className="h-4 w-4" />
            Escritorio
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="mobile" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {METRICS.map((metric) => (
              <CircleProgress
                key={metric.key}
                value={mobileResults[metric.key]}
                color={metric.color}
                label={metric.name}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="desktop" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {METRICS.map((metric) => (
              <CircleProgress
                key={metric.key}
                value={desktopResults[metric.key]}
                color={metric.color}
                label={metric.name}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}