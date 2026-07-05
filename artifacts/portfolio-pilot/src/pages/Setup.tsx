import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, ArrowRight, CheckCircle2, TrendingUp, ShieldAlert, GraduationCap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useGetProfile, useUpsertProfile } from '@workspace/api-client-react';

const formSchema = z.object({
  goal: z.string().min(1, 'Goal is required'),
  horizon: z.string().min(1, 'Horizon is required'),
  riskTolerance: z.string().min(1, 'Risk tolerance is required'),
  dividendPreference: z.string().min(1, 'Dividend preference is required'),
  internationalExposure: z.boolean(),
  smallCapPreference: z.boolean(),
  sectors: z.array(z.string()),
  esgPreference: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = [
  { id: 'goal', title: 'Investment Goal' },
  { id: 'horizon', title: 'Time Horizon' },
  { id: 'risk', title: 'Risk Profile' },
  { id: 'preferences', title: 'Preferences' }
];

const SECTORS = ['Technology', 'Healthcare', 'Financials', 'Consumer Discretionary', 'Energy', 'Industrials', 'Materials', 'Real Estate', 'Utilities'];

export default function Setup() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  
  const { data: existingProfile, isLoading: isProfileLoading } = useGetProfile({
    query: {
      retry: false, // Don't retry if 404
      queryKey: ['profile'],
    }
  });

  const upsertProfile = useUpsertProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: 'growth',
      horizon: 'long_term',
      riskTolerance: 'moderate',
      dividendPreference: 'neutral',
      internationalExposure: true,
      smallCapPreference: false,
      sectors: [],
      esgPreference: false,
    },
  });

  useEffect(() => {
    if (existingProfile) {
      form.reset(existingProfile);
    }
  }, [existingProfile, form]);

  const progress = ((step + 1) / STEPS.length) * 100;

  function nextStep() {
    // Validate current step fields before proceeding
    const fieldsToValidate = {
      0: ['goal'],
      1: ['horizon'],
      2: ['riskTolerance'],
      3: [] // Preferences validated on submit
    }[step] as (keyof FormValues)[];

    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid && step < STEPS.length - 1) {
        setStep(step + 1);
      }
    });
  }

  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  function onSubmit(data: FormValues) {
    upsertProfile.mutate(
      { data },
      {
        onSuccess: () => {
          setLocation('/dashboard');
        }
      }
    );
  }

  if (isProfileLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Investor Profile</h1>
          <p className="text-muted-foreground">Let's calibrate your recommendation engine.</p>
          <div className="mt-8 flex items-center gap-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center text-sm font-medium">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                  i < step ? 'bg-primary border-primary text-primary-foreground' :
                  i === step ? 'border-primary text-primary' :
                  'border-white/10 text-muted-foreground'
                }`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`ml-2 hidden sm:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 h-px ml-4 ${i < step ? 'bg-primary' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1 mt-6" />
        </div>

        <div className="bg-card border border-card-border rounded-xl p-6 sm:p-10 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {step === 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Primary Objective</h2>
                    <p className="text-sm text-muted-foreground mb-6">What is the main goal for this portfolio?</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                          >
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem value="growth" className="peer sr-only" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-2 p-4 border border-white/10 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-white/5 transition-all">
                                <TrendingUp className="w-6 h-6 text-primary" />
                                <div className="font-semibold text-base">Capital Growth</div>
                                <div className="text-sm text-muted-foreground font-normal">Maximize long-term capital appreciation over time.</div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem value="income" className="peer sr-only" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-2 p-4 border border-white/10 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-white/5 transition-all">
                                <Building2 className="w-6 h-6 text-primary" />
                                <div className="font-semibold text-base">Dividend Income</div>
                                <div className="text-sm text-muted-foreground font-normal">Generate a reliable and growing stream of passive income.</div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormControl>
                                <RadioGroupItem value="preservation" className="peer sr-only" />
                              </FormControl>
                              <FormLabel className="flex flex-col gap-2 p-4 border border-white/10 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-white/5 transition-all">
                                <ShieldAlert className="w-6 h-6 text-primary" />
                                <div className="font-semibold text-base">Capital Preservation</div>
                                <div className="text-sm text-muted-foreground font-normal">Protect principal investment with minimal downside volatility.</div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Time Horizon</h2>
                    <p className="text-sm text-muted-foreground mb-6">When do you plan to need these funds?</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="horizon"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                          >
                            <FormItem>
                              <FormControl><RadioGroupItem value="short_term" className="peer sr-only" /></FormControl>
                              <FormLabel className="flex flex-col items-center text-center gap-2 p-4 border border-white/10 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-white/5 transition-all">
                                <div className="font-semibold">Short Term</div>
                                <div className="text-xs text-muted-foreground font-normal">&lt; 3 Years</div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormControl><RadioGroupItem value="medium_term" className="peer sr-only" /></FormControl>
                              <FormLabel className="flex flex-col items-center text-center gap-2 p-4 border border-white/10 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-white/5 transition-all">
                                <div className="font-semibold">Medium Term</div>
                                <div className="text-xs text-muted-foreground font-normal">3 - 7 Years</div>
                              </FormLabel>
                            </FormItem>
                            <FormItem>
                              <FormControl><RadioGroupItem value="long_term" className="peer sr-only" /></FormControl>
                              <FormLabel className="flex flex-col items-center text-center gap-2 p-4 border border-white/10 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-white/5 transition-all">
                                <div className="font-semibold">Long Term</div>
                                <div className="text-xs text-muted-foreground font-normal">7+ Years</div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Risk Tolerance</h2>
                    <p className="text-sm text-muted-foreground mb-6">How much volatility can you stomach for higher returns?</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="riskTolerance"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-white/10 rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 hover:bg-white/5 transition-all">
                              <FormControl><RadioGroupItem value="conservative" /></FormControl>
                              <FormLabel className="flex-1 cursor-pointer font-normal">
                                <div className="font-semibold">Conservative</div>
                                <div className="text-sm text-muted-foreground">Prioritize stability, minimal drops. (Target Beta &lt; 0.8)</div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-white/10 rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 hover:bg-white/5 transition-all">
                              <FormControl><RadioGroupItem value="moderate" /></FormControl>
                              <FormLabel className="flex-1 cursor-pointer font-normal">
                                <div className="font-semibold">Moderate</div>
                                <div className="text-sm text-muted-foreground">Market-like performance and drops. (Target Beta ~1.0)</div>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border border-white/10 rounded-lg cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 hover:bg-white/5 transition-all">
                              <FormControl><RadioGroupItem value="aggressive" /></FormControl>
                              <FormLabel className="flex-1 cursor-pointer font-normal">
                                <div className="font-semibold">Aggressive</div>
                                <div className="text-sm text-muted-foreground">Willing to endure large swings for maximum upside. (Target Beta &gt; 1.2)</div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Portfolio Preferences</h2>
                    <p className="text-sm text-muted-foreground mb-6">Fine-tune the assets that make up your recommendations.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="internationalExposure" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 border border-white/10 p-4 rounded-lg">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>International Exposure</FormLabel>
                          <p className="text-xs text-muted-foreground">Include non-US equities.</p>
                        </div>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="smallCapPreference" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 border border-white/10 p-4 rounded-lg">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Small Cap Exposure</FormLabel>
                          <p className="text-xs text-muted-foreground">Include smaller companies.</p>
                        </div>
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="esgPreference" render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 border border-white/10 p-4 rounded-lg">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>ESG Focus</FormLabel>
                          <p className="text-xs text-muted-foreground">Prioritize sustainable companies.</p>
                        </div>
                      </FormItem>
                    )} />
                  </div>

                  <FormField
                    control={form.control}
                    name="sectors"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Sector Focus (Optional)</FormLabel>
                          <p className="text-xs text-muted-foreground">Select sectors to overweight in your recommendations.</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {SECTORS.map((sector) => (
                            <FormField
                              key={sector}
                              control={form.control}
                              name="sectors"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={sector}
                                    className="flex flex-row items-start space-x-2 space-y-0 bg-white/5 px-3 py-2 rounded-md border border-transparent hover:bg-white/10 transition-colors"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(sector)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, sector])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== sector
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-xs leading-tight cursor-pointer w-full">{sector}</FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={prevStep}
                  disabled={step === 0}
                  className={step === 0 ? "invisible" : ""}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                
                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={nextStep} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={upsertProfile.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,212,170,0.3)]">
                    {upsertProfile.isPending ? 'Saving...' : 'Complete Profile'} <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
