import { ShieldCheck } from "lucide-react";

export function VerifiedBadge({
  size = "sm",
  showLabel = true,
}: {
  size?: "xs" | "sm" | "md";
  showLabel?: boolean;
}) {
  const sz = size === "xs" ? "px-1.5 py-0 text-[10px]" : size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[11px]";
  const icon = size === "xs" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold ${sz}`}
      style={{ background: "rgba(46,107,173,0.1)", color: "#2E6BAD" }}
      title="Verified by RoundDrop"
    >
      <ShieldCheck className={icon} />
      {showLabel && "Verified"}
    </span>
  );
}
