import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdResult {
  primaryText: string[];
  headline: string[];
  description: string[];
  primaryTextImages?: string[];
  headlineImages?: string[];
  descriptionImages?: string[];
}

const AdKit = () => {
  const [itemDescription, setItemDescription] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [creativeStyle, setCreativeStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AdResult | null>(null);

  const handleGenerate = async () => {
    if (!itemDescription || !campaignGoal || !creativeStyle) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://78398d7a9140.ngrok-free.app/webhook-test/c8be406b-ee83-497e-877f-a5fe26cae487", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemDescription,
          campaignGoal,
          creativeStyle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate ads");
      }

      const data = await response.json();
      
      // Check if the response contains actual results or just a workflow start message
      if (data.message && data.message === "Workflow was started") {
        toast.info("Workflow started. This might be a webhook that processes async. Check the response format.");
        setResults(null);
      } else if (data.text && data.headline && data.description) {
        // Convert single strings to arrays for consistent UI handling
        setResults({
          primaryText: [data.text],
          headline: [data.headline],
          description: [data.description]
        });
        toast.success("Ads generated successfully!");
      } else if (data.primaryText && data.headline && data.description) {
        setResults(data);
        toast.success("Ads generated successfully!");
      } else {
        // For demo purposes, set some mock data to show the UI works
        setResults({
          primaryText: ["Sample primary text 1", "Sample primary text 2", "Sample primary text 3"],
          headline: ["Sample headline 1", "Sample headline 2", "Sample headline 3"],
          description: ["Sample description 1", "Sample description 2", "Sample description 3"]
        });
        toast.info("API returned unexpected format. Showing sample data.");
      }
    } catch (error) {
      console.error("Error generating ads:", error);
      toast.error("Failed to generate ads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const renderColumn = (title: string, items: string[] = [], images?: string[]) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="space-y-3">
        {items && items.length > 0 ? items.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start gap-3">
              <p className="text-sm flex-1">{item}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(item)}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {images && images[index] && (
              <div className="mt-3">
                <img
                  src={images[index]}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md border"
                />
              </div>
            )}
          </Card>
        )) : (
          <p className="text-muted-foreground text-sm">No {title.toLowerCase()} generated yet.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Ad-Kit Brandon</h1>
          <p className="text-muted-foreground">Generate compelling ad content for your campaigns</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ad Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Item Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your product or service..."
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Campaign Goal</Label>
                <Select value={campaignGoal} onValueChange={setCampaignGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traffic">Traffic</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="retargeting">Retargeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Creative Style</Label>
                <Select value={creativeStyle} onValueChange={setCreativeStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select creative style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clean">Clean</SelectItem>
                    <SelectItem value="ugc">UGC</SelectItem>
                    <SelectItem value="meme">Meme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate!"
              )}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {renderColumn("Primary Text", results.primaryText, results.primaryTextImages)}
            {renderColumn("Headline", results.headline, results.headlineImages)}
            {renderColumn("Description", results.description, results.descriptionImages)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdKit;