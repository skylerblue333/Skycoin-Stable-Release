import http from "node:http";

const port = Number(process.env.PORT || 8090);
const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "zkml-verifier-adapter", mode: "fail-closed" }));
    return;
  }

  // Proof verification is deliberately fail-closed until a real audited verifier
  // is configured. Never report a proof as valid from this adapter.
  res.writeHead(501, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "ZKML verifier not configured" }));
});

server.listen(port, "0.0.0.0");
