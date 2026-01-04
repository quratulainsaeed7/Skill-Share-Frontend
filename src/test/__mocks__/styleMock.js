// src/test/__mocks__/styleMock.js
// Mock for CSS module imports
module.exports = new Proxy(
    {},
    {
        get: function (target, key) {
            if (key === '__esModule') {
                return false;
            }
            return key;
        },
    }
);
