import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, FileText, AlertTriangle, Users, Heart } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl shadow-medical">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground">
            Effective Date: January 6, 2025 | Last Updated: January 6, 2025
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Important Legal Notice
            </CardTitle>
            <CardDescription>
              These Terms of Service govern your use of IronledgerMedMap. By using our platform, you agree to these terms. Please read them carefully.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              1. Acceptance of Terms
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  By accessing and using IronledgerMedMap ("the Platform", "we", "us", or "our"), you ("User", "you", or "your") accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p className="mb-4">
                  If you do not agree to abide by the above, please do not use this service. These terms apply to all users of the platform, including patients, healthcare providers, and administrative users.
                </p>
                <p>
                  IronledgerMedMap is operated by Ironledger (Pty) Ltd, a company registered in South Africa.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  IronledgerMedMap is a digital platform that facilitates connections between patients and healthcare providers in South Africa. Our services include:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Healthcare provider search and discovery</li>
                  <li>Appointment booking and scheduling</li>
                  <li>Provider profile management</li>
                  <li>Payment processing for consultations</li>
                  <li>Communication facilitation between patients and providers</li>
                </ul>
                <p>
                  <strong>Important:</strong> IronledgerMedMap is a technology platform only. We do not provide medical services, diagnosis, treatment, or medical advice.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-500" />
              3. Medical Disclaimer
            </h2>
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-red-800 mb-2">CRITICAL MEDICAL DISCLAIMER:</p>
                  <p className="text-red-700">
                    IronledgerMedMap does NOT provide medical advice, diagnosis, or treatment. All medical decisions must be made by qualified healthcare professionals.
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-2">
                  <li>The platform facilitates appointment booking only</li>
                  <li>All medical consultations occur directly between you and your chosen healthcare provider</li>
                  <li>We are not responsible for the quality, accuracy, or outcomes of medical services</li>
                  <li>In case of medical emergencies, contact emergency services immediately (10177)</li>
                  <li>Always consult qualified healthcare professionals for medical advice</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-blue-500" />
              4. User Responsibilities
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">4.1 Patient Responsibilities:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Provide accurate and complete personal and medical information</li>
                  <li>Attend scheduled appointments or cancel with appropriate notice</li>
                  <li>Make payments for services as agreed</li>
                  <li>Respect healthcare providers and their time</li>
                  <li>Follow provider instructions and treatment plans</li>
                </ul>

                <h3 className="font-semibold mb-2">4.2 Healthcare Provider Responsibilities:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Maintain valid registration with the Health Professions Council of South Africa (HPCSA)</li>
                  <li>Provide accurate profile information and qualifications</li>
                  <li>Maintain professional standards and ethical conduct</li>
                  <li>Honor scheduled appointments or provide appropriate notice</li>
                  <li>Comply with all applicable medical and legal regulations</li>
                </ul>

                <h3 className="font-semibold mb-2">4.3 All Users Must:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use the platform lawfully and ethically</li>
                  <li>Respect the privacy and confidentiality of others</li>
                  <li>Not misuse or abuse the platform</li>
                  <li>Comply with these Terms of Service</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  Your privacy is important to us. Our collection, use, and protection of personal information is governed by our Privacy Policy and complies with the Protection of Personal Information Act (POPI Act) of South Africa.
                </p>
                <p className="mb-4">
                  By using our platform, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
                <p>
                  <strong>Medical Information:</strong> All medical information shared through our platform is treated as confidential and protected according to South African healthcare regulations.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">6.1 Consultation Fees:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>Consultation fees are set by individual healthcare providers</li>
                  <li>Payment is required before or at the time of consultation</li>
                  <li>Fees are clearly displayed before booking confirmation</li>
                </ul>

                <h3 className="font-semibold mb-2">6.2 Platform Fees:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  <li>A convenience fee may apply to certain transactions</li>
                  <li>Premium memberships include additional benefits and reduced fees</li>
                  <li>All fees are clearly disclosed before payment</li>
                </ul>

                <h3 className="font-semibold mb-2">6.3 Refund Policy:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cancellations made 24+ hours in advance: Full refund</li>
                  <li>Cancellations made less than 24 hours: 50% refund</li>
                  <li>No-shows: No refund</li>
                  <li>Provider cancellations: Full refund or rescheduling</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  <strong>TO THE MAXIMUM EXTENT PERMITTED BY SOUTH AFRICAN LAW:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>IronledgerMedMap is not liable for any medical outcomes or decisions</li>
                  <li>We do not guarantee the availability, quality, or accuracy of healthcare services</li>
                  <li>Our liability is limited to the amount paid for platform services</li>
                  <li>We are not responsible for actions or omissions of healthcare providers</li>
                  <li>Platform availability may be interrupted for maintenance or technical issues</li>
                </ul>
                <p>
                  This limitation applies to all claims, whether based on contract, tort, negligence, or any other legal theory.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  All content on IronledgerMedMap, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, is the property of IronledgerMedMap or its content suppliers and is protected by South African and international copyright laws.
                </p>
                <p>
                  Users may not reproduce, distribute, or create derivative works from our content without express written permission.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  We reserve the right to terminate or suspend access to our platform immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
                </p>
                <p>
                  Upon termination, your right to use the platform will cease immediately.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  These Terms of Service are governed by and construed in accordance with the laws of South Africa, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
                <p>
                  Any disputes arising from these terms will be resolved according to South African law and in South African courts.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  We reserve the right to update these Terms of Service at any time. We will notify users of any material changes via email or prominent platform notice.
                </p>
                <p>
                  Continued use of the platform after changes constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Company:</strong> Ironledger (Pty) Ltd</p>
                  <p><strong>Email:</strong> legal@ironledgermedmap.com</p>
                  <p><strong>Phone:</strong> +27 (0) 11 123 4567</p>
                  <p><strong>Address:</strong> [Company Address], South Africa</p>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            By using IronledgerMedMap, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
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

export default TermsOfService;
