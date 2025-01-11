import prisma from '@/lib/db';

type FollowParams = {
  followerId: string;
  followingId: string;
};

type PaginationParams = {
  page?: number;
  limit?: number;
};

type GetFollowsParams = {
  userId: string;
} & PaginationParams;

type GetSuggestedUsersParams = {
  userId: string;
  limit?: number;
};

/**
 * Follow a user
 */
export async function followUser({ followerId, followingId }: FollowParams) {
  try {
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    return { success: true, data: follow };
  } catch {
    return { success: false, error: 'Failed to follow user' };
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser({ followerId, followingId }: FollowParams) {
  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to unfollow user' };
  }
}

/**
 * Check if user follows another user
 */
export async function isFollowing({ followerId, followingId }: FollowParams) {
  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return { success: true, data: Boolean(follow) };
  } catch {
    return { success: false, error: 'Failed to check follow status' };
  }
}

/**
 * Get user's followers with pagination
 */
export async function getUserFollowers({ userId, page = 1, limit = 10 }: GetFollowsParams) {
  try {
    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.follow.count({
      where: {
        followingId: userId,
      },
    });

    return {
      success: true,
      data: {
        followers: followers.map((f) => f.follower),
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      },
    };
  } catch {
    return { success: false, error: 'Failed to get followers' };
  }
}

/**
 * Get users that a user is following with pagination
 */
export async function getUserFollowing({ userId, page = 1, limit = 10 }: GetFollowsParams) {
  try {
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.follow.count({
      where: {
        followerId: userId,
      },
    });

    return {
      success: true,
      data: {
        following: following.map((f) => f.following),
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit,
        },
      },
    };
  } catch {
    return { success: false, error: 'Failed to get following users' };
  }
}

/**
 * Get follower/following counts for a user
 */
export async function getUserFollowCounts({ userId }: { userId: string }) {
  try {
    const [followersCount, followingCount] = await Promise.all([
      prisma.follow.count({
        where: {
          followingId: userId,
        },
      }),
      prisma.follow.count({
        where: {
          followerId: userId,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        followersCount,
        followingCount,
      },
    };
  } catch {
    return { success: false, error: 'Failed to get follow counts' };
  }
}

/**
 * Get suggested users to follow
 * This gets users who are followed by users you follow
 */
export async function getSuggestedUsers({ userId, limit = 5 }: GetSuggestedUsersParams) {
  try {
    const suggestedUsers = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          {
            followers: {
              some: {
                follower: {
                  following: {
                    some: {
                      followerId: userId,
                    },
                  },
                },
              },
            },
          },
        ],
        NOT: {
          followers: {
            some: {
              followerId: userId,
            },
          },
        },
      },
      select: {
        id: true,
        username: true,
        imageUrl: true,
        firstName: true,
        lastName: true,
      },
      take: limit,
    });

    return { success: true, data: suggestedUsers };
  } catch {
    return { success: false, error: 'Failed to get suggested users' };
  }
}
