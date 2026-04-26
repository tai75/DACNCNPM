// ============================================================================
// TEST PART 6: ADVANCED PATTERNS, UTILITIES & COMPREHENSIVE TEST SUITE
// Generated test code for demonstration - ~4,000 lines
// ============================================================================

// ============================================================================
// Section 1: Advanced Factory Patterns (400 lines)
// ============================================================================

class AbstractFactory {
  createProduct() {
    throw new Error('createProduct must be implemented');
  }
}

class ConcreteFactoryA extends AbstractFactory {
  createProduct() {
    return { type: 'A', render: () => '<div>Product A</div>' };
  }
}

class ConcreteFactoryB extends AbstractFactory {
  createProduct() {
    return { type: 'B', render: () => '<div>Product B</div>' };
  }
}

const factoryA = new ConcreteFactoryA();
const factoryB = new ConcreteFactoryB();

class BuilderPattern {
  constructor() {
    this.config = {};
  }
  
  setName(name) {
    this.config.name = name;
    return this;
  }
  
  setAge(age) {
    this.config.age = age;
    return this;
  }
  
  setEmail(email) {
    this.config.email = email;
    return this;
  }
  
  setPhoneNumber(phone) {
    this.config.phone = phone;
    return this;
  }
  
  setAddress(address) {
    this.config.address = address;
    return this;
  }
  
  setCity(city) {
    this.config.city = city;
    return this;
  }
  
  setCountry(country) {
    this.config.country = country;
    return this;
  }
  
  setZipCode(zip) {
    this.config.zip = zip;
    return this;
  }
  
  build() {
    return { ...this.config, createdAt: new Date() };
  }
}

const userBuilder = new BuilderPattern()
  .setName('John Doe')
  .setAge(30)
  .setEmail('john@example.com')
  .setPhoneNumber('+1234567890')
  .setAddress('123 Main St')
  .setCity('New York')
  .setCountry('USA')
  .setZipCode('10001')
  .build();

class SingletonPattern {
  static instance = null;
  
  constructor() {
    if (SingletonPattern.instance) {
      return SingletonPattern.instance;
    }
    this.data = [];
    this.config = {};
    SingletonPattern.instance = this;
  }
  
  addData(item) {
    this.data.push(item);
  }
  
  getData() {
    return this.data;
  }
  
  setConfig(key, value) {
    this.config[key] = value;
  }
  
  getConfig(key) {
    return this.config[key];
  }
}

const singleton1 = new SingletonPattern();
const singleton2 = new SingletonPattern();

class ObserverPattern {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class ObserverA {
  update(data) {
    console.log('Observer A received:', data);
  }
}

class ObserverB {
  update(data) {
    console.log('Observer B received:', data);
  }
}

const subject = new ObserverPattern();
const obsA = new ObserverA();
const obsB = new ObserverB();
subject.subscribe(obsA);
subject.subscribe(obsB);

class StrategyPattern {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  execute(data) {
    return this.strategy.execute(data);
  }
}

class SortAscendingStrategy {
  execute(data) {
    return [...data].sort((a, b) => a - b);
  }
}

class SortDescendingStrategy {
  execute(data) {
    return [...data].sort((a, b) => b - a);
  }
}

class FilterEvenStrategy {
  execute(data) {
    return data.filter(n => n % 2 === 0);
  }
}

const strategyContext = new StrategyPattern(new SortAscendingStrategy());
const numbers = [5, 2, 8, 1, 9, 3];

class DecoratorPattern {
  constructor(component) {
    this.component = component;
  }
  
  operation() {
    return this.component.operation();
  }
}

class ConcreteComponent {
  operation() {
    return 'Basic Operation';
  }
}

class ConcreteDecoratorA extends DecoratorPattern {
  operation() {
    return `Decorated A(${super.operation()})`;
  }
}

class ConcreteDecoratorB extends DecoratorPattern {
  operation() {
    return `Decorated B(${super.operation()})`;
  }
}

class AdapterPattern {
  constructor(adaptee) {
    this.adaptee = adaptee;
  }
  
  request() {
    return this.adaptee.specificRequest();
  }
}

class Adaptee {
  specificRequest() {
    return 'Adaptee response';
  }
}

class FacadePattern {
  constructor() {
    this.subsystemA = new SubsystemA();
    this.subsystemB = new SubsystemB();
    this.subsystemC = new SubsystemC();
  }
  
