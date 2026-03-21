db = db.getSiblingDB("admin");

if (!db.getUser("untitled_admin")) {
  db.createUser({
    user: "untitled_admin",
    pwd: "password",
    roles: [{ role: "root", db: "admin" }],
  });
}
