import { render as renderEmail } from "@react-email/render";
import EstimateEmail, { EstimateEmailProps, EstimateEmailItem } from "./EstimateEmail";
import React from "react";

export function fmtCurrency(amount: number, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

// Build props from raw DB rows
export function buildEstimateEmailProps(input: {
  company: { name: string; logoUrl?: string; address?: string; phone?: string; email?: string };
  client: { name: string; email?: string };
  estimate: {
    number: string;
    issueDateISO: string;
    expiryDateISO?: string | null;
    subtotal: number;
    tax: number;
    total: number;
    deposit: number;
    serviceAddress?: string;
    contractTitle?: string | null;
    contractUrl?: string | null;
    currency?: string; // e.g., "USD" / "CAD"
    locale?: string;   // e.g., "en-US"
  };
  portalUrl: string;
  depositUrl: string;
  items?: Array<{
    title?: string;
    description?: string;
    qty: number;
    unit_price: number;
    line_total: number;
  }>;
}): EstimateEmailProps {
  const c = input.estimate.currency ?? "USD";
  const L = input.estimate.locale ?? "en-US";
  const f = (n: number) => fmtCurrency(n, c, L);

  return {
    company: input.company,
    client: input.client,
    portalUrl: input.portalUrl,
    depositUrl: input.depositUrl,
    estimate: {
      number: input.estimate.number,
      issueDate: new Date(input.estimate.issueDateISO).toLocaleDateString(L),
      expiryDate: input.estimate.expiryDateISO ? new Date(input.estimate.expiryDateISO).toLocaleDateString(L) : undefined,
      subtotal: f(input.estimate.subtotal),
      tax: f(input.estimate.tax),
      total: f(input.estimate.total),
      deposit: f(input.estimate.deposit),
      serviceAddress: input.estimate.serviceAddress,
      contractTitle: input.estimate.contractTitle ?? undefined,
      contractUrl: input.estimate.contractUrl ?? undefined,
    },
    items: (input.items ?? []) as EstimateEmailItem[],
  };
}

export function renderEstimateEmail(props: EstimateEmailProps) {
  const html = renderEmail(<EstimateEmail {...props} />, { pretty: true });
  const text =
`Estimate ${props.estimate.number}

Total: ${props.estimate.total}
Deposit required to approve: ${props.estimate.deposit}

View / approve: ${props.portalUrl}
Pay deposit: ${props.depositUrl}

Issue date: ${props.estimate.issueDate}
Expires: ${props.estimate.expiryDate ?? "-"}

${props.company.name}`;
  return { html, text };
}