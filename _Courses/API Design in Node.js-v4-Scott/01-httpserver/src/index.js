import http from "http";

const server = http.createServer((req, res) => {
  console.log(req);
  console.log(res);

  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.end("Hello, World!");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
