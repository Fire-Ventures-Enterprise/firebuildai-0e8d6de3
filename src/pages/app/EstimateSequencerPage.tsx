import { EstimateSequencerDemo } from "@/components/estimates/EstimateSequencerDemo";
import { SEOHead } from "@/components/seo/SEOHead";

export default function EstimateSequencerPage() {
  return (
    <>
      <SEOHead
        title="Estimate Sequencer - FireBuild"
        description="Automatically sequence construction estimates into proper work order phases"
      />
      <EstimateSequencerDemo />
    </>
  );
}