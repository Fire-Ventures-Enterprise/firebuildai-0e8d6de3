import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { notify } from "@/lib/notify";
import { POFiles } from "@/services/poFiles";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileImage } from "lucide-react";

type Props = {
  poId: string;
  paymentId?: string;              // if provided, will update po_payments.receipt_url
  onUploaded?: () => void;         // refetch hook
  accept?: string;                 // e.g., "image/*,application/pdf"
  multiple?: boolean;
};

export function ReceiptUpload({ 
  poId, 
  paymentId, 
  onUploaded, 
  accept = "image/*,application/pdf", 
  multiple = false 
}: Props) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);

  const upload = async () => {
    if (!files || files.length === 0) return;
    try {
      setBusy(true);
      for (const f of Array.from(files)) {
        const path = await POFiles.uploadReceipt(poId, f, paymentId);
        if (paymentId) {
          await supabase.from("po_payments").update({ receipt_url: path }).eq("id", paymentId);
        }
      }
      notify.success("Receipt uploaded");
      setFiles(null);
      // Reset the file input
      const input = document.querySelector(`input[type="file"]`) as HTMLInputElement;
      if (input) input.value = "";
      onUploaded?.();
    } catch (e) {
      notify.error("Upload failed", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        Attach receipt {paymentId ? "(for this payment)" : "(to PO)"} 
      </Label>
      <div className="flex items-center gap-2">
        <input 
          type="file" 
          multiple={multiple} 
          accept={accept} 
          onChange={(e) => setFiles(e.target.files)} 
          className="text-sm file:mr-2 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        <Button 
          size="sm" 
          onClick={upload} 
          disabled={!files || busy}
          className="gap-2"
        >
          <Upload className="h-3 w-3" />
          Upload
        </Button>
      </div>
      {files && files.length > 0 && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <FileImage className="h-3 w-3" />
          {files.length} file{files.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}