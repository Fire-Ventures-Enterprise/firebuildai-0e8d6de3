// Test case data for workflow testing

export class WorkflowTestCase {
  static createTestEstimate() {
    return {
      id: 'test-estimate-001',
      estimateNumber: 'EST-2024-0089',
      status: 'draft' as const,
      issueDate: new Date(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      
      // Customer info
      customerId: 'test-customer-001',
      customerName: 'Mike & Sarah Johnson',
      customerEmail: 'johnson@email.com',
      customerPhone: '(613) 555-0123',
      customerAddress: '456 Oak Street',
      customerCity: 'Ottawa',
      customerProvince: 'Ontario',
      customerPostalCode: 'K1A 0B1',
      
      // Service location
      serviceAddress: '456 Oak Street',
      serviceCity: 'Ottawa',
      serviceProvince: 'Ontario',
      servicePostalCode: 'K1A 0B1',
      
      // Line items - Mixed construction order for testing
      items: [
        {
          itemName: 'Kitchen Cabinet Installation',
          description: 'Install new custom kitchen cabinets',
          quantity: 1,
          rate: 2500,
          amount: 2500,
          taxable: true,
          sortOrder: 1
        },
        {
          itemName: 'Demolition of Existing Kitchen',
          description: 'Remove old cabinets, countertops, and fixtures',
          quantity: 1,
          rate: 1200,
          amount: 1200,
          taxable: true,
          sortOrder: 2
        },
        {
          itemName: 'Electrical Rough-in Work',
          description: 'Add new circuits for appliances and lighting',
          quantity: 1,
          rate: 1800,
          amount: 1800,
          taxable: true,
          sortOrder: 3
        },
        {
          itemName: 'Granite Countertop Installation',
          description: 'Supply and install granite countertops',
          quantity: 1,
          rate: 3500,
          amount: 3500,
          taxable: true,
          sortOrder: 4
        },
        {
          itemName: 'Paint Kitchen Walls and Ceiling',
          description: 'Prime and paint two coats',
          quantity: 1,
          rate: 900,
          amount: 900,
          taxable: true,
          sortOrder: 5
        },
        {
          itemName: 'Plumbing Rough-in',
          description: 'Relocate sink plumbing and add dishwasher line',
          quantity: 1,
          rate: 1100,
          amount: 1100,
          taxable: true,
          sortOrder: 6
        },
        {
          itemName: 'Drywall Repair and Finishing',
          description: 'Patch and finish walls after rough-in',
          quantity: 1,
          rate: 600,
          amount: 600,
          taxable: true,
          sortOrder: 7
        }
      ],
      
      // Financial
      subtotal: 13000,
      markupTotal: 2600,
      discount: 0,
      discountType: 'percentage',
      discountAmount: 0,
      taxRate: 13,
      taxAmount: 1690,
      total: 14690,
      
      // Deposit
      depositAmount: 4407,
      depositPercentage: 30,
      depositDue: new Date(),
      
      // Contract
      contractRequired: true,
      contractAttached: true,
      contractText: 'Standard kitchen renovation contract terms...',
      scopeOfWork: 'Complete kitchen renovation including demo, electrical, plumbing, cabinets, countertops, and finish work.',
      
      // Additional
      notes: 'Start date pending deposit. 3-week estimated completion.',
      privateNotes: 'Customer prefers morning work hours.',
      signatureRequired: true,
      
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}