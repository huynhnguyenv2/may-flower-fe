"use client";

import { AuthPage } from "@refinedev/antd";

export default function AdminLoginPage() {
  return (
    <AuthPage
      type="login"
      title="nau.fleur"
      registerLink={false}
      forgotPasswordLink={false}
      formProps={{
        initialValues: { email: "" },
      }}
    />
  );
}
