import { useRouter } from "next/router";
import React from "react";
import { useQueryData } from "../../../utils/Hooks";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, profiles } = useQueryData(["profiles", "user"]);
  const router = useRouter();
  if (!user || !profiles) {
    router.push("/");
    return <div></div>;
  }
  return <div>{children}</div>;
}

export default ProtectedRoute;
