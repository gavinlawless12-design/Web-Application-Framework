import { useGetRecommendations } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

export default function Discover() {
  const { data: recommendations, isLoading } = useGetRecommendations({
    query: { queryKey: ['recommendations'] }
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto animate-pulse space-y-6">
        <div className="h-10 bg-white/5 w-1/3 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-card rounded-xl border border-white/5"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Cpu className="w-8 h-8 text-primary" /> AI Recommendations
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Equities identified by our engine matching your profile goals, risk tolerance, and factor preferences. Scored out of 100.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations?.map((stock) => {
          // Score coloring
          const scoreColor = stock.score >= 80 ? 'text-green-500 stroke-green-500 bg-green-500/10' : 
                            stock.score >= 60 ? 'text-primary stroke-primary bg-primary/10' : 
                            stock.score >= 40 ? 'text-yellow-500 stroke-yellow-500 bg-yellow-500/10' : 
                            'text-red-500 stroke-red-500 bg-red-500/10';

          const radius = 24;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (stock.score / 100) * circumference;

          return (
            <Card key={stock.ticker} className="bg-card border-card-border overflow-hidden hover:border-primary/50 transition-colors group flex flex-col">
              <CardContent className="p-0 flex flex-col h-full">
                {/* Header */}
                <div className="p-5 border-b border-white/5 flex justify-between items-start bg-white/[0.02]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-xl">{stock.ticker}</h3>
                      <Badge variant="outline" className="text-[10px] font-normal uppercase bg-background border-white/10">
                        {stock.sector}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate w-48" title={stock.company}>{stock.company}</div>
                  </div>
                  
                  {/* Circular Score */}
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="24" className="stroke-white/10" strokeWidth="4" fill="none" />
                      <circle 
                        cx="32" cy="32" r="24" 
                        className={cn("transition-all duration-1000 ease-out", scoreColor.split(' ')[1])}
                        strokeWidth="4" 
                        fill="none" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={cn("text-lg font-bold", scoreColor.split(' ')[0])}>{stock.score}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
                  <div className="p-3 text-center">
                    <div className="text-[10px] text-muted-foreground uppercase mb-1">Price</div>
                    <div className="font-medium text-sm">${stock.price.toFixed(2)}</div>
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-[10px] text-muted-foreground uppercase mb-1">Change</div>
                    <div className={`font-medium text-sm flex items-center justify-center ${stock.change1dPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change1dPct >= 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                      {Math.abs(stock.change1dPct).toFixed(2)}%
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <div className="text-[10px] text-muted-foreground uppercase mb-1">P/E</div>
                    <div className="font-medium text-sm">{stock.peRatio ? stock.peRatio.toFixed(1) : '-'}</div>
                  </div>
                </div>

                {/* AI Explanation & Breakdown */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    "{stock.aiExplanation}"
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex gap-2 items-start">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-foreground/80 line-clamp-1">{stock.pros[0]}</span>
                    </div>
                    {stock.cons.length > 0 && (
                      <div className="flex gap-2 items-start">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                        <span className="text-xs text-foreground/80 line-clamp-1">{stock.cons[0]}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link href={`/stocks/${stock.ticker}`} className="w-full">
                    <button className="w-full py-2.5 rounded border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group-hover:border-primary/50 group-hover:text-primary">
                      Deep Dive Analysis <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
