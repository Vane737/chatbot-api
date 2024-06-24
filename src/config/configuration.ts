export default () => ({
    port: parseInt(process.env.PORT, 10) || 3002,
    database: {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      name: process.env.POSTGRES_DATABASE,
      ssl: process.env.POSTGRES_SSL === 'true',
      url: process.env.DATABASE_URL,
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    },
    supabase: {
      host: process.env.SUPABASE_HOST,
      port: parseInt(process.env.SUPABASE_PORT, 10) || 5432,
      username: process.env.SUPABASE_USERNAME,
      password: process.env.SUPABASE_PASSWORD,
      database: process.env.SUPABASE_DATABASE,
      key: process.env.SUPABASE_KEY,
      url: process.env.SUPABASE_URL,
    },
  });