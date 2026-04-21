jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const {
  authMiddleware,
  adminMiddleware,
  staffMiddleware,
  adminOrStaffMiddleware,
} = require("../middleware/auth");

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware", () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  const strongTestSecret = ["A", "b", "3", "!", "x".repeat(40)].join("");

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = strongTestSecret;
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
      throw new Error("Token không hợp lệ");
    });

    const req = { headers: { authorization: "Bearer invalid-token" } };
    const res = createMockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Token không hợp lệ" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("should attach user and call next when token is valid", () => {
    jwt.verify.mockReturnValue({ id: 1, role: "user" });

    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = createMockResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", strongTestSecret);
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
      expect.objectContaining({ success: false, message: "Chỉ admin mới có quyền truy cập" })
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

describe("staffMiddleware", () => {
  test("should return 403 for non-staff user", () => {
    const req = { user: { id: 1, role: "user" } };
    const res = createMockResponse();
    const next = jest.fn();

    staffMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Chỉ nhân viên mới có quyền truy cập" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next for staff user", () => {
    const req = { user: { id: 2, role: "staff" } };
    const res = createMockResponse();
    const next = jest.fn();

    staffMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});

describe("adminOrStaffMiddleware", () => {
  test("should return 403 for normal user", () => {
    const req = { user: { id: 1, role: "user" } };
    const res = createMockResponse();
    const next = jest.fn();

    adminOrStaffMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Chỉ admin hoặc nhân viên mới có quyền truy cập" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next for admin", () => {
    const req = { user: { id: 1, role: "admin" } };
    const res = createMockResponse();
    const next = jest.fn();

    adminOrStaffMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should call next for staff", () => {
    const req = { user: { id: 2, role: "staff" } };
    const res = createMockResponse();
    const next = jest.fn();

    adminOrStaffMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
