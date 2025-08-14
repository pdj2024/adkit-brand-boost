import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Ad-Kit Brandon</h1>
        <p className="text-xl text-muted-foreground mb-6">Generate compelling ad content for your campaigns</p>
        <Button onClick={() => navigate("/ad-kit")}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
