// ===== PART 1: MOCK DATA GENERATOR =====
// Generated code for testing - Part 1 of 5
// ~3,000 lines

class MockDataGenerator {
  generateUsers(count = 1000) {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        phone: `+84${Math.floor(Math.random() * 10000000000)}`,
        address: `${i + 1} Main St, City`,
        createdAt: new Date(2024, Math.random() * 12, Math.random() * 28),
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
        role: ['user', 'admin', 'moderator'][Math.floor(Math.random() * 3)],
        avatar: `avatar${i + 1}.jpg`,
        verified: Math.random() > 0.5,
        lastLogin: new Date(2024, Math.random() * 12, Math.random() * 28),
      });
    }
    return users;
  }

  generateProducts(count = 500) {
    const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Furniture'];
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push({
        id: `PRD${String(i + 1).padStart(5, '0')}`,
        name: `Product ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 10000) + 100,
        discountPrice: Math.floor(Math.random() * 8000) + 50,
        stock: Math.floor(Math.random() * 500),
        rating: (Math.random() * 5).toFixed(1),
        reviews: Math.floor(Math.random() * 500),
        description: `This is a great product number ${i + 1}`,
        image: `image${i + 1}.jpg`,
        tags: ['sale', 'new', 'popular', 'trending'][Math.floor(Math.random() * 4)],
        sku: `SKU${String(i + 1).padStart(6, '0')}`,
        weight: Math.random() * 10,
        dimensions: `${Math.random() * 50}x${Math.random() * 50}x${Math.random() * 50}`,
      });
    }
    return products;
  }

  generateOrders(count = 300) {
    const orders = [];
    for (let i = 0; i < count; i++) {
      orders.push({
        id: `ORD${String(i + 1).padStart(8, '0')}`,
        userId: Math.floor(Math.random() * 1000) + 1,
        items: Math.floor(Math.random() * 10) + 1,
        total: Math.floor(Math.random() * 100000) + 1000,
        tax: Math.floor(Math.random() * 5000),
        shipping: Math.floor(Math.random() * 3000),
        status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        createdAt: new Date(2024, Math.random() * 12, Math.random() * 28),
        updatedAt: new Date(2024, Math.random() * 12, Math.random() * 28),
        shippingAddress: `Address ${i + 1}`,
        paymentMethod: ['credit_card', 'debit_card', 'paypal', 'bank'][Math.floor(Math.random() * 4)],
        trackingNumber: `TRACK${String(i + 1).padStart(8, '0')}`,
        notes: `Order notes for order ${i + 1}`,
      });
    }
    return orders;
  }

  generateReviews(count = 200) {
    const reviews = [];
    for (let i = 0; i < count; i++) {
      reviews.push({
        id: i + 1,
        productId: `PRD${String(Math.floor(Math.random() * 500) + 1).padStart(5, '0')}`,
        userId: Math.floor(Math.random() * 1000) + 1,
        rating: Math.floor(Math.random() * 5) + 1,
        title: `Review Title ${i + 1}`,
        content: `This is review content for item ${i + 1}. It contains detailed information about the product.`,
        verified: Math.random() > 0.5,
        helpful: Math.floor(Math.random() * 100),
        createdAt: new Date(2024, Math.random() * 12, Math.random() * 28),
      });
    }
    return reviews;
  }

  generateCategories(count = 20) {
    const categories = [];
    for (let i = 0; i < count; i++) {
      categories.push({
        id: i + 1,
        name: `Category ${i + 1}`,
        slug: `category-${i + 1}`,
        description: `Description for category ${i + 1}`,
        image: `category${i + 1}.jpg`,
        parent: i > 5 ? Math.floor(Math.random() * 5) + 1 : null,
        isActive: Math.random() > 0.2,
      });
    }
    return categories;
  }

  generateBrands(count = 50) {
    const brands = [];
    for (let i = 0; i < count; i++) {
      brands.push({
        id: i + 1,
        name: `Brand ${i + 1}`,
        slug: `brand-${i + 1}`,
        logo: `logo${i + 1}.png`,
        description: `Brand ${i + 1} description`,
        website: `https://brand${i + 1}.com`,
        isActive: Math.random() > 0.1,
      });
    }
    return brands;
  }

  generatePaymentMethods(count = 10) {
    const methods = [];
    for (let i = 0; i < count; i++) {
      methods.push({
        id: i + 1,
        name: `Payment Method ${i + 1}`,
        type: ['credit_card', 'debit_card', 'wallet', 'bank_transfer'][i % 4],
        isActive: true,
        fee: Math.random() * 5,
      });
    }
    return methods;
  }

  generateShippingMethods(count = 5) {
    const methods = [];
    for (let i = 0; i < count; i++) {
      methods.push({
        id: i + 1,
        name: `Shipping ${i + 1}`,
        cost: (i + 1) * 25000,
        deliveryDays: (i + 1) * 2,
        isActive: true,
      });
    }
    return methods;
  }

  generateCoupons(count = 30) {
    const coupons = [];
    for (let i = 0; i < count; i++) {
      coupons.push({
        id: i + 1,
        code: `COUPON${String(i + 1).padStart(5, '0')}`,
        discount: Math.floor(Math.random() * 50) + 5,
        discountType: Math.random() > 0.5 ? 'percentage' : 'fixed',
        minAmount: Math.floor(Math.random() * 500000),
        maxUses: Math.floor(Math.random() * 100) + 10,
        currentUses: Math.floor(Math.random() * 50),
        expiryDate: new Date(2024, Math.random() * 12, Math.random() * 28),
        isActive: Math.random() > 0.2,
      });
    }
    return coupons;
  }

  generateNotifications(count = 100) {
    const notifications = [];
    for (let i = 0; i < count; i++) {
      notifications.push({
        id: i + 1,
        userId: Math.floor(Math.random() * 1000) + 1,
        type: ['order', 'promotion', 'system', 'message'][Math.floor(Math.random() * 4)],
        title: `Notification ${i + 1}`,
        message: `This is notification message ${i + 1}`,
        read: Math.random() > 0.3,
        createdAt: new Date(2024, Math.random() * 12, Math.random() * 28),
        actionUrl: `/notification/${i + 1}`,
      });
    }
    return notifications;
  }

  generateSessions(count = 50) {
    const sessions = [];
    for (let i = 0; i < count; i++) {
      sessions.push({
        id: i + 1,
        userId: Math.floor(Math.random() * 1000) + 1,
        token: `TOKEN${String(i + 1).padStart(10, '0')}`,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: `Mozilla/5.0 App ${i + 1}`,
        expiresAt: new Date(2024, Math.random() * 12, Math.random() * 28),
        createdAt: new Date(2024, Math.random() * 12, Math.random() * 28),
      });
    }
    return sessions;
  }

  generateActivityLogs(count = 500) {
    const logs = [];
    for (let i = 0; i < count; i++) {
      logs.push({
        id: i + 1,
        userId: Math.floor(Math.random() * 1000) + 1,
        action: ['login', 'logout', 'create', 'update', 'delete'][Math.floor(Math.random() * 5)],
        resource: `Resource${Math.floor(Math.random() * 10)}`,
        changes: { old: 'value', new: 'newvalue' },
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        timestamp: new Date(2024, Math.random() * 12, Math.random() * 28),
      });
    }
    return logs;
  }

  generateInventory(count = 300) {
    const inventory = [];
    for (let i = 0; i < count; i++) {
      inventory.push({
        id: i + 1,
        productId: `PRD${String(Math.floor(Math.random() * 500) + 1).padStart(5, '0')}`,
        warehouseId: Math.floor(Math.random() * 10) + 1,
        quantity: Math.floor(Math.random() * 1000),
        reserved: Math.floor(Math.random() * 100),
        lastRestocked: new Date(2024, Math.random() * 12, Math.random() * 28),
      });
    }
    return inventory;
  }
}

