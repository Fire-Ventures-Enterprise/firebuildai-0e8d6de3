import { useState } from "react";
import { notify } from "@/lib/notify";

type Runner<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>;

export function useAsyncToast() {
  const [loading, setLoading] = useState(false);

  async function run<TArgs extends any[], TResult>(
    fn: Runner<TArgs, TResult>,
    args: TArgs,
    msgs?: { pending?: string; success?: string; error?: string }
  ): Promise<TResult | null> {
    try {
      setLoading(true);
      if (msgs?.pending) notify.info(msgs.pending);
      const result = await fn(...args);
      if (msgs?.success) notify.success(msgs.success);
      return result;
    } catch (e) {
      notify.error(msgs?.error, e);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { run, loading };
}