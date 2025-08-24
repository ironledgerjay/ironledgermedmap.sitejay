import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Shield, CreditCard, FileText, AlertTriangle, Stethoscope, Clock, CheckCircle } from "lucide-react";

const DoctorTerms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl shadow-medical">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Healthcare Provider Terms & Conditions</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Professional Agreement for Medical Practitioners
          </p>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Stethoscope className="h-3 w-3 mr-1" />
            HPCSA Compliant
          </Badge>
        </div>

        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            These terms apply specifically to healthcare providers, practitioners, and medical professionals using the IronledgerMedMap platform. 
            By registering as a healthcare provider, you agree to these professional terms and conditions.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-blue-600">
              <Shield className="h-6 w-6 mr-2" />
              1. Professional Requirements and Verification
            </h2>
            <Card className="border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">1.1 Mandatory Requirements:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      HPCSA Registration
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Valid HPCSA registration number</li>
                      <li>• Current annual registration fees paid</li>
                      <li>• No active disciplinary actions</li>
                      <li>• Specialty registration where applicable</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Professional Insurance
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Valid professional indemnity insurance</li>
                      <li>• Minimum coverage: R10 million</li>
                      <li>• Insurance must cover telemedicine</li>
                      <li>• Annual proof of coverage required</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Qualifications
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Recognized medical degree</li>
                      <li>• Valid practicing certificate</li>
                      <li>• Continuing education compliance</li>
                      <li>• Specialty certifications</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Practice Information
                    </h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Valid practice license</li>
                      <li>• Registered practice address</li>
                      <li>• Emergency contact details</li>
                      <li>• Practice operating permits</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">1.2 Verification Process:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Initial Verification:</strong> All documents reviewed within 48-72 hours of submission</li>
                  <li><strong>HPCSA Database Check:</strong> Cross-reference with official HPCSA records</li>
                  <li><strong>Insurance Verification:</strong> Direct confirmation with insurance providers</li>
                  <li><strong>Background Screening:</strong> Check for disciplinary actions or restrictions</li>
                  <li><strong>Annual Re-verification:</strong> Mandatory annual review of all credentials</li>
                </ul>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-800 mb-2">Important Notice:</p>
                  <p className="text-sm text-red-700">
                    Providing false or misleading information during registration may result in immediate suspension, 
                    account termination, and reporting to the HPCSA. Practitioners must notify us immediately of any 
                    changes to their registration status, disciplinary actions, or insurance coverage.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-green-500" />
              2. Professional Standards and Conduct
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">2.1 Medical Practice Standards:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Clinical Excellence:</strong> Maintain the highest standards of clinical care and professional conduct</li>
                  <li><strong>Ethical Practice:</strong> Adhere to all HPCSA ethical guidelines and professional codes</li>
                  <li><strong>Patient Safety:</strong> Prioritize patient safety and well-being in all interactions</li>
                  <li><strong>Informed Consent:</strong> Obtain appropriate consent before providing any medical services</li>
                  <li><strong>Confidentiality:</strong> Maintain strict patient confidentiality as per medical ethics</li>
                  <li><strong>Scope of Practice:</strong> Practice only within your registered scope and specialization</li>
                </ul>

                <h3 className="font-semibold mb-3">2.2 Platform-Specific Requirements:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2 text-blue-700">Profile Accuracy:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Accurate and current profile information</li>
                      <li>Professional photograph</li>
                      <li>Detailed qualification listings</li>
                      <li>Clear consultation fees</li>
                      <li>Available appointment slots</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-green-700">Communication Standards:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Professional language and tone</li>
                      <li>Timely responses to patient inquiries</li>
                      <li>Clear communication of treatment plans</li>
                      <li>Proper documentation of consultations</li>
                      <li>Respectful patient interactions</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">2.3 Prohibited Activities:</h3>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                    <li>Practicing outside your registered scope or specialty</li>
                    <li>Providing medical advice without proper consultation</li>
                    <li>Sharing patient information without consent</li>
                    <li>False or misleading advertising of services</li>
                    <li>Inappropriate patient relationships</li>
                    <li>Prescribing controlled substances without proper examination</li>
                    <li>Operating under suspended or expired licenses</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-purple-500" />
              3. Financial Terms and Payment Processing
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">3.1 Fee Structure:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Platform Commission:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Standard bookings: 8% commission</li>
                      <li>• Premium providers: 5% commission</li>
                      <li>• Emergency bookings: 10% commission</li>
                      <li>• First month: 0% commission (promotion)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Payment Schedule:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Weekly payouts every Friday</li>
                      <li>• Minimum payout threshold: R500</li>
                      <li>• Direct bank transfer (EFT)</li>
                      <li>• Payment within 2-3 business days</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">3.2 Consultation Fees:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Fee Setting:</strong> Healthcare providers set their own consultation fees</li>
                  <li><strong>Transparency:</strong> All fees must be clearly displayed to patients before booking</li>
                  <li><strong>Medical Aid:</strong> Fees should align with medical aid tariffs where applicable</li>
                  <li><strong>Currency:</strong> All fees quoted and processed in South African Rand (ZAR)</li>
                  <li><strong>Fee Changes:</strong> 7 days notice required for fee increases</li>
                </ul>

                <h3 className="font-semibold mb-3">3.3 Payment Processing:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Patient Payment Collection</span>
                    <Badge variant="outline">Platform Responsibility</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Payment Security and Fraud Protection</span>
                    <Badge variant="outline">Platform Responsibility</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Medical Aid Claims Processing</span>
                    <Badge variant="outline">Provider Responsibility</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Tax Compliance and Reporting</span>
                    <Badge variant="outline">Provider Responsibility</Badge>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-yellow-800 mb-2">Tax Obligations:</p>
                  <p className="text-sm text-yellow-700">
                    Healthcare providers are responsible for their own tax obligations, including VAT registration 
                    where applicable, income tax reporting, and compliance with SARS requirements. The platform 
                    will provide transaction summaries to assist with tax reporting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-orange-500" />
              4. Appointment Management and Availability
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">4.1 Schedule Management:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Real-time Updates:</strong> Keep availability calendar current and accurate</li>
                  <li><strong>Advanced Notice:</strong> Provide at least 24 hours notice for schedule changes</li>
                  <li><strong>Emergency Unavailability:</strong> Immediate notification for unexpected unavailability</li>
                  <li><strong>Holiday Schedules:</strong> Update availability for public holidays and vacation periods</li>
                  <li><strong>Consultation Duration:</strong> Clearly specify appointment duration for each service type</li>
                </ul>

                <h3 className="font-semibold mb-3">4.2 Appointment Confirmation Requirements:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Response Times:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Standard bookings: Within 4 hours</li>
                      <li>• Same-day bookings: Within 1 hour</li>
                      <li>• Emergency slots: Within 30 minutes</li>
                      <li>• Weekend bookings: Within 6 hours</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Confirmation Process:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Review patient information</li>
                      <li>• Confirm appointment details</li>
                      <li>• Send confirmation to patient</li>
                      <li>• Add to personal calendar</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">4.3 Cancellation and Rescheduling Policy:</h3>
                <div className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Provider-Initiated Cancellations:</h4>
                    <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                      <li>24+ hours notice: No penalty, offer alternative slots</li>
                      <li>Less than 24 hours: Must offer priority rescheduling</li>
                      <li>Emergency situations: Acceptable with immediate notification</li>
                      <li>Excessive cancellations may result in account review</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Patient No-Shows:</h4>
                    <ul className="list-disc list-inside space-y-1 text-orange-700 text-sm">
                      <li>Wait time: Minimum 15 minutes past appointment time</li>
                      <li>Attempt contact: Call patient before marking as no-show</li>
                      <li>Documentation: Record no-show with timestamp</li>
                      <li>Fee policy: Apply no-show fees as per your practice policy</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Stethoscope className="h-6 w-6 mr-2 text-red-500" />
              5. Telemedicine and Virtual Consultations
            </h2>
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">5.1 Telemedicine Compliance:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>HPCSA Guidelines:</strong> Comply with all HPCSA telemedicine guidelines and regulations</li>
                  <li><strong>Patient Consent:</strong> Obtain explicit consent for telemedicine consultations</li>
                  <li><strong>Technology Requirements:</strong> Ensure secure, HIPAA-compliant communication platforms</li>
                  <li><strong>Documentation:</strong> Maintain proper records of virtual consultations</li>
                  <li><strong>Follow-up Care:</strong> Provide appropriate follow-up and referral options</li>
                </ul>

                <h3 className="font-semibold mb-3">5.2 Virtual Consultation Limitations:</h3>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Conditions Suitable for Telemedicine:</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                    <li>Follow-up consultations</li>
                    <li>Medication reviews</li>
                    <li>Mental health consultations</li>
                    <li>Chronic disease management</li>
                    <li>Health education and counseling</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Conditions NOT Suitable for Telemedicine:</h4>
                  <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                    <li>Emergency medical situations</li>
                    <li>Conditions requiring physical examination</li>
                    <li>Procedures requiring hands-on treatment</li>
                    <li>Initial diagnosis of complex conditions</li>
                    <li>Patients under influence of substances</li>
                  </ul>
                </div>

                <h3 className="font-semibold mb-3 mt-4">5.3 Technical Requirements:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-blue-700">Minimum Standards:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>High-speed internet connection</li>
                      <li>HD video and audio capability</li>
                      <li>Secure, encrypted platforms</li>
                      <li>Backup communication methods</li>
                      <li>Screen sharing capabilities</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-green-700">Platform Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Session recording (with consent)</li>
                      <li>File sharing capabilities</li>
                      <li>Digital prescription tools</li>
                      <li>Integration with EMR systems</li>
                      <li>Patient portal access</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-2 text-yellow-500" />
              6. Liability and Risk Management
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">6.1 Professional Liability:</h3>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                  <p className="font-semibold text-red-800 mb-2">Healthcare Provider Responsibility:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                    <li>Full professional and clinical responsibility for all patient interactions</li>
                    <li>Compliance with all medical and legal standards</li>
                    <li>Maintenance of adequate professional indemnity insurance</li>
                    <li>Documentation and record-keeping according to HPCSA standards</li>
                    <li>Appropriate referrals and follow-up care</li>
                  </ul>
                </div>

                <h3 className="font-semibold mb-3">6.2 Platform Limitations:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Technology Platform Only:</strong> IronledgerMedMap provides booking technology, not medical services</li>
                  <li><strong>No Medical Oversight:</strong> The platform does not monitor or supervise medical consultations</li>
                  <li><strong>Provider Independence:</strong> Healthcare providers operate independently and are not employees</li>
                  <li><strong>Clinical Decisions:</strong> All clinical decisions remain solely with the healthcare provider</li>
                </ul>

                <h3 className="font-semibold mb-3">6.3 Risk Mitigation Requirements:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Mandatory Insurance:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Professional indemnity: R10M minimum</li>
                      <li>• General liability coverage</li>
                      <li>• Cyber liability protection</li>
                      <li>• Annual proof of coverage</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Documentation Standards:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Detailed consultation notes</li>
                      <li>• Patient consent records</li>
                      <li>• Treatment plan documentation</li>
                      <li>• Follow-up care instructions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Account Management and Suspension</h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">7.1 Account Suspension Triggers:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Immediate Suspension:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Lapsed HPCSA registration</li>
                      <li>• Professional misconduct charges</li>
                      <li>• Insurance coverage lapse</li>
                      <li>• Patient safety concerns</li>
                      <li>• Fraudulent activity</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">Warning System:</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Excessive cancellations</li>
                      <li>• Poor patient feedback</li>
                      <li>• Non-compliance with policies</li>
                      <li>• Payment disputes</li>
                      <li>• Technical non-compliance</li>
                    </ul>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">7.2 Reinstatement Process:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Documentation Review:</strong> Submit updated credentials and certifications</li>
                  <li><strong>Compliance Verification:</strong> Demonstrate adherence to all requirements</li>
                  <li><strong>Remedial Actions:</strong> Complete any required training or corrective measures</li>
                  <li><strong>Review Process:</strong> Account review by medical advisory committee</li>
                  <li><strong>Probationary Period:</strong> Enhanced monitoring for specified period</li>
                </ul>

                <h3 className="font-semibold mb-3">7.3 Account Termination:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Permanent termination may result from:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Repeated violations of terms and conditions</li>
                    <li>Loss of professional license or registration</li>
                    <li>Criminal convictions related to professional practice</li>
                    <li>Serious patient safety incidents</li>
                    <li>Fraudulent or unethical behavior</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact and Support</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Provider Support Team:</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> providers@ironledgermedmap.com</p>
                      <p><strong>Phone:</strong> +27 (0) 11 123 4567</p>
                      <p><strong>Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM</p>
                      <p><strong>Emergency:</strong> 24/7 technical support available</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Regulatory Inquiries:</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Medical Director:</strong> Dr. [Name]</p>
                      <p><strong>Email:</strong> medical@ironledgermedmap.com</p>
                      <p><strong>Compliance:</strong> compliance@ironledgermedmap.com</p>
                      <p><strong>Legal:</strong> legal@ironledgermedmap.com</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <h3 className="font-semibold mb-2">Quick Support Options:</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="outline" size="sm">Provider Portal</Button>
                    <Button variant="outline" size="sm">Technical Support</Button>
                    <Button variant="outline" size="sm">Billing Inquiries</Button>
                    <Button variant="outline" size="sm">Account Management</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
            <h3 className="font-bold text-blue-800 text-lg mb-2">Professional Commitment</h3>
            <p className="text-blue-700 mb-2">
              By using IronledgerMedMap as a healthcare provider, you commit to maintaining the highest standards 
              of professional practice and patient care.
            </p>
            <p className="text-sm text-blue-600">
              These terms ensure quality healthcare delivery and protect both providers and patients.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Previous Page
            </Button>
            <Button onClick={() => window.print()}>
              Print Terms
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DoctorTerms;