// Utility Functions for data manipulation
const DataUtilities = {
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  },

  sortBy: (array, key) => {
    return [...array].sort((a, b) => a[key] - b[key]);
  },

  filterBy: (array, key, value) => {
    return array.filter(item => item[key] === value);
  },

  mapBy: (array, key) => {
    return array.map(item => item[key]);
  },

  findBy: (array, key, value) => {
    return array.find(item => item[key] === value);
  },

  sumBy: (array, key) => {
    return array.reduce((sum, item) => sum + item[key], 0);
  },

  avgBy: (array, key) => {
    const sum = array.reduce((total, item) => total + item[key], 0);
    return sum / array.length;
  },

  countBy: (array, key) => {
    return array.reduce((count, item) => {
      count[item[key]] = (count[item[key]] || 0) + 1;
      return count;
    }, {});
  },

  uniqueBy: (array, key) => {
    return array.filter((item, index, self) => 
      index === self.findIndex(t => t[key] === item[key])
    );
  },

  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  flatten: (array) => {
    return array.reduce((flat, item) => {
      return flat.concat(Array.isArray(item) ? DataUtilities.flatten(item) : item);
    }, []);
  },

  reverse: (array) => {
    return [...array].reverse();
  },

  compact: (array) => {
    return array.filter(item => item != null);
  },

  zip: (...arrays) => {
    const maxLength = Math.max(...arrays.map(arr => arr.length));
    return Array.from({ length: maxLength }, (_, i) =>
      arrays.map(arr => arr[i])
    );
  },

  unzip: (array) => {
    return array[0].map((_, i) => array.map(row => row[i]));
  },

  intersection: (array1, array2) => {
    return array1.filter(item => array2.includes(item));
  },

  union: (array1, array2) => {
    return [...new Set([...array1, ...array2])];
  },

  difference: (array1, array2) => {
    return array1.filter(item => !array2.includes(item));
  },

  sample: (array) => {
    return array[Math.floor(Math.random() * array.length)];
  },

  shuffle: (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
};

