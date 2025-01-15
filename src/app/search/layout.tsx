import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Recipes',
  description: 'Search through our collection of delicious recipes. Find recipes by name, ingredients, cuisine, or difficulty level.',
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Search Recipes</h1>
          <p className="text-muted-foreground">Find your next favorite dish</p>
        </div>
      </header> */}
      {children}
    </div>
  );
}
