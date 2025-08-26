import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, CreditCard, ArrowRight, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const paymentId = searchParams.get('payment_id');
  const pf_payment_id = searchParams.get('pf_payment_id');

  useEffect(() => {
    // In production, you'd fetch payment details from your API
    // For now, we'll simulate this
    const fetchPaymentDetails = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPaymentDetails({
          id: paymentId,
          payfast_id: pf_payment_id,
          amount: 'R39.00',
          type: paymentId?.includes('membership') ? 'Membership' : 'Booking',
          status: 'Complete',
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.error('Error fetching payment details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (paymentId) {
      fetchPaymentDetails();
    } else {
      setLoading(false);
    }
  }, [paymentId, pf_payment_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-green-200 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
            <p className="text-gray-600 mt-2">
              Your payment has been processed successfully through PayFast
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {paymentDetails && (
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-sm">{paymentDetails.id?.slice(-8)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-green-600">{paymentDetails.amount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <Badge variant="secondary">{paymentDetails.type}</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {paymentDetails.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span>{paymentDetails.date}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span>{paymentDetails.time}</span>
                  </div>
                </div>

                {paymentDetails.payfast_id && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-gray-600">PayFast Transaction ID:</span>
                      <span className="font-mono text-sm">{paymentDetails.payfast_id}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">What happens next?</h4>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1">
                    {paymentDetails?.type === 'Membership' ? (
                      <>
                        <li>• Your premium membership is now active</li>
                        <li>• You have 5 free bookings for the next 3 months</li>
                        <li>• No convenience fees on your bookings</li>
                        <li>• Priority customer support</li>
                      </>
                    ) : (
                      <>
                        <li>• Your appointment booking is confirmed</li>
                        <li>• Doctor will receive your booking notification</li>
                        <li>• You'll receive email confirmation shortly</li>
                        <li>• Check your bookings in your account dashboard</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1">
                <Link to="/dashboard">
                  <Calendar className="h-4 w-4 mr-2" />
                  View My Bookings
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="flex-1">
                <Link to="/search">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Book Another Appointment
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">
                Need help? Contact our support team
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <a href="mailto:support@ironledgermedmap.co.za" className="text-blue-600 hover:underline">
                  support@ironledgermedmap.co.za
                </a>
                <span className="text-gray-300">|</span>
                <a href="tel:0800633627" className="text-blue-600 hover:underline">
                  0800 MEDMAP
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
