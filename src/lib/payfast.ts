// PayFast integration for South African payments
import { createHash } from 'crypto';

interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passphrase: string;
  sandbox: boolean;
}

interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  passphrase?: string;
  signature?: string;
}

interface PayFastNotification {
  m_payment_id: string;
  pf_payment_id: string;
  payment_status: 'COMPLETE' | 'FAILED' | 'CANCELLED';
  item_name: string;
  item_description: string;
  amount_gross: string;
  amount_fee: string;
  amount_net: string;
  signature: string;
}

class PayFastService {
  private config: PayFastConfig;
  private baseUrl: string;

  constructor(config: PayFastConfig) {
    this.config = config;
    this.baseUrl = config.sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';
  }

  private generateSignature(data: Record<string, string>, passphrase?: string): string {
    // Create parameter string
    const paramString = Object.keys(data)
      .filter(key => data[key] !== '' && key !== 'signature')
      .sort()
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');

    // Add passphrase if provided
    const stringToHash = passphrase 
      ? `${paramString}&passphrase=${encodeURIComponent(passphrase)}`
      : paramString;

    // Generate MD5 hash
    return createHash('md5').update(stringToHash).digest('hex');
  }

  public createPaymentData(paymentDetails: {
    amount: number;
    description: string;
    paymentId: string;
    userEmail: string;
    userName: string;
    returnUrl: string;
    cancelUrl: string;
    notifyUrl: string;
  }): PayFastPaymentData {
    const [firstName, ...lastNameParts] = paymentDetails.userName.split(' ');
    const lastName = lastNameParts.join(' ') || firstName;

    const data: PayFastPaymentData = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      return_url: paymentDetails.returnUrl,
      cancel_url: paymentDetails.cancelUrl,
      notify_url: paymentDetails.notifyUrl,
      name_first: firstName,
      name_last: lastName,
      email_address: paymentDetails.userEmail,
      m_payment_id: paymentDetails.paymentId,
      amount: paymentDetails.amount.toFixed(2),
      item_name: 'Medical Appointment Service',
      item_description: paymentDetails.description,
    };

    // Generate signature
    const signature = this.generateSignature(data, this.config.passphrase);
    data.signature = signature;

    return data;
  }

  public verifyNotification(notification: PayFastNotification): boolean {
    const { signature, ...dataWithoutSignature } = notification;
    const expectedSignature = this.generateSignature(
      dataWithoutSignature as any,
      this.config.passphrase
    );

    return signature === expectedSignature;
  }

  public generatePaymentForm(paymentData: PayFastPaymentData): string {
    const formFields = Object.entries(paymentData)
      .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}">`)
      .join('\n');

    return `
      <form id="payfast-form" action="${this.baseUrl}" method="post">
        ${formFields}
      </form>
      <script>
        document.getElementById('payfast-form').submit();
      </script>
    `;
  }

  public async redirectToPayment(paymentData: PayFastPaymentData): Promise<void> {
    // Create a form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = this.baseUrl;

    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }
}

// Environment configuration
const getPayFastConfig = (): PayFastConfig => {
  return {
    merchantId: import.meta.env.VITE_PAYFAST_MERCHANT_ID || '10000100',
    merchantKey: import.meta.env.VITE_PAYFAST_MERCHANT_KEY || '46f0cd694581a',
    passphrase: import.meta.env.VITE_PAYFAST_PASSPHRASE || 'jt7NOE43FZPn',
    sandbox: import.meta.env.VITE_PAYFAST_SANDBOX === 'true' || true,
  };
};

export const payfastService = new PayFastService(getPayFastConfig());

export type { PayFastPaymentData, PayFastNotification, PayFastConfig };
export { PayFastService };
