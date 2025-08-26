import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database, FileText, AlertTriangle, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl shadow-medical">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Effective Date: January 6, 2025 | Last Updated: January 6, 2025
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Shield className="h-3 w-3 mr-1" />
            POPI Act Compliant
          </Badge>
        </div>

        <Card className="mb-8 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Lock className="h-5 w-5 mr-2" />
              Your Privacy Rights Under POPI Act
            </CardTitle>
            <CardDescription>
              IronledgerMedMap is fully compliant with the Protection of Personal Information Act (POPI Act) of South Africa. 
              This policy explains your rights and how we protect your personal information.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Eye className="h-6 w-6 mr-2 text-primary" />
              1. Information We Collect
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">1.1 Personal Information:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li><strong>Identity Information:</strong> Name, surname, date of birth, ID number</li>
                  <li><strong>Contact Information:</strong> Email address, phone number, physical address</li>
                  <li><strong>Account Information:</strong> Username, password (encrypted), profile preferences</li>
                  <li><strong>Payment Information:</strong> Bank details, payment history (processed securely via PayFast)</li>
                </ul>

                <h3 className="font-semibold mb-3">1.2 Health Information (Special Personal Information under POPI):</h3>
                <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200">
                  <p className="font-semibold text-red-800 mb-2">Sensitive Medical Data:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    <li>Medical history and conditions</li>
                    <li>Prescription information</li>
                    <li>Appointment notes and records</li>
                    <li>Health insurance information</li>
                    <li>Any health-related communications</li>
                  </ul>
                </div>

                <h3 className="font-semibold mb-3">1.3 Technical Information:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>IP address and browser information</li>
                  <li>Device information and operating system</li>
                  <li>Usage analytics and platform interactions</li>
                  <li>Cookies and tracking data (see Cookie Policy)</li>
                </ul>

                <h3 className="font-semibold mb-3">1.4 Healthcare Provider Information:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>HPCSA registration number and qualifications</li>
                  <li>Practice information and specializations</li>
                  <li>Professional credentials and certifications</li>
                  <li>Patient interaction records</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Database className="h-6 w-6 mr-2 text-blue-500" />
              2. How We Use Your Information
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">2.1 Primary Purposes (Article 11 - POPI Act):</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Healthcare Service Facilitation:</strong> Connecting you with healthcare providers</li>
                  <li><strong>Appointment Management:</strong> Booking, scheduling, and managing appointments</li>
                  <li><strong>Payment Processing:</strong> Secure transaction processing and billing</li>
                  <li><strong>Communication:</strong> Appointment reminders, updates, and support</li>
                  <li><strong>Legal Compliance:</strong> Meeting regulatory and legal requirements</li>
                </ul>

                <h3 className="font-semibold mb-3">2.2 Lawful Basis for Processing (POPI Act Section 11):</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Consent</h4>
                    <p className="text-sm text-blue-700">You explicitly consent to processing for healthcare services</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Legitimate Interest</h4>
                    <p className="text-sm text-green-700">Platform operation and service improvement</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Contractual Necessity</h4>
                    <p className="text-sm text-purple-700">Fulfilling our service agreement with you</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Legal Compliance</h4>
                    <p className="text-sm text-orange-700">Meeting healthcare and financial regulations</p>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">2.3 Special Personal Information Processing:</h3>
                <p className="mb-2">
                  Health information is processed only with your explicit consent and for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Providing healthcare appointment services</li>
                  <li>Facilitating communication with healthcare providers</li>
                  <li>Emergency medical situations (with your prior consent)</li>
                  <li>Legal requirements under healthcare regulations</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Your Rights Under POPI Act</h2>
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Right to Access
                      </h4>
                      <p className="text-sm text-green-700">Request copies of your personal information we hold</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Right to Correction
                      </h4>
                      <p className="text-sm text-blue-700">Request correction of inaccurate information</p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Right to Deletion
                      </h4>
                      <p className="text-sm text-red-700">Request deletion of your personal information</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Right to Object
                      </h4>
                      <p className="text-sm text-purple-700">Object to processing based on legitimate interests</p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Right to Portability
                      </h4>
                      <p className="text-sm text-orange-700">Request transfer of your data to another service</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Right to Withdraw
                      </h4>
                      <p className="text-sm text-gray-700">Withdraw consent for data processing</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">How to Exercise Your Rights:</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Contact our Data Protection Officer at: <strong>privacy@ironledgermedmap.com</strong>
                  </p>
                  <p className="text-sm text-blue-700">
                    We will respond to your request within 30 days as required by POPI Act.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">4.1 We Share Information With:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Healthcare Providers:</strong> Only information necessary for your appointment</li>
                  <li><strong>Payment Processors:</strong> PayFast (for secure payment processing)</li>
                  <li><strong>Service Providers:</strong> IT support, hosting (with data processing agreements)</li>
                  <li><strong>Legal Authorities:</strong> When required by South African law</li>
                </ul>

                <h3 className="font-semibold mb-3">4.2 We Never Share:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Your information for marketing by third parties</li>
                  <li>Medical information without your explicit consent</li>
                  <li>Data with unauthorized parties</li>
                  <li>Information outside South Africa without adequate protection</li>
                </ul>

                <h3 className="font-semibold mb-3">4.3 International Transfers:</h3>
                <p className="mb-2">
                  If we transfer data outside South Africa, we ensure adequate protection through:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Adequacy decisions by the Information Regulator</li>
                  <li>Standard data protection clauses</li>
                  <li>Binding corporate rules</li>
                  <li>Your explicit consent for transfers</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security and Protection</h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">5.1 Technical Safeguards:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Encryption</h4>
                    <p className="text-sm text-green-700">All data encrypted in transit and at rest</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Access Controls</h4>
                    <p className="text-sm text-blue-700">Role-based access and authentication</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Monitoring</h4>
                    <p className="text-sm text-purple-700">24/7 security monitoring and alerts</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Backups</h4>
                    <p className="text-sm text-orange-700">Secure, encrypted data backups</p>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">5.2 Organizational Safeguards:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Staff training on data protection and POPI Act</li>
                  <li>Data processing agreements with all vendors</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Incident response and breach notification procedures</li>
                  <li>Data minimization and retention policies</li>
                </ul>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Data Breach Notification:</h4>
                  <p className="text-sm text-red-700">
                    In case of a data breach, we will notify the Information Regulator within 72 hours and affected individuals without undue delay, as required by POPI Act.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">6.1 Retention Periods:</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Account Information</span>
                    <Badge variant="outline">Active account + 2 years after closure</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Medical Records</span>
                    <Badge variant="outline">6 years (as per HPCSA requirements)</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Payment Records</span>
                    <Badge variant="outline">5 years (tax compliance)</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Communication Records</span>
                    <Badge variant="outline">3 years</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Technical Logs</span>
                    <Badge variant="outline">1 year</Badge>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">6.2 Secure Disposal:</h3>
                <p>
                  When retention periods expire, we securely delete all personal information using industry-standard data destruction methods to ensure it cannot be recovered.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Our platform is designed for users 18 years and older. For users under 18:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Parental or guardian consent is required</li>
                  <li>Additional privacy protections apply</li>
                  <li>Limited data collection and use</li>
                  <li>Enhanced security measures</li>
                </ul>
                <p>
                  If we become aware that a child under 18 has provided personal information without parental consent, we will take steps to remove such information from our servers.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  We use cookies and similar technologies to improve your experience. See our Cookie Policy for detailed information about:
                </p>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Types of cookies we use</li>
                  <li>How to manage cookie preferences</li>
                  <li>Third-party cookies and analytics</li>
                  <li>Your consent and opt-out options</li>
                </ul>
                <Button variant="outline" size="sm">
                  View Cookie Policy
                </Button>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will:
                </p>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Notify you of material changes via email or platform notice</li>
                  <li>Provide 30 days notice before changes take effect</li>
                  <li>Seek your consent for changes affecting special personal information</li>
                  <li>Maintain previous versions for your reference</li>
                </ul>
                <p>
                  Your continued use of our platform after changes indicates acceptance of the updated policy.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Mail className="h-6 w-6 mr-2 text-green-500" />
              10. Contact Information
            </h2>
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Data Protection Officer:</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> [DPO Name]</p>
                      <p><strong>Email:</strong> privacy@ironledgermedmap.com</p>
                      <p><strong>Phone:</strong> +27 (0) 11 123 4567</p>
                      <p><strong>Address:</strong> [Company Address], South Africa</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Information Regulator (South Africa):</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Website:</strong> www.inforegulator.org.za</p>
                      <p><strong>Email:</strong> complaints.IR@justice.gov.za</p>
                      <p><strong>Phone:</strong> +27 (0) 12 406 4818</p>
                      <p>You have the right to lodge a complaint with the Information Regulator if you believe your privacy rights have been violated.</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <h3 className="font-semibold mb-2">Quick Contact Options:</h3>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Privacy Team
                    </Button>
                    <Button variant="outline" size="sm">
                      Request Data Access
                    </Button>
                    <Button variant="outline" size="sm">
                      Report Privacy Concern
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            This Privacy Policy is compliant with the Protection of Personal Information Act (POPI Act) of South Africa and represents our commitment to protecting your privacy rights.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Previous Page
            </Button>
            <Button onClick={() => window.print()}>
              Print Policy
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
