import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface DestinationCardProps {
  image: string;
  title: string;
  description: string;
}

export function DestinationCard({ image, title, description }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <AspectRatio ratio={16 / 9}>
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
