import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Info } from 'lucide-react'
import Image from 'next/image'

interface Workshop {
  id: number
  title: string
  status: string
  image: string
  location: string
  date: string
  type: string
}

interface WorkshopCardProps {
  workshop: Workshop
  onBookNow: () => void
}

export function WorkshopCard({ workshop, onBookNow }: WorkshopCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open application':
        return 'bg-[#9B0000] hover:bg-[#8A0000] text-white'
      case 'closed':
        return 'bg-[#9B0000] hover:bg-[#8A0000] text-white'
      case 'done':
        return 'bg-[#9B0000] hover:bg-[#8A0000] text-white'
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  }

  const getButtonText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open application':
        return 'Book Now'
      case 'closed':
        return 'Closed'
      case 'done':
        return 'Done'
      default:
        return 'Book Now'
    }
  }

  const isBookable = workshop.status.toLowerCase() === 'open application'

  return (
    <Card className="border-2 border-[#9B0000] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Workshop Image */}
        <div className="relative bg-white p-4">
          <Image
            src={workshop.image || "/placeholder.svg?height=120&width=280&text=YSEALI+seeds+for+the+future"}
            alt={workshop.title}
            width={280}
            height={120}
            className="w-full h-24 object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="px-4 pb-4 space-y-3">
          {/* Location and Date */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-[#9B0000]" />
              <span className="text-gray-700 font-medium">{workshop.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-[#9B0000]" />
              <span className="text-gray-700 font-medium">
                {new Date(workshop.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }).replace(/ /g, '.')}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {workshop.title}
          </h3>

          {/* Status Badge */}
          <div className="flex justify-start">
            <Badge className={`${getStatusColor(workshop.status)} text-xs px-3 py-1 rounded-full font-medium`}>
              {workshop.status}
            </Badge>
          </div>

          {/* Book Now Button */}
          <div className="flex items-center space-x-2 pt-2">
            <Button
              onClick={onBookNow}
              disabled={!isBookable}
              className={`${
                isBookable 
                  ? 'bg-[#9B0000] hover:bg-[#8A0000]' 
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white text-sm font-medium px-6 py-2 rounded flex-1`}
            >
              {getButtonText(workshop.status)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-2 border-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
            >
              <Info className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
