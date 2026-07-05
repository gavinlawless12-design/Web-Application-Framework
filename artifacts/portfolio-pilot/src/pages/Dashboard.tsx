import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Newspaper, Search, Activity, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetProfile, useGetMarketOverview, useGetTrendingStocks, useGetMarketNews, useGetRecommendationSummary } from '@workspace/api-client-react';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useGetProfile({
    query: { retry: false, queryKey: ['profile'] }
  });

  const { data: marketOverview, isLoading: isMarketLoading } = useGetMarketOverview({
    query: { queryKey: ['market-overview'] }
  });
  
  const { data: trendingData, isLoading: isTrendingLoading } = useGetTrendingStocks({
    query: { queryKey: ['trending-stocks'] }
  });
  
  const { data: newsData, isLoading: isNewsLoading } = useGetMarketNews({
    query: { queryKey: ['market-news'] }
  });

  const { data: recSummary, isLoading: isRecSummaryLoading } = useGetRecommendationSummary({
    query: { queryKey: ['rec-summary'] }
  });

  useEffect(() => {
    if (isProfileError) {
      setLocation('/setup');
    }
  }, [isProfileError, setLocation]);

  if (isProfileLoading || isMarketLoading) {
    return <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>;
  }

  // Circular progress math
  const fgScore = marketOverview?.fearGreedIndex || 50;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fgScore / 100) * circumference;

  const fgColor = fgScore > 75 ? 'text-green-500' : fgScore > 55 ? 'text-green-400' : fgScore > 45 ? 'text-yellow-500' : fgScore > 25 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Terminal Dashboard</h1>
          <p className="text-muted-foreground mt-1">Market overview and personalized insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/screener">
            <Button variant="outline" className="border-white/10 bg-card hover:bg-white/5 gap-2">
              <Search className="w-4 h-4" /> Global Screener
            </Button>
          </Link>
          <Link href="/discover">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-[0_0_10px_rgba(0,212,170,0.2)]">
              <Cpu className="w-4 h-4" /> AI Recommendations
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Market Indexes */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketOverview?.indexes.map((idx) => (
            <Card key={idx.ticker} className="bg-card border-card-border">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">{idx.name}</div>
                    <div className="text-2xl font-bold tracking-tight mt-1">{idx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  <div className={`flex items-center text-sm font-medium ${idx.change1dPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {idx.change1dPct >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {Math.abs(idx.change1dPct).toFixed(2)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fear & Greed */}
        <Card className="bg-card border-card-border flex flex-col items-center justify-center p-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="40" className="stroke-white/10" strokeWidth="8" fill="none" />
              <circle 
                cx="64" cy="64" r="40" 
                className={`stroke-current ${fgColor} transition-all duration-1000 ease-out`} 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{fgScore}</span>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className={`font-semibold ${fgColor}`}>{marketOverview?.fearGreedLabel || 'Neutral'}</div>
            <div className="text-xs text-muted-foreground mt-1">Fear & Greed Index</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Trending & Profile */}
        <div className="space-y-6">
          <Card className="bg-card border-card-border h-[400px] flex flex-col">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Trending Tickers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              {isTrendingLoading ? (
                <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {trendingData?.trending.map((stock) => (
                    <Link key={stock.ticker} href={`/stocks/${stock.ticker}`}>
                      <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div>
                          <div className="font-semibold group-hover:text-primary transition-colors">{stock.ticker}</div>
                          <div className="text-xs text-muted-foreground truncate w-32">{stock.company}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${stock.price.toFixed(2)}</div>
                          <div className={`text-xs font-medium ${stock.change1dPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {stock.change1dPct >= 0 ? '+' : ''}{stock.change1dPct.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-5">
              <div className="text-sm text-muted-foreground mb-1">Your Objective</div>
              <div className="text-xl font-semibold capitalize mb-4 text-primary">{profile?.goal.replace('_', ' ')}</div>
              
              {!isRecSummaryLoading && recSummary && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Active Recs</div>
                    <div className="font-medium">{recSummary.totalRecommendations}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                    <div className="font-medium">{recSummary.avgScore.toFixed(0)}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Middle Column: News Feed */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-card-border h-full min-h-[500px] flex flex-col">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-primary" /> Market Terminal Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              {isNewsLoading ? (
                <div className="p-6 text-center text-sm text-muted-foreground">Fetching live news...</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {newsData?.map((article) => (
                    <a key={article.id} href={article.url} target="_blank" rel="noreferrer" className="block p-5 hover:bg-white/5 transition-colors group">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="font-medium text-sm leading-snug group-hover:text-primary transition-colors">
                          {article.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-white/5 px-2 py-1 rounded">
                          {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/70">{article.source}</span>
                        {article.tickers.length > 0 && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <div className="flex items-center gap-1.5">
                              {article.tickers.slice(0,3).map(t => (
                                <span key={t} className="text-[10px] font-mono text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
