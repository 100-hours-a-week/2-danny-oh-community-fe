import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// form-data 및 x-www-form-urlencoded를 처리하도록 설정
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공을 위한 미들웨어 설정 (예: public 폴더 내 HTML 파일 제공)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
