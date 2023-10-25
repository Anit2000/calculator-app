import {
  EmptyState,
  IndexTable,
  LegacyCard,
  Page,
  useIndexResourceState,
  Text,
  Button,
  Frame,
  Loading
} from "@shopify/polaris";
import { EditMajor } from "@shopify/polaris-icons";
import { navigate } from "raviger";
import React, { useEffect,useState } from "react";
import useFetch from "../../hooks/useFetch";
import { getPricing } from "../../helpers/calculator";

const Prices = () => {
  const [pricingList,setPricingList] = useState([]);
  const [loading,setLoading] = useState(true);
  const fetch = useFetch();
  const resourceName = {
    singular: "Price",
    plural: "Prices",
  };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(pricingList);
  const rowMarkup = pricingList.map(({ _id, title, pricing }, ind) => (
    <IndexTable.Row 
      id={_id}
      key={_id}
      selected={selectedResources.includes(_id)}
      position={ind}
    >
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {title}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {pricing.length}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end">
          <Button
            variant="tertiary"
            onClick={() => navigate(`/debug/prices/price-${_id}`)}
            icon={EditMajor}
          />
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  useEffect(()=>{
    (async function getPricingData(){
      let data = await  getPricing(fetch);
      setPricingList(data);
      setLoading(false);
    })()
  },[])
  if(loading){
    return  <div style={{height: '100px'}}>
    <Frame>
      <Loading />
    </Frame>
  </div>
  }
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
    >
      {pricingList.length == 0 && (
        <LegacyCard sectioned>
          <EmptyState
            heading="Manage Calculator Pricing"
            action={{ content: "Add Price",onAction:()=>navigate("/debug/prices/create-price") }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Add pricing logics for calcualtors</p>
          </EmptyState>
        </LegacyCard>
      )}
      {pricingList.length > 0 && 
        <LegacyCard>
          <IndexTable
            resourceName={resourceName}
            itemCount={pricingList.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              {
                title: "Pricing",
              },
              {
                title: "Count",
              }
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      }
    </Page>
  );
};

export default Prices;
