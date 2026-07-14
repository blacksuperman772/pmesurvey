// Serverless function: returns all survey submissions (admin only).
// Basic-auth guarded by ADMIN_USER / ADMIN_PASS env vars.
module.exports = async (req, res) => {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return res.status(405).json({ error: "Method not allowed" }); }
  const auth = req.headers["authorization"] || "";
  const expectedUser = process.env.ADMIN_USER || "Admin";
  const expectedPass = process.env.ADMIN_PASS || "Favors123";
  const m = auth.match(/^Basic\s+(.+)$/i);
  if (!m) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).json({ error: "Unauthorized" });
  }
  const decoded = Buffer.from(m[1], "base64").toString("utf8");
  const [u, p] = decoded.split(":");
  if (u !== expectedUser || p !== expectedPass) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const token = process.env.GH_TOKEN;
    const repo = process.env.DATA_REPO || "blacksuperman772/pmesurvey-data";
    const apiUrl = `https://api.github.com/repos/${repo}/contents/submissions/submissions.json`;
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "pmesurvey" };
    const cur = await fetch(apiUrl, { headers });
    if (cur.status === 404) return res.status(200).json([]);
    if (!cur.ok) return res.status(502).json({ error: "Could not read store" });
    const j = await cur.json();
    const arr = JSON.parse(Buffer.from(j.content, "base64").toString("utf8"));
    return res.status(200).json(Array.isArray(arr) ? arr : []);
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
};
