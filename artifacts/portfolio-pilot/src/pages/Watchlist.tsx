import { useEffect, useState } from 'react';
import { useGetWatchlists, useCreateWatchlist, useDeleteWatchlist, useSearchStocks, useAddToWatchlist, useRemoveFromWatchlist } from '@workspace/api-client-react';
import { List, Plus, Trash2, Search as SearchIcon, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { Link } from 'wouter';
import { useDebounce } from '@/hooks/use-debounce';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function WatchlistPage() {
  const { toast } = useToast();
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: watchlists, isLoading: isListsLoading } = useGetWatchlists({
    query: { queryKey: ['watchlists'] }
  });

  const activeList = watchlists?.find(w => w.id === activeListId) || watchlists?.[0];

  useEffect(() => {
    if (watchlists?.length && !activeListId) {
      setActiveListId(watchlists[0].id);
    }
  }, [watchlists, activeListId]);

  const { data: searchResults, isFetching: isSearching } = useSearchStocks(
    { q: debouncedSearch },
    { query: { enabled: debouncedSearch.length > 1, queryKey: ['search', debouncedSearch] } }
  );

  const createWatchlist = useCreateWatchlist();
  const deleteWatchlist = useDeleteWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const handleCreateList = () => {
    const name = prompt("Enter watchlist name:");
    if (name) {
      createWatchlist.mutate({ data: { name } });
    }
  };

  const handleAddStock = (ticker: string) => {
    if (!activeList) return;
    addToWatchlist.mutate(
      { id: activeList.id, data: { ticker } },
      { onSuccess: () => {
        setSearchQuery('');
        toast({ title: `Added ${ticker}`, description: `Added to ${activeList.name}` });
      }}
    );
  };

  return (
    <div className="h-full flex flex-col p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <List className="w-8 h-8 text-primary" /> Watchlists
          </h1>
          <p className="text-muted-foreground mt-2">Track equities and monitor live pricing and AI scores.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Sidebar - Lists */}
        <Card className="bg-card border-card-border w-full md:w-64 shrink-0 flex flex-col max-h-[800px] md:max-h-full">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
            <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Your Lists</span>
            <Button variant="ghost" size="icon" className="w-6 h-6 rounded text-primary hover:text-primary hover:bg-primary/20" onClick={handleCreateList}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-2 flex-1 overflow-y-auto space-y-1">
            {isListsLoading ? (
               <div className="text-xs text-muted-foreground text-center p-4">Loading lists...</div>
            ) : watchlists?.map(list => (
              <div 
                key={list.id} 
                onClick={() => setActiveListId(list.id)}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                  (activeList?.id === list.id) ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-white/5 text-foreground'
                }`}
              >
                <span className="truncate">{list.name}</span>
                <span className="text-xs opacity-50 bg-background px-1.5 py-0.5 rounded">{list.items.length}</span>
              </div>
            ))}
            {watchlists?.length === 0 && (
               <div className="text-xs text-muted-foreground text-center p-4">No watchlists found.</div>
            )}
          </div>
        </Card>

        {/* Main Area - List Content */}
        <div className="flex-1 flex flex-col min-h-0 gap-6">
          {/* Search/Add Bar */}
          <Card className="bg-card border-card-border shrink-0 p-1">
            <div className="relative flex items-center">
              <SearchIcon className="w-5 h-5 absolute left-4 text-muted-foreground" />
              <Input 
                placeholder="Search ticker or company to add..." 
                className="pl-12 h-12 bg-transparent border-none text-base focus-visible:ring-0 shadow-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Search Dropdown */}
            {searchQuery.length > 1 && (
              <div className="absolute z-50 w-full md:w-[calc(100%-18rem-1.5rem)] mt-2 bg-popover border border-popover-border rounded-lg shadow-xl overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-sm text-center text-muted-foreground">Searching...</div>
                ) : searchResults?.length ? (
                  <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
                    {searchResults.map(res => (
                      <div key={res.ticker} className="p-3 flex items-center justify-between hover:bg-white/5 cursor-pointer" onClick={() => handleAddStock(res.ticker)}>
                        <div>
                          <div className="font-semibold text-primary">{res.ticker}</div>
                          <div className="text-xs text-muted-foreground">{res.company}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">Add to {activeList?.name} +</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-center text-muted-foreground">No results found</div>
                )}
              </div>
            )}
          </Card>

          {/* List Table */}
          <Card className="bg-card border-card-border flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="font-semibold text-lg">{activeList?.name || 'Select a list'}</h2>
              {activeList && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-popover-border">
                    <DropdownMenuItem 
                      className="text-destructive focus:bg-destructive/10 cursor-pointer"
                      onClick={() => {
                        if (confirm('Delete this watchlist?')) {
                          deleteWatchlist.mutate({ id: activeList.id });
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete List
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              {activeList?.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <List className="w-12 h-12 mb-4 opacity-20" />
                  <p>This list is empty.</p>
                  <p className="text-sm">Search above to add equities.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-white/[0.02] border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-4 py-3 font-semibold w-[250px]">Ticker / Company</th>
                      <th className="px-4 py-3 font-semibold text-right">Price</th>
                      <th className="px-4 py-3 font-semibold text-right">Change %</th>
                      <th className="px-4 py-3 font-semibold text-center w-24">PP Score</th>
                      <th className="px-4 py-3 font-semibold w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeList?.items.map((stock) => (
                      <tr key={stock.ticker} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-4 py-4">
                          <Link href={`/stocks/${stock.ticker}`}>
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">{stock.ticker}</div>
                            <div className="text-[11px] text-muted-foreground truncate w-48">{stock.company}</div>
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-right font-mono font-medium">${stock.price.toFixed(2)}</td>
                        <td className={`px-4 py-4 text-right font-mono font-medium flex items-center justify-end h-full mt-2 ${stock.change1dPct >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change1dPct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-1" />}
                          {Math.abs(stock.change1dPct).toFixed(2)}%
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded text-xs font-bold ${
                            stock.score >= 80 ? 'bg-green-500/20 text-green-400' :
                            stock.score >= 60 ? 'bg-primary/20 text-primary' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {stock.score}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-8 h-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFromWatchlist.mutate({ id: activeList.id, ticker: stock.ticker })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
