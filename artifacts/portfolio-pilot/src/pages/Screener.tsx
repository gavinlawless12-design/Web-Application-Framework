import { useState } from 'react';
import { Link } from 'wouter';
import { Filter, DownloadCloud, ChevronDown, ChevronUp, Star, SlidersHorizontal } from 'lucide-react';
import { useRunScreener, useGetScreenerPresets } from '@workspace/api-client-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

export default function Screener() {
  const [activePreset, setActivePreset] = useState<string>('growth');
  
  const { data: presets } = useGetScreenerPresets({
    query: { queryKey: ['screener-presets'] }
  });

  const { data: results, isLoading } = useRunScreener({
    query: { 
      queryKey: ['screener', activePreset],
    }
  });

  return (
    <div className="h-full flex flex-col p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Filter className="w-8 h-8 text-primary" /> Global Screener
          </h1>
          <p className="text-muted-foreground mt-2">Filter the universe of equities by fundamentals and AI score.</p>
        </div>
        <Button variant="outline" className="border-white/10 gap-2">
          <DownloadCloud className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        
        {/* Filter Sidebar */}
        <Card className="bg-card border-card-border w-full xl:w-80 shrink-0 overflow-y-auto max-h-[800px] xl:max-h-full scrollbar-none">
          <div className="p-4 border-b border-white/5 sticky top-0 bg-card z-10">
            <h2 className="font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Parameters
            </h2>
          </div>
          
          <div className="p-4 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Presets</label>
              <Tabs value={activePreset} onValueChange={setActivePreset} className="w-full">
                <TabsList className="grid grid-cols-2 gap-2 h-auto bg-transparent p-0">
                  {presets?.map(p => (
                    <TabsTrigger 
                      key={p.id} 
                      value={p.id}
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-white/5 bg-white/5 text-xs py-2"
                    >
                      {p.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="h-px bg-white/5" />

            <div className="space-y-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valuation</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground">Min P/E</span>
                  <Input type="number" placeholder="0.0" className="h-8 bg-white/5 border-white/10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground">Max P/E</span>
                  <Input type="number" placeholder="25.0" className="h-8 bg-white/5 border-white/10 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground">Min Yield %</span>
                  <Input type="number" placeholder="0.0" className="h-8 bg-white/5 border-white/10 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-muted-foreground">Max Yield %</span>
                  <Input type="number" placeholder="-" className="h-8 bg-white/5 border-white/10 text-xs" />
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            <div className="space-y-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quality & Growth</label>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Min Revenue Growth %</span>
                </div>
                <Input type="number" placeholder="10" className="h-8 bg-white/5 border-white/10 text-xs" />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Min ROE %</span>
                </div>
                <Input type="number" placeholder="15" className="h-8 bg-white/5 border-white/10 text-xs" />
              </div>
            </div>

            <Button className="w-full bg-primary text-primary-foreground">Apply Custom Filters</Button>
          </div>
        </Card>

        {/* Data Table */}
        <Card className="bg-card border-card-border flex-1 flex flex-col overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/[0.02] border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-4 py-3 font-semibold w-8"></th>
                  <th className="px-4 py-3 font-semibold w-[200px]">Ticker / Company</th>
                  <th className="px-4 py-3 font-semibold">Sector</th>
                  <th className="px-4 py-3 font-semibold text-right">Price</th>
                  <th className="px-4 py-3 font-semibold text-right">Change</th>
                  <th className="px-4 py-3 font-semibold text-right">P/E</th>
                  <th className="px-4 py-3 font-semibold text-right">Rev. Growth</th>
                  <th className="px-4 py-3 font-semibold text-right">Yield</th>
                  <th className="px-4 py-3 font-semibold text-center w-24">PP Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">Loading results...</td>
                  </tr>
                ) : results?.map((stock) => (
                  <tr key={stock.ticker} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3 text-muted-foreground/50 hover:text-yellow-500 cursor-pointer transition-colors">
                      <Star className="w-4 h-4" />
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/stocks/${stock.ticker}`}>
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">{stock.ticker}</div>
                        <div className="text-[10px] text-muted-foreground truncate w-40">{stock.company}</div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px] font-normal border-white/10 bg-transparent">{stock.sector}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">${stock.price.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-mono ${stock.change1dPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change1dPct >= 0 ? '+' : ''}{stock.change1dPct.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{stock.peRatio?.toFixed(1) || '-'}</td>
                    <td className="px-4 py-3 text-right font-mono text-green-400">+{stock.revenueGrowth.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-mono">{stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold ${
                        stock.score >= 80 ? 'bg-green-500/20 text-green-400' :
                        stock.score >= 60 ? 'bg-primary/20 text-primary' :
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {stock.score}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-xs text-muted-foreground">
            <span>Showing top {results?.length || 0} results for {activePreset} criteria</span>
            <span>Sorted by PP Score (Desc)</span>
          </div>
        </Card>

      </div>
    </div>
  );
}
