import HeaderTitle from "@/components/Dashboard/ReusableComponents/HeaderTitle";
import UserList from "@/components/Dashboard/Users/UserList";
import React from "react";

export default function page() {
  return (
    <div className="space-y-6 p-6">
      <HeaderTitle
        title="Users"
        subtitle="Mange your users and change user role"
      />
      <UserList />
    </div>
  );
}
