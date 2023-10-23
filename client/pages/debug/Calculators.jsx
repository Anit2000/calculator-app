import React from "react";
import {
  Button,
  EmptyState,
  LegacyCard,
  Text,
  IndexTable,
  useIndexResourceState,
  Badge,
} from "@shopify/polaris";
import { ProductsMajor, EditMajor } from "@shopify/polaris-icons";
import { navigate } from "raviger";
import { Page } from "@shopify/polaris";

const Calculators = () => {
  let calculators = [
    {
      id: 1,
      title: "SOS-1 calcualtor",
      products: 100,
    },
    {
      id: 2,
      title: "SOS-1 calcualtor",
      products: 100,
    },
  ];
  const resourceName = {
    singular: "Calculator",
    plural: "Calculators",
  };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(calculators);
  const rowMarkup = calculators.map(({ id, title, products }, ind) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={ind}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {title}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge icon={ProductsMajor}>{products}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end">
          <Button
            variant="tertiary"
            onClick={() => navigate(`/debug/calculators/calc-${id}`)}
            icon={EditMajor}
          />
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  return (
    <Page
      title="Calcualtors"
      backAction={{ content: "Home", onAction: () => navigate("/") }}
      primaryAction={{
        content: "Create Calcualtor",
        onAction: () => navigate("/debug/calculators/create-calculator"),
      }}
    >
      {calculators.length == 0 && (
        <LegacyCard sectioned>
          <EmptyState
            heading="Manage your Calcualtors"
            action={{
              content: "Add Calculator",
              onAction: () => console.log("clicked"),
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          ></EmptyState>
        </LegacyCard>
      )}
      {calculators.length > 0 && (
        <LegacyCard>
          <IndexTable
            resourceName={resourceName}
            itemCount={calculators.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            headings={[
              { title: "Name" },
              { title: "Products" },
              {
                id: "actions",
                title: (
                  <Text as="span" alignment="end">
                    Actions
                  </Text>
                ),
              },
            ]}
            onSelectionChange={handleSelectionChange}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      )}
    </Page>
  );
};

export default Calculators;
