import React, { useEffect, useState } from "react";
import {
  Page,
  EmptyState,
  useIndexResourceState,
  IndexTable,
  Button,
  Badge,
  LegacyCard,
  Text,
  Frame,
  Loading,
} from "@shopify/polaris";
import { EditMajor } from "@shopify/polaris-icons";
import { navigate } from "raviger";
import useFetch from "../../hooks/useFetch";
import { listOptions } from "../../helpers/calculator";

const Options = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch = useFetch();

  const resourceName = {
    singular: "Option",
    plural: "Options",
  };
  const { allResourcesSelected, selectedResources, handleSelectionChange } =
    useIndexResourceState(data);

  const rowMarkup = data.map(({ _id, title, options }, ind) => (
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
        <Badge>{options.length}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end">
          <Button
            variant="tertiary"
            onClick={() => navigate(`/debug/options/opt-${_id}`)}
            icon={EditMajor}
          />
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  useEffect(() => {
    (async function () {
      let optionsList = await listOptions(fetch);
      setData(optionsList);
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
      title="Calculator Options"
      backAction={{ content: "Home", onAction: () => navigate("/") }}
      primaryAction={{
        content: "Create Option",
        onAction: () => navigate("/debug/options/create-option"),
      }}
    >
      {data.length == 0 && (
        <EmptyState
          heading="Manage Options For Calcualtors"
          action={{
            content: "Add Options",
            onAction: () => navigate("/debug/options/create-option"),
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        />
      )}
      {data.length > 0 && (
        <LegacyCard className="card-spacing">
          <IndexTable
            resourceName={resourceName}
            itemCount={data.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            hasMoreItems={true}
            headings={[
              { title: "Name" },
              { title: "Options" },
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

export default Options;
