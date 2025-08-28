"use client";

import StatusBadge from "@/components/prismui/status-badge";

export default function StatusBadgeExample() {
  return (
    <div className="py-8 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Status Badges</h2>
      </div>
      
      <div className="flex flex-col gap-4 items-center justify-center">
        <StatusBadge status="completed" label="Completed" />
        <StatusBadge status="pending" label="Pending" />
        <StatusBadge status="processing" label="Processing" />
        <StatusBadge status="failed" label="Failed" />
        <StatusBadge status="draft" label="Draft" />
      </div>
    </div>
  );
}
