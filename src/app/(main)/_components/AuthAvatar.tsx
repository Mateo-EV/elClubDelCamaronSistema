"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/AuthProvider";

export const AuthAvatar = () => {
  const { user } = useAuth();

  return (
    <Avatar className="size-8 rounded-lg">
      {/* <AvatarImage src={user.firstname} alt={user.firstname} /> */}
      <AvatarFallback className="rounded-lg">
        {user.firstName[0]}
      </AvatarFallback>
    </Avatar>
  );
};
