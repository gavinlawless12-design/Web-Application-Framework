import { useParams, Link } from 'wouter';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, Star, ExternalLink, MessageSquare, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useGetStock } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function StockDetail() {
  const { ticker } = useParams<{ ticker: string }>();
  
  const { data: stock, isLoading, isError } = useGetStock(ticker || '', {
    query: {
      queryKey: ['stock', ticker],
      enabled: !!ticker
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-[1400px] mx-auto animate-pulse space-y-8">
        <div className="h-24 bg-card rounded-xl border border-white/5"></div>
        <div className="h-96 bg-card rounded-xl border border-white/5"></div>
      </div>
    );
  }

  if (isError || !stock) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Stock Not Found</h2>
        <Link href="/screener">
          <Button>Return to Screener</Button>
        </Link>
      </div>
    );
  }

  const isPositive = stock.change1dPct >= 0;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-6 animate-in fade-in">
      {/* Header Card */}
      <Card className="bg-card border-card-border overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-6 items-center">
            <Link href="/screener">
              <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-white/5 hover:bg-white/10 shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-bold tracking-tighter">{stock.ticker}</h1>
                <Badge className="bg-white/10 text-foreground hover:bg-white/20 border-transparent font-medium">{stock.exchange}</Badge>
              </div>
              <h2 className="text-lg text-muted-foreground">{stock.company}</h2>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-[10px] uppercase border-white/10">{stock.sector}</Badge>
                <Badge variant="outline" className="text-[10px] uppercase border-white/10">{stock.industry}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-end gap-4 md:gap-1 w-full md:w-auto justify-between md:justify-end border-t border-white/10 md:border-none pt-4 md:pt-0">
            <div className="text-right">
              <div className="text-4xl font-bold font-mono tracking-tight">${stock.price.toFixed(2)}</div>
              <div className={`flex items-center justify-end text-lg font-medium mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
                {Math.abs(stock.change1d).toFixed(2)} ({Math.abs(stock.change1dPct).toFixed(2)}%)
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="border-white/10 gap-1.5 h-8 text-xs">
                <Star className="w-3.5 h-3.5" /> Watch
              </Button>
              <Link href={`/ai?prompt=Analyze ${stock.ticker} financials`}>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 h-8 text-xs shadow-[0_0_10px_rgba(0,212,170,0.2)]">
                  <MessageSquare className="w-3.5 h-3.5" /> AI Deep Dive
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0 space-x-6">
              {['overview', 'financials', 'analysis', 'news'].map(tab => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="overview" className="pt-6 space-y-6 outline-none">
              
              <Card className="bg-card border-card-border overflow-hidden">
                <CardHeader className="py-4 border-b border-white/5 bg-white/[0.01]">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex justify-between items-center">
                    <span>Price History (1Y)</span>
                    <span className="text-foreground normal-case font-mono">{stock.week52Low} - {stock.week52High}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stock.priceHistory} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="date" hide />
                      <YAxis domain={['auto', 'auto']} hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                        labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                        formatter={(val: number) => [`$${val.toFixed(2)}`, 'Price']}
                      />
                      <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Market Cap', val: stock.marketCap },
                  { label: 'P/E Ratio', val: stock.peRatio?.toFixed(2) || '-' },
                  { label: 'Dividend Yield', val: stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '-' },
                  { label: 'Beta (5Y)', val: stock.beta.toFixed(2) },
                  { label: 'Volume', val: stock.volume },
                  { label: 'Avg Volume', val: stock.avgVolume },
                  { label: 'Institutional Own', val: `${stock.institutionalOwnership.toFixed(1)}%` },
                  { label: 'Analyst Rating', val: stock.analystRating }
                ].map(stat => (
                  <div key={stat.label} className="p-4 bg-card border border-white/5 rounded-lg">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</div>
                    <div className="font-semibold">{stat.val}</div>
                  </div>
                ))}
              </div>

              <Card className="bg-card border-card-border">
                <CardHeader className="py-4 border-b border-white/5">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">About Company</CardTitle>
                </CardHeader>
                <CardContent className="p-5 text-sm text-foreground/80 leading-relaxed">
                  {stock.description}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="financials" className="pt-6 space-y-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-card-border">
                  <CardHeader className="py-4 border-b border-white/5">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Revenue History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stock.revenueHistory}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="period" tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}/>
                        <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card border-card-border">
                  <CardHeader className="py-4 border-b border-white/5">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">EPS History</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stock.epsHistory}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="period" tick={{fontSize: 12, fill: 'hsl(var(--muted-foreground))'}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}/>
                        <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Rev Growth (Y/Y)', val: `${stock.revenueGrowth.toFixed(2)}%`, pos: stock.revenueGrowth > 0 },
                  { label: 'EPS Growth (Y/Y)', val: `${stock.epsGrowth.toFixed(2)}%`, pos: stock.epsGrowth > 0 },
                  { label: 'Oper. Margin', val: `${stock.operatingMargin.toFixed(2)}%`, pos: stock.operatingMargin > 15 },
                  { label: 'Free Cash Flow', val: stock.freeCashFlow, pos: true }
                ].map(stat => (
                  <div key={stat.label} className="p-4 bg-card border border-white/5 rounded-lg flex flex-col justify-between">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{stat.label}</div>
                    <div className={`font-semibold text-lg ${stat.pos ? 'text-green-400' : 'text-foreground'}`}>{stat.val}</div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="pt-6 space-y-6 outline-none">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="py-4 border-b border-primary/10">
                  <CardTitle className="text-sm font-medium uppercase tracking-wider text-primary flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> AI Investment Thesis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 text-sm leading-relaxed">
                  {stock.aiSummary}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-card-border">
                  <CardHeader className="py-4 border-b border-white/5">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-green-500 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Strengths & Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {stock.swot.strengths.concat(stock.swot.opportunities).slice(0,4).map((item, i) => (
                        <div key={i} className="p-4 text-sm flex gap-3">
                          <span className="text-green-500 mt-0.5 shrink-0">+</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-card-border">
                  <CardHeader className="py-4 border-b border-white/5">
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-yellow-500 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Weaknesses & Threats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {stock.swot.weaknesses.concat(stock.swot.threats).slice(0,4).map((item, i) => (
                        <div key={i} className="p-4 text-sm flex gap-3">
                          <span className="text-yellow-500 mt-0.5 shrink-0">-</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="news" className="pt-6 outline-none">
              <div className="space-y-4">
                {stock.news.map(article => (
                  <a key={article.id} href={article.url} target="_blank" rel="noreferrer" className="block">
                    <Card className="bg-card border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{article.title}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.summary}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold uppercase text-muted-foreground/70">{article.source}</div>
                          {article.sentiment && (
                            <Badge variant="outline" className={`text-[10px] capitalize ${
                              article.sentiment === 'positive' ? 'text-green-400 border-green-400/20' :
                              article.sentiment === 'negative' ? 'text-red-400 border-red-400/20' :
                              'text-muted-foreground border-white/10'
                            }`}>
                              {article.sentiment}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </TabsContent>

          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card border-card-border overflow-hidden">
            <div className="bg-primary p-6 text-center text-primary-foreground">
              <div className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-90">PortfolioPilot Score</div>
              <div className="text-6xl font-bold tracking-tighter mb-1">{stock.score}</div>
              <div className="text-xs font-medium opacity-80">Out of 100</div>
            </div>
            <div className="p-4 bg-card divide-y divide-white/5">
               <div className="flex justify-between py-2 text-sm">
                 <span className="text-muted-foreground">Target Price</span>
                 <span className="font-semibold">${stock.targetPrice?.toFixed(2) || '-'}</span>
               </div>
               <div className="flex justify-between py-2 text-sm">
                 <span className="text-muted-foreground">Upside</span>
                 <span className="font-semibold text-green-400">
                   {stock.targetPrice ? `+${(((stock.targetPrice - stock.price) / stock.price) * 100).toFixed(1)}%` : '-'}
                 </span>
               </div>
            </div>
          </Card>

          <Card className="bg-card border-card-border">
            <CardHeader className="py-4 border-b border-white/5">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Peer Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {stock.competitors.map(comp => (
                  <Link key={comp.ticker} href={`/stocks/${comp.ticker}`}>
                    <div className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer flex justify-between items-center group">
                      <div>
                        <div className="font-semibold group-hover:text-primary transition-colors">{comp.ticker}</div>
                        <div className="text-xs text-muted-foreground truncate w-24">{comp.company}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-sm">${comp.price.toFixed(2)}</div>
                        <div className={`text-xs font-mono mt-0.5 ${comp.change1dPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {comp.change1dPct >= 0 ? '+' : ''}{comp.change1dPct.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