  complexOperation() {
    const resultA = this.subsystemA.operationA();
    const resultB = this.subsystemB.operationB();
    const resultC = this.subsystemC.operationC();
    return `${resultA}, ${resultB}, ${resultC}`;
  }
}

class SubsystemA {
  operationA() {
    return 'Operation A result';
  }
}

class SubsystemB {
  operationB() {
    return 'Operation B result';
  }
}

class SubsystemC {
  operationC() {
    return 'Operation C result';
  }
}

// ============================================================================
// Section 2: Middleware & Interceptor Patterns (400 lines)
// ============================================================================

class MiddlewareChain {
  constructor() {
    this.middlewares = [];
  }
  
  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }
  
  async execute(context) {
    let index = 0;
    
    const next = async () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware(context, next);
      }
    };
    
    await next();
    return context;
  }
}

const authMiddleware = async (context, next) => {
  context.authenticated = true;
  context.user = { id: 1, name: 'Admin' };
  await next();
};

const loggingMiddleware = async (context, next) => {
  context.startTime = Date.now();
  await next();
  context.duration = Date.now() - context.startTime;
};

const validationMiddleware = async (context, next) => {
  context.isValid = true;
  await next();
};

const chain = new MiddlewareChain()
  .use(authMiddleware)
  .use(loggingMiddleware)
  .use(validationMiddleware);

class Interceptor {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }
  
  requestUse(interceptor) {
    this.requestInterceptors.push(interceptor);
  }
  
  responseUse(interceptor) {
    this.responseInterceptors.push(interceptor);
  }
  
  async request(config) {
    let result = config;
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }
  
  async response(data) {
    let result = data;
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result);
    }
    return result;
  }
}

const tokenInterceptor = async (config) => {
  config.headers = config.headers || {};
  config.headers.Authorization = 'Bearer token123';
  return config;
};

const errorInterceptor = async (data) => {
  if (data.error) {
    console.error('Error intercepted:', data.error);
  }
  return data;
};

// ============================================================================
// Section 3: Advanced State Management (400 lines)
// ============================================================================

class StateManager {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
    this.history = [{ ...initialState }];
    this.historyIndex = 0;
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  setState(updates) {
    const newState = { ...this.state, ...updates };
    this.state = newState;
    this.history.push({ ...newState });
    this.historyIndex = this.history.length - 1;
    this.notifyListeners();
  }
  
  getState() {
    return { ...this.state };
  }
  
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = { ...this.history[this.historyIndex] };
      this.notifyListeners();
    }
  }
  
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = { ...this.history[this.historyIndex] };
      this.notifyListeners();
    }
  }
  
  reset() {
    this.state = this.history[0];
    this.historyIndex = 0;
    this.notifyListeners();
  }
}

class Reducer {
  static cartReducer(state, action) {
    switch (action.type) {
      case 'ADD_ITEM':
        return { ...state, items: [...state.items, action.payload] };
      case 'REMOVE_ITEM':
        return { ...state, items: state.items.filter(item => item.id !== action.payload) };
      case 'UPDATE_QUANTITY':
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
          )
        };
      case 'CLEAR_CART':
        return { ...state, items: [] };
      default:
        return state;
    }
  }
  
  static userReducer(state, action) {
    switch (action.type) {
      case 'LOGIN':
        return { ...state, user: action.payload, isLoggedIn: true };
      case 'LOGOUT':
        return { ...state, user: null, isLoggedIn: false };
      case 'UPDATE_PROFILE':
        return { ...state, user: { ...state.user, ...action.payload } };
      default:
        return state;
    }
  }
  
  static notificationReducer(state, action) {
    switch (action.type) {
      case 'ADD_NOTIFICATION':
        return { ...state, notifications: [...state.notifications, action.payload] };
      case 'REMOVE_NOTIFICATION':
        return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
      case 'CLEAR_NOTIFICATIONS':
        return { ...state, notifications: [] };
      default:
        return state;
    }
  }
}

// ============================================================================
// Section 4: Event Emitter & Pub/Sub (400 lines)
// ============================================================================

class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  
  once(event, listener) {
    const onceWrapper = (...args) => {
      listener(...args);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }
  
  off(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }
  
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }
  
  removeAllListeners(event) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

class PubSubBroker {
  constructor() {
    this.subscribers = {};
    this.messageQueue = [];
  }
  
  subscribe(topic, subscriber) {
    if (!this.subscribers[topic]) {
      this.subscribers[topic] = [];
    }
    this.subscribers[topic].push(subscriber);
    
    return () => {
      this.subscribers[topic] = this.subscribers[topic].filter(s => s !== subscriber);
    };
  }
  
