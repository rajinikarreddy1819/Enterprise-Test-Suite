import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = {
    VERIFIED: { bg: "bg-emerald-100", text: "text-emerald-800", icon: CheckCircle2, border: "border-emerald-200", label: "VERIFIED" },
    APPROVED: { bg: "bg-emerald-100", text: "text-emerald-800", icon: CheckCircle2, border: "border-emerald-200", label: "APPROVED" },
    PENDING: { bg: "bg-amber-100", text: "text-amber-800", icon: Clock, border: "border-amber-200", label: "PENDING" },
    SUBMITTED: { bg: "bg-blue-100", text: "text-blue-800", icon: Clock, border: "border-blue-200", label: "SUBMITTED" },
    UNDER_REVIEW: { bg: "bg-purple-100", text: "text-purple-800", icon: Clock, border: "border-purple-200", label: "IN REVIEW" },
    REVOKED: { bg: "bg-red-100", text: "text-red-800", icon: XCircle, border: "border-red-200", label: "REVOKED" },
    EXPIRED: { bg: "bg-orange-100", text: "text-orange-800", icon: AlertTriangle, border: "border-orange-200", label: "EXPIRED" },
    REJECTED: { bg: "bg-red-100", text: "text-red-800", icon: XCircle, border: "border-red-200", label: "REJECTED" },
  };

  // @ts-ignore - safe fallback
  const mapped = config[status?.toUpperCase()] || { bg: "bg-slate-100", text: "text-slate-800", icon: CheckCircle2, border: "border-slate-200", label: status || "UNKNOWN" };
  const Icon = mapped.icon;

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm",
      mapped.bg, mapped.text, mapped.border, className
    )}>
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {mapped.label}
    </span>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 border-b border-border pb-4">
      <h2 className="text-2xl sm:text-3xl font-bold font-serif text-primary tracking-tight">{title}</h2>
      {subtitle && <p className="mt-2 text-muted-foreground text-sm sm:text-base">{subtitle}</p>}
    </div>
  );
}
