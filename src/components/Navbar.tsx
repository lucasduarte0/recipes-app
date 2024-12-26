import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <div className="flex w-full gap-3">
      <Avatar className="shrink-0 m-auto w-12 h-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex-1 flex flex-col">
        <h1 className="text-xl font-bold">Hello, World!</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to Next.js with Tailwind CSS
        </p>
      </div>
    </div>
  );
}
