import express from 'express';
import session from 'express-session';
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
import Axios from "axios";
// import db from './config/db.js';

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
app.use(cors({
    origin: 'http://localhost:4100',
    credentials: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 라우터 설정
app.use('/routes', route);
app.use(chatRoutes);
app.use(askRoute);

app.get('/api/auth/kakao', async (req, res) => {
    const code = req.query.code;
    try {
        // Access token 가져오기
        const tokenResponse = await Axios.post('https://kauth.kakao.com/oauth/token', {}, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            params: {
                grant_type: 'authorization_code',
                client_id: process.env.KAKAO_CLIENT_ID,
                code,
                redirect_uri: process.env.KAKAO_REDIRECT_URI
            }
        });

        // 사용자 정보 가져오기
        const userResponse = await Axios.post('https://kapi.kakao.com/v2/user/me', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${tokenResponse.data.access_token}`
            }
        });

        const userData = userResponse.data;
        const snsPrimaryKey = userData.id; // 카카오 사용자 ID
        const snsType = 'kakao'; // snsType은 항상 kakao로 설정
        const userName = userData.properties.nickname; // 카카오 사용자 닉네임
        const email = userData.user_email || null; // 카카오 이메일 (없으면 null)
        const gender = userData.user_gender || null; // 카카오 성별 (선택 사항)
        const birthday = userData.user_birthday || null; // 카카오 생일 (선택 사항)
        const nick = userData.user_nick ||null;

        // sign_id는 랜덤으로 생성 (예: UUID 또는 랜덤 문자열)
        const signId = `sign_${Math.random().toString(36).substr(2, 9)}`;

        // 카카오로 로그인한 사용자가 이미 데이터베이스에 존재하는지 확인
        const row = await db.sequelize.query(
           `SELECT * FROM users WHERE snsPrimaryKey=? AND snsType="kakao"`,
           { replacements: [snsPrimaryKey], type: db.Sequelize.QueryTypes.SELECT }
        );
        console.log('Row:', row);
        if (row.length > 0) {
            // 기존 사용자일 경우, session에 userId 저장
            req.session.userId = row[0].id;
            req.session.save((err) => {
                if (err) {
                    console.error('Session Save Error:', err);
                    return res.status(500).json({ message: 'Session save failed' });
                }
                res.redirect('http://localhost:4100'); // 로그인 후 리다이렉트
            });
        } else {
            // 새로운 사용자일 경우, 기본 정보만 저장
            await db.sequelize.query(
               `INSERT INTO users (sign_id, user_name, user_email, user_nick, user_gender, user_birthday, snsPrimaryKey, snsType)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
               {
                   replacements: [signId, userName, email, userName, gender, birthday, snsPrimaryKey, snsType],
                   type: db.Sequelize.QueryTypes.INSERT
               }
            );
            console.log('User added to database');
            res.status(200).json({ message: 'User added successfully' });
        }
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// user_nick 업데이트 처리
app.post('/api/user/nickname', async (req, res) => {
    const userId = req.session.userId; // 로그인한 사용자의 ID
    const { nickname } = req.body; // 사용자로부터 받은 닉네임

    if (!nickname) {
        return res.status(400).json({ message: 'Nickname is required' });
    }

    try {
        // 닉네임 업데이트
        await db.sequelize.query(
           `UPDATE users SET nickname = ? WHERE id = ?`,
           {
               replacements: [nickname, userId],
               type: db.Sequelize.QueryTypes.UPDATE
           }
        );
        res.status(200).json({ message: 'Nickname updated successfully' });
    } catch (error) {
        console.error('Error updating nickname:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Swagger 문서 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));


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
