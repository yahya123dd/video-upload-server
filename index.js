const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send(\`
    <h2>رفع فيديو</h2>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="video" accept="video/*" required />
      <button type="submit">ارفع الفيديو</button>
    </form>
    <br/>
    <a href="/videos">شاهد كل الفيديوهات</a>
  \`);
});

app.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) return res.send('لم يتم رفع أي فيديو!');
  res.send('تم رفع الفيديو بنجاح! <a href="/">ارفع فيديو آخر</a> | <a href="/videos">شاهد الفيديوهات</a>');
});

app.get('/videos', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) return res.send('خطأ في قراءة الفيديوهات');

    let videosList = files.map(file => {
      return \`<video width="320" height="240" controls>
                <source src="/uploads/\${file}" type="video/mp4">
                متصفحك لا يدعم عرض الفيديو
              </video><br/><br/>\`;
    }).join('');

    res.send(\`
      <h2>جميع الفيديوهات المرفوعة</h2>
      \${videosList}
      <br/><a href="/">ارفع فيديو جديد</a>
    \`);
  });
});

app.listen(PORT, () => {
  console.log(\`السيرفر شغّال على http://localhost:\${PORT}\`);
});