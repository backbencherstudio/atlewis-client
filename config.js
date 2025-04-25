import './envConfig.js'
 
export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
})