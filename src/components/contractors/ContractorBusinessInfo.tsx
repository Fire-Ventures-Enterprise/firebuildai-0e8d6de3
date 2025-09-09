import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Shield, Phone, MapPin, Building2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ContractorBusinessInfoProps {
  account: any;
  onUpdate: () => void;
}

export function ContractorBusinessInfo({ account, onUpdate }: ContractorBusinessInfoProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact_person: account?.contact_person || "",
    phone: account?.phone || "",
    address: account?.address || "",
    city: account?.city || "",
    province: account?.province || "Ontario",
    postal_code: account?.postal_code || "",
    gst_number: account?.gst_number || "",
    wsib_number: account?.wsib_number || "",
    insurance_provider: account?.insurance_provider || "",
    insurance_policy_number: account?.insurance_policy_number || "",
    insurance_expiry_date: account?.insurance_expiry_date || "",
    trade_type: account?.trade_type || "",
    notes: account?.notes || ""
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("contractor_accounts")
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq("id", account.id);

      if (error) throw error;
      
      toast.success("Business information updated successfully");
      onUpdate();
    } catch (error: any) {
      console.error("Error updating business info:", error);
      toast.error(error.message || "Failed to update business information");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${account.id}-insurance-certificate.${fileExt}`;
      const filePath = `insurance-certificates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      await supabase
        .from("contractor_accounts")
        .update({
          insurance_certificate_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq("id", account.id);

      toast.success("Insurance certificate uploaded successfully");
      onUpdate();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error(error.message || "Failed to upload insurance certificate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/50 border-muted">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-xl">Business Information</CardTitle>
            <CardDescription className="text-sm">
              Complete contractor profile and compliance details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="John Smith"
                  className="mt-1.5 bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="mt-1.5 bg-background/50"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Business Address
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                  className="mt-1.5 bg-background/50"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Toronto"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
                    <SelectTrigger id="province" className="mt-1.5 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ontario">Ontario</SelectItem>
                      <SelectItem value="Quebec">Quebec</SelectItem>
                      <SelectItem value="British Columbia">British Columbia</SelectItem>
                      <SelectItem value="Alberta">Alberta</SelectItem>
                      <SelectItem value="Manitoba">Manitoba</SelectItem>
                      <SelectItem value="Saskatchewan">Saskatchewan</SelectItem>
                      <SelectItem value="Nova Scotia">Nova Scotia</SelectItem>
                      <SelectItem value="New Brunswick">New Brunswick</SelectItem>
                      <SelectItem value="Newfoundland">Newfoundland</SelectItem>
                      <SelectItem value="PEI">PEI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="M5V 3A8"
                    className="mt-1.5 bg-background/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tax & Compliance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tax & Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gst_number">GST/HST Number</Label>
                <Input
                  id="gst_number"
                  value={formData.gst_number}
                  onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                  placeholder="123456789RT0001"
                  className="mt-1.5 bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="wsib_number">WSIB Number</Label>
                <Input
                  id="wsib_number"
                  value={formData.wsib_number}
                  onChange={(e) => setFormData({ ...formData, wsib_number: e.target.value })}
                  placeholder="1234567"
                  className="mt-1.5 bg-background/50"
                />
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Insurance Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insurance_provider">Insurance Provider</Label>
                <Input
                  id="insurance_provider"
                  value={formData.insurance_provider}
                  onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                  placeholder="ABC Insurance Co."
                  className="mt-1.5 bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="insurance_policy_number">Policy Number</Label>
                <Input
                  id="insurance_policy_number"
                  value={formData.insurance_policy_number}
                  onChange={(e) => setFormData({ ...formData, insurance_policy_number: e.target.value })}
                  placeholder="POL-123456"
                  className="mt-1.5 bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="insurance_expiry_date">Expiry Date</Label>
                <Input
                  id="insurance_expiry_date"
                  type="date"
                  value={formData.insurance_expiry_date}
                  onChange={(e) => setFormData({ ...formData, insurance_expiry_date: e.target.value })}
                  className="mt-1.5 bg-background/50"
                />
              </div>
              <div>
                <Label htmlFor="insurance_certificate">Insurance Certificate</Label>
                <div className="mt-1.5">
                  <Input
                    id="insurance_certificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="bg-background/50"
                  />
                  {account?.insurance_certificate_url && (
                    <a 
                      href={account.insurance_certificate_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      View current certificate
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trade Type */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Trade Information</h3>
            <div>
              <Label htmlFor="trade_type">Trade Type</Label>
              <Select value={formData.trade_type} onValueChange={(value) => setFormData({ ...formData, trade_type: value })}>
                <SelectTrigger id="trade_type" className="mt-1.5 bg-background/50">
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="carpentry">Carpentry</SelectItem>
                  <SelectItem value="drywall">Drywall</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="roofing">Roofing</SelectItem>
                  <SelectItem value="flooring">Flooring</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="general">General Contractor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information..."
              className="mt-1.5 bg-background/50 min-h-[100px]"
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Business Information
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}