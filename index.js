import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger/swagger-output.json' assert { type: 'json' };
import dotenv from 'dotenv';
import db from './models/index.js'; // Sequelize 인스턴스를 가져옵니다.
import { status } from './config/response.status.js';
import cors from 'cors';
import route from './src/routes/routeRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import askRoute from './src/routes/detailRoutes.js';
import { response } from './config/response.js';
import multer from 'multer';

dotenv.config();

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

// server setting - view, static, body-parser etc..
app.set('port', process.env.PORT || 3000); // 서버 포트 지정
app.use(cors()); // CORS 허용
app.use(express.static('public'));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger 문서 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 라우터 설정
app.use('/routes', route);
app.use('/', chatRoutes);
app.use('/', askRoute);

// 루트 페이지 핸들러
app.get('/', (req, res, next) => {
    res.send(response(status.SUCCESS, "루트 페이지!"));
});

// 데이터베이스 연결
db.sequelize.sync({ force: false }) // db.sequelize에서 sync 호출
  .then(() => {
    console.log('데이터 베이스 연결 성공');
  })
  .catch((err) => {
    console.log(err);
  });

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
