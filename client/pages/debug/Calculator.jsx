import React, { useEffect, useState } from "react";
import { Page,Frame,Loading,EmptyState,LegacyCard, Grid } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { AddProductMajor } from "@shopify/polaris-icons";
import { navigate, usePath } from "raviger";
import { getcalculator } from "../../helpers/calculator";
import useFetch from "../../hooks/useFetch";

const Calculator = () => {
  const path = usePath();
  const fetch = useFetch();
  const [open,setOpen] = useState(false);
  const [intialSelection,setInitialSelection] = useState([]);
  const [loading,setLoading] = useState(true);
  const [title,setTitle] = useState("");
  const [products,setProducts] = useState([]);

  let id = path.split("/");
  id = id[id.length - 1];
  useEffect(()=>{
    (async function fetchData(){
     let data = await getcalculator(id,fetch);
     setTitle(data.title);
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
      title={title}
      backAction={{
        content: "Calculator heading",
        onAction: () => navigate("/debug/calculators"),
      }}
    >
      <ResourcePicker resourceType="Product" open={open}
        // onSelection={handleSelection}
        onCancel={()=> setOpen(false)} 
        showVariants={false}
        initialSelectionIds={[intialSelection]}
      />
      <Grid>
        <Grid.Cell columnSpan={{ xs: 12, lg: 6 }}>
          <LegacyCard>
          {
            products.length == 0 && <EmptyState
              heading="Product List Is Empty"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              action={{
                content: "Add Product",
                icon: AddProductMajor,
                onAction: () => {
                  setOpen(true)
                },
              }}
            >
              <p>Choose products to add </p>
            </EmptyState> 
          }
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  );
};

export default Calculator;
