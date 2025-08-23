import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Landmark,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { PaymentProviderSelector, PaymentProvider } from './PaymentProviderSelector';
import { useEnhancedPayment } from '../hooks/useEnhancedPayment';

interface EnhancedPaymentFormProps {
  amount: number;
  currency?: string;
  description: string;
  type: 'membership' | 'booking';
  userEmail: string;
  userName: string;
  userId?: string;
  bookingId?: string;
  hasFreeBookings?: boolean;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

type FormStep = 'provider' | 'payment';

export const EnhancedPaymentForm: React.FC<EnhancedPaymentFormProps> = ({
  amount,
  currency = 'ZAR',
  description,
  type,
  userEmail,
  userName,
  userId,
  bookingId,
  hasFreeBookings = false,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('provider');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('payfast');

  const { 
    processPayment, 
    processMembershipPayment, 
    processBookingPayment, 
    isProcessing 
  } = useEnhancedPayment();

  const handleProviderSelect = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
  };

  const handleContinueToPayment = () => {
    setCurrentStep('payment');
  };

  const handleBackToProvider = () => {
    setCurrentStep('provider');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let result;

      if (type === 'membership' && userId) {
        result = await processMembershipPayment(
          amount > 0 ? 'premium' : 'basic',
          userId,
          selectedProvider,
          userEmail,
          userName
        );
      } else if (type === 'booking' && bookingId) {
        result = await processBookingPayment(
          bookingId,
          amount,
          selectedProvider,
          userEmail,
          userName,
          hasFreeBookings
        );
      } else {
        result = await processPayment({
          amount,
          currency,
          description,
          type,
          provider: selectedProvider,
          userEmail,
          userName,
        });
      }

      if (result.success) {
        onSuccess(result.paymentId || '');
      } else {
        onError(result.error || 'Payment failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError(errorMessage);
    }
  };

  // PayFast is always ready once provider is selected
  const canProceed = currentStep === 'provider' || currentStep === 'payment';

  // Free booking display
  if (hasFreeBookings) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            Free Booking Available
          </CardTitle>
          <CardDescription>You have free bookings remaining in your premium membership</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge variant="secondary" className="text-lg font-semibold">
              No Payment Required
            </Badge>
          </div>
          
          <p className="text-sm text-center text-muted-foreground">
            This booking will use one of your remaining free bookings.
          </p>
          
          <Button 
            onClick={() => onSuccess('free_booking')} 
            className="w-full" 
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confirming Booking...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Free Booking
              </>
            )}
          </Button>
          
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-between">
          {currentStep === 'payment' && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToProvider}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex-1">
            <CardTitle className="flex items-center justify-center">
              <Landmark className="h-5 w-5 mr-2" />
              {currentStep === 'provider' ? 'Payment Method' : 'Payment Details'}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="w-8" /> {/* Spacer */}
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="secondary" className="text-lg font-semibold">
            {currency} {amount}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {currentStep === 'provider' ? (
          <div className="space-y-6">
            <PaymentProviderSelector
              amount={amount}
              currency={currency}
              onProviderSelect={handleProviderSelect}
              selectedProvider={selectedProvider}
            />
            
            <Button 
              onClick={handleContinueToPayment}
              className="w-full" 
              size="lg"
            >
              Continue to Payment
            </Button>
            
            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="w-full">
                Cancel
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <Badge variant="outline">
                PayFast Payment
              </Badge>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You will be redirected to PayFast to complete your payment securely.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>{currency} {amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span>PayFast</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <Lock className="h-4 w-4 text-green-600" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!canProceed || isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Proceed to PayFast
                </>
              )}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            {import.meta.env.DEV ? 'Demo Mode: No real charges will be made' : 'Secure payment processing'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPaymentForm;
