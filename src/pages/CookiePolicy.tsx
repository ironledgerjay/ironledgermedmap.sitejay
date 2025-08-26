import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cookie, Settings, Eye, Shield, BarChart, CheckCircle } from "lucide-react";
import { useState } from "react";

const CookiePolicy = () => {
  const [preferences, setPreferences] = useState({
    essential: true, // Always enabled
    analytics: true,
    marketing: false,
    functional: true
  });

  const handlePreferenceChange = (type: string, value: boolean) => {
    if (type === 'essential') return; // Essential cookies can't be disabled
    setPreferences(prev => ({ ...prev, [type]: value }));
  };

  const savePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl shadow-medical">
              <Cookie className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl text-muted-foreground mb-4">
            How we use cookies and similar technologies
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Shield className="h-3 w-3 mr-1" />
            POPI Act Compliant
          </Badge>
        </div>

        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <Settings className="h-5 w-5 mr-2" />
              Cookie Preferences
            </CardTitle>
            <CardDescription>
              Customize your cookie preferences below. Essential cookies cannot be disabled as they are necessary for the platform to function.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Essential Cookies
                  </h4>
                  <p className="text-sm text-muted-foreground">Required for basic platform functionality</p>
                </div>
                <Switch checked={preferences.essential} disabled />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center">
                    <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                    Analytics Cookies
                  </h4>
                  <p className="text-sm text-muted-foreground">Help us understand how you use our platform</p>
                </div>
                <Switch 
                  checked={preferences.analytics} 
                  onCheckedChange={(value) => handlePreferenceChange('analytics', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-purple-500" />
                    Marketing Cookies
                  </h4>
                  <p className="text-sm text-muted-foreground">Used to show you relevant advertisements</p>
                </div>
                <Switch 
                  checked={preferences.marketing} 
                  onCheckedChange={(value) => handlePreferenceChange('marketing', value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center">
                    <Settings className="h-4 w-4 mr-2 text-gray-500" />
                    Functional Cookies
                  </h4>
                  <p className="text-sm text-muted-foreground">Remember your preferences and settings</p>
                </div>
                <Switch 
                  checked={preferences.functional} 
                  onCheckedChange={(value) => handlePreferenceChange('functional', value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <Button onClick={savePreferences}>Save Preferences</Button>
              <Button variant="outline" onClick={() => setPreferences({essential: true, analytics: false, marketing: false, functional: false})}>
                Reject All Optional
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Cookie className="h-6 w-6 mr-2 text-orange-500" />
              1. What Are Cookies?
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. 
                  They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
                </p>
                
                <h3 className="font-semibold mb-3">Types of Information We Collect:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Website usage patterns and navigation behavior</li>
                  <li>Login status and user preferences</li>
                  <li>Language and regional settings</li>
                  <li>Device and browser information</li>
                  <li>Performance and error data</li>
                </ul>

                <p className="text-sm text-muted-foreground">
                  <strong>Legal Basis:</strong> We use cookies based on your consent (for non-essential cookies) and legitimate interests 
                  (for essential cookies required for platform functionality), in compliance with the POPI Act and international standards.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Essential Cookies
                  </CardTitle>
                  <CardDescription>Always active - Required for basic functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                    <li>User authentication and session management</li>
                    <li>Security features and fraud prevention</li>
                    <li>Basic website functionality</li>
                    <li>Payment processing security</li>
                  </ul>
                  <Badge variant="default" className="bg-green-100 text-green-800">Cannot be disabled</Badge>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <BarChart className="h-5 w-5 mr-2" />
                    Analytics Cookies
                  </CardTitle>
                  <CardDescription>Help us improve our platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                    <li>Website usage statistics</li>
                    <li>Page performance monitoring</li>
                    <li>User journey analysis</li>
                    <li>Error tracking and reporting</li>
                  </ul>
                  <Badge variant="outline">Optional - Requires consent</Badge>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-700">
                    <Eye className="h-5 w-5 mr-2" />
                    Marketing Cookies
                  </CardTitle>
                  <CardDescription>Personalized advertising and content</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                    <li>Targeted healthcare advertising</li>
                    <li>Social media integration</li>
                    <li>Third-party marketing platforms</li>
                    <li>Retargeting and remarketing</li>
                  </ul>
                  <Badge variant="outline">Optional - Requires consent</Badge>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-700">
                    <Settings className="h-5 w-5 mr-2" />
                    Functional Cookies
                  </CardTitle>
                  <CardDescription>Enhanced user experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                    <li>Language and region preferences</li>
                    <li>Theme and display settings</li>
                    <li>Saved search filters</li>
                    <li>Chat and support features</li>
                  </ul>
                  <Badge variant="outline">Optional - Requires consent</Badge>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Third-Party Cookies and Services</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  We use several trusted third-party services that may set their own cookies. These services help us provide 
                  better healthcare appointment booking and platform functionality.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Analytics Services:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Google Analytics (Website usage)</li>
                      <li>• Hotjar (User behavior analysis)</li>
                      <li>• Custom analytics (Platform metrics)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Essential Services:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• PayFast (Payment processing)</li>
                      <li>• Supabase (Database and authentication)</li>
                      <li>• Cloudflare (Security and performance)</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Marketing Services:</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Google Ads (Healthcare advertising)</li>
                      <li>• Facebook Pixel (Social media)</li>
                      <li>• LinkedIn Insights (Professional network)</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Communication:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Intercom (Customer support)</li>
                      <li>• Mailchimp (Email communications)</li>
                      <li>• Twilio (SMS notifications)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-yellow-800 mb-2">Third-Party Privacy Policies:</p>
                  <p className="text-sm text-yellow-700">
                    Each third-party service has its own privacy policy governing their use of cookies and data. 
                    We recommend reviewing these policies for complete information about their data practices.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Cookie Retention and Expiration</h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Cookie Lifespan Categories:</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Session Cookies</span>
                    <Badge variant="outline">Deleted when browser closes</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Authentication Cookies</span>
                    <Badge variant="outline">30 days</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Preference Cookies</span>
                    <Badge variant="outline">1 year</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Analytics Cookies</span>
                    <Badge variant="outline">2 years</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Marketing Cookies</span>
                    <Badge variant="outline">13 months</Badge>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">Automatic Cleanup:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Expired cookies are automatically removed by your browser</li>
                  <li>We regularly review and update cookie expiration periods</li>
                  <li>Unused cookies are periodically cleaned from our systems</li>
                  <li>You can manually clear cookies at any time through your browser settings</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Managing Your Cookie Preferences</h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Platform Cookie Controls:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Cookie Banner:</strong> Manage preferences when you first visit our website</li>
                  <li><strong>This Page:</strong> Use the preference controls at the top of this page</li>
                  <li><strong>Account Settings:</strong> Logged-in users can manage cookies in account settings</li>
                  <li><strong>Email Preferences:</strong> Opt-out links in marketing emails</li>
                </ul>

                <h3 className="font-semibold mb-3">Browser Cookie Controls:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2 text-blue-700">Popular Browsers:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Chrome: Settings &gt; Privacy &gt; Cookies</li>
                      <li>Firefox: Options &gt; Privacy &gt; Cookies</li>
                      <li>Safari: Preferences &gt; Privacy</li>
                      <li>Edge: Settings &gt; Privacy &gt; Cookies</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-green-700">Mobile Browsers:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Chrome Mobile: Menu &gt; Settings &gt; Privacy</li>
                      <li>Safari iOS: Settings &gt; Safari &gt; Privacy</li>
                      <li>Samsung Internet: Menu &gt; Settings &gt; Privacy</li>
                      <li>Firefox Mobile: Menu &gt; Settings &gt; Privacy</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-800 mb-2">Important Note:</p>
                  <p className="text-sm text-red-700">
                    Disabling essential cookies may affect platform functionality, including login, appointment booking, 
                    and payment processing. Some features may not work properly if cookies are completely disabled.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Protection and Security</h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Cookie Data Protection:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Encryption:</strong> All cookie data is encrypted in transit and at rest</li>
                  <li><strong>Secure Transmission:</strong> Cookies are transmitted over HTTPS connections only</li>
                  <li><strong>Access Controls:</strong> Strict access controls for cookie data processing</li>
                  <li><strong>Regular Audits:</strong> Cookie usage reviewed quarterly for compliance</li>
                  <li><strong>Data Minimization:</strong> We collect only necessary cookie data</li>
                </ul>

                <h3 className="font-semibold mb-3">POPI Act Compliance:</h3>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <ul className="list-disc list-inside space-y-1 text-green-700 text-sm">
                    <li>Explicit consent obtained for non-essential cookies</li>
                    <li>Clear information provided about cookie purposes</li>
                    <li>Easy opt-out mechanisms available</li>
                    <li>Cookie data protected with appropriate safeguards</li>
                    <li>Regular compliance reviews and updates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Updates to This Cookie Policy</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices, 
                  technology, legal requirements, or other factors.
                </p>

                <h3 className="font-semibold mb-3">How We Notify You:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Email notification for significant changes</li>
                  <li>Website banner announcement</li>
                  <li>Updated "Last Modified" date on this page</li>
                  <li>Account dashboard notifications for logged-in users</li>
                </ul>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-800 mb-2">Your Continued Consent:</p>
                  <p className="text-sm text-blue-700">
                    By continuing to use our platform after policy updates, you consent to the revised Cookie Policy. 
                    If you disagree with changes, you can update your cookie preferences or stop using our platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  If you have questions about our use of cookies or this Cookie Policy, please contact us:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Data Protection Officer:</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> privacy@ironledgermedmap.com</p>
                      <p><strong>Phone:</strong> +27 (0) 11 123 4567</p>
                      <p><strong>Address:</strong> [Company Address], South Africa</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Technical Support:</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> support@ironledgermedmap.com</p>
                      <p><strong>Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM</p>
                      <p><strong>Emergency:</strong> 24/7 technical support available</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            This Cookie Policy was last updated on January 6, 2025, and is compliant with the POPI Act and international privacy standards.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Previous Page
            </Button>
            <Button onClick={() => window.print()}>
              Print Policy
            </Button>
            <Button onClick={savePreferences}>
              Save Cookie Preferences
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
