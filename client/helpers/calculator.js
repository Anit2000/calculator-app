import useFetch from "../hooks/useFetch";

const saveCalculator = (data, fetch) => {
  let request = fetch("/api/calculators/create-calculator", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const updateCalculator = (data, fetch) => {
  let request = fetch("/api/calculators/update-calculator", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const listCalculators = async (fetch) => {
  let request = await fetch("/api/calculators")
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log(err));
  return request;
};

const countCalculator = async (fetch) => {
  let request = await fetch("/api/calculators/count")
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => console.log(err));
  return request;
};

const getcalculator = async (id, fetch) => {
  let request = await fetch("/api/calculators/calculator?id=" + id)
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const deletecalcluator = async (fetch, options) => {
  let request = await fetch("/api/calculators/delete", options)
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

const deletePrice = async (fetch, options) => {
  let request = await fetch("/api/calculators/delete-price", options)
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const getPricing = async (fetch) => {
  let request = await fetch("/api/calculators/pricing")
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const countPricing = async (fetch) => {
  let request = await fetch("/api/calculators/pricingcount")
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const getPrice = async (id, fetch) => {
  let request = await fetch("/api/calculators/price?id=" + id)
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const updatePrice = async (fetch, options) => {
  let request = await fetch("/api/calculators/update-price", options)
    .then((res) => res.json())
    .then((data) => data);
  return request;
};

const parseCsv = async (fetch, options) => {
  let request = await fetch("/api/calculators/parse-csv", options)
    .then((res) => res.json())
    .then((data) => data);
  return request;
};
export {
  saveCalculator,
  updateCalculator,
  listCalculators,
  getcalculator,
  getProducts,
  createPrice,
  getPricing,
  getPrice,
  updatePrice,
  parseCsv,
  countCalculator,
  countPricing,
  deletecalcluator,
  deletePrice,
};
