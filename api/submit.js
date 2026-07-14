// Serverless function: appends a survey submission to a JSON file in a
// (private) GitHub repo. The GitHub token is read from env, never exposed to the browser.
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    // Vercel usually parses JSON bodies automatically, but fall back to manual parse.
    let payload = req.body;
    if (!payload || typeof payload !== "object") {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      try { payload = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
      catch (_) { payload = null; }
    }
    if (!payload || !Array.isArray(payload.responses) || payload.responses.length === 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const token = process.env.GH_TOKEN;
    const repo = process.env.DATA_REPO || "blacksuperman772/pmesurvey-data";
    const filePath = "submissions/submissions.json";
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "pmesurvey",
      "Content-Type": "application/json",
    };

    // Read current file (if it exists)
    let arr = [];
    let sha;
    const cur = await fetch(apiUrl, { headers });
    if (cur.ok) {
      const j = await cur.json();
      sha = j.sha;
      try {
        const parsed = JSON.parse(Buffer.from(j.content, "base64").toString("utf8"));
        if (Array.isArray(parsed)) arr = parsed;
      } catch (_) { arr = []; }
    } else if (cur.status !== 404) {
      return res.status(502).json({ error: "Could not read store" });
    }

    const record = {
      id: "resp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8),
      submittedAt: new Date().toISOString(),
      biodata: payload.biodata || {},
      responses: payload.responses,
    };
    arr.push(record);

    const content = Buffer.from(JSON.stringify(arr, null, 2)).toString("base64");
    const body = { message: `New survey submission ${record.id}`, content };
    if (sha) body.sha = sha;

    const put = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    if (!put.ok) {
      const txt = await put.text();
      return res.status(502).json({ error: "Failed to store submission", detail: txt.slice(0, 300) });
    }
    return res.status(200).json({ ok: true, id: record.id });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
