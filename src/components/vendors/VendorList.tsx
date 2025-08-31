import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Building2, Phone, Mail, MapPin } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Vendor {
  id: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  payment_terms?: string;
  tax_rate?: number;
  default_category?: string;
  active: boolean;
}

interface VendorListProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
}

export function VendorList({ vendors, onEdit, onDelete }: VendorListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendors = vendors.filter(vendor =>
    vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (vendors.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">No vendors yet</p>
          <p className="text-sm text-muted-foreground mt-2">Add your first vendor to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{vendor.company_name}</CardTitle>
                  {vendor.contact_person && (
                    <p className="text-sm text-muted-foreground mt-1">{vendor.contact_person}</p>
                  )}
                </div>
                <Badge variant={vendor.active ? "default" : "secondary"}>
                  {vendor.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {vendor.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{vendor.email}</span>
                </div>
              )}
              
              {vendor.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{vendor.phone}</span>
                </div>
              )}
              
              {(vendor.address || vendor.city) && (
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    {vendor.address && <div>{vendor.address}</div>}
                    {vendor.city && (
                      <div>
                        {vendor.city}{vendor.province && `, ${vendor.province}`}
                        {vendor.postal_code && ` ${vendor.postal_code}`}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="pt-2 space-y-1 text-sm text-muted-foreground">
                <div>Terms: {vendor.payment_terms || 'Net 30'}</div>
                <div>Tax: {vendor.tax_rate || 13}%</div>
                <div>Category: {vendor.default_category || 'materials'}</div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(vendor)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {vendor.company_name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(vendor.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}