import React from "react";
import { Page } from "@shopify/polaris";
import { navigate, usePath } from "raviger";
const Calculator = () => {
  const path = usePath();
  return (
    <Page
      title="Calculator title"
      backAction={{
        content: "Calculator heading",
        onAction: () => navigate("/debug/calculators"),
      }}
    ></Page>
  );
};

export default Calculator;
