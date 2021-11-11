import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="https://github.com/zh/token-protected-content" target="_blank" rel="noopener noreferrer">
      <PageHeader title="Private Content" subTitle="Stake 👁️  to access it" style={{ cursor: "pointer" }} />
    </a>
  );
}
