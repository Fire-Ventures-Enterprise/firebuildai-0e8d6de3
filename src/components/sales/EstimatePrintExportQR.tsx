import QRCode from "qrcode";

export async function getEstimateQRDataUrl(publicToken: string): Promise<string> {
  const portalUrl = `${window.location.origin}/portal/estimate/${publicToken}`;
  
  return QRCode.toDataURL(portalUrl, { 
    width: 150, 
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
}

export async function getInvoiceQRDataUrl(publicToken: string): Promise<string> {
  const portalUrl = `${window.location.origin}/portal/invoice/${publicToken}`;
  
  return QRCode.toDataURL(portalUrl, { 
    width: 150, 
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
}