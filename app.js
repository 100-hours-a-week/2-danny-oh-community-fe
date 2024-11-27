import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// form-data 및 x-www-form-urlencoded를 처리하도록 설정
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/posts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'posts.html'));
});

app.get('/posting', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_post.html'));
});

app.get('/posts/:post_id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

app.get('/posts/:post_id/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit_post.html'));
});


app.get('/user/editProfile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit_profile.html'));
});

app.get('/user/editPassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit_pass.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
