import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HomeButtonProps {
  className?: string;
}

export default function HomeButton({ className = "" }: HomeButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/')}
      variant="outline"
      size="sm"
      className={`fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border-primary/20 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 ${className}`}
    >
      <Home className="h-4 w-4 mr-2" />
      Home
    </Button>
  );
}
