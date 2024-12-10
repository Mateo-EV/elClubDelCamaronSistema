"use client";

import AvatarDropdown from "./AvatarDropdown";
// import { Button } from "@/components/ui/button";
// import { BellIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 h-16 border-b px-4">
      <nav className="container mx-auto flex h-full w-full items-center justify-between">
        <h2 className="font-semibold">El Club del Camarón</h2>
        <div className="flex items-center gap-2">
          {/* <Button variant="ghost" size="icon">
            <BellIcon />
          </Button> */}
          <AvatarDropdown />
        </div>
      </nav>
    </header>
  );
}
