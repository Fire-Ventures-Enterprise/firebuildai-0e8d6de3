import { ProductLandingPage } from "@/components/marketing/ProductLandingPage";
import { Workflow, GitBranch, CheckSquare, Layers } from "lucide-react";

// Workflow Automation Product
export function WorkflowAutomationPage() {
  return (
    <ProductLandingPage
      productName="FireBuild Workflow Engine"
      productTagline="Automate Your Business Operations End-to-End"
      productDescription="Build custom workflows that automate repetitive tasks, from estimate follow-ups to invoice collections. Save hours every week with intelligent automation."
      features={[
        "Visual workflow builder with drag-and-drop interface",
        "Pre-built templates for common contractor workflows",
        "Automated estimate and invoice follow-ups",
        "Smart document generation and distribution",
        "Multi-step approval processes",
        "Conditional logic and branching workflows",
        "Integration with email, SMS, and WhatsApp",
        "Performance tracking for each workflow"
      ]}
      subdomain="workflows"
      icon={Workflow}
      betaFeatures={[
        "AI-suggested workflow optimizations",
        "Natural language workflow creation",
        "Cross-platform automation with Zapier",
        "Custom webhook integrations"
      ]}
    />
  );
}