const helmet = require("helmet");

const helmetConfig = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: "no-referrer" },
  xssFilter: true,
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true },
});

module.exports = helmetConfig;
