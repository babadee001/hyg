import { Pool } from 'pg'
import dotenv from 'dotenv'

const current_env = process.env.NODE_ENV || 'dev';
dotenv.config()
const config = {
  "dev": process.env.devDB,
  "test": process.env.testDB,
  "production": process.env.productionDB
}

const pool = new Pool({
  connectionString: config[current_env]
})
pool.connect()
.then(()=>console.log(`connected to ${current_env} DB`))
.catch((err)=>console.log(err))

export default pool;