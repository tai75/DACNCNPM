jest.mock("../config/db", () => ({
  query: jest.fn((sql, params, callback) => {
    if (typeof callback === "function") {
      callback(null, { insertId: 1 });
    }
  }),
}));

const serviceController = require("../controller/serviceController");

describe("Service Controller", () => {
  test("should return error for missing name", () => {
    const req = {
      body: { price: 100 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    serviceController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return error for missing price", () => {
    const req = {
      body: { name: "Test Service" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    serviceController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return error for invalid price", () => {
    const req = {
      body: { name: "Test Service", price: -100 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    serviceController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("Tên quá ngắn", () => {
    const req = {
      body: { name: "A", price: 100 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    serviceController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("Request hợp lệ", () => {
    const req = {
      body: { name: "Cắt tỉa cây", price: 100 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Không test DB thật → chỉ test logic validation
    serviceController.create(req, res);

    expect(res.status).not.toHaveBeenCalledWith(400);
  });
});