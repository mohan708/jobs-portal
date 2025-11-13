// Import with `import * as Sentry from "@sentry/node"` if you are using ESM

import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://57ef29bbe82280649542fce476a30f83@o4510357706309632.ingest.us.sentry.io/4510357718564864",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
//   integrations: [Sentry.mongooseIntegration()],

  sendDefaultPii: true,
});