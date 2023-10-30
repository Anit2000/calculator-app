import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { EmptyState, Frame, Layout, Page, Loading } from "@shopify/polaris";
import { navigate } from "raviger";
import React, { useEffect, useState } from "react";
import { countCalculator, countPricing } from "../helpers/calculator";
import useFetch from "../hooks/useFetch";

const HomePage = () => {
  const fetch = useFetch();
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const [loading, setLoading] = useState(false);
  const [calCount, setCalCount] = useState(0);
  const [priceCount, setPriceCount] = useState(0);

  useEffect(() => {
    (async function fetchCalData() {
      setLoading(true);
      let cal = await countCalculator(fetch);
      let price = await countPricing(fetch);
      // console.log(data);
      setCalCount(cal);
      setPriceCount(price);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {loading ? (
        <div style={{ height: "100px" }}>
          <Frame>
            <Loading />
          </Frame>
        </div>
      ) : (
        <Page>
          <Layout>
            <Layout.Section oneHalf>
              <EmptyState
                image="https://cdn.shopify.com/shopifycloud/shopstatus/bundles/917b5cdc43f0172c0791b4c4911eb8ddd0f38a0fbc23b1a4b78ec81a168192bf.svg"
                heading={
                  calCount > 0 ? `${calCount} Calculator` : "Manage Calculators"
                }
                action={{
                  content:
                    calCount > 0 ? "Add More Calculators" : "Create Calculator",
                  onAction: () =>
                    navigate("/debug/calculators/create-calculator"),
                }}
                secondaryAction={{
                  content: "View All Calculators",
                  onAction: () => navigate("/debug/calculators"),
                }}
              ></EmptyState>
            </Layout.Section>
            <Layout.Section oneHalf>
              <EmptyState
                image="https://cdn.shopify.com/shopifycloud/shopstatus/bundles/917b5cdc43f0172c0791b4c4911eb8ddd0f38a0fbc23b1a4b78ec81a168192bf.svg"
                heading={
                  priceCount > 0
                    ? `${priceCount} Pricing Gruops`
                    : "Manage Pricing Groups"
                }
                action={{
                  content:
                    priceCount > 0
                      ? "Add More Pricing Groups"
                      : "Create Pricing Group",
                  onAction: () => navigate("/debug/prices/create-price"),
                }}
                secondaryAction={{
                  content: "View All Pricing Groups",
                  onAction: () => navigate("/debug/prices"),
                }}
              ></EmptyState>
            </Layout.Section>
          </Layout>
        </Page>
      )}
    </>
  );
};

export default HomePage;
