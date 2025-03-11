import { TravelForm } from "@/components/travel-form";
import { DestinationCard } from "@/components/destination-card";

const FEATURED_DESTINATIONS = [
  {
    image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a",
    title: "Paris, France",
    description: "The City of Light awaits with its iconic landmarks and culinary delights."
  },
  {
    image: "https://images.unsplash.com/photo-1554366347-897a5113f6ab",
    title: "Tokyo, Japan",
    description: "Experience the perfect blend of tradition and modernity."
  },
  {
    image: "https://images.unsplash.com/photo-1606944331341-72bf6523ff5e",
    title: "Barcelona, Spain",
    description: "Discover stunning architecture and Mediterranean charm."
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Create Your Perfect Travel Booklet
          </h1>
          <p className="text-muted-foreground text-lg">
            Tell us about your dream trip and we'll create a personalized travel guide just for you.
          </p>
        </div>

        <TravelForm />

        <section className="mt-24">
          <h2 className="text-2xl font-semibold mb-8">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_DESTINATIONS.map((destination) => (
              <DestinationCard key={destination.title} {...destination} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
