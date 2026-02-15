import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Ship, Package, Truck, Plane, Train, ArrowRight, Building2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const defaultType = searchParams.get('type') || 'trader';
  
  const [activeTab, setActiveTab] = useState<string>(defaultType);
  const [isLoading, setIsLoading] = useState(false);

  const [traderForm, setTraderForm] = useState({
    name: '', email: '', password: '', companyName: '', phone: '', agreeTerms: false,
  });

  const [providerForm, setProviderForm] = useState({
    name: '', email: '', password: '', companyName: '', phone: '',
    licenseNumber: '', transportModes: [] as string[], description: '', agreeTerms: false,
  });

  const handleTraderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!traderForm.agreeTerms) {
      toast({ title: 'Please agree to terms', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: traderForm.email,
      password: traderForm.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          name: traderForm.name,
          company_name: traderForm.companyName,
          phone: traderForm.phone,
          role: 'trader',
        },
      },
    });
    setIsLoading(false);
    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Account created!', description: 'Welcome to CargoSpace.' });
    navigate('/marketplace');
  };

  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerForm.agreeTerms) {
      toast({ title: 'Please agree to terms', variant: 'destructive' });
      return;
    }
    if (providerForm.transportModes.length === 0) {
      toast({ title: 'Select transport modes', description: 'Please select at least one.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: providerForm.email,
      password: providerForm.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          name: providerForm.name,
          company_name: providerForm.companyName,
          phone: providerForm.phone,
          role: 'provider',
          transport_modes: providerForm.transportModes.join(','),
          license_number: providerForm.licenseNumber,
          description: providerForm.description,
        },
      },
    });
    setIsLoading(false);
    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ 
      title: 'Application submitted!', 
      description: 'Your application is under review. We will contact you within 2-3 business days.' 
    });
    navigate('/');
  };

  const toggleTransportMode = (mode: string) => {
    setProviderForm(prev => ({
      ...prev,
      transportModes: prev.transportModes.includes(mode)
        ? prev.transportModes.filter(m => m !== mode)
        : [...prev.transportModes, mode],
    }));
  };

  const transportModes = [
    { id: 'ship', label: 'Ocean Freight', icon: Ship },
    { id: 'road', label: 'Road Transport', icon: Truck },
    { id: 'rail', label: 'Rail Freight', icon: Train },
    { id: 'air', label: 'Air Cargo', icon: Plane },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center">
              <Ship className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">CargoSpace</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Join thousands of traders and providers on our platform</p>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="trader" className="gap-2"><User className="w-4 h-4" />Trader</TabsTrigger>
              <TabsTrigger value="provider" className="gap-2"><Building2 className="w-4 h-4" />Provider</TabsTrigger>
            </TabsList>

            <TabsContent value="trader">
              <form onSubmit={handleTraderSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trader-name">Full Name</Label>
                    <Input id="trader-name" placeholder="John Doe" value={traderForm.name} onChange={e => setTraderForm({ ...traderForm, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="trader-phone">Phone</Label>
                    <Input id="trader-phone" placeholder="+1 234 567 890" value={traderForm.phone} onChange={e => setTraderForm({ ...traderForm, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="trader-company">Company Name</Label>
                  <Input id="trader-company" placeholder="Acme Trading Co." value={traderForm.companyName} onChange={e => setTraderForm({ ...traderForm, companyName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="trader-email">Email</Label>
                  <Input id="trader-email" type="email" placeholder="john@example.com" value={traderForm.email} onChange={e => setTraderForm({ ...traderForm, email: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="trader-password">Password</Label>
                  <Input id="trader-password" type="password" placeholder="••••••••" value={traderForm.password} onChange={e => setTraderForm({ ...traderForm, password: e.target.value })} required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="trader-terms" checked={traderForm.agreeTerms} onCheckedChange={(checked) => setTraderForm({ ...traderForm, agreeTerms: checked as boolean })} />
                  <Label htmlFor="trader-terms" className="text-sm text-muted-foreground">
                    I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}<ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="provider">
              <form onSubmit={handleProviderSubmit} className="space-y-4">
                <div className="p-4 bg-ocean-light rounded-lg mb-4">
                  <p className="text-sm text-foreground"><strong>Provider Registration:</strong> Your application will be reviewed by our team. Approval typically takes 2-3 business days.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provider-name">Contact Name</Label>
                    <Input id="provider-name" placeholder="John Doe" value={providerForm.name} onChange={e => setProviderForm({ ...providerForm, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="provider-phone">Phone</Label>
                    <Input id="provider-phone" placeholder="+1 234 567 890" value={providerForm.phone} onChange={e => setProviderForm({ ...providerForm, phone: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="provider-company">Company Name</Label>
                  <Input id="provider-company" placeholder="Global Logistics Inc." value={providerForm.companyName} onChange={e => setProviderForm({ ...providerForm, companyName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="provider-license">License/Registration Number</Label>
                  <Input id="provider-license" placeholder="e.g., DOT-123456" value={providerForm.licenseNumber} onChange={e => setProviderForm({ ...providerForm, licenseNumber: e.target.value })} required />
                </div>
                <div>
                  <Label>Transport Modes</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {transportModes.map(mode => (
                      <button key={mode.id} type="button" onClick={() => toggleTransportMode(mode.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${providerForm.transportModes.includes(mode.id) ? 'border-primary bg-ocean-light' : 'border-border hover:border-primary/50'}`}>
                        <mode.icon className="w-5 h-5" /><span className="text-sm">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="provider-email">Email</Label>
                  <Input id="provider-email" type="email" placeholder="contact@logistics.com" value={providerForm.email} onChange={e => setProviderForm({ ...providerForm, email: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="provider-password">Password</Label>
                  <Input id="provider-password" type="password" placeholder="••••••••" value={providerForm.password} onChange={e => setProviderForm({ ...providerForm, password: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="provider-description">Company Description</Label>
                  <Textarea id="provider-description" placeholder="Tell us about your logistics services..." value={providerForm.description} onChange={e => setProviderForm({ ...providerForm, description: e.target.value })} rows={3} />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="provider-terms" checked={providerForm.agreeTerms} onCheckedChange={(checked) => setProviderForm({ ...providerForm, agreeTerms: checked as boolean })} />
                  <Label htmlFor="provider-terms" className="text-sm text-muted-foreground">
                    I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Provider Agreement</Link>
                  </Label>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Submitting...' : 'Submit Application'}<ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{' '}<Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 hero-gradient relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20" />
        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 accent-gradient rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
            <Package className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            {activeTab === 'trader' ? 'Start Shipping Today' : 'Grow Your Business'}
          </h2>
          <p className="text-primary-foreground/70">
            {activeTab === 'trader' 
              ? 'Join our marketplace and find affordable cargo space for your exports. No commitments, pay only when you book.'
              : 'List your available container space and connect with traders worldwide. Maximize your capacity utilization.'}
          </p>
        </div>
      </div>
    </div>
  );
}
