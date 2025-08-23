import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Landmark, Shield, Zap, Check } from "lucide-react";

export type PaymentProvider = 'payfast';

interface PaymentProviderSelectorProps {
  amount: number;
  currency?: string;
  onProviderSelect: (provider: PaymentProvider) => void;
  selectedProvider?: PaymentProvider;
  className?: string;
}

export const PaymentProviderSelector: React.FC<PaymentProviderSelectorProps> = ({
  amount,
  currency = 'ZAR',
  onProviderSelect,
  selectedProvider,
  className = '',
}) => {
  const [provider, setProvider] = useState<PaymentProvider>(selectedProvider || 'payfast');

  const handleProviderChange = (newProvider: PaymentProvider) => {
    setProvider(newProvider);
    onProviderSelect(newProvider);
  };

  const providerOption = {
    id: 'payfast' as PaymentProvider,
    name: 'PayFast',
    description: 'Secure South African payment gateway',
    icon: Landmark,
    features: [
      'EFT (Bank Transfer)',
      'Instant EFT',
      'Credit & Debit Cards',
      'Bitcoin payments',
      'Secure & Local',
      'Trusted by thousands'
    ],
    badge: 'Secure',
    badgeVariant: 'default' as const,
    processingTime: 'Instant to 3 business days',
    fees: 'From 3.5% + R2.00'
  };

  const Icon = providerOption.icon;
  const isSelected = provider === providerOption.id;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Secure Payment with PayFast</h3>
        <p className="text-sm text-muted-foreground">
          Complete your payment of {currency} {amount} safely and securely
        </p>
      </div>

      <RadioGroup 
        value={provider} 
        onValueChange={(value) => handleProviderChange(value as PaymentProvider)}
        className="space-y-3"
      >
        <div>
          <Label htmlFor={providerOption.id} className="cursor-pointer">
            <Card className={`relative transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-primary border-primary' : 'border-muted'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={providerOption.id} id={providerOption.id} />
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-base">{providerOption.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {providerOption.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={providerOption.badgeVariant}>
                    {providerOption.badge}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Check className="h-4 w-4 mr-1 text-green-600" />
                      Supported Methods
                    </h4>
                    <ul className="space-y-1 text-muted-foreground">
                      {providerOption.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center mb-1">
                        <Zap className="h-4 w-4 mr-1 text-amber-500" />
                        <span className="font-medium">Processing Time</span>
                      </div>
                      <p className="text-muted-foreground">{providerOption.processingTime}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <Shield className="h-4 w-4 mr-1 text-blue-500" />
                        <span className="font-medium">Transaction Fees</span>
                      </div>
                      <p className="text-muted-foreground">{providerOption.fees}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Label>
        </div>
      </RadioGroup>

      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <Shield className="h-4 w-4 text-green-600" />
        <span>All payments are secured with 256-bit SSL encryption</span>
      </div>
    </div>
  );
};

export default PaymentProviderSelector;
