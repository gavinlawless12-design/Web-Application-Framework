import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Briefcase, Settings2, Save, DownloadCloud, Activity, Zap, RefreshCw } from 'lucide-react';
import { useBuildPortfolio, useGetPortfolioHealth } from '@workspace/api-client-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  investmentAmount: z.coerce.number().min(1000, 'Minimum $1,000 required'),
  monthlyContribution: z.coerce.number().min(0),
  desiredReturn: z.number().min(3).max(25),
  maxVolatility: z.number().min(5).max(40),
  riskLevel: z.string()
});

type FormValues = z.infer<typeof formSchema>;

export default function PortfolioBuilder() {
  const { toast } = useToast();
  const buildPortfolio = useBuildPortfolio();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: 50000,
      monthlyContribution: 1000,
      desiredReturn: 10,
      maxVolatility: 15,
      riskLevel: 'moderate'
    }
  });

  const onSubmit = (data: FormValues) => {
    buildPortfolio.mutate({ data });
  };

  const proposal = buildPortfolio.data;

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" /> Portfolio Builder
          </h1>
          <p className="text-muted-foreground mt-2">Generate statistically optimized allocations via Mean-Variance constraints.</p>
        </div>
        {proposal && (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,212,170,0.3)]">
            <Save className="w-4 h-4 mr-2" /> Save to Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls - Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-card border-card-border">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" /> Optimization Constraints
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField control={form.control} name="investmentAmount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Capital ($)</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-white/5 border-white/10 font-mono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="monthlyContribution" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Addition ($)</FormLabel>
                      <FormControl>
                        <Input type="number" className="bg-white/5 border-white/10 font-mono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="riskLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Constraint Profile</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10">
                            <SelectValue placeholder="Select a profile" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="conservative">Capital Preservation (Low Beta)</SelectItem>
                          <SelectItem value="moderate">Balanced Growth (Market Beta)</SelectItem>
                          <SelectItem value="aggressive">Aggressive Growth (High Beta)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="desiredReturn" render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center mb-3">
                        <FormLabel>Target Annual Return</FormLabel>
                        <span className="text-xs font-mono text-primary">{field.value}%</span>
                      </div>
                      <FormControl>
                        <Slider
                          min={3} max={25} step={0.5}
                          value={[field.value]}
                          onValueChange={(val) => field.onChange(val[0])}
                          className="py-2"
                        />
                      </FormControl>
                    </FormItem>
                  )} />

                  <Button type="submit" disabled={buildPortfolio.isPending} className="w-full bg-secondary text-secondary-foreground hover:bg-white/10 border border-white/10">
                    {buildPortfolio.isPending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                    {buildPortfolio.isPending ? 'Optimizing...' : 'Run Optimization'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Results - Right Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!proposal ? (
            <Card className="flex-1 bg-card/50 border-dashed border-white/10 flex flex-col items-center justify-center min-h-[500px] text-center p-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Awaiting Parameters</h3>
              <p className="text-sm text-muted-foreground max-w-md">Configure your constraints on the left and run the optimizer to generate a statistically sound allocation strategy.</p>
            </Card>
          ) : (
            <>
              {/* Top Row: Chart & Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-card-border flex flex-col">
                  <CardHeader className="pb-2 border-b border-white/5">
                    <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Target Allocation</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={proposal.allocations}
                            cx="50%" cy="50%"
                            innerRadius={60} outerRadius={80}
                            paddingAngle={2}
                            dataKey="percentage"
                            stroke="none"
                          >
                            {proposal.allocations.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Allocation']}
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-card-border">
                  <CardHeader className="pb-2 border-b border-white/5">
                    <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Projected Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 divide-x divide-y divide-white/5">
                      <div className="p-4">
                        <div className="text-xs text-muted-foreground mb-1">Exp. Annual Return</div>
                        <div className="text-2xl font-bold text-green-500">{proposal.metrics.expectedAnnualReturn.toFixed(2)}%</div>
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-muted-foreground mb-1">Target Volatility</div>
                        <div className="text-2xl font-bold">{proposal.metrics.expectedVolatility.toFixed(2)}%</div>
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-muted-foreground mb-1">Sharpe Ratio</div>
                        <div className="text-2xl font-bold text-primary">{proposal.metrics.sharpeRatio.toFixed(2)}</div>
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-muted-foreground mb-1">Div. Yield</div>
                        <div className="text-2xl font-bold text-blue-400">{proposal.metrics.dividendYield.toFixed(2)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row: Allocation Details */}
              <Card className="bg-card border-card-border">
                <CardHeader className="pb-4 border-b border-white/5">
                  <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Allocation Strategy</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {proposal.allocations.map((alloc) => (
                      <div key={alloc.label} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: alloc.color }} />
                          <div>
                            <div className="font-medium text-sm">{alloc.label}</div>
                            <div className="text-xs text-muted-foreground font-mono mt-1">
                              {alloc.tickers.join(', ')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{alloc.percentage.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            ${((form.getValues('investmentAmount') * alloc.percentage) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-5 bg-white/[0.02] border-t border-white/5">
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      <span className="font-semibold text-primary not-italic mr-2">AI Rationale:</span>
                      {proposal.rationale}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
