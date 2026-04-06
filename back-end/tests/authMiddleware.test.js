jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const {
  authMiddleware,
  adminMiddleware,
  staffMiddleware,
  adminOrStaffMiddleware,
} = require("../middleware/auth");
=======
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware", () => {
  const originalJwtSecret = process.env.JWT_SECRET;
<<<<<<< HEAD
  const strongTestSecret = ["A", "b", "3", "!", "x".repeat(40)].join("");

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = strongTestSecret;
=======

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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

<<<<<<< HEAD
    expect(jwt.verify).toHaveBeenCalledWith("valid-token", strongTestSecret);
=======
    expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret");
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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
<<<<<<< HEAD

describe("staffMiddleware", () => {
  test("should return 403 for non-staff user", () => {
    const req = { user: { id: 1, role: "user" } };
    const res = createMockResponse();
    const next = jest.fn();

    staffMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Staff access required" })
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
      expect.objectContaining({ success: false, message: "Admin or staff access required" })
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
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
