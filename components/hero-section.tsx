import Image from 'next/image'

export function HeroSection() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start">
          {/* Left side - Logos */}
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/kirirom-institute-of-technology-new.png"
                alt="Kirirom Institute of Technology"
                width={200}
                height={60}
                className="h-auto"
              />
              <Image
                src="/images/incubation-center.png"
                alt="Incubation Center"
                width={120}
                height={40}
                className="h-auto"
              />
            </div>
            <div className="ml-[200px]"> {/* Adjust margin to align with IC logo */}
              <Image
                src="/images/kit-sao.png"
                alt="KIT SAO"
                width={100}
                height={60}
                className="h-auto"
              />
            </div>
          </div>

          {/* Right side - Main heading */}
          <div className="text-right flex-1 max-w-md ml-8">
            <h1 className="text-4xl font-bold text-[#9B0000] italic mb-2">
              In House Product<br />
              Experience Sharing
            </h1>
            <h2 className="text-2xl font-bold text-[#9B0000] italic mb-4">
              Collaborate, Not Compete
            </h2>
            <p className="text-gray-600">
              Discover KIT activities, workshops, and Job Offers
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
