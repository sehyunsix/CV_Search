const mysql = require('mysql2/promise');
const { defaultLogger: logger } = require('@utils/logger');

class MySqlService {
  constructor() {
    this.pool = null;
  }

  async connect() {
    if (this.pool) {
      return this.pool;
    }

    try {
      this.pool = mysql.createPool({
        uri: process.env.RDB_URL,
        user: process.env.RDB_USERNAME,
        password: process.env.RDB_PASSWORD,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // 연결 테스트
      const connection = await this.pool.getConnection();
      logger.info('MySQL 데이터베이스에 연결되었습니다.');
      connection.release();

      return this.pool;
    } catch (error) {
      logger.error('MySQL 연결 오류:', error);
      throw new Error('MySQL 데이터베이스 연결 실패');
    }
  }

  async query(sql, params) {
    try {
      await this.connect();
      const [results] = await this.pool.query(sql, params);
      return results;
    } catch (error) {
      logger.error('MySQL 쿼리 오류:', error);
      throw error;
    }
  }
}

const mysqlService = new MySqlService();
module.exports = { mysqlService };