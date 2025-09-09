import { render as renderEmail } from "@react-email/render";
import BrandedEstimateEmail, { BrandedEstimateEmailProps } from "./BrandedEstimateEmail";
import React from "react";

export const fmt = (n: number, currency = "CAD", locale = "en-CA") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);

export function buildBrandedProps(input: {
  company: { name: string; logoUrl?: string; siteUrl: string; phone?: string; email?: string; address?: string };
  client: { name: string; email?: string };
  currency?: string; locale?: string;
  estimate: {
    number: string; issueDateISO: string; expiryDateISO?: string | null;
    subtotal: number; tax: number; total: number; deposit: number;
    serviceAddress?: string;
  };
  token: string; // public portal token
  landingBase: string; // e.g., https://firebuild.ai/open/estimate
  portalBase: string;  // e.g., https://app.firebuild.ai/portal/estimate
  payBase: string;     // your checkout endpoint, e.g., https://app.firebuild.ai/pay/deposit
  items?: Array<{ description: string; qty: number; unit_price: number; line_total: number; title?: string }>;
}): BrandedEstimateEmailProps {
  const c = input.currency ?? "CAD";
  const L = input.locale ?? "en-CA";
  const f = (x: number) => fmt(x, c, L);

  const landUrl = `${input.landingBase}/${input.token}?utm_source=email&utm_medium=estimate&utm_campaign=${encodeURIComponent(input.estimate.number)}`;
  const portalUrl = `${input.portalBase}/${input.token}?utm_source=email&utm_medium=estimate`;
  const payUrl = `${input.payBase}?estimate_token=${input.token}&return_url=${encodeURIComponent(portalUrl)}`;

  const items = (input.items ?? []).slice(0, 5).map((i, idx) => {
    const title = i.title ?? (i.description.split(/\r?\n/)[0] || `Item ${idx + 1}`);
    const rest = i.description.startsWith(title) ? i.description.slice(title.length).trim() : i.description;
    return { title, qty: i.qty, unit: f(i.unit_price), amount: f(i.line_total), details: rest || undefined };
  });

  return {
    company: input.company,
    client: input.client,
    landUrl, portalUrl, payUrl,
    estimate: {
      number: input.estimate.number,
      issueDate: new Date(input.estimate.issueDateISO).toLocaleDateString(L),
      expiryDate: input.estimate.expiryDateISO ? new Date(input.estimate.expiryDateISO).toLocaleDateString(L) : undefined,
      subtotal: f(input.estimate.subtotal),
      tax: f(input.estimate.tax),
      total: f(input.estimate.total),
      deposit: f(input.estimate.deposit),
      serviceAddress: input.estimate.serviceAddress,
    },
    items,
  };
}

export function renderBrandedEstimateEmail(props: BrandedEstimateEmailProps) {
  const html = renderEmail(<BrandedEstimateEmail {...props} />, { pretty: true });
  const text =
    `Estimate ${props.estimate.number}

Total: ${props.estimate.total}
Deposit required to approve: ${props.estimate.deposit}

Pay deposit: ${props.payUrl}
View details: ${props.landUrl}

Issue date: ${props.estimate.issueDate}
Expires: ${props.estimate.expiryDate ?? "-"}

${props.company.name} • ${props.company.siteUrl}`;
  return { html, text };
}