"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { adminPages } from "@/data/data";
import { usePathname } from "next/navigation";
import React from "react";

function BreadcrumbsBlock() {
  const pathname = usePathname();
  const pageData = adminPages.filter((page) => page.href === pathname)[0];
  const pageSteps = pageData.href
    .split("/")
    .filter(
      (step, index, array) =>
        step !== "" && step !== "admin" && index !== array.length - 1
    );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname !== "/admin" && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {pageSteps.map((step, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/admin/${step}`}>
                    {step}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
            <BreadcrumbSeparator />
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage>{pageData.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbsBlock;
