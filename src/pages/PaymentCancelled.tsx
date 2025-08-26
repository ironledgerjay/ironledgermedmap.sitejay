import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, ArrowLeft, RefreshCw, Home, HelpCircle } from 'lucide-react';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    // Extract payment details from URL parameters or localStorage
    if (paymentId) {
      setPaymentDetails({
        id: paymentId,
        type: paymentId.includes('membership') ? 'Membership' : 'Booking',
        cancelledAt: new Date().toLocaleString()
      });
    }
  }, [paymentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-red-200 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-red-800">Payment Cancelled</CardTitle>
            <p className="text-gray-600 mt-2">
              Your payment was cancelled before completion
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {paymentDetails && (
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Cancelled Payment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-sm">{paymentDetails.id?.slice(-8)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold">{paymentDetails.type}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled:</span>
                    <span>{paymentDetails.cancelledAt}</span>
                  </div>
                </div>
              </div>
            )}

            <Alert className="border-orange-200 bg-orange-50">
              <HelpCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Don't worry!</strong> No payment has been processed. You can try again at any time.
                {paymentDetails?.type === 'Booking' && ' Your appointment slot is still available for booking.'}
                {paymentDetails?.type === 'Membership' && ' You can still upgrade to premium membership whenever you\'re ready.'}
              </AlertDescription>
            </Alert>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">What would you like to do next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Try the payment again with the same or different payment method</li>
                <li>• Contact our support team if you experienced technical issues</li>
                <li>• Browse other available appointments or membership options</li>
                <li>• Return to your dashboard to manage existing bookings</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="flex-1" onClick={() => window.history.back()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Payment Again
              </Button>
              
              <Button variant="outline" asChild className="flex-1">
                <Link to="/search">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Find Doctors
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Common reasons for payment cancellation:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Payment was manually cancelled on the PayFast page</li>
                <li>• Browser back button was used during payment</li>
                <li>• Session timeout on the payment page</li>
                <li>• Network connectivity issues</li>
              </ul>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">
                Need assistance with your payment?
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <a href="mailto:payments@ironledgermedmap.co.za" className="text-blue-600 hover:underline">
                  payments@ironledgermedmap.co.za
                </a>
                <span className="text-gray-300">|</span>
                <a href="tel:0800633627" className="text-blue-600 hover:underline">
                  0800 MEDMAP
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Our payment support team is available Monday to Friday, 8AM - 6PM
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancelled;
