import React, { useState } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { Profile } from "../models/interfaces";
import { EditAccountHeader } from "../src/components/EditAccount";
import { useUser } from "../utils/Hooks";

const EditAccount = () => {
  const { data } = useUser();
  if (!data) {
    return <div></div>;
  }

  const user = data as Profile;
  const [username, setUsername] = useState(user.username);
  const [editName, setEditName] = useState(false);

  return (
    <div className="font-kanit">
      <EditAccountHeader />
    </div>
  );
};

export default EditAccount;
