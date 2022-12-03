import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useProfiles, useUser } from "../../../utils/Hooks";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { data: user } = useUser();
  const { data: profiles } = useProfiles();
  const router = useRouter();

  useEffect(() => {
    if (!profiles) {
      router.push("/");
    }
  }, [profiles]);

  return <div>{children}</div>;
}

export default ProtectedRoute;
