import sql, { pool } from 'mssql/msnodesqlv8';

const sqlConfig = {
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PWD,
    database: 'DA_NMCNPM',
    server: 'NDMQLAPTOP\\SQLEXPRESS',
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
}

const Connection = new sql.ConnectionPool(sqlConfig);

export default Connection;