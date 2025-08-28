"use client";

import StatusBadge from "@/components/prismui/status-badge";

export default function StatusBadgeDemoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Status Badge Component</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">Status Badge Variants</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col space-y-4">
              <h3 className="font-medium text-gray-700">Default Status Badges</h3>
              <div className="flex flex-wrap gap-4">
                <StatusBadge status="pending" label="Pending" />
                <StatusBadge status="completed" label="Completed" />
                <StatusBadge status="processing" label="Processing" />
                <StatusBadge status="failed" label="Failed" />
                <StatusBadge status="draft" label="Draft" />
              </div>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h3 className="font-medium text-gray-700">Example Usage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600">WS</span>
                    </div>
                    <div>
                      <p className="font-medium">AI Workshop</p>
                      <p className="text-sm text-gray-500">Sep 10, 2025</p>
                    </div>
                  </div>
                  <StatusBadge status="completed" label="Booked" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600">DS</span>
                    </div>
                    <div>
                      <p className="font-medium">Data Science Workshop</p>
                      <p className="text-sm text-gray-500">Oct 15, 2025</p>
                    </div>
                  </div>
                  <StatusBadge status="pending" label="Pending" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
