/* eslint-disable react/no-unescaped-entities */
import {
  Body, Button, Column, Container, Head, Heading, Hr, Html,
  Img, Link, Preview, Row, Section, Tailwind, Text
} from "@react-email/components";
import * as React from "react";

export type EstimateEmailItem = {
  title?: string;
  description?: string;  // full text (we'll split first line as title if title not provided)
  qty: number;
  unit_price: number;
  line_total: number;
};

export type EstimateEmailProps = {
  company: { name: string; logoUrl?: string; address?: string; phone?: string; email?: string };
  client: { name: string; email?: string };
  estimate: {
    number: string;
    issueDate: string;   // already formatted e.g. Aug 29, 2025
    expiryDate?: string; // formatted
    subtotal: string;    // formatted "$1,234.00"
    tax: string;
    total: string;
    deposit: string;     // formatted
    serviceAddress?: string;
    contractTitle?: string;
    contractUrl?: string;
  };
  portalUrl: string;     // view details
  depositUrl: string;    // pay deposit (approval)
  items?: EstimateEmailItem[]; // show first ~5 for brevity
};

export default function EstimateEmail({
  company, client, estimate, portalUrl, depositUrl, items = [],
}: EstimateEmailProps) {
  const preview = `Estimate ${estimate.number} — Deposit ${estimate.deposit} to approve`;

  const safeItems = items.slice(0, 5).map((i, idx) => {
    const first = (i.title ?? ((i.description ?? "").split(/\r?\n/)[0] || `Item ${idx + 1}`)).trim();
    const rest = (i.description ?? "");
    const details = rest.startsWith(first) ? rest.slice(first.length).trim() : rest;
    return { ...i, title: first, details };
  });

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-[#f6f7fb] text-[#111827] m-0 p-0">
          <Container className="mx-auto my-6 w-full max-w-[640px] bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <Section className="bg-[#111827] text-white p-6">
              <Row>
                <Column>
                  {company.logoUrl ? (
                    <Img src={company.logoUrl} width="120" alt={company.name} />
                  ) : (
                    <Heading as="h2" className="text-white m-0 text-xl">{company.name}</Heading>
                  )}
                </Column>
                <Column align="right">
                  <span className="inline-block rounded-full bg-[#dbeafe] text-[#1e3a8a] text-xs px-2 py-1">
                    Estimate
                  </span>
                </Column>
              </Row>
            </Section>

            {/* Title */}
            <Section className="p-6">
              <Heading as="h1" className="text-[22px] leading-7 m-0">
                Estimate {estimate.number}
              </Heading>
              <Text className="text-[#6b7280] m-0 mt-1">
                Please review and approve by paying the deposit.
              </Text>
            </Section>

            {/* Parties */}
            <Section className="px-6 -mt-3">
              <Row>
                <Column>
                  <Text className="text-xs text-[#6b7280] m-0">From</Text>
                  <Text className="m-0 font-semibold">{company.name}</Text>
                  {company.address && <Text className="m-0 text-sm">{company.address}</Text>}
                  {company.phone && <Text className="m-0 text-sm">{company.phone}</Text>}
                  {company.email && <Text className="m-0 text-sm">{company.email}</Text>}
                </Column>
                <Column align="right">
                  <Text className="text-xs text-[#6b7280] m-0">Bill To</Text>
                  <Text className="m-0 font-semibold">{client.name}</Text>
                  {client.email && <Text className="m-0 text-sm">{client.email}</Text>}
                  {estimate.serviceAddress && (
                    <>
                      <Text className="text-xs text-[#6b7280] m-0 mt-2">Service Address</Text>
                      <Text className="m-0 text-sm">{estimate.serviceAddress}</Text>
                    </>
                  )}
                </Column>
              </Row>
            </Section>

            {/* Dates */}
            <Section className="px-6 -mt-3">
              <Row>
                <Column>
                  <Text className="text-xs text-[#6b7280] m-0">Issue Date</Text>
                  <Text className="m-0 font-semibold">{estimate.issueDate}</Text>
                </Column>
                <Column align="right">
                  <Text className="text-xs text-[#6b7280] m-0">Expiration Date</Text>
                  <Text className="m-0 font-semibold">{estimate.expiryDate ?? "—"}</Text>
                </Column>
              </Row>
            </Section>

            {/* Totals */}
            <Section className="px-6">
              <table width="100%">
                <tbody>
                  <tr>
                    <td className="py-1 text-[#6b7280] text-sm">Subtotal</td>
                    <td className="py-1 text-right text-sm">{estimate.subtotal}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-[#6b7280] text-sm">Tax</td>
                    <td className="py-1 text-right text-sm">{estimate.tax}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Total</td>
                    <td className="py-1 text-right font-semibold">{estimate.total}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-[#2563eb]">Deposit Required</td>
                    <td className="py-1 text-right font-semibold text-[#2563eb]">
                      {estimate.deposit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Actions */}
            <Section className="px-6 -mt-2">
              <Row>
                <Column>
                  <Button
                    href={depositUrl}
                    className="bg-[#1f6feb] text-white font-semibold rounded-md px-5 py-3"
                  >
                    Pay Deposit
                  </Button>
                </Column>
                <Column align="right">
                  <Button
                    href={portalUrl}
                    className="bg-[#e5e7eb] text-[#111827] font-semibold rounded-md px-5 py-3"
                  >
                    View Details
                  </Button>
                </Column>
              </Row>
            </Section>

            {/* Optional in-email details (short list) */}
            {safeItems.length > 0 && (
              <>
                <Hr className="mx-6 border-[#e5e7eb]" />
                <Section className="px-6">
                  <Heading as="h3" className="text-base m-0 mb-2">Summary</Heading>
                  <table width="100%" style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th align="left" style={{background:"#f3f4f6",border:"1px solid #e5e7eb",padding:"8px",fontSize:"12px",color:"#374151"}}>Item</th>
                        <th align="right" style={{background:"#f3f4f6",border:"1px solid #e5e7eb",padding:"8px",fontSize:"12px",color:"#374151"}}>Rate</th>
                        <th align="right" style={{background:"#f3f4f6",border:"1px solid #e5e7eb",padding:"8px",fontSize:"12px",color:"#374151"}}>Qty</th>
                        <th align="right" style={{background:"#f3f4f6",border:"1px solid #e5e7eb",padding:"8px",fontSize:"12px",color:"#374151"}}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeItems.map((it, idx) => (
                        <React.Fragment key={idx}>
                          <tr>
                            <td style={{border:"1px solid #e5e7eb",padding:"8px"}}>
                              <strong>{it.title}</strong>
                            </td>
                            <td align="right" style={{border:"1px solid #e5e7eb",padding:"8px"}}>${it.unit_price.toFixed(2)}</td>
                            <td align="right" style={{border:"1px solid #e5e7eb",padding:"8px"}}>{it.qty}</td>
                            <td align="right" style={{border:"1px solid #e5e7eb",padding:"8px"}}>${it.line_total.toFixed(2)}</td>
                          </tr>
                          {it.details && (
                            <tr>
                              <td colSpan={4} style={{border:"1px solid #e5e7eb",borderTop:"0",padding:"8px",fontSize:"12px",color:"#374151",whiteSpace:"pre-wrap"}}>
                                {it.details}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <Text className="text-xs text-[#6b7280] mt-2">
                    For full details, open the secure portal.
                  </Text>
                </Section>
              </>
            )}

            {/* Contract note */}
            {(estimate.contractTitle || estimate.contractUrl) && (
              <>
                <Hr className="mx-6 border-[#e5e7eb]" />
                <Section className="px-6 pb-6">
                  <Heading as="h3" className="text-base m-0">{estimate.contractTitle ?? "Service Agreement"}</Heading>
                  <Text className="text-sm text-[#374151] m-0 mt-1">
                    By paying the deposit, you agree to the Service Agreement including payment terms and warranties.
                  </Text>
                  {estimate.contractUrl && (
                    <Text className="m-0 mt-2">
                      <Link href={estimate.contractUrl}>View Full Contract →</Link>
                    </Text>
                  )}
                </Section>
              </>
            )}

            {/* Footer */}
            <Hr className="mx-6 border-[#e5e7eb]" />
            <Section className="p-6 pt-3">
              <Text className="text-center text-xs text-[#6b7280] m-0">
                Questions? Reply to this email or contact {company.phone ?? ""} • {company.email ?? ""}<br/>
                {company.name} — {company.address ?? ""}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}