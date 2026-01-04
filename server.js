const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // отвечаем на preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});


const DB_PATH = path.join(__dirname, "db.json");

/* ---------- GALLERY ---------- */
app.get("/gallery", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json([
    {
      url: "https://i.pinimg.com/236x/d3/fb/69/d3fb6973cddc1d875dc7c2e04525d2e7.jpg",
      title: "Тест 1",
    },
    {
      url: "https://i.pinimg.com/550x/a7/87/20/a78720c39a39ac50a2856420d636d113.jpg",
      title: "Тест 2",
    },
    {
      url: "https://i.pinimg.com/236x/71/9a/84/719a84fd80e49047407371ef9b3c224d.jpg",
      title: "Тест 3",
    },
    {
      url: "https://i.pinimg.com/236x/f4/dc/58/f4dc58f3bddf1c5b5249511820246df8.jpg",
      title: "Тест 4",
    },
    {
      url: "https://i.pinimg.com/236x/88/05/12/8805128eef83a0d8b724567611ddf7a1.jpg",
      title: "Тест 5",
    },
  ]);
});

/* ---------- TEMPERATURE ---------- */
app.post("/temperature", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { room, temperature } = req.body;

  if (!room || typeof temperature !== "number") {
    return res.status(400).json({ message: "Некорректные данные" });
  }

  let data = [];

  try {
    // если файла нет — создаём
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, "[]");
    }

    const file = fs.readFileSync(DB_PATH, "utf-8");
    data = JSON.parse(file);
  } catch (e) {
    // если файл битый — начинаем с нуля
    data = [];
  }

  data.push({
    room,
    temperature,
    createdAt: new Date().toISOString(),
  });

  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

  res.json({ message: "Температура сохранена" });
});

/* ---------- START ---------- */
app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
