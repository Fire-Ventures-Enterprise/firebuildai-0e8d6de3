// Advanced Xactimate File Parser
// Supports .XMO (XML), PDF, and CSV formats

import { XactimateImportData } from '@/types/xactimate';

export class XactimateParser {
  /**
   * Main parsing function that detects file type and routes to appropriate parser
   */
  static async parseFile(file: File): Promise<XactimateImportData> {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.xmo') || fileName.endsWith('.xml')) {
      return await this.parseXMOFile(file);
    } else if (fileName.endsWith('.pdf')) {
      return await this.parsePDFFile(file);
    } else if (fileName.endsWith('.csv')) {
      return await this.parseCSVFile(file);
    } else {
      // Try to parse as text/ESX format
      return await this.parseTextFile(file);
    }
  }

  /**
   * Parse XMO/XML file format (Xactimate native format)
   */
  private static async parseXMOFile(file: File): Promise<XactimateImportData> {
    const text = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format');
    }

    const data: XactimateImportData = {
      claim_number: undefined,
      insured_name: undefined,
      property_address: undefined,
      date_of_loss: undefined,
      total_rcv: undefined,
      total_acv: undefined,
      deductible: undefined,
      line_items: []
    };

    // Extract estimate header information
    const estimate = xmlDoc.querySelector('Estimate');
    if (estimate) {
      data.claim_number = estimate.getAttribute('ClaimNumber') || 
                          xmlDoc.querySelector('ClaimNumber')?.textContent || undefined;
      data.insured_name = xmlDoc.querySelector('InsuredName')?.textContent || 
                         xmlDoc.querySelector('CustomerName')?.textContent || undefined;
      data.adjuster_name = xmlDoc.querySelector('AdjusterName')?.textContent || undefined;
      data.adjuster_email = xmlDoc.querySelector('AdjusterEmail')?.textContent || undefined;
      data.carrier_name = xmlDoc.querySelector('CarrierName')?.textContent || undefined;
    }

    // Extract property information
    const property = xmlDoc.querySelector('Property');
    if (property) {
      data.property_address = property.querySelector('Address')?.textContent || undefined;
      data.property_city = property.querySelector('City')?.textContent || undefined;
      data.property_state = property.querySelector('State')?.textContent || undefined;
      data.property_postal_code = property.querySelector('PostalCode')?.textContent || undefined;
    }

    // Extract loss information
    const loss = xmlDoc.querySelector('Loss');
    if (loss) {
      const dateOfLoss = loss.querySelector('Date')?.textContent;
      if (dateOfLoss) {
        data.date_of_loss = new Date(dateOfLoss);
      }
      data.cause_of_loss = loss.querySelector('Cause')?.textContent || undefined;
    }

    // Extract pricing summary
    const summary = xmlDoc.querySelector('Summary');
    if (summary) {
      data.total_rcv = this.parseNumber(summary.querySelector('RCV')?.textContent);
      data.total_acv = this.parseNumber(summary.querySelector('ACV')?.textContent);
      data.deductible = this.parseNumber(summary.querySelector('Deductible')?.textContent);
      data.depreciation = this.parseNumber(summary.querySelector('Depreciation')?.textContent);
    }

    // Extract line items
    const lineItems = xmlDoc.querySelectorAll('LineItem');
    lineItems.forEach((item, index) => {
      const lineItem = {
        code: item.getAttribute('Code') || item.querySelector('Code')?.textContent || '',
        description: item.querySelector('Description')?.textContent || '',
        quantity: this.parseNumber(item.querySelector('Quantity')?.textContent) || 0,
        unit: item.querySelector('Unit')?.textContent || 'EA',
        unit_price: this.parseNumber(item.querySelector('UnitPrice')?.textContent) || 0,
        total_price: this.parseNumber(item.querySelector('Total')?.textContent) || 0,
        category: item.querySelector('Category')?.textContent || 'General',
        room: item.querySelector('Room')?.textContent || 'General',
        type: item.querySelector('Type')?.textContent || 'Material',
        trade: item.querySelector('Trade')?.textContent,
        tax: this.parseNumber(item.querySelector('Tax')?.textContent)
      };
      
      // Calculate total if not provided
      if (!lineItem.total_price && lineItem.quantity && lineItem.unit_price) {
        lineItem.total_price = lineItem.quantity * lineItem.unit_price;
      }
      
      data.line_items.push(lineItem);
    });

    return data;
  }

  /**
   * Parse PDF file using text extraction
   */
  private static async parsePDFFile(file: File): Promise<XactimateImportData> {
    // For PDF parsing, we'll need to extract text first
    // In a production environment, you'd use a library like pdf.js
    // For now, we'll use a pattern-based text extraction approach
    
    const text = await this.extractTextFromPDF(file);
    return this.parseTextContent(text);
  }

  /**
   * Extract text from PDF (simplified version)
   */
  private static async extractTextFromPDF(file: File): Promise<string> {
    // This is a placeholder - in production, use pdf.js or similar
    // For now, convert to text if possible
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Parse CSV file format
   */
  private static async parseCSVFile(file: File): Promise<XactimateImportData> {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid');
    }

    // Parse headers
    const headers = this.parseCSVLine(lines[0]);
    const data: XactimateImportData = {
      claim_number: undefined,
      insured_name: undefined,
      property_address: undefined,
      date_of_loss: undefined,
      total_rcv: undefined,
      total_acv: undefined,
      deductible: undefined,
      line_items: []
    };

    // Map common header variations
    const headerMap: Record<string, string> = {
      'code': 'code',
      'item code': 'code',
      'xactimate code': 'code',
      'description': 'description',
      'item description': 'description',
      'qty': 'quantity',
      'quantity': 'quantity',
      'unit': 'unit',
      'unit price': 'unit_price',
      'price': 'unit_price',
      'total': 'total_price',
      'total price': 'total_price',
      'category': 'category',
      'room': 'room',
      'room name': 'room',
      'trade': 'trade'
    };

    // Find column indices
    const columnIndices: Record<string, number> = {};
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().trim();
      const mappedField = headerMap[normalizedHeader];
      if (mappedField) {
        columnIndices[mappedField] = index;
      }
    });

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      if (values.length === 0) continue;

      const lineItem: any = {
        code: values[columnIndices.code] || '',
        description: values[columnIndices.description] || '',
        quantity: this.parseNumber(values[columnIndices.quantity]) || 1,
        unit: values[columnIndices.unit] || 'EA',
        unit_price: this.parseNumber(values[columnIndices.unit_price]) || 0,
        total_price: this.parseNumber(values[columnIndices.total_price]) || 0,
        category: values[columnIndices.category] || 'General',
        room: values[columnIndices.room] || 'General',
        trade: values[columnIndices.trade]
      };

      // Calculate total if not provided
      if (!lineItem.total_price && lineItem.quantity && lineItem.unit_price) {
        lineItem.total_price = lineItem.quantity * lineItem.unit_price;
      }

      data.line_items.push(lineItem);
    }

    // Try to extract header info from first few lines if present
    const headerText = lines.slice(0, 10).join('\n');
    this.extractHeaderInfo(headerText, data);

    return data;
  }

  /**
   * Parse a single CSV line handling quoted values
   */
  private static parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    if (current) {
      result.push(current.trim());
    }
    
    return result;
  }

  /**
   * Parse text file using pattern matching
   */
  private static async parseTextFile(file: File): Promise<XactimateImportData> {
    const text = await file.text();
    return this.parseTextContent(text);
  }

  /**
   * Parse text content using pattern matching
   */
  private static parseTextContent(text: string): XactimateImportData {
    const data: XactimateImportData = {
      claim_number: undefined,
      insured_name: undefined,
      property_address: undefined,
      date_of_loss: undefined,
      total_rcv: undefined,
      total_acv: undefined,
      deductible: undefined,
      line_items: []
    };

    // Extract header information
    this.extractHeaderInfo(text, data);

    // Extract line items using various patterns
    const lineItems = this.extractLineItemsFromText(text);
    data.line_items = lineItems;

    return data;
  }

  /**
   * Extract header information from text
   */
  private static extractHeaderInfo(text: string, data: XactimateImportData): void {
    // Claim number patterns
    const claimPatterns = [
      /Claim\s*#?\s*:?\s*([A-Z0-9\-]+)/i,
      /Claim\s+Number\s*:?\s*([A-Z0-9\-]+)/i,
      /File\s*#?\s*:?\s*([A-Z0-9\-]+)/i
    ];
    
    for (const pattern of claimPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.claim_number = match[1];
        break;
      }
    }

    // Insured name patterns
    const insuredPatterns = [
      /Insured\s*:?\s*([^\n]+)/i,
      /Customer\s*:?\s*([^\n]+)/i,
      /Policyholder\s*:?\s*([^\n]+)/i
    ];
    
    for (const pattern of insuredPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.insured_name = match[1].trim();
        break;
      }
    }

    // Property address
    const addressPattern = /Property\s+Address\s*:?\s*([^\n]+)/i;
    const addressMatch = text.match(addressPattern);
    if (addressMatch) {
      data.property_address = addressMatch[1].trim();
    }

    // Date of loss
    const datePatterns = [
      /Date\s+of\s+Loss\s*:?\s*([^\n]+)/i,
      /Loss\s+Date\s*:?\s*([^\n]+)/i
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const dateStr = match[1].trim();
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          data.date_of_loss = date;
        }
        break;
      }
    }

    // Pricing totals
    const rcvPattern = /RCV\s*:?\s*\$?([\d,\.]+)/i;
    const rcvMatch = text.match(rcvPattern);
    if (rcvMatch) {
      data.total_rcv = this.parseNumber(rcvMatch[1]);
    }

    const acvPattern = /ACV\s*:?\s*\$?([\d,\.]+)/i;
    const acvMatch = text.match(acvPattern);
    if (acvMatch) {
      data.total_acv = this.parseNumber(acvMatch[1]);
    }

    const deductiblePattern = /Deductible\s*:?\s*\$?([\d,\.]+)/i;
    const deductMatch = text.match(deductiblePattern);
    if (deductMatch) {
      data.deductible = this.parseNumber(deductMatch[1]);
    }
  }

  /**
   * Extract line items from text using pattern matching
   */
  private static extractLineItemsFromText(text: string): any[] {
    const lineItems: any[] = [];
    const lines = text.split('\n');
    
    // Common line item patterns
    // Format: CODE DESCRIPTION QTY UNIT PRICE TOTAL
    const lineItemPattern = /^([A-Z]{3}[A-Z0-9\-]*)\s+(.+?)\s+([\d,\.]+)\s+([A-Z]{2,4})\s+\$?([\d,\.]+)\s+\$?([\d,\.]+)/;
    
    for (const line of lines) {
      const match = line.match(lineItemPattern);
      if (match) {
        lineItems.push({
          code: match[1],
          description: match[2].trim(),
          quantity: this.parseNumber(match[3]),
          unit: match[4],
          unit_price: this.parseNumber(match[5]),
          total_price: this.parseNumber(match[6]),
          category: 'General',
          room: 'General'
        });
      }
    }

    // If no line items found with strict pattern, try looser patterns
    if (lineItems.length === 0) {
      const loosePattern = /([A-Z]{2,}[\d\-]*)\s+(.+?)\s+([\d,\.]+)/g;
      let match;
      
      while ((match = loosePattern.exec(text)) !== null) {
        lineItems.push({
          code: match[1],
          description: match[2].trim(),
          quantity: this.parseNumber(match[3]),
          unit: 'EA',
          unit_price: 0,
          total_price: 0,
          category: 'General',
          room: 'General'
        });
      }
    }

    return lineItems;
  }

  /**
   * Parse number from string, handling currency formatting
   */
  private static parseNumber(value: string | null | undefined): number | undefined {
    if (!value) return undefined;
    
    // Remove currency symbols and thousands separators
    const cleaned = value.toString()
      .replace(/[$,]/g, '')
      .replace(/\s/g, '')
      .trim();
    
    const num = parseFloat(cleaned);
    return isNaN(num) ? undefined : num;
  }
}