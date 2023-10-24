import React from "react";

import ExitFrame from "./ExitFrame";
import Index from "./pages/Index";
import DebugIndex from "./pages/debug/Index";
import ActiveWebhooks from "./pages/debug/Webhooks";
import Calculators from "./pages/debug/Calculators";
import Prices from "./pages/debug/Prices";
import Calculator from "./pages/debug/Calculator";
import CreateCalculator from "./pages/debug/CreateCalculator";
import CreatePrice from "./pages/debug/CreatePrice";

const routes = {
  "/": () => <Index />,
  "/exitframe": () => <ExitFrame />,
  "/exitframe/:shop": ({ shop }) => <ExitFrame shop={shop} />,
  //Debug Cards
  "/debug": () => <DebugIndex />,
  "/debug/webhooks": () => <ActiveWebhooks />,
  "/debug/calculators": () => <Calculators />,
  "/debug/calculators/create-calculator": () => <CreateCalculator />,
  "/debug/calculators/:calculatorId": (calculatorId) => (
    <Calculator id={calculatorId} />
  ),
  "/debug/prices": () => <Prices />,
  "/debug/prices/create-price" : () => <CreatePrice/>
  //Add your routes here
};

export default routes;
