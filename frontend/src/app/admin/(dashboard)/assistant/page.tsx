"use client";

import { List } from "@refinedev/antd";
import { AdminAssistantChat } from "@/admin/AdminAssistantChat";

export default function AdminAssistantPage() {
  return (
    <List title="Trợ lý AI (vận hành)">
      <AdminAssistantChat />
    </List>
  );
}