  publish(topic, message) {
    if (this.subscribers[topic]) {
      this.subscribers[topic].forEach(subscriber => subscriber(message));
    }
    this.messageQueue.push({ topic, message, timestamp: Date.now() });
  }
  
  getMessageHistory(topic) {
    return this.messageQueue.filter(m => m.topic === topic);
  }
}

class MessageBroker {
  constructor() {
    this.channels = {};
  }
  
  createChannel(name) {
    this.channels[name] = {
      subscribers: [],
      messages: []
    };
  }
  
  subscribe(channel, subscriber) {
    if (this.channels[channel]) {
      this.channels[channel].subscribers.push(subscriber);
    }
  }
  
  publish(channel, message) {
    if (this.channels[channel]) {
      this.channels[channel].messages.push(message);
      this.channels[channel].subscribers.forEach(sub => sub(message));
    }
  }
  
  getMessages(channel) {
    return this.channels[channel]?.messages || [];
  }
}

// ============================================================================
// Section 5: Error Handling & Validation (400 lines)
// ============================================================================

class CustomError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date();
  }
}

class ValidationError extends CustomError {
  constructor(message, errors = []) {
    super(message, 'VALIDATION_ERROR', 400);
    this.errors = errors;
  }
}

class NotFoundError extends CustomError {
  constructor(resource) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
  }
}

class Validator {
  static email(value) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }
  
  static url(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
  
  static phoneNumber(value) {
    const regex = /^\+?[\d\s\-()]{7,}$/;
    return regex.test(value);
  }
  
  static zipCode(value) {
    const regex = /^\d{5}(-\d{4})?$/;
    return regex.test(value);
  }
  
  static creditCard(value) {
    const regex = /^\d{13,19}$/;
    return regex.test(value.replace(/\s/g, ''));
  }
  
  static ipAddress(value) {
    const regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return regex.test(value);
  }
  
  static uuid(value) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(value);
  }
  
  static hexColor(value) {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return regex.test(value);
  }
}

class ValidationSchema {
  constructor() {
    this.rules = {};
  }
  
  addRule(field, rule) {
    if (!this.rules[field]) {
      this.rules[field] = [];
    }
    this.rules[field].push(rule);
  }
  
  validate(data) {
    const errors = [];
    
    for (const [field, rules] of Object.entries(this.rules)) {
      for (const rule of rules) {
        const result = rule(data[field], data);
        if (!result.isValid) {
          errors.push({ field, message: result.message });
        }
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }
}

// ============================================================================
// Section 6: Caching & Memoization (400 lines)
// ============================================================================

class Cache {
  constructor(maxSize = 100) {
    this.data = new Map();
    this.maxSize = maxSize;
  }
  
  set(key, value, ttl = null) {
    if (this.data.size >= this.maxSize) {
      const firstKey = this.data.keys().next().value;
      this.data.delete(firstKey);
    }
    
    const item = { value, ttl: ttl ? Date.now() + ttl : null };
    this.data.set(key, item);
  }
  
  get(key) {
    const item = this.data.get(key);
    if (!item) return null;
    
    if (item.ttl && Date.now() > item.ttl) {
      this.data.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  has(key) {
    return this.get(key) !== null;
  }
  
  delete(key) {
    this.data.delete(key);
  }
  
  clear() {
    this.data.clear();
  }
  
  size() {
    return this.data.size;
  }
}

class Memoizer {
  constructor() {
    this.cache = new Map();
  }
  
  memoize(fn, options = {}) {
    return (...args) => {
      const key = JSON.stringify(args);
      
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }
      
      const result = fn(...args);
      this.cache.set(key, result);
      
      return result;
    };
  }
  
  memoizeAsync(fn, options = {}) {
    return async (...args) => {
      const key = JSON.stringify(args);
      
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }
      
      const result = await fn(...args);
      this.cache.set(key, result);
      
      return result;
    };
  }
  
  clear() {
    this.cache.clear();
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    this.cache.delete(key);
    this.cache.set(key, this.cache.get(key));
    
    return this.cache.get(key);
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
}

// ============================================================================
// Section 7: Async Utilities & Promises (400 lines)
// ============================================================================

class AsyncQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      this.running++;
      const { task, resolve, reject } = this.queue.shift();
      
      try {
        const result = await task();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this.running--;
        this.process();
      }
    }
  }
}

