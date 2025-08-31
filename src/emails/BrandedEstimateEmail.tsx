/* eslint-disable react/no-unescaped-entities */
import {
  Body, Button, Column, Container, Head, Heading, Hr, Html,
  Img, Link, Preview, Row, Section, Tailwind, Text
} from "@react-email/components";
import * as React from "react";

type Money = string; // already formatted

export type BrandedEstimateEmailProps = {
  company: { name: string; logoUrl?: string; siteUrl: string; phone?: string; email?: string; address?: string };
  client:  { name: string; email?: string };
  estimate: {
    number: string;
    issueDate: string;          // "Aug 29, 2025"
    expiryDate?: string;        // optional
    subtotal: Money; tax: Money; total: Money; deposit: Money;
    serviceAddress?: string;
  };
  // Buttons
  landUrl: string;    // marketing/landing page (we'll auto-redirect to portal)
  portalUrl: string;  // direct secure portal (fallback)
  payUrl: string;     // deposit/checkout link (Stripe/PayPal) with return_url set
  // Optional: show a few items
  items?: Array<{ title: string; qty: number; unit: Money; amount: Money; details?: string }>;
};

export default function BrandedEstimateEmail(props: BrandedEstimateEmailProps) {
  const { company, client, estimate, landUrl, portalUrl, payUrl, items = [] } = props;
  const preview = `Estimate ${estimate.number} — Deposit ${estimate.deposit} to approve`;

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-[#0b1220] text-white m-0 p-0">
          <Container className="mx-auto my-6 w-full max-w-[680px] bg-[#0f172a] rounded-xl overflow-hidden border border-white/10">
            {/* Hero / Header */}
            <Section className="relative">
              <div style={{ position: "relative", height: "220px", background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)" }}>
                <div style={{ position: "absolute", inset: 0, padding: "24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", background: "rgba(0,0,0,0.3)" }}>
                  {company.logoUrl ? (
                    <Img src={company.logoUrl} alt={company.name} width="140" height="40" style={{ maxHeight: "40px", objectFit: "contain" }} />
                  ) : (
                    <Heading as="h2" className="text-xl m-0 text-white">{company.name}</Heading>
                  )}
                  <span style={{ display: "inline-block", borderRadius: "9999px", background: "rgba(255,255,255,0.9)", color: "black", fontSize: "12px", padding: "4px 12px" }}>
                    Estimate
                  </span>
                </div>
              </div>
            </Section>

            {/* Title + intro */}
            <Section className="px-6 pt-6">
              <Heading as="h1" className="text-[22px] leading-7 m-0 text-white">
                Estimate {estimate.number}
              </Heading>
              <Text className="text-white/70 m-0 mt-1">
                Hi {client.name}, your estimate is ready. You can review everything and approve by paying the deposit.
              </Text>
            </Section>

            {/* Summary / Totals */}
            <Section className="px-6 mt-4">
              <Row>
                <Column>
                  <Text className="text-xs text-white/60 m-0">Issue Date</Text>
                  <Text className="m-0 font-semibold text-white">{estimate.issueDate}</Text>
                </Column>
                <Column align="right">
                  <Text className="text-xs text-white/60 m-0">Expiration Date</Text>
                  <Text className="m-0 font-semibold text-white">{estimate.expiryDate ?? "—"}</Text>
                </Column>
              </Row>
            </Section>

            <Section className="px-6 mt-4">
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr><td className="py-1 text-white/70 text-sm">Subtotal</td>
                      <td className="py-1 text-right text-sm text-white">{estimate.subtotal}</td></tr>
                  <tr><td className="py-1 text-white/70 text-sm">Tax</td>
                      <td className="py-1 text-right text-sm text-white">{estimate.tax}</td></tr>
                  <tr><td className="py-1 font-semibold text-white">Total</td>
                      <td className="py-1 text-right font-semibold text-white">{estimate.total}</td></tr>
                  <tr><td className="py-1 text-[#60a5fa] font-semibold">Deposit Required</td>
                      <td className="py-1 text-right font-semibold text-[#60a5fa]">{estimate.deposit}</td></tr>
                </tbody>
              </table>
            </Section>

            {/* CTA buttons */}
            <Section className="px-6 mt-6">
              <Row>
                <Column>
                  <Button href={payUrl} className="bg-[#60a5fa] text-black font-semibold rounded-md px-5 py-3" style={{ background: "#60a5fa", color: "black", fontWeight: "600", borderRadius: "6px", padding: "12px 20px", textDecoration: "none", display: "inline-block" }}>
                    Pay Deposit & Approve
                  </Button>
                </Column>
                <Column align="right">
                  <Button href={landUrl} className="bg-white/10 text-white font-semibold rounded-md px-5 py-3" style={{ background: "rgba(255,255,255,0.1)", color: "white", fontWeight: "600", borderRadius: "6px", padding: "12px 20px", textDecoration: "none", display: "inline-block" }}>
                    View Details
                  </Button>
                </Column>
              </Row>
              <Text className="text-xs text-white/50 mt-3">
                Having trouble? Open the secure portal directly: <Link href={portalUrl} className="text-[#60a5fa]" style={{ color: "#60a5fa" }}>{portalUrl}</Link>
              </Text>
            </Section>

            {/* Short items list */}
            {items.length > 0 && (
              <>
                <Hr className="mx-6 border-white/10 my-4" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
                <Section className="px-6 pb-1">
                  <Heading as="h3" className="text-base m-0 mb-3 text-white">Summary</Heading>
                  <table width="100%" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th align="left" style={{background:"#111827",padding:"8px",fontSize:"12px",color:"#9ca3af"}}>Item</th>
                        <th align="right" style={{background:"#111827",padding:"8px",fontSize:"12px",color:"#9ca3af"}}>Rate</th>
                        <th align="right" style={{background:"#111827",padding:"8px",fontSize:"12px",color:"#9ca3af"}}>Qty</th>
                        <th align="right" style={{background:"#111827",padding:"8px",fontSize:"12px",color:"#9ca3af"}}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.slice(0,5).map((it, idx) => (
                        <React.Fragment key={idx}>
                          <tr>
                            <td style={{borderTop:"1px solid #1f2937",padding:"8px",color:"white"}}><strong>{it.title}</strong></td>
                            <td align="right" style={{borderTop:"1px solid #1f2937",padding:"8px",color:"white"}}>{it.unit}</td>
                            <td align="right" style={{borderTop:"1px solid #1f2937",padding:"8px",color:"white"}}>{it.qty}</td>
                            <td align="right" style={{borderTop:"1px solid #1f2937",padding:"8px",color:"white"}}>{it.amount}</td>
                          </tr>
                          {it.details && (
                            <tr>
                              <td colSpan={4} style={{borderTop:"0",padding:"8px",fontSize:"12px",color:"#9ca3af",whiteSpace:"pre-wrap"}}>
                                {it.details}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <Text className="text-xs text-white/50 mt-3">
                    For the complete estimate, open the secure portal.
                  </Text>
                </Section>
              </>
            )}

            {/* Footer */}
            <Hr className="mx-6 border-white/10 my-4" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
            <Section className="p-6 pt-3">
              <Text className="text-center text-xs text-white/50 m-0">
                Questions? Reply to this email or contact {company.phone ?? ""} • {company.email ?? ""}<br/>
                <Link href={company.siteUrl} className="text-[#60a5fa]" style={{ color: "#60a5fa" }}>{company.siteUrl}</Link> — {company.address ?? ""}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}