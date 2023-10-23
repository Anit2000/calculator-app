import React, { useCallback, useEffect, useState } from "react";
import { EmptyState, Grid, IndexTable, Layout, LegacyCard,Text,Page,TextField, useIndexResourceState, Badge } from "@shopify/polaris";
import { navigate } from "raviger";
import { AddProductMajor, CashDollarMinor } from "@shopify/polaris-icons";
import { ResourcePicker } from "@shopify/app-bridge-react";
import {saveCalculator} from "../../helpers/calculator";
import useFetch from "../../hooks/useFetch";

const CreateCalculator = () => {
  const [open,setOpen] = useState(false);
  const [title,setTitle] = useState("");
  const [pageDisabled,setPageDisabled] = useState(true);
  const [selectedProducts,setSelectedProducts] = useState([])
  const [calculator,setcalculator] = useState();
  const [updateData,setUpdateData] = useState(false);
  const fetch = useFetch();
  const handleChange = (newValue)=>{
    setTitle(newValue);
    setcalculator((prev) =>({
      title:newValue,
      ...prev
    }))
    setPageDisabled(false)
  };
  const handleSelection = (selectionPayload) =>{
    setSelectedProducts([...selectionPayload.selection]);
    setcalculator((prev) =>({
      products:[...selectionPayload.selection].map(el => el.id),
      ...prev
    }))
    setPageDisabled(false)
  }
  const resourceName = {
    singular: 'Product',
    plural: 'Products',
  };
  const actions = [
    {
      content: 'Remove Products',
      onAction: () => console.log('Delete the foloowing'),
    },
  ];
  const {selectedResources,allResourcesSelected,handleSelectionChange} = useIndexResourceState(selectedProducts);
  const productTableMarkup = selectedProducts.map(({title,id,status,images},ind) => 
    <IndexTable.Row id={id} key={id} selected={selectedResources.includes(id)} position={ind}>
      <IndexTable.Cell>
        <img 
          src={images[0].originalSrc}
          width="50px"
          height="50px"
          alt={images[0].altText}
          style={{
            borderRadius:"6px"
          }}
        />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">{title}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone="info">{status}</Badge>
      </IndexTable.Cell>
    </IndexTable.Row>
  )
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
        disabled: pageDisabled,
        onAction:()=>{
          saveCalculator(calculator,fetch)
        }
      }}
    >
      <ResourcePicker resourceType="Product" open={open}
        onSelection={handleSelection}
        onCancel={()=> setOpen(false)} 
        showVariants={false}
      />
      <Grid>
        <Grid.Cell columnSpan={{xs:12,lg:12}}>
          <TextField label="Calcualtor Name" autoComplete="off" value={title} onChange={handleChange}
            helpText="Please Input Calculator Title"
          />
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 12, lg: 6 }}>
          <LegacyCard>
            {
              selectedProducts.length == 0 && <EmptyState
              heading="Product List Is Empty"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              action={{
                content: "Add Product",
                icon: AddProductMajor,
                onAction: () => {
                  setOpen(true);
                },
              }}
            >
              <p>Choose products to add </p>
            </EmptyState> 
            }
            {
              selectedProducts.length > 0 && <IndexTable
                resourceName={resourceName}
                itemCount={selectedProducts.length}
                selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
                headings={[
                  {title:""},
                  {title:"Product"},
                  {title:"Status"}
                ]}
                onSelectionChange={handleSelectionChange}
                promotedBulkActions={actions}
              >{productTableMarkup}</IndexTable>
            }
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