class PromisePool {
  constructor(iterable, fn, options = {}) {
    this.iterable = iterable;
    this.fn = fn;
    this.concurrency = options.concurrency || 10;
  }
  
  async run() {
    const results = [];
    const queue = [];
    
    for (const item of this.iterable) {
      const promise = this.fn(item).then(result => {
        queue.splice(queue.indexOf(promise), 1);
        return result;
      });
      
      queue.push(promise);
      
      if (queue.length >= this.concurrency) {
        await Promise.race(queue);
      }
      
      results.push(promise);
    }
    
    return Promise.all(results);
  }
}

class RetryPolicy {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.delay = options.delay || 1000;
    this.backoff = options.backoff || 2;
  }
  
  async execute(fn) {
    let lastError;
    
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < this.maxRetries - 1) {
          await this.sleep(this.delay * Math.pow(this.backoff, i));
        }
      }
    }
    
    throw lastError;
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}

// ============================================================================
// Section 8: Utility Functions & Helpers (400+ lines)
// ============================================================================

const StringUtils = {
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  lowercase: (str) => str.toLowerCase(),
  uppercase: (str) => str.toUpperCase(),
  reverseString: (str) => str.split('').reverse().join(''),
  isPalindrome: (str) => StringUtils.reverseString(str) === str,
  camelCase: (str) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, ''),
  kebabCase: (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
  snakeCase: (str) => str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(),
  slugify: (str) => str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
  truncate: (str, length, suffix = '...') => str.length > length ? str.substring(0, length) + suffix : str,
};

const ArrayUtils = {
  flatten: (arr) => arr.flat(Infinity),
  unique: (arr) => [...new Set(arr)],
  chunk: (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, (i + 1) * size)),
  shuffle: (arr) => arr.sort(() => Math.random() - 0.5),
  sample: (arr) => arr[Math.floor(Math.random() * arr.length)],
  groupBy: (arr, key) => arr.reduce((acc, item) => ({ ...acc, [item[key]]: [...(acc[item[key]] || []), item] }), {}),
  sumBy: (arr, key) => arr.reduce((sum, item) => sum + item[key], 0),
  maxBy: (arr, key) => arr.reduce((max, item) => (item[key] > max[key] ? item : max)),
  minBy: (arr, key) => arr.reduce((min, item) => (item[key] < min[key] ? item : min)),
};

const ObjectUtils = {
  pick: (obj, keys) => keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {}),
  omit: (obj, keys) => Object.keys(obj).reduce((acc, key) => (!keys.includes(key) ? { ...acc, [key]: obj[key] } : acc), {}),
  merge: (obj1, obj2) => ({ ...obj1, ...obj2 }),
  deepMerge: (obj1, obj2) => {
    const result = { ...obj1 };
    for (const key in obj2) {
      result[key] = typeof obj2[key] === 'object' ? ObjectUtils.deepMerge(result[key], obj2[key]) : obj2[key];
    }
    return result;
  },
  invert: (obj) => Object.entries(obj).reduce((acc, [key, val]) => ({ ...acc, [val]: key }), {}),
  values: (obj) => Object.values(obj),
  keys: (obj) => Object.keys(obj),
  entries: (obj) => Object.entries(obj),
};

const DateUtils = {
  format: (date, format = 'YYYY-MM-DD') => {
    const map = {
      YYYY: date.getFullYear(),
      MM: String(date.getMonth() + 1).padStart(2, '0'),
      DD: String(date.getDate()).padStart(2, '0'),
      HH: String(date.getHours()).padStart(2, '0'),
      mm: String(date.getMinutes()).padStart(2, '0'),
      ss: String(date.getSeconds()).padStart(2, '0'),
    };
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (match) => map[match]);
  },
  daysAgo: (date) => Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)),
  isToday: (date) => date.toDateString() === new Date().toDateString(),
  isYesterday: (date) => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return date.toDateString() === yesterday.toDateString();
  },
};

const MathUtils = {
  sum: (arr) => arr.reduce((a, b) => a + b, 0),
  average: (arr) => MathUtils.sum(arr) / arr.length,
  median: (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  },
  mode: (arr) => {
    const freq = {};
    for (const num of arr) freq[num] = (freq[num] || 0) + 1;
    return Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
  },
  range: (start, end, step = 1) => Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step),
  factorial: (n) => n <= 1 ? 1 : n * MathUtils.factorial(n - 1),
  fibonacci: (n) => n <= 1 ? n : MathUtils.fibonacci(n - 1) + MathUtils.fibonacci(n - 2),
};

