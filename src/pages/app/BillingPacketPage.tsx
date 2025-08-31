import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PurchaseOrders } from "@/services/purchaseOrders";
import { POFiles } from "@/services/poFiles";
import { POBillingPacket } from "@/components/po/POBillingPacket";
import { getCurrentProfile } from "@/services/session";
import type { PurchaseOrderWithJoins } from "@/domain/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

type PacketPO = PurchaseOrderWithJoins & {
  receiptThumbs?: string[];
};

export default function BillingPacketPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<PacketPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState<string>();
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  
  useEffect(() => {
    loadOrders();
    getCurrentProfile().then(profile => {
      if (profile) setCompanyName(profile.company_name || "Your Company");
    });
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Build filter based on selection
      const filters: any = { limit: 50 };
      if (filter === "approved") {
        filters.status = "approved";
      } else if (filter === "unpaid") {
        filters.payment_status = "pending";
      } else if (filter === "partial") {
        filters.payment_status = "partial";
      }
      
      const list = await PurchaseOrders.list(filters);
      
      // Collect receipts for each PO
      const withThumbs = await Promise.all(list.map(async po => {
        try {
          const paths = await POFiles.gatherReceiptPaths(po.id, po.payments ?? []);
          const map = await POFiles.signMany(paths);
          return { ...po, receiptThumbs: Object.values(map) };
        } catch (error) {
          console.error(`Failed to load receipts for PO ${po.id}:`, error);
          return { ...po, receiptThumbs: [] };
        }
      }));
      
      setOrders(withThumbs);
    } catch (error) {
      console.error("Failed to load purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setSearchParams({ filter: value });
  };

  const getPacketTitle = () => {
    const month = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (filter === "approved") return `Approved POs · ${month}`;
    if (filter === "unpaid") return `Unpaid POs · ${month}`;
    if (filter === "partial") return `Partially Paid POs · ${month}`;
    return `All POs · ${month}`;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Billing Packet Generator</CardTitle>
          </div>
          <CardDescription>
            Create a comprehensive PDF packet with cover sheet and all selected purchase orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="max-w-xs">
              <Label>Filter Purchase Orders</Label>
              <Select value={filter} onValueChange={handleFilterChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purchase Orders</SelectItem>
                  <SelectItem value="approved">Approved Only</SelectItem>
                  <SelectItem value="unpaid">Unpaid Only</SelectItem>
                  <SelectItem value="partial">Partially Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Found {orders.length} purchase order{orders.length > 1 ? 's' : ''} matching your criteria
                </div>
                <POBillingPacket
                  title={getPacketTitle()}
                  companyName={companyName}
                  orders={orders}
                  watermarkAll={true}
                />
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No purchase orders found matching your filter criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}