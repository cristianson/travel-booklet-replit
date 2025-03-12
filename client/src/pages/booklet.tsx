import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';
import type { TravelPreferences, BookletContent } from "@shared/schema";

export default function Booklet() {
  const { id } = useParams();

  const { data: booklet, isLoading, error } = useQuery<TravelPreferences>({
    queryKey: [`/api/booklets/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-24 w-full mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-6">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-destructive/10">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
            <p className="text-destructive">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!booklet) return null;

  const content = booklet.bookletContent as BookletContent;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        {content.summary}
      </p>

      {content.sections.map((section, index) => (
        <Card key={index} className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}