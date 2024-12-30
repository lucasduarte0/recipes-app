import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { auth } from '@clerk/nextjs/server';
import { Plus } from 'lucide-react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { recipes: true }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <main className="container max-w-lg mx-auto px-4 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col items-center mt-8">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-2xl">
              {user.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={user.imageUrl} 
                  alt={user.username} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                '👨‍🍳'
              )}
            </div>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
            <Plus size={16} />
          </button>
        </div>

        <h1 className="text-2xl font-bold mt-4">{`${user.firstName} ${user.lastName}`}</h1>
        <p className="text-gray-500">@{user.username}</p>

        <Button variant="outline" className="mt-4 rounded-full px-8">
          Edit Profile
        </Button>

        <p className="text-primary mt-4">
          Add a bio to share your cooking journey
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6 w-full">
          <div className="text-center">
            <p className="font-bold">{user.recipes.length}</p>
            <p className="text-gray-500 text-sm">Recipes</p>
          </div>
          <div className="text-center">
            <p className="font-bold">0</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
          <div className="text-center">
            <p className="font-bold">0</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Recipes Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Recipes</h2>
        {user.recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">📸</div>
            <p className="text-muted-foreground text-center">
              Your recipes will appear here after posting.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {user.recipes.map((recipe) => (
              <div key={recipe.id} className="aspect-square bg-gray-100 rounded-lg">
                {/* Recipe preview card */}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
