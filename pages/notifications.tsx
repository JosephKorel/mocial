import { NextPage } from "next";
import React from "react";
import { Profile } from "../models/interfaces";
import { useNotifications, useUser } from "../utils/Hooks";

const Notifications: NextPage = () => {
  const { data } = useUser();
  const user = data as Profile;
  const { data: notifications, isLoading } = useNotifications(user.id);
  if (isLoading) return <div></div>;

  console.log(notifications);

  return <div>Notifications</div>;
};

export default Notifications;
