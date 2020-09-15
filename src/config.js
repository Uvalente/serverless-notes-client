const dev = {
  STRIPE_KEY: "pk_test_51HNJ4jAVpHqplV2EmMhgVIFHviiMunzY2IzADS9GLjcmvIZVzbiLEfjVsXRuqWuwVnqnLrkCgC0dR3NbnsjDwuZ1002ObykIRS",
  s3: {
    REGION: "eu-west-2",
    BUCKET: "notes-app-api-2-dev-serverlessdeploymentbucket-icdok3ulkyjq"
  },
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://hvc2bsuw6b.execute-api.eu-west-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_i5qq31c1L",
    APP_CLIENT_ID: "4n5um3vbt6fvt4dmaf736oj86l",
    IDENTITY_POOL_ID: "eu-west-2:b13a71f4-91ee-4f83-a27a-99b04cddbadb"
  }
};

const prod = {
  STRIPE_KEY: "pk_test_51HNJ4jAVpHqplV2EmMhgVIFHviiMunzY2IzADS9GLjcmvIZVzbiLEfjVsXRuqWuwVnqnLrkCgC0dR3NbnsjDwuZ1002ObykIRS",
  s3: {
    REGION: "eu-west-2",
    BUCKET: "notes-app-api-2-prod-serverlessdeploymentbucket-1w5ampjug02ij"
  },
  apiGateway: {
    REGION: "eu-west-2",
    URL: "https://stleq9fevg.execute-api.eu-west-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "eu-west-2",
    USER_POOL_ID: "eu-west-2_SOB2TWuUt",
    APP_CLIENT_ID: "7n3pfvbshel2clo7amg1fg9b0n",
    IDENTITY_POOL_ID: "eu-west-2:6ee1a17d-9569-4bec-b02a-1e0f0686f9a1"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};