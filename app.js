// ดูแลการเชื่อมต่อกับ GitHub OAuth โดยใช้ Express.js และ Axios
// ใช้ dotenv เพื่อโหลดค่าต่าง ๆ จากไฟล์ .env
// ใช้ axios เพื่อทำการร้องขอ HTTP ไปยัง GitHub API
// ใช้ express เพื่อสร้างเซิร์ฟเวอร์และจัดการเส้นทางต่าง ๆ
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

const port = 3000;

// กำหนดค่าต่าง ๆ สำหรับการเชื่อมต่อกับ GitHub OAuth
// โดยใช้ client_id และ client_secret ที่ได้จากการสร้าง OAuth app ใน GitHub
// config จะเก็บ URL สำหรับการอนุญาตสิทธิ์, การขอ access token, และการดึงข้อมูลผู้ใช้
// รวมถึง client_id, client_secret และ scope ที่ต้องการ
const config = {
  github: {
    auth_url: "https://github.com/login/oauth/authorize",
    token_url: "https://github.com/login/oauth/access_token",
    user_url: "https://api.github.com/user",
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    scope: "read:user user:email",
  },
};

// สร้าง URL สำหรับพาผู้ใช้ไปหน้าอนุญาตสิทธิ์ของ GitHub ใส่พารามิเตอร์ต่าง ๆ เช่น client_id, redirect_uri, และ scope
// หน้าแรกของแอปพลิเคชันจะมีปุ่มให้ผู้ใช้คลิกเพื่อเข้าสู่ระบบด้วย GitHub
// เมื่อผู้ใช้คลิกปุ่ม จะถูกเปลี่ยนเส้นทางไปยังหน้าอนุญาตสิทธิ์ของ GitHub
// หลังจากผู้ใช้อนุญาตสิทธิ์แล้ว GitHub จะเปลี่ยนเส้นทางกลับมายัง URL ที่กำหนดใน redirect_uri พร้อมกับรหัสการอนุญาต (authorization code)
// แอปพลิเคชันจะใช้รหัสการอนุญาตนี้เพื่อขอ access token จาก GitHub
app.get("/", (req, res) => {
  const redirect = (provider) =>
    `${config[provider].auth_url}?client_id=${config[provider].client_id}&redirect_uri=http://localhost:3000/callback/${provider}&scope=${config[provider].scope}&response_type=code`;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login with GitHub</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 flex items-center justify-center h-screen">
      <div class="text-center bg-white p-10 rounded-2xl shadow-xl">
        <h1 class="text-2xl font-bold mb-6">Login with:</h1>
        <a href="${redirect(
          "github"
        )}" class="bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition">GitHub</a>
      </div>
    </body>
    </html>
  `);
});

// ใช้ tailwindcss เพื่อจัดรูปแบบหน้าเว็บ
// เมื่อผู้ใช้เข้าสู่ระบบสำเร็จ จะมีการแสดงข้อมูลผู้ใช้ที่ได้รับจาก GitHub API
// ข้อมูลนี้จะแสดงในรูปแบบ JSON เพื่อให้ผู้ใช้เห็นข้อมูลที่ได้รับจาก GitHub
// หากเกิดข้อผิดพลาดในระหว่างการเข้าสู่ระบบ จะมีการแสดงข้อความแสดงข้อผิดพลาด
// โดยใช้ res.status(500) เพื่อส่งสถานะ HTTP 500 (Internal Server Error) พร้อมกับข้อความแสดงข้อผิดพลาด
app.get("/callback/:provider", async (req, res) => {
  const provider = req.params.provider;
  const { code } = req.query;
  const conf = config[provider];

  if (!conf) return res.status(400).send("Unknown provider");

  try {
    let tokenRes;

    if (provider === "github") {
      tokenRes = await axios.post(
        conf.token_url,
        {
          code,
          client_id: conf.client_id,
          client_secret: conf.client_secret,
        },
        { headers: { accept: "application/json" } }
      );
    }

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get(conf.user_url, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login Success</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-green-50 flex items-center justify-center h-screen">
        <div class="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 class="text-xl font-semibold text-green-700 mb-4">Logged in with GITHUB ✅</h2>
          <pre class="text-sm bg-gray-100 p-4 rounded overflow-x-auto">${JSON.stringify(
            userRes.data,
            null,
            2
          )}</pre>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`Error during ${provider} login: ${err.message}`);
  }
});

// เริ่มต้นเซิร์ฟเวอร์ที่พอร์ต 3000 และแสดงข้อความในคอนโซลเมื่อเซิร์ฟเวอร์เริ่มทำงาน
// ข้อความนี้จะแจ้งให้ผู้ใช้ทราบว่าแอปพลิเคชันกำลังทำงานอยู่ที่ URL ใด
app.listen(port, () =>
  console.log(`OAuth app running at http://localhost:${port}`)
);
