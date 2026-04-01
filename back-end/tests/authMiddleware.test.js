jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware", () => {
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  test("should return 401 when Authorization header is missing", () => {
    const req = { headers: {} };
    const res = createMockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 500 when JWT_SECRET is not configured", () => {
    delete process.env.JWT_SECRET;

    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = createMockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 403 when token is invalid", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    const req = { headers: { authorization: "Bearer invalid-token" } };
    const res = createMockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Invalid token" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("should attach user and call next when token is valid", () => {
    jwt.verify.mockReturnValue({ id: 1, role: "user" });

    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = createMockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
    expect(req.user).toEqual({ id: 1, role: "user" });
    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("adminMiddleware", () => {
  test("should return 403 for non-admin user", () => {
    const req = { user: { id: 1, role: "user" } };
    const res = createMockResponse();
    const next = jest.fn();

    adminMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Admin access required" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next for admin user", () => {
    const req = { user: { id: 1, role: "admin" } };
    const res = createMockResponse();
    const next = jest.fn();

    adminMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
