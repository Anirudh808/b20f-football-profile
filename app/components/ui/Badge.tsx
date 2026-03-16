type BadgeVariant = "neon" | "electric" | "yellow" | "red" | "gray";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "gray", className = "" }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>{children}</span>
  );
}

interface StatusBadgeProps {
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    PENDING: { variant: "yellow" as BadgeVariant, icon: "⏳", label: "Pending" },
    APPROVED: { variant: "neon" as BadgeVariant, icon: "✅", label: "Approved" },
    REJECTED: { variant: "red" as BadgeVariant, icon: "❌", label: "Rejected" },
  };
  const { variant, icon, label } = config[status];
  return (
    <Badge variant={variant}>
      {icon} {label}
    </Badge>
  );
}
