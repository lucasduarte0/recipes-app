import Link from "next/link";
import Balancer from "react-wrap-balancer";

import { Separator } from "./ui/separator";

export default function Footer() {
  return (
    <footer className="w-full">
      <Separator />
      <div>
        <div className="grid gap-6">
          <div className="grid gap-6">
            <Link href="/">
              <h3 className="sr-only">brijr/components</h3>
              {/* <Image
                src={Logo}
                alt="Logo"
                width={120}
                height={27.27}
                className="transition-all hover:opacity-75 dark:invert"
              ></Image> */}
            </Link>
            <p>
              <Balancer>
                This website was made by{" "}
                <a href="https://instagram.com/lucasduuarte__">Lucas Silva</a>.
              </Balancer>
            </p>
            <div className="mb-6 flex flex-col gap-4 text-sm text-muted-foreground underline underline-offset-4 md:mb-0 md:flex-row">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/cookie-policy">Cookie Policy</Link>
            </div>
            <p className="text-muted-foreground">
              © <a href="https://github.com/lucasduarte0">lucasduarte0</a>. All
              rights reserved. 2024-present.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
