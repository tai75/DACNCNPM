jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authController = require("../controller/authController");

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  const strongTestSecret = ["A", "b", "3", "!", "x".repeat(40)].join("");

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = strongTestSecret;
  });

  test("register should reject invalid payload", async () => {
    const req = {
      body: { email: "invalid-email", password: "123" },
    };
    const res = createMockResponse();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });

  test("register should reject duplicate email", async () => {
    const req = {
      body: {
        name: "User A",
        email: "usera@example.com",
        phone: "0912345678",
        password: "12345678",
      },
    };
    const res = createMockResponse();

    db.query.mockImplementationOnce((sql, params, callback) => {
      callback(null, [{ id: 1, email: "usera@example.com" }]);
    });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Email Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng" })
    );
  });

  test("register should hash password and insert user", async () => {
    const req = {
      body: {
        name: "User B",
        email: "userb@example.com",
        phone: "0912345679",
        password: "12345678",
      },
    };

    const done = new Promise((resolve) => {
      const res = createMockResponse();
      res.json = jest.fn((payload) => {
        expect(bcrypt.hash).toHaveBeenCalledWith("12345678", 10);
        expect(db.query).toHaveBeenNthCalledWith(
          2,
          "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
          ["User B", "userb@example.com", "0912345679", "hashed-password"],
          expect.any(Function)
        );
        expect(payload).toEqual({ success: true, message: "ÄÄƒng kÃ½ thÃ nh cÃ´ng" });
        resolve();
      });

      db.query
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, []);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { insertId: 2 });
        });

      bcrypt.hash.mockResolvedValue("hashed-password");
      authController.register(req, res);
    });

    await done;
  });

  test("login should return jwt token", async () => {
    const req = {
      body: {
        email: "user@example.com",
        password: "123456",
      },
    };

    const done = new Promise((resolve) => {
      const res = createMockResponse();
      res.json = jest.fn((payload) => {
        expect(jwt.sign).toHaveBeenCalledWith(
          { id: 1, role: "user" },
          strongTestSecret,
          { expiresIn: "7d" }
        );
        expect(payload).toEqual(
          expect.objectContaining({ success: true, token: "mock-jwt-token" })
        );
        resolve();
      });

      db.query.mockImplementationOnce((sql, params, callback) => {
        callback(null, [
          {
            id: 1,
            name: "User",
            email: "user@example.com",
            password: "hashed-password",
            role: "user",
          },
        ]);
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mock-jwt-token");

      authController.login(req, res);
    });

    await done;
  });

  test("login should reject wrong password", async () => {
    const req = {
      body: {
        email: "user@example.com",
        password: "wrong-password",
      },
    };
    const res = createMockResponse();

    db.query.mockImplementationOnce((sql, params, callback) => {
      callback(null, [
        {
          id: 1,
          email: "user@example.com",
          password: "hashed-password",
          role: "user",
        },
      ]);
    });

    bcrypt.compare.mockResolvedValue(false);
    authController.login(req, res);

    await new Promise((resolve) => setImmediate(resolve));

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
  });
});
