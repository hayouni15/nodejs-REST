const { calculateTip } = require("../src/math");

test("should calculate total with tip", () => {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);
});

test("should calculate total with default tip", () => {
  const total = calculateTip(10);
  expect(total).toBe(12.5);
});