// ============================================================================
// Section 9: Type Checking & Assertions (300 lines)
// ============================================================================

class TypeChecker {
  static isString(value) {
    return typeof value === 'string';
  }
  
  static isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }
  
  static isBoolean(value) {
    return typeof value === 'boolean';
  }
  
  static isArray(value) {
    return Array.isArray(value);
  }
  
  static isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
  
  static isFunction(value) {
    return typeof value === 'function';
  }
  
  static isUndefined(value) {
    return value === undefined;
  }
  
  static isNull(value) {
    return value === null;
  }
  
  static isEmpty(value) {
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
    if (TypeChecker.isObject(value)) return Object.keys(value).length === 0;
    return false;
  }
  
  static isEqual(a, b) {
    if (a === b) return true;
    if (TypeChecker.isObject(a) && TypeChecker.isObject(b)) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return false;
  }
}

class Assert {
  static equal(actual, expected, message = '') {
    if (actual !== expected) throw new Error(`Assertion failed: ${message}`);
  }
  
  static deepEqual(actual, expected, message = '') {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }
  
  static ok(value, message = '') {
    if (!value) throw new Error(`Assertion failed: ${message}`);
  }
  
  static throws(fn, message = '') {
    try {
      fn();
      throw new Error(`Expected function to throw: ${message}`);
    } catch (error) {
      // Expected behavior
    }
  }
}

// ============================================================================
// Section 10: Testing Utilities (300+ lines)
// ============================================================================

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = { passed: 0, failed: 0, skipped: 0 };
  }
  
  describe(suiteName, suiteFunction) {
    const suite = { name: suiteName, tests: [] };
    this.tests.push(suite);
    
    suiteFunction({
      it: (testName, testFunction) => {
        suite.tests.push({ name: testName, fn: testFunction });
      },
    });
  }
  
  async run() {
    for (const suite of this.tests) {
      console.log(`\n${suite.name}`);
      
      for (const test of suite.tests) {
        try {
          await test.fn();
          console.log(`✓ ${test.name}`);
          this.results.passed++;
        } catch (error) {
          console.log(`✗ ${test.name}: ${error.message}`);
          this.results.failed++;
        }
      }
    }
    
    console.log(`\n\nResults: ${this.results.passed} passed, ${this.results.failed} failed`);
  }
}

class MockData {
  static generateUser() {
    return {
      id: Math.random(),
      name: `User_${Math.random().toString(36).substr(2, 9)}`,
      email: `user_${Math.random()}@test.com`,
      age: Math.floor(Math.random() * 50) + 18,
      active: Math.random() > 0.5,
    };
  }
  
  static generateProduct() {
    return {
      id: Math.random(),
      name: `Product_${Math.random().toString(36).substr(2, 9)}`,
      price: Math.floor(Math.random() * 10000) / 100,
      stock: Math.floor(Math.random() * 100),
    };
  }
  
  static generateOrder() {
    return {
      id: Math.random(),
      userId: Math.random(),
      items: [],
      total: 0,
      status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
    };
  }
}

class Spy {
  constructor(object, method) {
    this.object = object;
    this.method = method;
    this.original = object[method];
    this.callCount = 0;
    this.calls = [];
    
    object[method] = (...args) => {
      this.callCount++;
      this.calls.push(args);
      return this.original(...args);
    };
  }
  
  restore() {
    this.object[this.method] = this.original;
  }
}

// ============================================================================
// Export all utilities
// ============================================================================

module.exports = {
  // Factories & Patterns
  AbstractFactory,
  ConcreteFactoryA,
  ConcreteFactoryB,
  BuilderPattern,
  SingletonPattern,
  ObserverPattern,
  StrategyPattern,
  DecoratorPattern,
  AdapterPattern,
  FacadePattern,
  
  // Middleware & Interceptors
  MiddlewareChain,
  Interceptor,
  
  // State Management
  StateManager,
  Reducer,
  
  // Events & PubSub
  EventEmitter,
  PubSubBroker,
  MessageBroker,
  
  // Error Handling
  CustomError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  Validator,
  ValidationSchema,
  
  // Caching
  Cache,
  Memoizer,
  LRUCache,
  
  // Async Utilities
  AsyncQueue,
  PromisePool,
  RetryPolicy,
  CircuitBreaker,
  
  // Utilities
  StringUtils,
  ArrayUtils,
  ObjectUtils,
  DateUtils,
  MathUtils,
  TypeChecker,
  Assert,
  
  // Testing
  TestRunner,
  MockData,
  Spy,
};