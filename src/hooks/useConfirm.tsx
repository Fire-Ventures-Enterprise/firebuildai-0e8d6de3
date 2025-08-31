import { useRef, useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

type Opts = {
  title?: string;
  description?: string;
  actionText?: string;
  cancelText?: string;
};

export function useConfirm(defaults: Opts = {}) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<Opts>(defaults);
  const resolver = useRef<(v: boolean) => void>();

  const confirm = (o?: Opts) => {
    setOpts({ ...defaults, ...o });
    setOpen(true);
    return new Promise<boolean>((resolve) => (resolver.current = resolve));
  };

  const onClose = (v: boolean) => {
    setOpen(false);
    resolver.current?.(v);
  };

  const Confirm = (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{opts.title ?? "Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>{opts.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose(false)}>
            {opts.cancelText ?? "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onClose(true)}>
            {opts.actionText ?? "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, Confirm };
}