// Serverless function: returns aggregate statistics (admin only).
// Basic-auth guarded by ADMIN_USER / ADMIN_PASS env vars.
module.exports = async (req, res) => {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Method not allowed" }); }
  const auth = req.headers["authorization"] || "";
  const expectedUser = process.env.ADMIN_USER || "Admin";
  const expectedPass = process.env.ADMIN_PASS || "Favors123";
  const m = auth.match(/^Basic\s+(.+)$/i);
  if (!m) { res.setHeader("WWW-Authenticate", 'Basic realm="Admin"'); return res.status(401).json({ error: "Unauthorized" }); }
  const decoded = Buffer.from(m[1], "base64").toString("utf8");
  const [u, p] = decoded.split(":");
  if (u !== expectedUser || p !== expectedPass) { res.setHeader("WWW-Authenticate", 'Basic realm="Admin"'); return res.status(401).json({ error: "Unauthorized" }); }
  try {
    const token = process.env.GH_TOKEN;
    const repo = process.env.DATA_REPO || "blacksuperman772/pmesurvey-data";
    const apiUrl = `https://api.github.com/repos/${repo}/contents/submissions/submissions.json`;
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "pmesurvey" };
    const cur = await fetch(apiUrl, { headers });
    if (cur.status === 404) return res.status(200).json({ total: 0, perQuestion: {}, biodata: {} });
    if (!cur.ok) return res.status(502).json({ error: "Could not read store" });
    const j = await cur.json();
    const arr = JSON.parse(Buffer.from(j.content, "base64").toString("utf8"));
    const perQuestion = {};
    const biodata = {};
    for (const rec of arr) {
      for (const r of (rec.responses || [])) {
        perQuestion[r.q] = perQuestion[r.q] || { 1:0,2:0,3:0,4:0,5:0 };
        if (perQuestion[r.q][r.value] != null) perQuestion[r.q][r.value]++;
      }
      for (const [k, v] of Object.entries(rec.biodata || {})) {
        biodata[k] = biodata[k] || {};
        biodata[k][v] = (biodata[k][v] || 0) + 1;
      }
    }
    return res.status(200).json({ total: arr.length, perQuestion, biodata });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
