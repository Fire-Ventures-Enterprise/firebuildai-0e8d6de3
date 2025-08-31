import { useEffect, useState } from "react";
import { POFiles } from "@/services/poFiles";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/useConfirm";
import { FileText, Trash2, ExternalLink } from "lucide-react";
import type { PoPayment } from "@/domain/db";

type Props = {
  poId: string;
  payments?: PoPayment[];
};

export function POReceiptsGallery({ poId, payments = [] }: Props) {
  const [items, setItems] = useState<{ path: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { confirm, Confirm } = useConfirm({ 
    title: "Remove receipt?", 
    actionText: "Delete"
  });

  async function load() {
    try {
      setLoading(true);
      const paths = await POFiles.gatherReceiptPaths(poId, payments);
      const map = await POFiles.signMany(paths);
      setItems(paths.map(p => ({ path: p, url: map[p] })));
    } catch (error) {
      console.error("Failed to load receipts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, [poId, payments]);

  const remove = async (path: string) => {
    if (!(await confirm({ description: "This file will be permanently deleted." }))) return;
    await POFiles.deleteReceipt(path);
    await load();
  };

  if (loading) {
    return (
      <div className="mt-4">
        <div className="font-medium mb-2">Receipts</div>
        <div className="text-sm text-muted-foreground">Loading receipts...</div>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div className="mt-4">
      {Confirm}
      <div className="font-medium mb-2">Receipts</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(({ path, url }) => {
          const isPDF = /\.pdf$/i.test(path);
          const isImage = /\.(png|jpe?g|gif|webp)$/i.test(path);
          
          return (
            <div key={path} className="border rounded-lg overflow-hidden group">
              <a 
                href={url} 
                target="_blank" 
                rel="noreferrer" 
                className="block relative"
              >
                {isImage ? (
                  <img 
                    src={url} 
                    loading="lazy" 
                    alt="Receipt"
                    className="w-full h-36 object-cover group-hover:opacity-90 transition-opacity" 
                  />
                ) : (
                  <div className="h-36 bg-muted flex flex-col items-center justify-center gap-2 group-hover:bg-muted/80 transition-colors">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {isPDF ? "PDF Document" : "File"}
                    </span>
                  </div>
                )}
              </a>
              <div className="flex items-center justify-between p-2 bg-background border-t">
                <a 
                  className="text-xs text-primary hover:underline flex items-center gap-1" 
                  href={url} 
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                  View
                </a>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => remove(path)}
                  className="h-6 px-2"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}