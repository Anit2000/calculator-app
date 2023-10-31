import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  EmptyState,
  LegacyCard,
  Text,
  IndexTable,
  useIndexResourceState,
  Badge,
  Frame,
  Loading,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import { ProductsMajor, EditMajor } from "@shopify/polaris-icons";
import { navigate } from "raviger";
import { Page } from "@shopify/polaris";
import useFetch from "../../hooks/useFetch";
import { deletecalcluator, listCalculators } from "../../helpers/calculator";

const Calculators = () => {
  const fetch = useFetch();
  const [loading, setLoading] = useState(true);
  const [calculators, setCalculators] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  const handleDeleteCalculator = async () => {
    setLoading(true);
    let deleteData = {
      ids: selectedResources,
    };
    let response = await deletecalcluator(fetch, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(deleteData),
    });

    clearSelection()
    await fetchCalcData();
    handleCloseDeleteModal();
    setLoading(false);
  };

  const resourceName = {
    singular: "Calculator",
    plural: "Calculators",
  };
  const promotedBulkActions = [
    {
      content: "Delete Calculators",
      onAction: () => setDeleteModalOpen(true),
    },
  ];
  const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } =
    useIndexResourceState(calculators);

  const rowMarkup = calculators.map(({ _id, title, products }, ind) => (
    <IndexTable.Row
      id={_id}
      key={_id}
      selected={selectedResources.includes(_id)}
      position={ind}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {title}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge icon={ProductsMajor}>{products.length}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end">
          <Button
            variant="tertiary"
            onClick={() => navigate(`/debug/calculators/calc-${_id}`)}
            icon={EditMajor}
          />
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  async function fetchCalcData() {
    try {
      let data = await listCalculators(fetch);
      if (data) data = data.map((el) => ({ id: el._id, ...el }));
      data ? setCalculators(data) : "";
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  }
  useEffect(() => {
    fetchCalcData();
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
              onAction: () => navigate("/debug/calculators/create-calculator"),
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          ></EmptyState>
        </LegacyCard>
      )}
      {calculators.length > 0 && (
        <LegacyCard className="card-spacing">
          <IndexTable
            resourceName={resourceName}
            itemCount={calculators.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            hasMoreItems={true}
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
            promotedBulkActions={promotedBulkActions}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>
      )}
      <Modal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Delete Calculator"
        primaryAction={{
          content: "Confirm Delete",
          onAction: handleDeleteCalculator,
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
    </Page>
  );
};

export default Calculators;
