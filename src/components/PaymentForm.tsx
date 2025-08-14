import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Lock, 
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentFormProps {
  amount: number;
  currency?: string;
  description: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency = 'ZAR',
  description,
  onSuccess,
  onError,
  isProcessing = false,
}) => {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, simulate success
      const isSuccess = Math.random() > 0.1; // 90% success rate
      
      if (isSuccess) {
        const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        toast({
          title: "Payment Successful",
          description: `Payment of ${currency} ${amount} has been processed successfully.`
        });
        
        onSuccess(paymentId);
      } else {
        throw new Error('Payment declined. Please try again.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = cardDetails.number.length >= 13 && 
                     cardDetails.expiry.length === 5 && 
                     cardDetails.cvc.length >= 3 && 
                     cardDetails.name.length > 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Details
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="flex items-center justify-center space-x-2">
          <Badge variant="secondary" className="text-lg font-semibold">
            {currency} {amount}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) => handleInputChange('number', formatCardNumber(e.target.value))}
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => handleInputChange('expiry', formatExpiry(e.target.value))}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cardDetails.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Lock className="h-4 w-4 text-green-600" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={!isFormValid || isSubmitting || isProcessing}
          >
            {isSubmitting || isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Pay {currency} {amount}
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            Demo Mode: No real charges will be made
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
