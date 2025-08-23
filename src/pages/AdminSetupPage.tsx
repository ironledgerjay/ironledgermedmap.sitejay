import { useNavigate } from 'react-router-dom';
import AdminSetup from '@/components/AdminSetup';

export default function AdminSetupPage() {
  const navigate = useNavigate();

  const handleSetupComplete = () => {
    navigate('/login', {
      state: {
        message: "Admin account created successfully! You can now log in.",
        type: "success"
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AdminSetup onComplete={handleSetupComplete} />
      </div>
    </div>
  );
}
