import express from 'express';
import swaggerUi from 'swagger-ui-express';
//import swaggerFile from './swagger/swagger-output.json' assert { type: 'json' }; // require를 사용하여 JSON 파일 가져오기
import dotenv from 'dotenv';
const swaggerFile = require('./swagger/swagger-output.json');

// 이후 swaggerDocument를 사용하여 Swagger UI 설정 등 작업

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
// server setting - veiw, static, body-parser etc..
app.set('port', process.env.PORT || 3000)   // 서버 포트 지정
app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 라우터 설정
app.use('/api/routes', route);
app.use('/api',chatRoutes);
app.use('/api',askRoute);


app.get('/', (req, res, next) => {
    res.send(response(status.SUCCESS, "루트 페이지!"));
})

// Swagger 문서 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))


// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

