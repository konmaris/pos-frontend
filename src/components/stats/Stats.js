import axios from "axios";
import React, { useEffect } from "react";

import LineChart from "../charts/LineChart";
import BarChart from "../charts/BarChart";
import { ArcElement, BarElement, CategoryScale, Chart, Filler, Legend, LineElement, LinearScale, PointElement, RadialLinearScale, Title, Tooltip } from "chart.js";
import { Spinner } from "react-bootstrap";

Chart.register(ArcElement, BarElement, CategoryScale, Legend, LineElement, LinearScale, PointElement, Title, Tooltip, RadialLinearScale, Filler);

const Stats = () => {
  const [orders, setOrders] = React.useState([]);
  const [riders, setRiders] = React.useState([]);

  const [loading, setLoading] = React.useState(true);

  const orderCount = orders.length;
  const orderTakeawayCount = orders.filter((order) => order.type === "takeaway").length;
  const orderDeliveryCount = orders.filter((order) => order.type === "delivery").length;

  const orderAmountSum = orders.reduce((acc, order) => {
    return acc + order.order.total;
  }, 0);

  const orderDeliveryAmountSum = orders.reduce((acc, order) => {
    if (order.type !== "delivery") return acc;
    return acc + order.order.total;
  }, 0);

  const orderTakeawayAmountSum = orders.reduce((acc, order) => {
    if (order.type !== "takeaway") return acc;
    return acc + order.order.total;
  }, 0);

  const orderCashSum = orders.reduce((acc, order) => {
    if (order.paymentMethod !== "cash") return acc;
    return acc + order.order.total;
  }, 0);

  const orderCardSum = orders.reduce((acc, order) => {
    if (order.paymentMethod === "cash") return acc;
    return acc + order.order.total;
  }, 0);

  const fetchOrders = async () => {
    await axios
      .get("https://esp-pos-backend.onrender.com/orders/current")
      .then((res) => {
        setOrders(res?.data?.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchRiders = async () => {
    await axios
      .get("https://esp-pos-backend.onrender.com/deliveryBoys")
      .then((res) => {
        setRiders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const startHour = 8;
  const endHour = 21;

  const intervalLabels = Array.from({ length: endHour - startHour }, (_, i) => {
    return `${startHour + i}:00`;
  });

  const takeawayOrderCountPerInterval = orders.reduce(
    (acc, order) => {
      const orderTime = new Date(parseInt(order.orderTime));
      const orderHour = orderTime.getHours();

      if (orderHour < startHour || orderHour >= endHour) return acc;

      const interval = orderHour - startHour;

      if (order.type === "takeaway") {
        acc[interval]++;
      }

      // acc[interval]++;

      return acc;
    },
    Array.from({ length: endHour - startHour }, () => 0)
  );

  const deliveryOrderCountPerInterval = orders.reduce(
    (acc, order) => {
      const orderTime = new Date(parseInt(order.orderTime));
      const orderHour = orderTime.getHours();

      if (orderHour < startHour || orderHour >= endHour) return acc;

      const interval = orderHour - startHour;

      if (order.type === "delivery") {
        acc[interval]++;
      }

      // acc[interval]++;

      return acc;
    },
    Array.from({ length: endHour - startHour }, () => 0)
  );

  // find delivery order amount sum per interval
  const deliveryOrderAmountSumPerInterval = orders.reduce(
    (acc, order) => {
      const orderTime = new Date(parseInt(order.orderTime));
      const orderHour = orderTime.getHours();

      if (orderHour < startHour || orderHour >= endHour) return acc;

      const interval = orderHour - startHour;

      if (order.type === "delivery") {
        acc[interval] += order.order.total;
      }

      return acc;
    },
    Array.from({ length: endHour - startHour }, () => 0)
  );

  // find takeaway order amount sum per interval
  const takeawayOrderAmountSumPerInterval = orders.reduce(
    (acc, order) => {
      const orderTime = new Date(parseInt(order.orderTime));
      const orderHour = orderTime.getHours();

      if (orderHour < startHour || orderHour >= endHour) return acc;

      const interval = orderHour - startHour;

      if (order.type === "takeaway") {
        acc[interval] += order.order.total;
      }

      return acc;
    },
    Array.from({ length: endHour - startHour }, () => 0)
  );

  const ordersPerHourData = {
    labels: intervalLabels,
    datasets: [
      {
        label: "Takeaway",
        data: takeawayOrderCountPerInterval,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        fill: "",
        pointStyle: "circle",
        pointHitRadius: 20,
        pointRadius: 2,
      },
      {
        label: "Delivery",
        data: deliveryOrderCountPerInterval,
        borderColor: "rgb(99, 135, 255)",
        backgroundColor: "rgb(99, 135, 255)",
        fill: "",
        pointStyle: "circle",
        pointHitRadius: 20,
        pointRadius: 2,
      },
    ],
  };

  const moneySumPerHourData = {
    labels: intervalLabels,
    datasets: [
      {
        label: "Takeaway",
        data: takeawayOrderAmountSumPerInterval,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        fill: "",
        pointStyle: "circle",
        pointHitRadius: 20,
        pointRadius: 2,
      },
      {
        label: "Delivery",
        data: deliveryOrderAmountSumPerInterval,
        borderColor: "rgb(99, 135, 255)",
        backgroundColor: "rgb(99, 135, 255)",
        fill: "",
        pointStyle: "circle",
        pointHitRadius: 20,
        pointRadius: 2,
      },
    ],
  };

  //find all postal codes from orders
  const orderPostalCodes = orders.reduce((acc, order) => {
    if (!acc.includes(order.customer.postalCode)) {
      if (order.customer.postalCode) acc.push(order.customer.postalCode);
    }
    return acc;
  }, []);

  const orderCountPerPostalCode = orderPostalCodes.map((postalCode) => {
    return orders.filter((order) => order.customer.postalCode === postalCode).length;
  });

  // find the revenue per postalCode
  const orderAmountPerPostalCode = orderPostalCodes.map((postalCode) => {
    return orders
      .filter((order) => order.customer.postalCode === postalCode)
      .reduce((acc, order) => {
        return acc + order.order.total;
      }, 0);
  });

  console.log(orderAmountPerPostalCode);

  console.log(orderCountPerPostalCode);

  console.log(orderPostalCodes);

  const ordersPerPostalCodeData = {
    labels: orderPostalCodes,
    datasets: [
      {
        label: "Orders",
        data: orderCountPerPostalCode,
        backgroundColor: ["rgb(255, 99, 132)", "rgb(99, 135, 255)", "rgb(132, 255, 99)", "rgb(255, 132, 99)", "rgb(99, 255, 132)"],
      },
    ],
  };

  const revenuePerPostalCodeData = {
    labels: orderPostalCodes,
    datasets: [
      {
        label: "Revenue",
        data: orderAmountPerPostalCode,
        backgroundColor: ["rgb(255, 99, 132)", "rgb(99, 135, 255)", "rgb(132, 255, 99)", "rgb(255, 132, 99)", "rgb(99, 255, 132)"],
      },
    ],
  };

  // find how many unique riders are using the orders array and store their ids in an array
  const riderIds = orders.reduce((acc, order) => {
    if (!acc.includes(order.deliveryBoy)) {
      if (order.deliveryBoy) acc.push(order.deliveryBoy);
    }
    return acc;
  }, []);

  // using the same index as ridersIds map each riderId to the name of the rider found in rider state array
  const riderNames = riderIds.map((riderId) => {
    return riders.find((rider) => rider._id === riderId)?.name;
  });

  console.log(riderNames);

  // using riderIds array, create an array of objects with rider id and order count
  const ordersPerRider = riderIds.map((riderId) => {
    return orders.filter((order) => order.deliveryBoy === riderId).length;
  });

  const ordersPerRiderAmount = riderIds.map((riderId) => {
    return orders
      .filter((order) => order.deliveryBoy === riderId)
      .reduce((acc, order) => {
        return acc + order.order.total;
      }, 0);
  });

  console.log(ordersPerRider);

  console.log(riderIds);

  const ordersPerRiderData = {
    labels: riderNames,
    datasets: [
      {
        label: "Orders",
        data: ordersPerRider,
        backgroundColor: ["rgb(255, 99, 132)", "rgb(99, 135, 255)", "rgb(132, 255, 99)", "rgb(255, 132, 99)", "rgb(99, 255, 132)"],
        pointStyle: "circle",
        pointHitRadius: 20,
        pointRadius: 2,
      },
    ],
  };
  const ordersPerRiderAmountData = {
    labels: riderNames,
    datasets: [
      {
        label: "Revenue",
        data: ordersPerRiderAmount,
        // generate random colors for each rider
        backgroundColor: ["rgb(132, 255, 99)", "rgb(255, 132, 99)", "rgb(99, 255, 132)", "rgb(255, 99, 132)", "rgb(99, 135, 255)"],
        pointStyle: "circle",
        pointHitRadius: 20,
        pointRadius: 2,
      },
    ],
  };

  const cashPercentage = (orderCashSum / orderAmountSum) * 100;
  const cardPercentage = (orderCardSum / orderAmountSum) * 100;

  const paymentMethodComparisonData = {
    labels: ["Cash", "Card"],
    datasets: [
      {
        label: "Percentage",
        data: [cashPercentage, cardPercentage],
        // generate random colors for each rider
        backgroundColor: ["rgb(132, 255, 99)", "rgb(255, 132, 99)", "rgb(99, 255, 132)", "rgb(255, 99, 132)", "rgb(99, 135, 255)"],
        pointStyle: "circle",
        pointHitRadius: 20,
        pointRadius: 2,
      },
    ],
  };

  // find all unique order sources from orders array
  const orderSources = orders.reduce((acc, order) => {
    if (!acc.includes(order.source)) {
      if (order.source) acc.push(order.source);
    }
    return acc;
  }, []);

  console.log(orderSources);

  // find how many orders are from each source
  const orderCountPerSource = orderSources.map((source) => {
    return orders.filter((order) => order.source === source).length;
  });

  console.log(orderCountPerSource);

  const ordersPerSourceData = {
    labels: orderSources,
    datasets: [
      {
        label: "Orders",
        data: orderCountPerSource,
        backgroundColor: ["rgb(255, 99, 132)", "rgb(99, 135, 255)", "rgb(132, 255, 99)", "rgb(255, 132, 99)", "rgb(99, 255, 132)"],
      },
    ],
  };

  const ordersPerModeData = {
    labels: ["Takeaway", "Delivery"],
    datasets: [
      {
        label: "Orders",
        data: [orderTakeawayCount, orderDeliveryCount],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(99, 135, 255)"],
      },
    ],
  };

  // setLoading(false);

  useEffect(() => {
    fetchOrders();
    fetchRiders();
  }, []);

  return (
    <>
      {loading ? (
        <div className="w-100 h-75 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div style={{ overflowY: "scroll", maxHeight: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", overflowY: "scroll" }}>
            <BarChart width={"100%"} type="perc_value" totalAmount={orderAmountSum} showLegend={false} title={"Payment method comparison"} data={paymentMethodComparisonData} />
            {takeawayOrderCountPerInterval.length > 0 && deliveryOrderCountPerInterval.length > 0 && <LineChart title={"Orders per hour"} data={ordersPerHourData} />}
            {takeawayOrderCountPerInterval.length > 0 && deliveryOrderCountPerInterval.length > 0 && <LineChart type="currency" title={"Revenue per hour"} data={moneySumPerHourData} />}
            <BarChart width={"100%"} type="number" showLegend={false} title={"Orders per mode"} data={ordersPerModeData} />
            <div className="d-flex align-items-center justify-content-center">
              <BarChart width={"50%"} type="number" showLegend={false} title={"Orders per rider"} data={ordersPerRiderData} />
              <BarChart width={"50%"} type="currency" showLegend={false} title={"Revenue per rider"} data={ordersPerRiderAmountData} />
            </div>
            <BarChart width={"100%"} type="number" showLegend={false} title={"Orders per source"} data={ordersPerSourceData} />
            <div className="d-flex align-items-center justify-content-center">
              <BarChart width={"50%"} type="number" showLegend={false} title={"Orders per postal code"} data={ordersPerPostalCodeData} />
              <BarChart width={"50%"} type="currency" showLegend={false} title={"Revenue per postal code"} data={revenuePerPostalCodeData} />
            </div>
          </div>

          {/* <h2>Total orders: {orderCount}</h2>
      <h2>Takeaway orders: {orderTakeawayCount}</h2>
      <h2>Delivery orders: {orderDeliveryCount}</h2>
      <br />
      <h2>Total amount: {orderAmountSum.toFixed(2)}€</h2>
      <h2>Delivery amount: {orderDeliveryAmountSum.toFixed(2)}€</h2>
      <h2>Takeaway amount: {orderTakeawayAmountSum.toFixed(2)}€</h2>
      <br />
      <h2>Total cash: {orderCashSum.toFixed(2)}€</h2>
      <h2>Total card: {orderCardSum.toFixed(2)}€</h2> */}
          {/* <pre>{JSON.stringify(orders, 0, 4)}</pre> */}
        </div>
      )}
    </>
  );
};

export default Stats;
