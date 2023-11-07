import React, { useState, useCallback, useEffect } from "react";
import { usePath, navigate } from "raviger";
import useFetch from "../../hooks/useFetch";
import {
  DataTable,
  Layout,
  LegacyCard,
  LegacyStack,
  Page,
  TextField,
  FormLayout,
  Button,
  TextContainer,
  Banner,
  Select,
  Text,
  Frame,
  Loading,
} from "@shopify/polaris";
import { AddMajor, DeleteMajor } from "@shopify/polaris-icons";
import { getOption, updateOption } from "../../helpers/calculator";

const Option = () => {
  const path = usePath();
  const fetch = useFetch();
  const optId = path.split("options/")[1].split("opt-")[1];
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const [priceRule, setPriceRule] = useState();
  const [optionVal, setOptionVal] = useState("");
  const [optionPrice, setOptionPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateLoader, setUpdateLoader] = useState(false);

  const handleOptionValChange = useCallback((newValue) =>
    setOptionVal(newValue)
  );
  const handleOptionPriceChange = useCallback((newValue) =>
    setOptionPrice(newValue)
  );
  const handleSelectChange = useCallback((value) => {
    setPriceRule(Number(value));
  }, []);

  const addOption = () => {
    setOptions((prev) => [
      [
        optionVal,
        optionPrice,
        <Button
          icon={DeleteMajor}
          onClick={() => {
            deletOption(optionVal);
          }}
        />,
      ],
      ...prev,
    ]);
  };
  const deletOption = (value) => {
    setOptions((prev) => {
      let index = prev.findIndex((el) => el.indexOf(value) != -1);
      let arr = [];
      if (index != 0 && index != prev.length - 1) {
        arr = [
          ...prev.slice(0, index),
          ...prev.slice(index + 1, prev.length - 1),
        ];
      } else if (index == 0) {
        arr = [...prev.slice(1)];
      } else if (index == prev.length - 1) {
        arr = [...prev.slice(0, index)];
      }
      return arr;
    });
  };
  const updateData = async () => {
    setUpdateLoader(true);
    let optionDt = {
      id: optId,
      update: {
        options: options.map((el) => ({ value: el[0], price: el[1] })),
        rule: priceRule,
      },
    };
    let response = await updateOption(fetch, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(optionDt),
    });
    setUpdateLoader(false);
  };
  useEffect(() => {
    (async function () {
      try {
        let data = await getOption(fetch, optId);
        setTitle(data.title);
        data.options =
          data.options.length > 0
            ? data.options.map((el) => {
                let optObj = { value: el.value, price: el.price };
                let arr = [
                  ...Object.values(optObj),
                  <Button
                    icon={DeleteMajor}
                    onClick={() => {
                      deletOption(el.value);
                    }}
                  />,
                ];
                return arr;
              })
            : [];
        setOptions(data.options);
        setPriceRule(data.rule);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
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
        content: "option heading",
        onAction: () => navigate("/debug/options"),
      }}
      primaryAction={{
        content: "Update",
        loading: updateLoader,
        onAction: updateData,
      }}
    >
      <Layout>
        <Layout.Section oneHalf>
          <LegacyCard title="options">
            <div style={{ width: "100%", padding: "10px 0px" }}>
              {options.length > 0 && (
                <DataTable
                  columnContentTypes={["text", "numeric", "numeric"]}
                  headings={["Value", "Price", ""]}
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
                value={priceRule}
                onChange={handleSelectChange}
              />
            </TextContainer>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Option;
