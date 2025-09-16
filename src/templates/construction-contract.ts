export interface ContractData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyLicense?: string;
  
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  
  projectAddress: string;
  projectDescription: string;
  
  startDate: string;
  completionDate: string;
  
  contractPrice: number;
  depositAmount: number;
  paymentTerms: string;
  
  scopeOfWork: string;
  exclusions?: string;
}

export const generateContractText = (data: Partial<ContractData>): string => {
  const today = new Date().toLocaleDateString();
  
  return `
CONSTRUCTION CONTRACT AGREEMENT

This Construction Contract Agreement ("Agreement") is entered into as of ${today}, between:

CONTRACTOR:
${data.companyName || '[Company Name]'}
${data.companyAddress || '[Company Address]'}
Phone: ${data.companyPhone || '[Phone Number]'}
Email: ${data.companyEmail || '[Email Address]'}
${data.companyLicense ? `License #: ${data.companyLicense}` : ''}

CLIENT:
${data.clientName || '[Client Name]'}
${data.clientAddress || '[Client Address]'}
Phone: ${data.clientPhone || '[Phone Number]'}
Email: ${data.clientEmail || '[Email Address]'}

PROJECT LOCATION:
${data.projectAddress || '[Project Address]'}

1. SCOPE OF WORK
The Contractor agrees to provide all labor, materials, equipment, and services necessary for the completion of the following work:

${data.scopeOfWork || '[Detailed description of work to be performed]'}

2. PROJECT TIMELINE
- Start Date: ${data.startDate || '[Start Date]'}
- Estimated Completion Date: ${data.completionDate || '[Completion Date]'}
- Work will be performed during regular business hours (Monday-Friday, 8:00 AM - 5:00 PM) unless otherwise agreed.

3. CONTRACT PRICE AND PAYMENT TERMS
- Total Contract Price: $${data.contractPrice?.toLocaleString() || '[Amount]'}
- Deposit Required: $${data.depositAmount?.toLocaleString() || '[Amount]'} (Due upon signing)
- Payment Schedule: ${data.paymentTerms || 'As per payment schedule attached'}

All payments are due within 5 days of invoice date. Late payments will incur a 1.5% monthly interest charge.

4. MATERIALS AND WORKMANSHIP
- All materials will be new and of good quality, conforming to applicable standards
- All work will be completed in a workmanlike manner according to standard industry practices
- Contractor warrants all work performed for a period of one (1) year from completion

5. CHANGE ORDERS
Any changes, modifications, or additional work must be documented in a written change order signed by both parties before work proceeds. Change orders may affect the contract price and completion date.

6. PERMITS AND INSPECTIONS
Contractor will obtain all necessary permits and arrange for required inspections. Permit costs are ${data.contractPrice ? 'included in' : 'in addition to'} the contract price.

7. INSURANCE AND LIABILITY
- Contractor maintains general liability insurance of at least $1,000,000
- Contractor maintains workers' compensation insurance as required by law
- Client agrees to maintain homeowner's/property insurance during the project

8. SITE CONDITIONS
- Client will provide clear access to work areas
- Client will secure or remove valuable items from work areas
- Contractor will maintain a reasonably clean and safe work site
- Daily cleanup and final cleanup are included

9. EXCLUSIONS
Unless specifically included above, this contract does not include:
${data.exclusions || `- Repairs to existing structures not directly related to the project
- Correction of pre-existing code violations
- Hazardous material testing or remediation
- Moving of personal property
- Landscaping repairs beyond normal restoration`}

10. WARRANTY
Contractor warrants the work performed under this contract against defects in workmanship for one (1) year from substantial completion. This warranty does not cover:
- Normal wear and tear
- Damage from abuse, misuse, or lack of maintenance
- Acts of God or natural disasters
- Work performed by others

11. TERMINATION
Either party may terminate this contract with 7 days written notice. If Client terminates without cause, Client shall pay for all work completed plus 10% of remaining contract value. If Contractor terminates without cause, Contractor forfeits all claims to unearned funds.

12. DISPUTE RESOLUTION
Any disputes arising from this contract shall first be addressed through good faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with local construction industry standards.

13. LIEN WAIVER
Upon receipt of final payment, Contractor will provide a lien waiver releasing any mechanic's lien rights on the property.

14. INDEMNIFICATION
Each party agrees to indemnify and hold harmless the other party from claims arising from their own negligence or willful misconduct.

15. ENTIRE AGREEMENT
This contract, including any attached specifications, drawings, or payment schedules, constitutes the entire agreement between the parties. Any modifications must be in writing and signed by both parties.

16. GOVERNING LAW
This contract shall be governed by the laws of the state/province where the project is located.

17. ADDITIONAL TERMS AND CONDITIONS
- Weather delays beyond Contractor's control may extend the completion date
- Client's failure to make timely payments may result in work stoppage
- Contractor is not responsible for damage to underground utilities not properly marked
- Any concealed conditions discovered during work may require a change order

By signing below, both parties acknowledge they have read, understood, and agree to all terms and conditions of this contract.

CONTRACTOR:

_________________________________     Date: _______________
${data.companyName || '[Company Representative Name]'}
Title: [Title]

CLIENT:

_________________________________     Date: _______________
${data.clientName || '[Client Name]'}

_________________________________     Date: _______________
${data.clientName ? '[Additional Client if applicable]' : '[Client Name]'}
`;
};

export const CONTRACT_SECTIONS = {
  scopeOfWork: {
    title: 'Scope of Work',
    description: 'Detailed description of all work to be performed',
    required: true
  },
  timeline: {
    title: 'Project Timeline',
    description: 'Start and completion dates',
    required: true
  },
  payment: {
    title: 'Payment Terms',
    description: 'Total price, deposit, and payment schedule',
    required: true
  },
  warranty: {
    title: 'Warranty',
    description: 'Workmanship warranty terms',
    required: true
  },
  changeOrders: {
    title: 'Change Orders',
    description: 'Process for project modifications',
    required: true
  },
  insurance: {
    title: 'Insurance & Liability',
    description: 'Insurance coverage and liability terms',
    required: true
  }
};

export const STANDARD_EXCLUSIONS = [
  'Repairs to existing structures not directly related to the project',
  'Correction of pre-existing code violations',
  'Hazardous material testing or remediation (asbestos, lead, mold)',
  'Moving or storage of personal property',
  'Landscaping repairs beyond normal restoration',
  'Utility service upgrades unless specified',
  'Furniture or appliance moving',
  'Temporary living expenses',
  'Permits for work not included in scope',
  'Rock excavation or unusual soil conditions'
];

export const PAYMENT_SCHEDULE_TEMPLATES = {
  standard: {
    name: 'Standard (50-40-10)',
    stages: [
      { percentage: 50, description: 'Upon signing and permit approval' },
      { percentage: 40, description: 'At project midpoint/rough inspection' },
      { percentage: 10, description: 'Upon completion and final inspection' }
    ]
  },
  progressive: {
    name: 'Progressive (33-33-34)',
    stages: [
      { percentage: 33, description: 'Upon contract signing' },
      { percentage: 33, description: 'At 50% completion' },
      { percentage: 34, description: 'Upon final completion' }
    ]
  },
  milestone: {
    name: 'Milestone Based',
    stages: [
      { percentage: 25, description: 'Upon signing and mobilization' },
      { percentage: 25, description: 'Foundation/framing complete' },
      { percentage: 25, description: 'Rough inspections passed' },
      { percentage: 25, description: 'Final completion and inspection' }
    ]
  }
};