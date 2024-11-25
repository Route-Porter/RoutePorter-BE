import express from 'express';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger/swagger-output.json' assert { type: 'json' };
import dotenv from 'dotenv';
import route from './src/routes/routeRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import askRoute from './src/routes/detailRoutes.js';
import multer from 'multer';
import Axios from "axios";
import cors from 'cors';
import db from './config/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

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
        console.log('Token Response:', tokenResponse.data); // 응답 로그 출력

        const userResponse = await Axios.post('https://kapi.kakao.com/v2/user/me', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                'Authorization': `Bearer ${tokenResponse.data.access_token}`
            }
        });

        console.log('User Data:', userResponse.data); // 사용자 데이터 로그 출력

        const userData = userResponse.data;
        const snsPrimaryKey = userData.id; // 카카오 사용자 ID
        const snsType = 'kakao'; // snsType은 항상 kakao로 설정
        const nickname = userData.properties.nickname; // 카카오 사용자 닉네임

        const row = (await db.query(`SELECT * FROM user WHERE snsPrimaryKey=? AND snsType="kakao"`, [snsPrimaryKey]))[0];

        // console.log(row);

        if (row.length>0) {
            // console.log("row가 있다고 판단");
            req.session.userId = row.id;
            req.session.save((err) => {
                if (err) {
                    console.error('Session Save Error:', err);
                    return res.status(500).json({ message: 'Session save failed' });
                }
                res.redirect('http://localhost:4100');
            });
        } else {
            try {
                await db.query(
                    `INSERT INTO user (snsPrimaryKey, snsType, nickname) VALUES (?, ?, ?)`,
                    [snsPrimaryKey, snsType, nickname]
                );
                console.log('User added to database');
                res.status(200).json({ message: 'User added successfully' });
            } catch (error) {
                console.error('DB Insert Error:', error);
                return res.status(500).json({ message: 'Database error occurred during user insertion' });
            }
        }
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Swagger 문서 설정
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
