import React from "react";
import { EmptyState, Grid, Layout, LegacyCard, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import { AddProductMajor, CashDollarMinor } from "@shopify/polaris-icons";

const CreateCalculator = () => {
  const products = [
    {
      title: "Product title",
      id: "1",
      price: "100",
    },
    {
      title: "Product title",
      id: "2",
      price: "200",
    },
  ];
  return (
    <Page
      backAction={{
        content: "Calcualtors",
        onAction: () => {
          navigate("/debug/calculators");
        },
      }}
      primaryAction={{
        content: "Save",
        disabled: true,
      }}
    >
      <Grid>
        <Grid.Cell columnSpan={{ xs: 12, lg: 6 }}>
          <LegacyCard>
            <EmptyState
              heading="Product List Is Empty"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              action={{
                content: "Add Product",
                icon: AddProductMajor,
                onAction: () => {
                  console.log("clicked");
                },
              }}
            >
              <p>Choose products to add </p>
            </EmptyState>
          </LegacyCard>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 12, lg: 6 }}>
          <LegacyCard>
            <EmptyState
              heading="Product List Is Empty"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              action={{
                content: "Add Pricing",
                icon: CashDollarMinor,
                onAction: () => {
                  console.log("clicked");
                },
              }}
            >
              <p>Choose pricing rule </p>
            </EmptyState>
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  );
};

export default CreateCalculator;
