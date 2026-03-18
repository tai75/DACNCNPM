const serviceController = require("../controllers/serviceController");

describe("Service Controller", () => {

  test("Thiếu name", () => {
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

  test("Thiếu price", () => {
    const req = {
      body: { name: "Cắt cây" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    serviceController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("Price không hợp lệ", () => {
    const req = {
      body: { name: "Cắt cây", price: -10 }
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