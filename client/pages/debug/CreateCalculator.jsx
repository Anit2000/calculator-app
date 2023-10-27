import React, { useCallback, useEffect, useState } from "react";
import { EmptyState, Grid, IndexTable, Layout, LegacyCard,Text,Page,TextField, useIndexResourceState, Badge, Frame,Modal,LegacyStack,ChoiceList } from "@shopify/polaris";
import { navigate } from "raviger";
import { AddProductMajor, CashDollarMinor } from "@shopify/polaris-icons";
import { ResourcePicker } from "@shopify/app-bridge-react";
import {saveCalculator,getPricing} from "../../helpers/calculator";
import useFetch from "../../hooks/useFetch";

const CreateCalculator = () => {
  const [open,setOpen] = useState(false);
  const [title,setTitle] = useState("");
  const [pageDisabled,setPageDisabled] = useState(true);
  const [selectedProducts,setSelectedProducts] = useState([])
  const [priceModal,setPriceModal] = useState(false);
  const [calculator,setcalculator] = useState();
  const [pricing,setPricing] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [pricingList,setPricingList] = useState([]);
  const [updateData,setUpdateData] = useState(false);
  const [saveLoader,setSaveLoader] = useState(false)


  const fetch = useFetch();
  const handleChange = useCallback((newValue)=>{
    setcalculator((prev) =>({
      title:newValue,
      ...prev
    }))
    setPageDisabled(false)
    return setTitle(newValue);
  },[]) 
  const handleSelection = (selectionPayload) =>{
    setSelectedProducts([...selectionPayload.selection]);
    setcalculator((prev) =>({
      products:[...selectionPayload.selection].map(el => el.id),
      ...prev
    }))
    setPageDisabled(false)
  }
  const handleSelectedPrice = useCallback(
    (newValue) => {
      setSelectedPrice(newValue);
      setcalculator((prev) => ({price: newValue[0].id,...prev}));
    },
    [],
  );
  const resourceName = {
    singular: 'Product',
    plural: 'Products',
  };
  const pricingResourceName = {
    singular: 'Pricing',
    plural: 'Pricings',
  };
  const actions = [
    {
      content: 'Remove Products',
      onAction: () => console.log('Delete the foloowing'),
    },
  ];
  const {selectedResources,allResourcesSelected,handleSelectionChange} = useIndexResourceState(selectedProducts);
  const {selectedResources : pricingSelectedResoucrce , allResourcesSelected : pricingAllResourcesSelected ,handleSelectionChange : handlePriceSelectionChange } = useIndexResourceState(pricing);
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
  const pricingMarkup = pricing.map(({title,id,pricing},ind) => 
    <IndexTable.Row id={id} key={id} selected={pricingSelectedResoucrce.includes(id)} position={ind}>
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">{title}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">{pricing.length}</Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  );
  async function saveCalculatorContent(){
    setSaveLoader(true);
    await saveCalculator({
      ...calculator,
      title:title
    },fetch);
    setSaveLoader(false);
    navigate("/debug/calculators");
  }
  useEffect(()=>{
    (
      async function getData(){
        let pricingList = await getPricing(fetch);
        pricingList = pricingList.map(price => ({id: price._id,...price}));
        setPricingList(pricingList);
      }
    )()
  },[])
  return (
    <Frame>
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
          onAction:saveCalculatorContent,
          loading:saveLoader
        }}
      >
        <Modal 
        open={priceModal}
        onClose={() => setPriceModal(false)}
        title="Choose Pricing"
        primaryAction={{
          content:"Save",
          onAction:(value) =>{
            setPricing(selectedPrice)
            setPriceModal(false)
          }
        }}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <LegacyStack.Item>
              {
                pricingList.length > 0 && <ChoiceList
                  title="Pricings"
                  choices={pricingList.map(el =>({label : el.title, value: el}))}
                  onChange={handleSelectedPrice}
                  selected={selectedPrice}
                />
              }
              {
                pricingList.length == 0 && 
                <EmptyState 
                  heading="No Price Found"
                  action={{
                    content:'Create Pricing',
                    onAction:() => navigate("/debug/prices/create-price")
                  }}
                  >
                  <p>No existing Price found please create new price</p>
                </EmptyState>
              }
            </LegacyStack.Item>
          </LegacyStack>
        </Modal.Section>
      </Modal>
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
            {pricing.length == 0 &&
              <EmptyState
                  heading="Product List Is Empty"
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  action={{
                    content: "Add Pricing",
                    icon: CashDollarMinor,
                    onAction: () => {
                      setPriceModal(true)
                    },
                  }}
                >
                  <p>Choose pricing rule </p>
                </EmptyState>
              }
              {pricing.length > 0 &&  <IndexTable
                    resourceName={pricingResourceName}
                    itemCount={pricing.length}
                    selectedItemsCount={pricingAllResourcesSelected ? "All" : pricingSelectedResoucrce.length}
                    headings={[
                      {title:"Name"},
                      {title:"Count"},
                    ]}
                    onSelectionChange={handlePriceSelectionChange}
                    // promotedBulkActions={priceActions}
                    primaryAction={{
                      content:"Add Pricing",
                      action:()=>{
                        console.log('clicked')
                      }
                    }}
                  >{pricingMarkup}</IndexTable>
                }
            </LegacyCard>
          </Grid.Cell>
        </Grid>
      </Page>
    </Frame>
  );
};

export default CreateCalculator;
