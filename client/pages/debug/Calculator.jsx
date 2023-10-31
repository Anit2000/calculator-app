import React, { useEffect, useState, useCallback } from "react";
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
  Modal,
  ChoiceList,
  LegacyStack,
  Toast,
  TextField,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { AddProductMajor } from "@shopify/polaris-icons";
import { navigate, usePath } from "raviger";
import {
  getcalculator,
  getProducts,
  getPricing,
  updateCalculator,
  getPrice,
} from "../../helpers/calculator";
import useFetch from "../../hooks/useFetch";

const Calculator = () => {
  const path = usePath();
  const fetch = useFetch();
  const [open, setOpen] = useState(false);
  const [priceModal, setPriceModal] = useState(false);
  const [minMaxModal, setMinMaxModal] = useState(false);
  const [intialSelection, setInitialSelection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [products, setProducts] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [pricingList, setPricingList] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [toastDisplay, setToastDisplay] = useState(false);
  const [minWidth, setMinWidth] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const [minHeight, setMinHeight] = useState(0);
  const [maxHeight, setMaxHeight] = useState(0);

  let id = path.split("/");
  id = id[id.length - 1];
  async function handleSelection(selectedPayload) {
    setProducts(selectedPayload.selection);
  }
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);
  const {
    selectedResources: pricingSelectedResoucrce,
    allResourcesSelected: pricingAllResourcesSelected,
    handleSelectionChange: handlePriceSelectionChange,
  } = useIndexResourceState(pricing);
  const resourceName = {
    singular: "Product",
    plural: "Products",
  };
  const pricingResourceName = {
    singular: "Pricing",
    plural: "Pricings",
  };
  const actions = [
    {
      content: "Remove Products",
      onAction: () => console.log("Delete the foloowing"),
    },
  ];
  const priceActions = [
    {
      content: "Remove Price",
      onAction: () => setPricing([]),
    },
  ];
  const productTableMarkup = products.map(
    ({ title, id, status, images }, ind) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={ind}
      >
        <IndexTable.Cell>
          <img
            src={images[0].originalSrc || images[0].src}
            width="50px"
            height="50px"
            alt={images[0].altText}
            style={{
              borderRadius: "6px",
            }}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {title}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge tone="info">{status}</Badge>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );
  const pricingMarkup = pricing.map(({ title, id, pricing }, ind) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={pricingSelectedResoucrce.includes(id)}
      position={ind}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {title}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text variant="bodyMd" as="span">
          {pricing.length}
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  const handleSelectedPrice = useCallback((value) => {
    setSelectedPrice(value);
  }, []);
  const handleChangeMinWidth = useCallback(
    (newValue) => setMinWidth(newValue),
    []
  );
  const handleChangeMaxWidth = useCallback(
    (newValue) => setMaxWidth(newValue),
    []
  );
  const handleChangeMinHeight = useCallback(
    (newValue) => setMinHeight(newValue),
    []
  );
  const handleChangeMaxHeight = useCallback(
    (newValue) => setMaxHeight(newValue),
    []
  );
  const updateCalcualtorData = useCallback(async () => {
    try {
      const data = {
        id: id.split("calc-")[1],
        products: products.map((el) => `${el.id}`),
        pricing: pricing.length > 0 ? pricing[0]._id : null,
        minMaxWidth: { min: minWidth, max: maxWidth },
        minMaxHeight: { min: minHeight, max: maxHeight },
      };

      const updatedData = await updateCalculator(data, fetch);

      if (updatedData) {
        setToastDisplay(true);
      } else {
        console.error("Failed to update calculator data.");
      }
    } catch (error) {
      console.error("Error updating calculator data:", error);
    }
  }, [products, pricing, minWidth, maxWidth, minHeight, maxHeight]);

  useEffect(() => {
    (async function fetchData() {
      let data = await getcalculator(id, fetch);
      console.log(data);
      setTitle(data.title);
      if (data.products) {
        data.products = data.products.map((el) =>
          el.includes("/Product/") ? el.split("/Product/")[1] : el
        );
        setInitialSelection(
          data.products.map((el) => ({ id: `gid://shopify/Product/${el}` }))
        );
        if (data.products.length > 0) {
          let { products } = await getProducts(data.products.join(","), fetch);
          setProducts(products);
        }
      }
      if (data.price) {
        let pricingData = await getPrice(data.price, fetch);
        setPricing([pricingData]);
      }
      let pricingList = await getPricing(fetch);
      pricingList = pricingList.map((price) => ({ id: price._id, ...price }));
      setPricingList(pricingList);
      setLoading(false);
      setMinWidth(data.minMaxWidth.min);
      setMaxWidth(data.minMaxWidth.max);
      setMinHeight(data.minMaxHeight.min);
      setMaxHeight(data.minMaxHeight.max);
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
        content: "Update Calculator",
        onAction: updateCalcualtorData,
      }}
      secondaryActions={[
        {
          content: "Add Products",
          onAction: () => {
            setOpen(true);
          },
        },
        {
          content: "Update Price",
          onAction: () => {
            setPriceModal(true);
          },
        },
        {
          content: "MinMax Width & Height",
          onAction: () => {
            setMinMaxModal(true);
          },
        },
      ]}
    >
      <Frame>
        <ResourcePicker
          resourceType="Product"
          open={open}
          onSelection={handleSelection}
          onCancel={(payload) => setOpen(false)}
          showVariants={false}
          initialSelectionIds={intialSelection}
        />
        <Modal
          open={priceModal}
          onClose={() => setPriceModal(false)}
          title="Choose Pricing"
          primaryAction={{
            content: "Save",
            onAction: (value) => {
              setPricing(selectedPrice);
              setPriceModal(false);
            },
          }}
        >
          <Modal.Section>
            <LegacyStack vertical>
              <LegacyStack.Item>
                {pricingList.length > 0 && (
                  <ChoiceList
                    title="Pricings"
                    choices={pricingList.map((el) => ({
                      label: el.title,
                      value: el,
                    }))}
                    onChange={handleSelectedPrice}
                    selected={selectedPrice}
                  />
                )}
                {pricingList.length == 0 && (
                  <EmptyState
                    heading="No Price Found"
                    action={{
                      content: "Create Pricing",
                      onAction: () => navigate("/debug/prices/create-price"),
                    }}
                  >
                    <p>No existing Price found please create new price</p>
                  </EmptyState>
                )}
              </LegacyStack.Item>
            </LegacyStack>
          </Modal.Section>
        </Modal>
        <Modal
          open={minMaxModal}
          onClose={() => setMinMaxModal(false)}
          title="Set Min & Max, Width & Height"
          primaryAction={{
            content: "Save",
            onAction: (value) => {
              setMinMaxModal(false);
            },
          }}
        >
          <Modal.Section>
            <LegacyStack vertical>
              <LegacyStack.Item>
                <TextField
                  label="Enter Min Width"
                  type="number"
                  value={minWidth}
                  onChange={handleChangeMinWidth}
                  autoComplete="off"
                />
                <TextField
                  label="Enter Max Width"
                  type="number"
                  value={maxWidth}
                  onChange={handleChangeMaxWidth}
                  autoComplete="off"
                />
                <TextField
                  label="Enter Min Height"
                  type="number"
                  value={minHeight}
                  onChange={handleChangeMinHeight}
                  autoComplete="off"
                />
                <TextField
                  label="Enter Min Height"
                  type="number"
                  value={maxHeight}
                  onChange={handleChangeMaxHeight}
                  autoComplete="off"
                />
              </LegacyStack.Item>
            </LegacyStack>
          </Modal.Section>
        </Modal>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 12, lg: 6 }}>
            <LegacyCard>
              {products.length == 0 && (
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
              )}
              {products.length > 1 && (
                <>
                  <IndexTable
                    resourceName={resourceName}
                    itemCount={products.length}
                    selectedItemsCount={
                      allResourcesSelected ? "All" : selectedResources.length
                    }
                    headings={[
                      { title: "" },
                      { title: "Product" },
                      { title: "Status" },
                    ]}
                    onSelectionChange={handleSelectionChange}
                    // promotedBulkActions={actions}
                    primaryAction={{
                      content: "Add Product",
                      action: () => {
                        console.log("clicked");
                      },
                    }}
                  >
                    {productTableMarkup}
                  </IndexTable>
                </>
              )}
            </LegacyCard>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 12, lg: 6 }}>
            <LegacyCard>
              {pricing.length == 0 && (
                <EmptyState
                  heading="No Pricing Rule Selected"
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  action={{
                    content: "Add Pricing",
                    icon: AddProductMajor,
                    onAction: () => {
                      setPriceModal(true);
                    },
                  }}
                >
                  <p>Choose Pricing to add </p>
                </EmptyState>
              )}
              {pricing.length > 0 && (
                <IndexTable
                  resourceName={pricingResourceName}
                  itemCount={pricing.length}
                  selectedItemsCount={
                    pricingAllResourcesSelected
                      ? "All"
                      : pricingSelectedResoucrce.length
                  }
                  headings={[{ title: "Name" }, { title: "Count" }]}
                  onSelectionChange={handlePriceSelectionChange}
                  // promotedBulkActions={priceActions}
                  primaryAction={{
                    content: "Add Pricing",
                    action: () => {
                      console.log("clicked");
                    },
                  }}
                >
                  {pricingMarkup}
                </IndexTable>
              )}
            </LegacyCard>
          </Grid.Cell>
        </Grid>
        {toastDisplay && (
          <Toast
            content="Calulator Data Updated"
            onDismiss={() => setToastDisplay(false)}
            duration={4500}
          />
        )}
      </Frame>
    </Page>
  );
};

export default Calculator;
