import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import CarriersComponent from "../components/CarriersComponent";
import ProductSettingsComponent from "../components/ProductSettingsComponent";
import BoxSizesComponent from "../components/Pages/BoxSizesComponent";
import OrdersComponent from "../components/OrdersComponent";
import PlanStatusHeading from "../partials/PlanStatusHeading";
import GTZCarriersComponent from "../components/Pages/GlobalTranz/Ltl/CarriersComponent";
import useLoadComponent from "../hooks/useLoadComponent";
import ShippingGroup from "../components/Pages/ShippingGroup";
import ShippingRatesComponent from "../components/Pages/DBSC/ShippingRatesComponent";
import ShippingClassesComponent from "../components/Pages/DBSC/ShippingClassesComponent";

const { TabPane } = Tabs;

function TabsLayout() {
  const { installedCarriers, carrierId } = useSelector((state) => state);
  const [component, setComponent] = useState(0);
  const [tab, setTab] = useState("1");
  const [carrierSlug, setCarrierSlug] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("tab")) setTab(localStorage.getItem("tab"));

    return () => localStorage.removeItem("tab");
  }, [tab]);

  const loadComponent = () => {
    const slugs = [
      "ltl-quotes",
      "small-package",
      "ups-ltl",
      "ups-small",
      "fedex-ltl",
      "fedex-small",
      "gtz-ltl",
      "xpo-ltl",
      "rl-ltl",
      "unishippers-small",
      "yrc-ltl",
      "freightquote-ltl",
      "estes-ltl",
      "dayross-ltl",
      "odfl-ltl",
      "saia-ltl",
      "abf-ltl",
      "southeastern-ltl",
      "usps-small",
      "tql-ltl",
      "echo-ltl",
      "daylight-ltl",
      "dbsc",
    ];

    for (const ic of installedCarriers) {
      if (+ic.id === +carrierId) {
        const isFedexSmallCarrier = ic.slug === "fedex-small";
        const isUspsSmallCarrier = ic.slug === "usps-small";

        dispatch({
          type: "SET_FEDEX_SMALL_CARRIER",
          payload: isUspsSmallCarrier ? false : isFedexSmallCarrier,
        });
        dispatch({
          type: "SET_USPS_SMALL_CARRIER",
          payload: isFedexSmallCarrier ? false : isUspsSmallCarrier,
        });

        setComponent(slugs.indexOf(ic.slug));
        setCarrierSlug(ic.slug);
        break;
      }
    }
  };

  useEffect(() => {
    loadComponent();
  }, [carrierId, dispatch, installedCarriers]);

  const handleActiveTab = useCallback((key = "") => {
    localStorage.setItem("tab", key);
    setTab(key);
  }, []);

  const [connSettingsComponent, quoteSettingsComponent] =
    useLoadComponent(component);

  return (
    <Fragment>
      <PlanStatusHeading />

      <Tabs className={"tabs-wrp"} onChange={handleActiveTab} type="card">
        {(carrierSlug !== "usps-small" || carrierSlug !== "dbsc") && (
          <TabPane tab="Connection Settings" key="1">
            {connSettingsComponent}
          </TabPane>
        )}
        {["ltl-quotes", "freightquote-ltl", "tql-ltl"].includes(
          carrierSlug
        ) && (
          <TabPane tab="Carriers" key="2">
            <CarriersComponent />
          </TabPane>
        )}
        {["gtz-ltl"].includes(carrierSlug) && (
          <TabPane tab="Carriers" key="2">
            <GTZCarriersComponent />
          </TabPane>
        )}
        {["dbsc"].includes(carrierSlug) && (
          <>
            <TabPane tab="Shipping Rates" key="9">
              <ShippingRatesComponent />
            </TabPane>
            <TabPane tab="Shipping Classes" key="10">
              <ShippingClassesComponent />
            </TabPane>
          </>
        )}
        <TabPane tab="Shipping Groups" key="4">
          <ShippingGroup />
        </TabPane>
        {!["dbsc"].includes(carrierSlug) && (
          <TabPane tab="Quote Settings" key="5">
            {quoteSettingsComponent}
          </TabPane>
        )}
        <TabPane tab="Product Settings" key="6">
          <ProductSettingsComponent />
        </TabPane>
        <TabPane tab="Orders" key="7">
          <OrdersComponent />
        </TabPane>
        {/* Need to add small carriers index */}
        {[1, 3, 5, 9, 18].includes(component) && (
          <TabPane tab="Box Sizes" key="8">
            <BoxSizesComponent />
          </TabPane>
        )}
      </Tabs>
    </Fragment>
  );
}

export default TabsLayout;
