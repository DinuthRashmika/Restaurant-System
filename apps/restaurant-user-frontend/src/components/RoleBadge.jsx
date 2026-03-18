export default function RoleBadge({ role }) {
  const isOwner = role === "OWNER";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isOwner
          ? "bg-orange-100 text-orange-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {isOwner ? "Restaurant Owner" : "Customer"}
    </span>
  );
}