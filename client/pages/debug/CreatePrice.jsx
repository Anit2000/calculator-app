import React, { useCallback, useState } from "react";
import { navigate } from "raviger";
import nextId from "react-id-generator";
import { createPrice, updatePrice,parseCsv } from "../../helpers/calculator";
import useFetch from "../../hooks/useFetch";
import {
  EmptyState,
  LegacyCard,
  Page,
  Modal,
  Listbox,
  LegacyStack,
  TextField,
  Divider,
  Text,
  Button,
  IndexTable,
  useIndexResourceState,
  Icon,
  Toast,
  Frame,
  DropZone,
  Thumbnail,
  Spinner,
} from "@shopify/polaris";
import {
  CashDollarMajor,
  CirclePlusMinor,
  DeleteMinor,
  NoteMinor
} from "@shopify/polaris-icons";

const CreatePrice = () => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [price, setPrice] = useState(0);
  const [priceTitle, setPriceTitle] = useState("");
  const [priceList, setPriceList] = useState([]);
  const [list, setList] = useState([]);
  const [toastActive, setToastActive] = useState(false);
  const [file, setFile] = useState();
  const [fileModal,setFileModal] = useState(false);
  const [priceLoader,setPriceLoader] = useState(false);
  const fetch = useFetch();
  function handlePriceChange(newValue) {
    setPriceTitle(newValue);
  }
  const priceUpdate = useCallback(() => {
    let priceData = {
      id: nextId(),
      width: width,
      height: height,
      price: price,
    };
    setList((prev) => [priceData, ...prev]);
  }, [width, price, height]);
  const addPriceTable = () => {
    setPriceList((prev) => [...list, ...prev]);
    setOpen(false);
    setList([]);
  };
  function closeFileModal(){
    setFileModal(false);
    setFile();
  }
  const resourceName = {
    singular: "Price",
    plural: "Prices",
  };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(priceList);
  const toastMarkup = <Toast content="Pricing added"></Toast>;
  let listMarkup = priceList.map(({ id, width, height, price }, ind) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={ind}
    >
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {width}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {height}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd">
          {price}
        </Text>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));
  const createPriceDb = () => {
    let priceData = {
      title: priceTitle,
      pricing: priceList,
    };
    createPrice(priceData, fetch, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(priceData),
    });
    navigate("/debug/prices/");
  };
  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile(acceptedFiles[0]),
    [],
  );
  const handleFileSave = async () =>{
    setPriceLoader(true);
    let data = new FormData();
    console.log(file)
    data.append('file',file);
    data.append('storeData',{
      'store':'testing'
    })
    try{
      const request = await parseCsv(fetch,{
        method:"POST",
        body: data
      });
      setPriceList(request);
      setFileModal(false);
      setFile();
      setPriceLoader(false);
    }catch(err){
      console.log(err);
    }
  }
  const validImageTypes = ['csv'];
  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFile = file && (<LegacyStack>
      <Thumbnail
        size="small"
        alt={file.name}
        source={
          validImageTypes.includes(file.type)
            ? window.URL.createObjectURL(file)
            : NoteMinor
        }
      />
      <div>
        {file.name}{' '}
        <Text variant="bodySm" as="p">
          {file.size} bytes
        </Text>
      </div>
    </LegacyStack>);
  return (
    <Frame>
      <Page
        backAction={{
          content: "Pricings",
          onAction: () => {
            navigate("/debug/prices");
          },
        }}
        secondaryActions={[
          {
            content:"Import",
            onAction: () =>{
              setFileModal(true)
            }
          },
          {
            content: "Add Price",
            onAction: () => {
              setOpen(true);
            },
          },
        ]}
        primaryAction={{
          content: "Save",
          onAction: () => {
            createPriceDb();
          },
        }}
      >
        {toastActive && toastMarkup}
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <TextField
            label="Pricing Name"
            value={priceTitle}
            autoComplete="off"
            onChange={handlePriceChange}
          />
        </div>
        <Modal open={fileModal}
          onClose={closeFileModal}
          title="Upload CSV File"
          primaryAction={{
            content:"Save",
            loading: priceLoader,
            onAction:handleFileSave
          }}
          secondaryActions={[
            {
              content:'Cancel',
              onAction:closeFileModal
            }
          ]}
        >
          <div style={{padding: "40px"}}>
            <DropZone allowMultiple={false} accept=".csv" onDrop={handleDropZoneDrop}>
              {uploadedFile}
              {fileUpload}
            </DropZone>
          </div>
        </Modal>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Create New Pricing"
          primaryAction={{
            content: "Save",
            onAction: addPriceTable,
          }}
          secondaryActions={{
            content: "Cancel",
            onAction: () => {
              setOpen(false);
            },
          }}
        >
          <Modal.Section>
            <Listbox accessibilityLabel="Add pricing value">
              <Listbox.Option key={"price-headings"} value={"price-headings"}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                  }}
                >
                  <Text as="span" fontWeight="bold" variant="bodyMd">
                    Width
                  </Text>
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Height
                  </Text>
                  <Text as="span" variant="bodyMd" fontWeight="bold">
                    Price
                  </Text>
                </div>
              </Listbox.Option>
              {list.length > 0 && (
                <>
                  {list.map((el, ind) => (
                    <Listbox.Option key={"price-" + ind} value={"price-" + ind}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px",
                        }}
                      >
                        <Text as="span" variant="bodyMd">
                          {el.width}
                        </Text>
                        <Text as="span" variant="bodyMd">
                          {el.height}
                        </Text>
                        <Text as="span" variant="bodyMd">
                          {el.price}
                        </Text>
                      </div>
                    </Listbox.Option>
                  ))}
                  <div style={{ height: "8px", width: "100%" }}></div>
                  <Divider />
                  <div style={{ height: "8px", width: "100%" }}></div>
                </>
              )}

              <LegacyStack horizontal wrap={false} distribution="fillEvenly">
                <LegacyStack.Item>
                  <div style={{ maxWidth: "150px" }}>
                    <TextField
                      placeholder="Width"
                      value={width}
                      min={0}
                      onChange={useCallback(
                        (newValue) => setWidth(newValue),
                        []
                      )}
                      type="number"
                    />
                  </div>
                </LegacyStack.Item>
                <LegacyStack.Item>
                  <div style={{ maxWidth: "150px" }}>
                    <TextField
                      placeholder="Height"
                      value={height}
                      min={0}
                      onChange={useCallback(
                        (newValue) => setHeight(newValue),
                        []
                      )}
                      type="number"
                    />
                  </div>
                </LegacyStack.Item>
                <LegacyStack.Item>
                  <div style={{ maxWidth: "150px" }}>
                    <TextField
                      placeholder="Price"
                      value={price}
                      min={0}
                      onChange={useCallback(
                        (newValue) => setPrice(newValue),
                        []
                      )}
                      type="number"
                    />
                  </div>
                </LegacyStack.Item>
              </LegacyStack>
              <LegacyStack spacing="tight">
                <div style={{ marginTop: "10px" }}>
                  <Button icon={CirclePlusMinor} onClick={priceUpdate}>
                    Add
                  </Button>
                </div>
              </LegacyStack>
            </Listbox>
          </Modal.Section>
        </Modal>
        <LegacyCard>
          {priceList.length == 0 && (
            <EmptyState
              heading="Create Pricing Option For Calculator"
              action={{
                content: "Add Pricing",
                icon: CashDollarMajor,
                onAction: () => {
                  setOpen(true);
                },
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            ></EmptyState>
          )}
          {priceList.length > 0 && (
            <IndexTable
              resourceName={resourceName}
              itemCount={priceList.length}
              selectedItemsCount={
                allResourcesSelected ? "ALL" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                {
                  title: "Width",
                },
                {
                  title: "Height",
                },
                {
                  title: "Price",
                },
              ]}
              promotedBulkActions={[
                {
                  content: "Remove",
                  onAction: () => console.log("remove prices"),
                },
              ]}
            >
              {listMarkup}
            </IndexTable>
          )}
        </LegacyCard>
      </Page>
    </Frame>
  );
};

export default CreatePrice;