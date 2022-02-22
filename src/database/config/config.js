require('dotenv').config()
module.exports = {
  
  "development": {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  use_env_variables: "mysql://cqxvh50z5e0acwaf:b9y5yz3tac2qif52@dcrhg4kh56j13bnu.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/hcudqlwlba0y5v4b"
  }

}