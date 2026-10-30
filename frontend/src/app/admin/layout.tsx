import { Suspense } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@refinedev/antd/dist/reset.css";
import { RefineRoot } from "@/admin/RefineRoot";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | nau.fleur",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <Suspense fallback={null}>
        <RefineRoot>{children}</RefineRoot>
      </Suspense>
    </AntdRegistry>
  );
}
