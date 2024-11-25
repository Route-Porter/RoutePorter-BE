import mysql from 'mysql2/promise'; // promise 기반 MySQL 클라이언트 사용
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// MySQL 연결 설정
const db = mysql.createPool({
   host: process.env.TEST_DB_HOST,         // .env에 설정한 값
   user: process.env.TEST_DB_USER,
   password: process.env.TEST_DB_PASSWORD,
   database: process.env.TEST_DB_NAME,
   waitForConnections: true,
   connectionLimit: 10,
   queueLimit: 0,
});

// 연결 테스트
(async () => {
   try {
      const connection = await mysql.createConnection({
         host: process.env.TEST_DB_HOST,
         user: process.env.TEST_DB_USER,
         password: process.env.TEST_DB_PASSWORD,
         database: process.env.TEST_DB_NAME
      });
      console.log("데이터베이스 연결 성공!");
      await connection.end(); // 연결 종료
   } catch (err) {
      console.error("데이터베이스 연결 실패:", err.message);
   }
})();

export default db;
