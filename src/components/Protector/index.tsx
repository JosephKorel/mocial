import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useProfiles, useUser } from "../../../utils/Hooks";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const { data: user } = useUser();
  const { data: profiles } = useProfiles();

  if (!user || !profiles) {
    router.push("/");
    return <div></div>;
  }

  return <div>{children}</div>;
}

export default ProtectedRoute;
