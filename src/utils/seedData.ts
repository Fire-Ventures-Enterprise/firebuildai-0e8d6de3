import { supabase } from '@/integrations/supabase/client';

export const seedDemoData = async (userId: string) => {
  try {
    // Check if data already exists
    const { data: existingJobs } = await supabase
      .from('jobs')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (existingJobs && existingJobs.length > 0) {
      console.log('Demo data already exists');
      return false;
    }

    // Create demo customers
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .insert([
        {
          user_id: userId,
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@example.com',
          phone: '(613) 555-0101',
          address: '123 Maple Street',
          city: 'Ottawa',
          province: 'ON',
          postal_code: 'K1A 0A1',
          company_name: 'Smith Residence'
        },
        {
          user_id: userId,
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.j@example.com',
          phone: '(613) 555-0102',
          address: '456 Pine Avenue',
          city: 'Ottawa',
          province: 'ON',
          postal_code: 'K1B 0B2',
          company_name: 'Johnson Home'
        }
      ])
      .select();

    if (customersError) throw customersError;

    // Create demo estimates
    const { data: estimates, error: estimatesError } = await supabase
      .from('estimates')
      .insert([
        {
          user_id: userId,
          customer_id: customers[0].id,
          estimate_number: 'EST-2025-001',
          status: 'sent',
          service_address: '123 Maple Street',
          service_city: 'Ottawa',
          service_province: 'ON',
          service_postal_code: 'K1A 0A1',
          subtotal: 7500,
          tax_rate: 13,
          tax_amount: 975,
          total: 8475,
          deposit_amount: 2000,
          deposit_percentage: 25,
          issue_date: new Date().toISOString(),
          expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          scope_of_work: 'Complete kitchen cabinet installation and countertop replacement',
          notes: 'All materials included in pricing',
          terms_conditions: 'Payment due within 30 days of completion'
        },
        {
          user_id: userId,
          customer_id: customers[1].id,
          estimate_number: 'EST-2025-002',
          status: 'draft',
          service_address: '456 Pine Avenue',
          service_city: 'Ottawa',
          service_province: 'ON',
          service_postal_code: 'K1B 0B2',
          subtotal: 3200,
          tax_rate: 13,
          tax_amount: 416,
          total: 3616,
          deposit_amount: 1000,
          deposit_percentage: 30,
          issue_date: new Date().toISOString(),
          expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          scope_of_work: 'Bathroom vanity installation and tile flooring',
          notes: 'Customer to provide tiles',
          terms_conditions: 'Payment due within 30 days of completion'
        }
      ])
      .select();

    if (estimatesError) throw estimatesError;

    // Create estimate items
    const { error: itemsError } = await supabase
      .from('estimate_items')
      .insert([
        {
          estimate_id: estimates[0].id,
          description: 'Kitchen Cabinet Installation',
          quantity: 1,
          rate: 5000,
          amount: 5000,
          sort_order: 1
        },
        {
          estimate_id: estimates[0].id,
          description: 'Countertop Supply & Install',
          quantity: 1,
          rate: 2500,
          amount: 2500,
          sort_order: 2
        },
        {
          estimate_id: estimates[1].id,
          description: 'Bathroom Vanity Installation',
          quantity: 1,
          rate: 2000,
          amount: 2000,
          sort_order: 1
        },
        {
          estimate_id: estimates[1].id,
          description: 'Tile Flooring (100 sq ft)',
          quantity: 100,
          rate: 12,
          amount: 1200,
          sort_order: 2
        }
      ]);

    if (itemsError) throw itemsError;

    // Create demo jobs
    const { error: jobsError } = await supabase
      .from('jobs')
      .insert([
        {
          user_id: userId,
          customer_id: customers[0].id,
          title: 'Kitchen Renovation - Smith Residence',
          description: 'Complete kitchen cabinet installation and countertop replacement',
          location: '123 Maple Street, Ottawa, ON',
          status: 'in_progress',
          priority: 'high',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 45,
          budget: 8475,
          notes: 'Customer prefers morning appointments'
        },
        {
          user_id: userId,
          customer_id: customers[1].id,
          title: 'Bathroom Renovation - Johnson Home',
          description: 'Bathroom vanity installation and tile flooring',
          location: '456 Pine Avenue, Ottawa, ON',
          status: 'planning',
          priority: 'medium',
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          progress: 0,
          budget: 3616,
          notes: 'Waiting for tile delivery'
        }
      ]);

    if (jobsError) throw jobsError;

    console.log('Demo data seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding demo data:', error);
    throw error;
  }
};