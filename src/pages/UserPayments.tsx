import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Sparkles, Edit, CreditCard } from "lucide-react";
import InternalHeader from "@/components/InternalHeader";

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: string;
  method: string;
}

export default function UserPayments() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    full_name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    mobile_number: '',
    national_id_type: '',
    national_id_number: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        navigate('/user-login');
        return;
      }

      if (!session) {
        navigate('/user-login');
        return;
      }

      setUser(session.user);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setUserProfile(profile);
        if (profile) {
          setContactInfo({
            full_name: `${profile.first_name} ${profile.last_name}`,
            address: '',
            city: '',
            state: profile.state || '',
            zipcode: profile.zip_code || '',
            country: profile.country || '',
            mobile_number: profile.phone_number || '',
            national_id_type: '',
            national_id_number: ''
          });
        }
      }

      // Mock current balance and payment history
      setCurrentBalance(25.50);
      setPaymentHistory([
        {
          id: '1',
          date: '2024-01-15',
          amount: 10.00,
          status: 'Completed',
          method: 'Gift Card'
        },
        {
          id: '2',
          date: '2024-01-10',
          amount: 15.00,
          status: 'Completed',
          method: 'Gift Card'
        }
      ]);
    } catch (error) {
      console.error('Error in checkAuth:', error);
      navigate('/user-login');
    } finally {
      setLoading(false);
    }
  };


  const handleSaveContactInfo = async () => {
    try {
      // Update user profile with contact info
      const { error } = await supabase
        .from('user_profiles')
        .update({
          phone_number: contactInfo.mobile_number,
          state: contactInfo.state,
          zip_code: contactInfo.zipcode,
          country: contactInfo.country,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      setIsEditing(false);
      toast({
        title: "Contact information updated",
        description: "Your contact details have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating contact info:', error);
      toast({
        title: "Error",
        description: "Failed to update contact information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRedeemRewards = () => {
    if (currentBalance < 10) {
      toast({
        title: "Insufficient balance",
        description: "You need at least $10 USD to redeem rewards.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Redeem functionality coming soon",
      description: "The reward redemption feature will be available soon.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-inter flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <InternalHeader user={user} isProfileComplete={true} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-turquoise/20 via-sky-blue/20 to-coral/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-r from-turquoise/5 via-sky-blue/5 to-coral/5 p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-turquoise/20 to-sky-blue/20 p-3 rounded-full">
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-4xl font-black text-foreground">
                    Your Rewards Hub
                  </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                  Manage your balance and contact information
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="contact" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="balance">Manage Balance</TabsTrigger>
            </TabsList>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Contact Information
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Please ensure your contact info is up-to-date so we can deliver your rewards seamlessly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={contactInfo.full_name}
                        onChange={(e) => setContactInfo({...contactInfo, full_name: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobile_number">Mobile Number</Label>
                      <Input
                        id="mobile_number"
                        value={contactInfo.mobile_number}
                        onChange={(e) => setContactInfo({...contactInfo, mobile_number: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={contactInfo.city}
                        onChange={(e) => setContactInfo({...contactInfo, city: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={contactInfo.state}
                        onChange={(e) => setContactInfo({...contactInfo, state: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipcode">Zipcode</Label>
                      <Input
                        id="zipcode"
                        value={contactInfo.zipcode}
                        onChange={(e) => setContactInfo({...contactInfo, zipcode: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={contactInfo.country}
                      onChange={(e) => setContactInfo({...contactInfo, country: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="national_id_type">Select National ID</Label>
                      <Select
                        value={contactInfo.national_id_type}
                        onValueChange={(value) => setContactInfo({...contactInfo, national_id_type: value})}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                          <SelectItem value="driving_license">Driving License</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="national_id_number">National ID Number</Label>
                      <Input
                        id="national_id_number"
                        value={contactInfo.national_id_number}
                        onChange={(e) => setContactInfo({...contactInfo, national_id_number: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <Button onClick={handleSaveContactInfo} className="w-full">
                      Save Contact Information
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="balance">
              <div className="space-y-6">
                {/* Current Balance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Your Current Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-4xl font-bold text-primary mb-4">
                        ${currentBalance.toFixed(2)} USD
                      </div>
                      <Button
                        size="lg"
                        onClick={handleRedeemRewards}
                        disabled={currentBalance < 10}
                        className="min-w-[200px]"
                      >
                        Redeem My Rewards! →
                      </Button>
                      {currentBalance < 10 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Minimum $10 USD required for redemption
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paymentHistory.length > 0 ? (
                      <div className="space-y-4">
                        {paymentHistory.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <CreditCard className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">${payment.amount.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">{payment.date}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{payment.method}</p>
                              <p className="text-sm text-green-600">{payment.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No payment history yet. Get involved in more projects to earn!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Usergy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}