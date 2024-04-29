const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/routes", async (req, res) => {
	const targetUrl = req.body.url;

	if (!targetUrl) {
		return res.status(400).json({ message: "URL parameter is required" });
	}

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(targetUrl, { waitUntil: "networkidle2" });

		const links = await page.evaluate(() => {
			return Array.from(document.querySelectorAll("a")).map((a) => a.href);
		});

		await browser.close();

		res.json({ message: "Found links:", links });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error fetching URL" });
	}
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
