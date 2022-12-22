const sql = require('mssql/msnodesqlv8');

const sqlConfig = {
    server: 'PTHUAN-PC',
    database: 'DA_NMCNPM',
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
}

const Connection = new sql.ConnectionPool(sqlConfig);

export default Connection;