import {
  EmptyState,
  IndexTable,
  LegacyCard,
  Page,
  useIndexResourceState,
  Text,
  Button,
  Frame,
  Loading,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import { EditMajor } from "@shopify/polaris-icons";
import { navigate } from "raviger";
import React, { useCallback, useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { deletePrice, getPricing } from "../../helpers/calculator";

const Prices = () => {
  const fetch = useFetch();
  const [pricingList, setPricingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  const handleDeletePricing = async () => {
    setLoading(true);
    let deleteData = {
      ids: selectedResources,
    };
    let response = await deletePrice(fetch, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(deleteData),
    });
    clearSelection()
    await getPricingData();
    handleCloseDeleteModal();
    setLoading(false);
  };
  const resourceName = {
    singular: "Price",
    plural: "Prices",
  };
  const promotedBulkActions = [
    {
      content: "Delete Pricing Groups",
      onAction: () => setDeleteModalOpen(true),
    },
  ];
  const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } =
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
  async function getPricingData() {
    let data = await getPricing(fetch);
    setPricingList(data);
    setLoading(false);
  }
  useEffect(() => {
    getPricingData();
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
            action={{
              content: "Add Price",
              onAction: () => navigate("/debug/prices/create-price"),
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Add pricing logics for calcualtors</p>
          </EmptyState>
        </LegacyCard>
      )}
      {pricingList.length > 0 && (
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
              },
            ]}
            promotedBulkActions={promotedBulkActions}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      )}
      <Frame>
        <Modal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          title="Delete Calculator"
          primaryAction={{
            content: "Confirm Delete",
            onAction: handleDeletePricing,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: handleCloseDeleteModal,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                Are you sure you want to delete this calculator? This action
                cannot be undone.
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </Page>
  );
};

export default Prices;
