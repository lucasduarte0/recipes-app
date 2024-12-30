import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/profile(.*)']);
// const isPublicRoute = createRouteMatcher(['/']);

export default clerkMiddleware(async (auth, req) => {
  // const { userId } = await auth();

  // if (userId && req.nextUrl.pathname === '/') {
  //   const userUrl = new URL('/', req.url);
  //   return NextResponse.redirect(userUrl);
  // }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
