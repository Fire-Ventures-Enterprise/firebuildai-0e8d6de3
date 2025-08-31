import { toast } from "@/hooks/use-toast";

type AnyErr = unknown & { message?: string };

export const notify = {
  success: (title: string, description?: string) =>
    toast({ title, description }),
  info: (title: string, description?: string) =>
    toast({ title, description }),
  warn: (title: string, description?: string) =>
    toast({ title, description, variant: "destructive" }),
  error: (title = "Something went wrong", err?: AnyErr) => {
    const msg =
      typeof err === "string"
        ? err
        : (err as any)?.message ||
          (err as any)?.error_description ||
          (err as any)?.hint ||
          "Please try again.";
    toast({ title, description: msg, variant: "destructive" });
  },
};