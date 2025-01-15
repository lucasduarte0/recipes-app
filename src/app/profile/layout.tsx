import { Metadata } from 'next';
import { getUserById } from '@/services/users';

type Props = {
  params: Promise<{ profileId?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { profileId } = await params;
    
    if (!profileId) {
      return {
        title: 'Your Profile',
        description: 'View and manage your recipe profile, including your created recipes, liked recipes, and personal information.',
        openGraph: {
          title: 'Your Recipe Profile',
          description: 'View and manage your recipe profile, including your created recipes, liked recipes, and personal information.',
          type: 'profile',
        }
      };
    }

    const user = await getUserById(profileId);
    
    if (!user) {
      return {
        title: 'Profile Not Found',
        description: 'The requested profile could not be found.',
        openGraph: {
          title: 'Profile Not Found',
          description: 'The requested profile could not be found.',
          type: 'profile',
        }
      };
    }

    const fullName = `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`;

    return {
      title: `${fullName}'s Profile`,
      description: user.bio 
        ? `${fullName}'s cooking profile - ${user.bio}`
        : `Check out ${fullName}'s recipes and cooking adventures`,
      openGraph: {
        title: `${fullName}'s Recipe Profile`,
        description: user.bio 
          ? `${fullName}'s cooking profile - ${user.bio}`
          : `Check out ${fullName}'s recipes and cooking adventures`,
        type: 'profile',
        images: user.imageUrl ? [
          {
            url: user.imageUrl,
            width: 1200,
            height: 630,
            alt: `${fullName}'s profile picture`
          }
        ] : [],
      }
    };
  } catch {
    return {
      title: 'Profile',
      description: 'View recipe profiles and discover amazing cooks.',
      openGraph: {
        title: 'Recipe Profiles',
        description: 'View recipe profiles and discover amazing cooks.',
        type: 'profile',
      }
    };
  }
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}