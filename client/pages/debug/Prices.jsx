import {
  DataTable,
  EmptyState,
  IndexTable,
  LegacyCard,
  Page,
  useIndexResourceState,
  Text,
} from "@shopify/polaris";
import { navigate } from "raviger";
import React from "react";

const Prices = () => {
  const pricesList = [
    {
      id: 1,
      height: 10,
      width: 20,
      price: 100,
    },
    {
      id: 2,
      height: 15,
      width: 25,
      price: 200,
    },
  ];
  const resourceName = {
    singular: "Price",
    plural: "Prices",
  };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(pricesList);
  const rowMarkup = pricesList.map(({ id, height, width, price }, ind) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={ind}
    >
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {height}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {width}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {price}
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  return (
    <Page
      title="Prices"
      backAction={{
        content: "Home",
        onAction: () => {
          navigate("/");
        },
      }}
      primaryAction={{
        content: "Add",
        onAction: () => {
          navigate("/debug/prices/create-price");
        },
      }}
      secondaryActions={[
        {
          content: "Import",
        },
        {
          content: "Export",
          disabled: true,
        },
      ]}
    >
      {pricesList.length == 0 && (
        <LegacyCard sectioned>
          <EmptyState
            heading="Manage Calculator Pricing"
            action={{ content: "Add Price" }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Add pricing logics for calcualtors</p>
          </EmptyState>
        </LegacyCard>
      )}
      <LegacyCard>
        <IndexTable
          resourceName={resourceName}
          itemCount={pricesList.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            {
              title: "Width",
            },
            {
              title: "Height",
            },
            {
              title: "Price",
            },
          ]}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </Page>
  );
};

export default Prices;
