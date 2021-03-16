const { CODES, ApiError, NginxError, Client } = require("./dist/api");

function getClient() {
  const baseUrl =
    process.env["RIC_BASE_URL"] ||
    process.env["RIC_URL"] ||
    "https://sandbox.rightech.io/";

  return new Client({
    url: baseUrl,
    token: process.env["RIC_TOKEN"],
  });
}

const defaultClient = getClient();

Object.assign(defaultClient, { getClient, CODES, ApiError, NginxError, Client });

module.exports = defaultClient;
