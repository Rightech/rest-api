const { CODES, ApiError, NginxError, Client } = require("./dist/api");

function getClient({ url, token } = {}) {
  const baseUrl =
    url ||
    process.env["RIC_BASE_URL"] ||
    process.env["RIC_URL"] ||
    "https://dev.rightech.io/";

  return new Client({
    url: baseUrl,
    token: token || process.env["RIC_TOKEN"],
  });
}

const defaultClient = getClient();

Object.assign(defaultClient, {
  getClient,
  CODES,
  ApiError,
  NginxError,
  Client,
});

module.exports = defaultClient;
