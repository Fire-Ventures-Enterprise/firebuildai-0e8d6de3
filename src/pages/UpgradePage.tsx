import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, AlertCircle, Clock, Shield, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const UpgradePage = () => {
  const { profile, signOut } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpgrade = async (planName: string, tier?: string) => {
    setLoadingPlan(planName);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          subscriptionType: 'standalone',
          subscriptionTier: tier
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab for testing
        window.open(data.url, '_blank');
        toast({
          title: "Checkout opened",
          description: "Complete your payment in the new tab",
        });
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      name: 'Basic',
      tier: 'tier1',
      price: '$49',
      description: 'Perfect for small contractors',
      features: [
        '5 team members',
        'Unlimited estimates',
        'Basic invoicing',
        'Mobile app access',
        'Email support',
      ],
    },
    {
      name: 'Professional',
      tier: 'tier2',
      price: '$99',
      description: 'For growing businesses',
      features: [
        '20 team members',
        'Advanced estimates',
        'Professional invoicing',
        'Fleet management',
        'Priority support',
        'API access',
        'Custom branding',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      tier: 'tier3',
      price: '$249',
      description: 'For large organizations',
      features: [
        'Unlimited team members',
        'Enterprise features',
        'Advanced analytics',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'SLA guarantee',
        'Training sessions',
      ],
    },
  ];

  const dataRetentionDate = profile?.data_retention_until 
    ? new Date(profile.data_retention_until).toLocaleDateString()
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Alert Banner */}
        <Card className="border-destructive/50 bg-destructive/5 mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <CardTitle>Your Free Trial Has Expired</CardTitle>
            </div>
            <CardDescription className="mt-2">
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Trial ended on {profile?.trial_ends_at ? new Date(profile.trial_ends_at).toLocaleDateString() : 'N/A'}
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Your data is safe until {dataRetentionDate}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Upgrade now to regain access to your account and continue where you left off. 
              All your data, settings, and configurations are preserved.
            </p>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Upgrade today and get back to building your business
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name}
              className={plan.popular ? 'border-primary shadow-lg relative' : ''}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleUpgrade(plan.name, plan.tier)}
                  disabled={loadingPlan === plan.name}
                >
                  {loadingPlan === plan.name ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  Upgrade to {plan.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-muted-foreground">
            Need help choosing? Contact our sales team at{' '}
            <a href="mailto:sales@firebuildai.com" className="text-primary hover:underline">
              sales@firebuildai.com
            </a>
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
            <Button variant="ghost" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};