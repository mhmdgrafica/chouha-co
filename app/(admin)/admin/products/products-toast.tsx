"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ProductsToastProps = {
  toast?: string;
};

const toastMessages: Record<string, string> = {
  saved: "تم الحفظ بنجاح",
  published: "تم النشر بنجاح",
};

export function ProductsToast({ toast }: ProductsToastProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(Boolean(toast));

  const message = useMemo(() => {
    if (!toast) {
      return null;
    }

    return toastMessages[toast] ?? null;
  }, [toast]);

  useEffect(() => {
    setIsVisible(Boolean(message));
  }, [message]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsVisible(false);
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("toast");
      const nextQuery = nextParams.toString();

      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [message, pathname, router, searchParams]);

  if (!message || !isVisible) {
    return null;
  }

  return (
    <div className="fixed right-6 top-24 z-50 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
      {message}
    </div>
  );
}
