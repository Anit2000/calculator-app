import React, { useEffect, useState } from "react";
import {
  Page,
  Frame,
  Loading,
  EmptyState,
  LegacyCard,
  Grid,
  IndexTable,
  Badge,
  useIndexResourceState,
  Text,
  Button,
  HorizontalStack,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { AddProductMajor } from "@shopify/polaris-icons";
import { navigate, usePath } from "raviger";
import { getcalculator, getProducts } from "../../helpers/calculator";
import useFetch from "../../hooks/useFetch";

const Calculator = () => {
  const path = usePath();
  const fetch = useFetch();
  const [open, setOpen] = useState(false);
  const [intialSelection, setInitialSelection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [products, setProducts] = useState([]);

  let id = path.split("/");
  id = id[id.length - 1];
  function handleSelection(selectedPayload) {
    setProducts(selectedPayload.selection);
  }
  console.log(products)
  const {selectedResources,allResourcesSelected,handleSelectionChange} = useIndexResourceState(products);
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
  const productTableMarkup = products.map(({title,id,status,images},ind) => 
    <IndexTable.Row id={id} key={id} selected={selectedResources.includes(id)} position={ind}>
      <IndexTable.Cell>
        <img 
          src={images[0].originalSrc || images[0].src}
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
  useEffect(() => {
    (async function fetchData() {
      let data = await getcalculator(id, fetch);
      setTitle(data.title);
      setInitialSelection(data.products.map((el) => ({ id: el })));
      let {products} = await getProducts(
        data.products.map((el) => el.split("/Product/")[1]).join(","),
        fetch
      );
      setProducts(products);
      setLoading(false);
    })();
  }, []);
  if (loading) {
    return (
      <div style={{ height: "100px" }}>
        <Frame>
          <Loading />
        </Frame>
      </div>
    );
  }
  return (
    <Page
      title={title}
      backAction={{
        content: "Calculator heading",
        onAction: () => navigate("/debug/calculators"),
      }}
      primaryAction={{
        content: "Update",
        onAction : () => {console.log('update calcualtor')}
      }}
    >
      <ResourcePicker
        resourceType="Product"
        open={open}
        onSelection={handleSelection}
        onCancel={(payload) => setOpen(false)}
        showVariants={false}
        initialSelectionIds={intialSelection}
      />
      <Grid>
        <Grid.Cell columnSpan={{ xs: 12, lg: 6 }}>
          <LegacyCard>
            {products.length == 0 && 
              <EmptyState
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
              products.length > 1 &&
              <>
              <div  style={{padding:"10px"}}>
                <HorizontalStack align="end">
                  <Button
                    primary
                    onClick={()=>{setOpen(true)}}
                  >Add Products</Button>
                </HorizontalStack>
              </div>
                <IndexTable
                resourceName={resourceName}
                itemCount={products.length}
                selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
                headings={[
                  {title:""},
                  {title:"Product"},
                  {title:"Status"}
                ]}
                onSelectionChange={handleSelectionChange}
                promotedBulkActions={actions}
                primaryAction={{
                  content:"Add Product",
                  action:()=>{
                    console.log('clicked')
                  }
                }}
              >{productTableMarkup}</IndexTable>
            </>
              
            }
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  );
};

export default Calculator;
