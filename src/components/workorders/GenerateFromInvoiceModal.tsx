import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Search, Calendar, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { R } from "@/routes/routeMap";
import { createWorkOrderFromInvoice } from "@/services/workOrders";
import { useAsyncToast } from "@/hooks/useAsyncToast";
import { upsertInvoiceSchedule } from "@/services/scheduling";

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name?: string;
  service_address?: string;
  status: string;
  invoice_scheduling?: Array<{
    starts_at: string;
    ends_at: string;
  }>;
}

interface GenerateFromInvoiceModalProps {
  open: boolean;
  onClose: () => void;
}

export function GenerateFromInvoiceModal({ open, onClose }: GenerateFromInvoiceModalProps) {
  const navigate = useNavigate();
  const { run, loading: generating } = useAsyncToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [scheduleData, setScheduleData] = useState({
    starts_at: "",
    ends_at: ""
  });
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setInvoices([]);
      return;
    }

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for 300ms debounce
    const timer = setTimeout(() => {
      searchInvoices(searchQuery);
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchQuery]);

  const searchInvoices = async (query: string) => {
    setLoading(true);
    try {
      const q = query.trim().toLowerCase();
      
      // First get invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from("invoices_enhanced")
        .select("id, invoice_number, customer_name, service_address, status")
        .or(`invoice_number.ilike.%${q}%,customer_name.ilike.%${q}%,service_address.ilike.%${q}%`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (invoicesError) throw invoicesError;

      // Then get scheduling info for these invoices
      const invoiceIds = (invoicesData || []).map(inv => inv.id);
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("invoice_scheduling")
        .select("invoice_id, starts_at, ends_at")
        .in("invoice_id", invoiceIds);

      if (scheduleError) console.error("Schedule fetch error:", scheduleError);

      // Combine the data
      const invoices: Invoice[] = (invoicesData || []).map(invoice => {
        const schedule = scheduleData?.find(s => s.invoice_id === invoice.id);
        return {
          ...invoice,
          invoice_scheduling: schedule ? [{
            starts_at: schedule.starts_at,
            ends_at: schedule.ends_at
          }] : undefined
        };
      });

      setInvoices(invoices);
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error("Failed to search invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkOrder = async () => {
    if (!selectedInvoice) return;

    const hasSchedule = selectedInvoice.invoice_scheduling && selectedInvoice.invoice_scheduling.length > 0;

    // If invoice doesn't have schedule, save it first
    if (!hasSchedule) {
      if (!scheduleData.starts_at || !scheduleData.ends_at) {
        toast.error("Please set schedule times");
        return;
      }

      // Save schedule using the scheduling service
      try {
        await upsertInvoiceSchedule({
          invoice_id: selectedInvoice.id,
          starts_at: scheduleData.starts_at,
          ends_at: scheduleData.ends_at,
          status: 'scheduled'
        });
      } catch (error) {
        toast.error("Failed to save invoice schedule");
        return;
      }
    }

    // Generate work order
    const workOrderId = await run(
      createWorkOrderFromInvoice,
      [selectedInvoice.id],
      {
        pending: "Generating work order...",
        success: "Work order created successfully",
        error: "Failed to create work order"
      }
    );

    if (workOrderId) {
      onClose();
      navigate(R.workOrderDetail(workOrderId));
    }
  };

  const openInvoiceInNewTab = (invoiceId: string) => {
    window.open(R.invoiceDetail(invoiceId), "_blank");
  };

  const getScheduleInfo = (invoice: Invoice) => {
    if (invoice.invoice_scheduling && invoice.invoice_scheduling.length > 0) {
      const schedule = invoice.invoice_scheduling[0];
      return {
        starts_at: schedule.starts_at,
        ends_at: schedule.ends_at
      };
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Work Order from Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Find invoice by number, customer, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="wo-gen-search"
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {invoices.length > 0 && (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {invoices.map((invoice) => {
                  const schedule = getScheduleInfo(invoice);
                  return (
                    <Card
                      key={invoice.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedInvoice?.id === invoice.id ? "border-primary bg-accent" : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{invoice.invoice_number}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              {invoice.customer_name || "No customer"}
                            </span>
                          </div>
                          
                          {invoice.service_address && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {invoice.service_address}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            {schedule ? (
                              <div className="flex items-center gap-1 text-sm text-success">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(schedule.starts_at), "MMM d, h:mm a")} - 
                                  {format(new Date(schedule.ends_at), "h:mm a")}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-sm text-warning">
                                <AlertCircle className="h-3 w-3" />
                                <span>No schedule set</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openInvoiceInNewTab(invoice.id);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {selectedInvoice && (!selectedInvoice.invoice_scheduling || selectedInvoice.invoice_scheduling.length === 0) && (
            <div className="border rounded-lg p-4 bg-accent/50 space-y-3">
              <div className="flex items-center gap-2 text-sm text-warning">
                <AlertCircle className="h-4 w-4" />
                <span>Schedule required before generating work order</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="starts_at">Start Time</Label>
                  <Input
                    id="starts_at"
                    type="datetime-local"
                    value={scheduleData.starts_at}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, starts_at: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ends_at">End Time</Label>
                  <Input
                    id="ends_at"
                    type="datetime-local"
                    value={scheduleData.ends_at}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, ends_at: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateWorkOrder}
              disabled={!selectedInvoice || generating}
              data-testid="btn-wo-generate"
            >
              {generating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Work Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}