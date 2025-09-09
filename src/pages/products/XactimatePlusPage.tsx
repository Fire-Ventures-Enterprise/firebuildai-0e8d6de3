import { ProductLandingPage } from "@/components/marketing/ProductLandingPage";
import { FileSearch, FileText, Calculator, DollarSign } from "lucide-react";

// Xactimate Integration Product
export function XactimatePlusPage() {
  return (
    <ProductLandingPage
      productName="FireBuild Xactimate Plus"
      productTagline="Seamless Xactimate Integration for Restoration Contractors"
      productDescription="Import, edit, and manage Xactimate estimates directly within FireBuild. Automatically convert to invoices, track progress, and sync with insurance carriers."
      features={[
        "One-click Xactimate file import (ESX format)",
        "Visual line item editor with drag-and-drop",
        "Automatic photo attachment to line items",
        "Real-time pricing updates from Xactimate",
        "Insurance carrier direct submission",
        "Supplement tracking and management",
        "Progress billing based on completion percentage",
        "Detailed profit margin analysis by category"
      ]}
      subdomain="xactimate"
      icon={FileSearch}
      betaFeatures={[
        "AI-powered supplement suggestions",
        "Automatic code matching and validation",
        "Insurance adjuster collaboration portal",
        "Predictive settlement timeline estimates"
      ]}
    />
  );
}