import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

const newsItems = [
  {
    id: 1,
    title: '5 Simple Tips on How to Choose the Right Major for Your Future',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Education'
  },
  {
    id: 2,
    title: 'Special Lecture by Dr. Thomas Leoang: Introducing the Design...',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Lecture'
  },
  {
    id: 3,
    title: 'Two Software Engineering Students Lead DX Projects in...',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Achievement'
  }
]

export function NewsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#9B0000] mb-4">
            RESERVE YOUR SEAT AS FAST AS POSSIBLE
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Landing a high-skilled job in Japan has never been easier. Follow these simple steps to apply, connect with top employers, and start your new career.
          </p>
          <p className="text-gray-600 mt-2">
            No one would share your International Experience like KIT Alumni did
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="text-sm text-[#9B0000] font-medium mb-2">
                  {item.category}
                </div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">
                  {item.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
