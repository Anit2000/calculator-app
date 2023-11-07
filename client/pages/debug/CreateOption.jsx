import React, { useCallback, useState } from "react";
import {
  Page,
  TextField,
  Layout,
  LegacyCard,
  Text,
  Button,
  FormLayout,
  LegacyStack,
  DataTable,
  Banner,
  TextContainer,
  Select,
} from "@shopify/polaris";
import { AddMajor } from "@shopify/polaris-icons";
import { navigate } from "raviger";
import { createOption } from "../../helpers/calculator";
import useFetch from "../../hooks/useFetch";

const CreateOption = () => {
  const fetch = useFetch();
  const [title, setTitle] = useState("");
  const [optionVal, setOptionVal] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = useCallback((newValue) => setTitle(newValue));
  const handleOptionValChange = useCallback((newValue) =>
    setOptionVal(newValue)
  );
  const handleOptionPriceChange = useCallback((newValue) =>
    setOptionPrice(newValue)
  );
  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const addOption = () => {
    setOptions((prev) => [[optionVal, optionPrice], ...prev]);
  };

  const savePrice = async () => {
    setLoading(true);
    let data = {
      title: title,
      options: options.map((el) => ({ value: el[0], price: el[1] })),
      rule: selected,
    };
    await createOption(fetch, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setLoading(false);
    navigate("/debug/options");
  };
  return (
    <Page
      title="Create Option"
      backAction={{
        content: "Options",
        onAction: () => navigate("/debug/options"),
      }}
      primaryAction={{
        content: "Save",
        loading: loading,
        onAction: savePrice,
      }}
    >
      <TextField
        label="Option Title"
        onChange={handleTitleChange}
        value={title}
      />
      <div style={{ width: "100%", marginTop: "40px" }}></div>
      <Layout>
        <Layout.Section oneHalf>
          <LegacyCard title="Add Options">
            <div style={{ width: "100%", padding: "10px 0px" }}>
              {options.length > 0 && (
                <DataTable
                  columnContentTypes={["text", "numeric"]}
                  headings={["Value", "Price"]}
                  rows={options}
                />
              )}
              {options.length == 0 && (
                <Text variant="headingSm" alignment="center" as="span">
                  No Options added
                </Text>
              )}
              <div style={{ padding: "20px 10px" }}>
                <LegacyStack wrap={false} alignment="leading" spacing="loose">
                  <LegacyStack.Item fill>
                    <FormLayout>
                      <FormLayout.Group condensed>
                        <TextField
                          type="text"
                          placeholder="Option value"
                          onChange={handleOptionValChange}
                          value={optionVal}
                        />
                        <TextField
                          type="number"
                          placeholder="Price"
                          onChange={handleOptionPriceChange}
                          value={optionPrice}
                          min={0}
                        />
                      </FormLayout.Group>
                    </FormLayout>
                  </LegacyStack.Item>
                  <Button
                    icon={AddMajor}
                    onClick={addOption}
                    accessibilityLabel="Add option"
                  />
                </LegacyStack>
              </div>
            </div>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard title="Option Rule" sectioned>
            <TextContainer>
              <Banner>
                <p>
                  Use your finance report to get detailed information about your
                  business.
                </p>
              </Banner>
            </TextContainer>
            <div style={{ marginTop: "20px" }}></div>
            <Select
              options={[
                {
                  label: "Per unit",
                  value: 0,
                },
                {
                  label: "Overall unit",
                  value: 1,
                },
              ]}
              value={selected}
              onChange={handleSelectChange}
            />
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default CreateOption;
