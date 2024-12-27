// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { SignedIn, UserButton, SignedOut, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
// import { currentUser } from "@clerk/nextjs/server";

export default async function Navbar() {
  return (
    <div>
      <SignedIn>
        <NavbarSignedIn />
      </SignedIn>
      <SignedOut>
        <NavbarSignedOut />
      </SignedOut>
    </div>
  );
}

async function NavbarSignedIn() {
  const user = await currentUser();

  return (
    <div className="flex w-full gap-3">
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "size-12",
          },
        }}
      />
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-playful font-bold">Hello, {user?.firstName}</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to the Recipe App!
        </p>
      </div>
    </div>
  );
}

function NavbarSignedOut() {
  return (
    <div className="flex w-full gap-3">
      <SignInButton>
        <button className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">
          Sign in
        </button>
      </SignInButton>
    </div>
  );
}
