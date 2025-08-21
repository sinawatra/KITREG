import { Card, CardContent } from "@/components/ui/card"

export function ShimmerCard() {
  return (
    <Card className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm animate-pulse">
      <CardContent className="p-0">
        {/* Image Placeholder */}
        <div className="relative bg-gray-200 p-4">
          <div className="w-full h-24 bg-gray-300 rounded"></div>
        </div>

        {/* Content Placeholder */}
        <div className="px-4 pb-4 space-y-3">
          {/* Location and Date Placeholder */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>

          {/* Title Placeholder */}
          <div className="h-5 bg-gray-300 rounded w-full"></div>
          <div className="h-5 bg-gray-300 rounded w-5/6"></div>

          {/* Status Badge Placeholder */}
          <div className="flex justify-start">
            <div className="h-6 bg-gray-300 rounded-full w-24"></div>
          </div>

          {/* Button Placeholder */}
          <div className="flex items-center space-x-2 pt-2">
            <div className="h-10 bg-gray-300 rounded flex-1"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