// String Utilities
const StringUtilities = {
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  uppercase: (str) => str.toUpperCase(),
  lowercase: (str) => str.toLowerCase(),
  camelCase: (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    ).replace(/\s+/g, '');
  },
  snakeCase: (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`),
  kebabCase: (str) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`),
  pascalCase: (str) => str.replace(/(-|_|\.|\s)+(.)?/g, (_, __, c) => c ? c.toUpperCase() : ''),
  truncate: (str, length) => str.length > length ? str.substring(0, length) + '...' : str,
  pad: (str, length, char = ' ') => str.padStart(length, char),
  repeat: (str, times) => str.repeat(times),
  reverse: (str) => str.split('').reverse().join(''),
  contains: (str, substring) => str.includes(substring),
  startsWith: (str, prefix) => str.startsWith(prefix),
  endsWith: (str, suffix) => str.endsWith(suffix),
  split: (str, separator) => str.split(separator),
  join: (array, separator) => array.join(separator),
  trim: (str) => str.trim(),
  replace: (str, search, replace) => str.replace(new RegExp(search, 'g'), replace),
};

// Validation Utilities
const ValidationUtilities = {
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isPhone: (phone) => /^\+?[1-9]\d{1,14}$/.test(phone),
  isURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  isStrongPassword: (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    return hasUpper && hasLower && hasDigit && hasSpecial && password.length >= 8;
  },
  isInteger: (value) => Number.isInteger(value),
  isFloat: (value) => !Number.isInteger(value) && !isNaN(value),
  isPositive: (value) => value > 0,
  isNegative: (value) => value < 0,
  isZero: (value) => value === 0,
  isEmpty: (value) => {
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length === 0;
    return value == null;
  },
  isNull: (value) => value === null,
  isUndefined: (value) => value === undefined,
  isDefined: (value) => value !== undefined,
  isBoolean: (value) => typeof value === 'boolean',
  isString: (value) => typeof value === 'string',
  isNumber: (value) => typeof value === 'number',
  isObject: (value) => typeof value === 'object' && value !== null,
  isArray: (value) => Array.isArray(value),
  isFunction: (value) => typeof value === 'function',
};

// Format Utilities
const FormatUtilities = {
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  formatDate: (date, format = 'MM/DD/YYYY') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },

  formatTime: (date) => {
    return new Date(date).toLocaleTimeString('en-US');
  },

  formatBytes: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  formatNumber: (num, decimals = 0) => {
    return num.toFixed(decimals);
  },

  formatPercent: (value, total) => {
    return ((value / total) * 100).toFixed(2) + '%';
  },

  formatPhoneNumber: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  formatCreditCard: (cc) => {
    return cc.replace(/\d(?=\d{4})/g, '*');
  },

  formatJson: (obj) => {
    return JSON.stringify(obj, null, 2);
  },

  formatDuration: (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },
};

// Export all utilities
export {
  MockDataGenerator,
  DataUtilities,
  StringUtilities,
  ValidationUtilities,
  FormatUtilities,
};
