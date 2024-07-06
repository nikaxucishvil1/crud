const express = require("express");
const app = express();
const fs = require("fs/promises");

app.use(express.json());

app.get("/api/products", async (req, res) => {
  const data = await fs.readFile("data.json", "utf-8");
  const parsedData = JSON.parse(data);
  res.json(parsedData);
});

app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const data = await fs.readFile("data.json", "utf-8");
  const parsedData = JSON.parse(data);
  const product = parsedData.find((el) => el.id == id);
  if (!product) {
    return res.json({ success: false, data: null });
  }
  return res.json(product);
});

app.post("/api/create", async (req, res) => {
  const { name, price } = req.body;
  const data = await fs.readFile("data.json", "utf-8");
  const parsedData = JSON.parse(data);
  const lastId = parsedData[parsedData.length - 1]?.id || 0;
  const newProduct = {
    id: lastId + 1,
    name,
    price,
  };
  parsedData.push(newProduct);
  await fs.writeFile("data.json", JSON.stringify(parsedData, null, 2));
  res.json({ success: true, message: "created successfully" });
});

app.delete("/api/delete/:id", async (req, res) => {
  const { id } = req.params;
  const data = await fs.readFile("data.json", "utf-8");
  const parsedData = JSON.parse(data);
  const index = parsedData.findIndex((el) => el.id === Number(id));
  if (index === -1) {
    return res.json({ success: false, message: "can't delete" });
  }
  const deletedProducts = parsedData.splice(index, 1);
  await fs.writeFile("data.json", JSON.stringify(parsedData, null, 2));
  return res.json(deletedProducts);
});

app.put("/api/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const data = await fs.readFile("data.json", "utf-8");
  const parsedData = JSON.parse(data);
  const index = parsedData.findIndex((el) => el.id === Number(id));
  if (index === -1) {
    return res.json({ success: false, message: "can't update" });
  }

  parsedData[index] = {
    ...parsedData[index],
    name,
    price,
  };
  await fs.writeFile("data.json", JSON.stringify(parsedData, null, 2));
  return res.json(parsedData[index]);
});

app.listen(3000, () => {
  console.log("server running on http://localhost:3000");
});
