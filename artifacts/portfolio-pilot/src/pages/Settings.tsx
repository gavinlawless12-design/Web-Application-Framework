import { useGetProfile } from '@workspace/api-client-react';
import { Settings2, User, Bell, Shield, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Link } from 'wouter';

export default function Settings() {
  const { data: profile } = useGetProfile({
    query: { queryKey: ['profile'] }
  });

  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage your terminal preferences and profile data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-card-border">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-primary" /> Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground uppercase text-xs tracking-wider mb-1">Goal</div>
                  <div className="font-medium capitalize">{profile?.goal.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground uppercase text-xs tracking-wider mb-1">Risk Tolerance</div>
                  <div className="font-medium capitalize">{profile?.riskTolerance}</div>
                </div>
                <div>
                  <div className="text-muted-foreground uppercase text-xs tracking-wider mb-1">Time Horizon</div>
                  <div className="font-medium capitalize">{profile?.horizon.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-muted-foreground uppercase text-xs tracking-wider mb-1">Preferences</div>
                  <div className="font-medium">
                    {[
                      profile?.internationalExposure ? 'Intl' : null,
                      profile?.smallCapPreference ? 'Small Cap' : null,
                      profile?.esgPreference ? 'ESG' : null
                    ].filter(Boolean).join(', ') || 'Standard'}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <Link href="/setup">
                  <Button variant="outline" className="border-white/10 hover:bg-white/5 w-full">Re-calibrate Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-card-border">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-primary" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Price Alerts</div>
                    <div className="text-sm text-muted-foreground">Notify when watchlist items move &gt;5% in a day.</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly Portfolio Report</div>
                    <div className="text-sm text-muted-foreground">Receive AI summary of your allocations.</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Terminal Newsletter</div>
                    <div className="text-sm text-muted-foreground">Macro insights and trending equities.</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-card-border">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-primary" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">Change Password</Button>
              <Button variant="outline" className="w-full justify-start border-white/10 hover:bg-white/5">Two-Factor Authentication</Button>
            </CardContent>
          </Card>
          
          <Button variant="destructive" className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
