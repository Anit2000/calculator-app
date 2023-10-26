import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {
  EmptyState,
  Layout,
  Page,
} from "@shopify/polaris";
import { navigate } from "raviger";
import React from "react";

const HomePage = () => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  return (
    <>
      <Page >
        <Layout>
          <Layout.Section oneHalf>
            <EmptyState
              image="https://cdn.shopify.com/shopifycloud/shopstatus/bundles/917b5cdc43f0172c0791b4c4911eb8ddd0f38a0fbc23b1a4b78ec81a168192bf.svg"
             heading="Manage Calculators" 
             action={{
              content:"Calculators",
              onAction:() => navigate("/debug/calculators")
             }}
            ></EmptyState>
          </Layout.Section>
          <Layout.Section oneHalf>
            <EmptyState
                image="https://cdn.shopify.com/shopifycloud/shopstatus/bundles/917b5cdc43f0172c0791b4c4911eb8ddd0f38a0fbc23b1a4b78ec81a168192bf.svg"
                heading="Manage Prices"
                action={{
                  content:"Pricings",
                  onAction:() => navigate("/debug/prices")
                }}
              ></EmptyState>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
};

export default HomePage;
