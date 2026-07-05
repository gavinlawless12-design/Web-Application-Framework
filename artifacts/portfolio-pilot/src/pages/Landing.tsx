import { Link } from 'wouter';
import { ArrowRight, LineChart, TrendingUp, ShieldAlert, Cpu, Briefcase, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <header className="absolute inset-x-0 top-0 z-50 flex h-20 items-center justify-between px-6 lg:px-12 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <LineChart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-xl tracking-tight">PortfolioPilot</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:flex">Log In</Button>
          <Link href="/setup">
            <Button className="font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(0,212,170,0.3)] hover:shadow-[0_0_25px_rgba(0,212,170,0.5)]">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
          
          <div className="container mx-auto px-6 text-center z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Terminal 2.0 Live
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
              Build Your Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Portfolio</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Institutional-grade investment research and portfolio recommendation platform. Bloomberg Terminal filtered through modern design — precise, data-dense, and powered by AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/setup">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)]">
                  Start Building <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-medium border-white/10 hover:bg-white/5">
                See Demo
              </Button>
            </div>
          </div>
          
          {/* Decorative Terminal UI fade */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] max-w-6xl h-64 border border-white/10 bg-card/50 backdrop-blur-sm rounded-t-xl overflow-hidden flex flex-col pointer-events-none shadow-2xl">
            <div className="h-8 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 p-6 flex gap-4 opacity-50">
              <div className="flex-1 border border-white/5 rounded bg-white/5" />
              <div className="flex-1 border border-white/5 rounded bg-white/5" />
              <div className="flex-[2] border border-white/5 rounded bg-white/5" />
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-background border-t border-white/5 relative z-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Professional Grade Tools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to analyze, build, and maintain a resilient portfolio.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Personalized Recommendations', icon: Cpu, desc: 'AI-driven stock picks tailored to your exact risk tolerance and horizon.' },
                { title: 'Portfolio Builder', icon: Briefcase, desc: 'Construct optimized allocations with dynamic rebalancing suggestions.' },
                { title: 'Growth Screener', icon: TrendingUp, desc: 'Filter thousands of equities with precise fundamental criteria.' },
                { title: 'Risk Analyzer', icon: ShieldAlert, desc: 'Deep dive into beta, volatility, and diversification metrics.' },
                { title: 'Market Intelligence', icon: LineChart, desc: 'Real-time trending assets and macroeconomic indicators.' },
                { title: 'Smart Watchlists', icon: List, desc: 'Track your thesis with live price action and scoring updates.' }
              ].map((feature, i) => (
                <div key={i} className="group p-6 rounded-xl border border-white/10 bg-card hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-24 h-24 text-primary" />
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
