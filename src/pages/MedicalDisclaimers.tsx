import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, AlertTriangle, Phone, Shield, Stethoscope, Clock, Users, FileText } from "lucide-react";

const MedicalDisclaimers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-xl shadow-medical">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Medical Disclaimers</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Important Medical and Legal Information
          </p>
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical Medical Information
          </Badge>
        </div>

        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            <strong>EMERGENCY NOTICE:</strong> If you are experiencing a medical emergency, call 10177 (South Africa Emergency Services) or go to your nearest emergency room immediately. Do not use this platform for emergency medical situations.
          </AlertDescription>
        </Alert>

        <div className="space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-red-600">
              <AlertTriangle className="h-6 w-6 mr-2" />
              1. Primary Medical Disclaimer
            </h2>
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="bg-red-50 p-6 rounded-lg mb-4 border border-red-200">
                  <h3 className="font-bold text-red-800 text-lg mb-4">CRITICAL DISCLAIMER:</h3>
                  <ul className="space-y-3 text-red-700">
                    <li className="flex items-start">
                      <span className="mr-2 text-red-800 font-bold">•</span>
                      <span><strong>IronledgerMedMap is NOT a healthcare provider</strong> and does not provide medical advice, diagnosis, or treatment.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-800 font-bold">•</span>
                      <span><strong>We are a technology platform only</strong> that facilitates connections between patients and healthcare providers.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-800 font-bold">•</span>
                      <span><strong>All medical decisions must be made by qualified healthcare professionals</strong> registered with the Health Professions Council of South Africa (HPCSA).</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-red-800 font-bold">•</span>
                      <span><strong>No doctor-patient relationship</strong> is established through the use of this platform.</span>
                    </li>
                  </ul>
                </div>
                
                <p className="mb-4">
                  The information provided on this platform is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
                </p>
                
                <p className="font-semibold text-red-600">
                  Never disregard professional medical advice or delay in seeking it because of something you have read on this platform.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Phone className="h-6 w-6 mr-2 text-red-500" />
              2. Emergency Medical Situations
            </h2>
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="bg-orange-50 p-6 rounded-lg mb-4 border border-orange-200">
                  <h3 className="font-bold text-orange-800 text-lg mb-4">EMERGENCY CONTACTS:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-semibold text-orange-800">South Africa Emergency Services:</p>
                      <p className="text-2xl font-bold text-orange-700">10177</p>
                      <p className="text-sm text-orange-600">Available 24/7 for all emergencies</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-orange-800">Alternative Emergency Numbers:</p>
                      <p className="text-orange-700">Police: 10111</p>
                      <p className="text-orange-700">Fire: 10177</p>
                      <p className="text-orange-700">Medical: 10177</p>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold mb-3">When to Seek Emergency Care Immediately:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Chest pain or difficulty breathing</li>
                    <li>Severe allergic reactions</li>
                    <li>Loss of consciousness</li>
                    <li>Severe bleeding or trauma</li>
                    <li>Stroke symptoms (FAST test)</li>
                    <li>Heart attack symptoms</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Poisoning or overdose</li>
                    <li>Severe burns</li>
                    <li>Head or spinal injuries</li>
                    <li>Psychiatric emergencies</li>
                    <li>Pregnancy complications</li>
                    <li>Any life-threatening condition</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="font-semibold text-red-800 mb-2">DO NOT USE THIS PLATFORM FOR:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                    <li>Emergency medical situations requiring immediate attention</li>
                    <li>Life-threatening conditions</li>
                    <li>Urgent medical consultations</li>
                    <li>Time-sensitive medical advice</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Stethoscope className="h-6 w-6 mr-2 text-blue-500" />
              3. Healthcare Provider Verification
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Our Verification Process:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✓ HPCSA Registration</h4>
                    <p className="text-sm text-green-700">All healthcare providers must be registered with the Health Professions Council of South Africa</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">✓ Credential Verification</h4>
                    <p className="text-sm text-blue-700">We verify medical qualifications and specializations</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">✓ Practice Information</h4>
                    <p className="text-sm text-purple-700">Verification of practice locations and contact details</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">✓ Professional Standing</h4>
                    <p className="text-sm text-orange-700">Checks for disciplinary actions or restrictions</p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Verification Limitations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                    <li>Verification is based on information provided by healthcare providers</li>
                    <li>We cannot guarantee real-time accuracy of all credentials</li>
                    <li>Patients should independently verify provider credentials when in doubt</li>
                    <li>We are not responsible for the actions or decisions of healthcare providers</li>
                  </ul>
                </div>

                <p className="mt-4 text-sm">
                  <strong>Patient Responsibility:</strong> You are encouraged to verify healthcare provider credentials independently through the HPCSA website (www.hpcsa.co.za) before scheduling appointments.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-500" />
              4. Platform Limitations and Liability
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">4.1 What We Do:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-green-700">
                  <li>Provide a platform for finding and booking healthcare providers</li>
                  <li>Facilitate appointment scheduling and management</li>
                  <li>Process payments securely</li>
                  <li>Verify basic healthcare provider credentials</li>
                  <li>Provide customer support for platform-related issues</li>
                </ul>

                <h3 className="font-semibold mb-3">4.2 What We Do NOT Do:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4 text-red-700">
                  <li>Provide medical advice, diagnosis, or treatment</li>
                  <li>Guarantee the quality or outcomes of medical services</li>
                  <li>Monitor or supervise healthcare consultations</li>
                  <li>Take responsibility for healthcare provider actions</li>
                  <li>Provide emergency medical services</li>
                  <li>Store or manage detailed medical records</li>
                </ul>

                <h3 className="font-semibold mb-3">4.3 Liability Limitations:</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">IronledgerMedMap shall not be liable for:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Medical outcomes, complications, or adverse events</li>
                    <li>Healthcare provider negligence or malpractice</li>
                    <li>Misdiagnosis or delayed diagnosis</li>
                    <li>Treatment failures or medical errors</li>
                    <li>Unavailability of healthcare providers</li>
                    <li>Technical platform issues affecting urgent medical needs</li>
                  </ul>
                </div>

                <p className="text-sm text-muted-foreground">
                  Our liability is limited to platform service fees paid. For medical malpractice claims, patients must pursue legal action directly against the healthcare provider.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-purple-500" />
              5. Appointment and Consultation Disclaimers
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">5.1 Appointment Scheduling:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li><strong>Availability:</strong> Appointment slots shown are based on provider-submitted schedules and may not reflect real-time availability</li>
                  <li><strong>Confirmation:</strong> All appointments require confirmation from the healthcare provider</li>
                  <li><strong>Cancellations:</strong> Providers may cancel or reschedule appointments due to emergencies or unforeseen circumstances</li>
                  <li><strong>Wait Times:</strong> Actual consultation wait times may vary and are beyond our control</li>
                </ul>

                <h3 className="font-semibold mb-3">5.2 Consultation Quality:</h3>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>We do not monitor the quality or content of medical consultations</li>
                  <li>Duration and depth of consultations are determined by healthcare providers</li>
                  <li>Follow-up care and treatment plans are the responsibility of the healthcare provider</li>
                  <li>Second opinions should be sought when medically appropriate</li>
                </ul>

                <h3 className="font-semibold mb-3">5.3 Virtual Consultations:</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-800 mb-2">Telemedicine Limitations:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                    <li>Not all conditions can be diagnosed or treated virtually</li>
                    <li>Technical issues may affect consultation quality</li>
                    <li>Physical examinations may be limited or impossible</li>
                    <li>Emergency situations require in-person care</li>
                    <li>Prescription medications may have restrictions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Users className="h-6 w-6 mr-2 text-indigo-500" />
              6. Patient Rights and Responsibilities
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-green-700">Your Rights as a Patient:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Right to quality medical care</li>
                      <li>Right to informed consent</li>
                      <li>Right to medical confidentiality</li>
                      <li>Right to access your medical records</li>
                      <li>Right to second opinions</li>
                      <li>Right to refuse treatment</li>
                      <li>Right to lodge complaints</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3 text-blue-700">Your Responsibilities:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Provide accurate medical history</li>
                      <li>Follow treatment instructions</li>
                      <li>Attend scheduled appointments</li>
                      <li>Pay for services as agreed</li>
                      <li>Communicate openly with providers</li>
                      <li>Report adverse reactions</li>
                      <li>Respect provider time and policies</li>
                    </ul>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800 mb-2">Complaint Procedures:</h4>
                  <p className="text-sm text-indigo-700 mb-2">
                    If you have concerns about your medical care:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-indigo-700 text-sm">
                    <li>First, discuss concerns directly with your healthcare provider</li>
                    <li>Contact the practice manager if issues persist</li>
                    <li>Lodge complaints with the HPCSA for professional misconduct</li>
                    <li>Contact us only for platform-related technical issues</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-2 text-gray-500" />
              7. Legal and Regulatory Compliance
            </h2>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">7.1 Applicable Laws and Regulations:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Health Professions Act, 1974</li>
                    <li>National Health Act, 2003</li>
                    <li>Protection of Personal Information Act (POPI)</li>
                    <li>Electronic Communications and Transactions Act</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Consumer Protection Act</li>
                    <li>Medicines and Related Substances Act</li>
                    <li>Medical Schemes Act</li>
                    <li>Promotion of Access to Information Act</li>
                  </ul>
                </div>

                <h3 className="font-semibold mb-3">7.2 Regulatory Bodies:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Health Professions Council of South Africa (HPCSA)</span>
                    <span className="text-sm text-muted-foreground">www.hpcsa.co.za</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">South African Health Products Regulatory Authority</span>
                    <span className="text-sm text-muted-foreground">www.sahpra.org.za</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Council for Medical Schemes</span>
                    <span className="text-sm text-muted-foreground">www.medicalschemes.gov.za</span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-yellow-800 mb-2">Important Note:</p>
                  <p className="text-sm text-yellow-700">
                    While we strive to comply with all applicable laws and regulations, this platform does not constitute legal advice. 
                    Users should consult with legal professionals for specific legal questions or concerns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

        <Separator className="my-8" />

        <div className="text-center">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
            <h3 className="font-bold text-red-800 text-lg mb-2">FINAL REMINDER</h3>
            <p className="text-red-700 mb-2">
              This platform is for non-emergency appointment booking only. 
              <strong> For medical emergencies, call 10177 immediately.</strong>
            </p>
            <p className="text-sm text-red-600">
              Always consult qualified healthcare professionals for medical advice, diagnosis, and treatment.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Previous Page
            </Button>
            <Button onClick={() => window.print()}>
              Print Disclaimers
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MedicalDisclaimers;
