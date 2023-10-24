import useFetch from "../hooks/useFetch";

const saveCalculator = (data, fetch) => {
  let request = fetch("/api/calculators/create-calculator", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log("create Calcualtor request made", data);
};

const listCalculators = async (fetch) => {
  let request = await fetch("/api/calculators")
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const getcalculator = async (id, fetch) => {
  let request = await fetch("/api/calculators/calculator?id=" + id)
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const getProducts = async (ids, fetch) => {
  let request = await fetch("/api/calculators/products?ids=" + ids)
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const createPrice = async (ids, fetch, options) => {
  let request = await fetch("/api/calculators/create-price", options)
    .then((res) => res.json())
    .then((data) => data);
  return request;
};
export {
  saveCalculator,
  listCalculators,
  getcalculator,
  getProducts,
  createPrice,
};
