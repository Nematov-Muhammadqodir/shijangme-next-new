import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AdminHome = () => {
  const router = useRouter();

  /** LIFECYCLES **/
  useEffect(() => {
    router.push("/_admin/users");
  }, []);
  return <></>;
};

export default AdminHome;
