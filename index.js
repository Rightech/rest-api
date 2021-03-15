const { CODES, ApiError, NginxError, Client } = require("./dist/api");

function resolveDefaultClient() {
  const baseUrl =
    process.env["RIC_BASE_URL"] ||
    process.env["RIC_URL"] ||
    "https://sandbox.rightech.io/";

  return new Client({
    url: baseUrl,
    token: process.env["RIC_TOKEN"],
  });
}

const defaultClient = resolveDefaultClient();

Object.assign(defaultClient, { CODES, ApiError, NginxError, Client });

module.exports = defaultClient;
