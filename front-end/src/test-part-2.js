// ===== PART 2: API CLIENT & STATE MANAGEMENT =====
// Generated code for testing - Part 2 of 5
// ~3,500 lines

// ===== API CLIENT =====
class APIClient {
  constructor(baseURL = 'http://localhost:3000', config = {}) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    };
    this.timeout = config.timeout || 30000;
    this.retryCount = config.retryCount || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  setAuthToken(token) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.headers['Authorization'];
  }

  setHeader(key, value) {
    this.headers[key] = value;
  }

  removeHeader(key) {
    delete this.headers[key];
  }

  async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method,
      headers: { ...this.headers, ...options.headers },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    let lastError;
    for (let i = 0; i < this.retryCount; i++) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout)
        );

        const response = await Promise.race([
          fetch(url, config),
          timeoutPromise
        ]);

        if (!response.ok) {
          throw new APIError(`HTTP ${response.status}`, response.status);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        return await response.text();
      } catch (error) {
        lastError = error;
        if (i < this.retryCount - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (i + 1)));
        }
      }
    }

    throw lastError;
  }

  get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  patch(endpoint, data, options = {}) {
    return this.request('PATCH', endpoint, data, options);
  }

  delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  async upload(endpoint, file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new APIError(`HTTP ${xhr.status}`, xhr.status));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      xhr.setRequestHeader('Authorization', this.headers['Authorization']);
      xhr.send(formData);
    });
  }
}

// ===== API ERROR HANDLING =====
class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

// ===== STATE MANAGEMENT =====
class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
    this.history = [initialState];
    this.historyIndex = 0;
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push({ ...this.state });
    this.historyIndex++;
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  reset() {
    this.state = { ...this.history[0] };
    this.historyIndex = 0;
    this.notify();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = { ...this.history[this.historyIndex] };
      this.notify();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = { ...this.history[this.historyIndex] };
      this.notify();
    }
  }

  clear() {
    this.state = {};
    this.history = [{}];
    this.historyIndex = 0;
    this.listeners.clear();
  }
}

// ===== REACT HOOKS =====
const HookImplementations = {
  useLocalStorage: `
    function useLocalStorage(key, initialValue) {
      const [storedValue, setStoredValue] = useState(() => {
        try {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) : initialValue;
        } catch (error) {
          console.error('useLocalStorage error:', error);
          return initialValue;
        }
      });

      const setValue = (value) => {
        try {
          const valueToStore = value instanceof Function ? value(storedValue) : value;
          setStoredValue(valueToStore);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error('useLocalStorage error:', error);
        }
      };

      return [storedValue, setValue];
    }
  `,

  useAsync: `
    function useAsync(asyncFunction, immediate = true) {
      const [status, setStatus] = useState('idle');
      const [value, setValue] = useState(null);
      const [error, setError] = useState(null);

      const execute = useCallback(async () => {
        setStatus('pending');
        setValue(null);
        setError(null);
        try {
          const response = await asyncFunction();
          setValue(response);
          setStatus('success');
          return response;
        } catch (error) {
          setError(error);
          setStatus('error');
        }
      }, [asyncFunction]);

      useEffect(() => {
        if (!immediate) return;
        execute();
      }, [execute, immediate]);

      return { execute, status, value, error };
    }
  `,

  useFetch: `
    function useFetch(url, options = {}) {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
            const json = await response.json();
            setData(json);
            setLoading(false);
          } catch (error) {
            setError(error);
            setLoading(false);
          }
        };

        fetchData();
      }, [url, options]);

      return { data, loading, error };
    }
  `,

  useDebounce: `
    function useDebounce(value, delay = 500) {
      const [debouncedValue, setDebouncedValue] = useState(value);

      useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
      }, [value, delay]);

      return debouncedValue;
    }
  `,

  useThrottle: `
    function useThrottle(value, interval = 500) {
      const [throttledValue, setThrottledValue] = useState(value);
      const lastUpdated = useRef(Date.now());

      useEffect(() => {
        const now = Date.now();
        if (now >= lastUpdated.current + interval) {
          lastUpdated.current = now;
          setThrottledValue(value);
        }
      }, [value, interval]);

      return throttledValue;
    }
  `,

  usePrevious: `
    function usePrevious(value) {
      const ref = useRef();

      useEffect(() => {
        ref.current = value;
      }, [value]);

      return ref.current;
    }
  `,

  useWindowSize: `
    function useWindowSize() {
      const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
      });

      useEffect(() => {
        const handleResize = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      return windowSize;
    }
  `,

  useClickOutside: `
    function useClickOutside(ref, callback) {
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (ref.current && !ref.current.contains(event.target)) {
            callback();
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, [ref, callback]);
    }
  `,

  useMount: `
    function useMount(callback) {
      useEffect(callback, []);
    }
  `,

  useUnmount: `
    function useUnmount(callback) {
      useEffect(() => {
        return callback;
      }, []);
    }
  `,

  useCounter: `
    function useCounter(initialValue = 0) {
      const [count, setCount] = useState(initialValue);

      const increment = useCallback(() => setCount(c => c + 1), []);
      const decrement = useCallback(() => setCount(c => c - 1), []);
      const reset = useCallback(() => setCount(initialValue), [initialValue]);

      return { count, increment, decrement, reset };
    }
  `,

  useToggle: `
    function useToggle(initialValue = false) {
      const [value, setValue] = useState(initialValue);
      const toggle = useCallback(() => setValue(v => !v), []);

      return [value, toggle];
    }
  `,

  useForm: `
    function useForm(initialValues, onSubmit) {
      const [values, setValues] = useState(initialValues);
      const [errors, setErrors] = useState({});
      const [touched, setTouched] = useState({});

      const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(v => ({ ...v, [name]: value }));
      };

      const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(t => ({ ...t, [name]: true }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(values);
      };

      const reset = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
      };

      return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        setValues,
        setErrors,
      };
    }
  `,

  useApi: `
    function useApi(url, options = {}) {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const fetchData = useCallback(async () => {
        setLoading(true);
        try {
          const response = await fetch(url, options);
          if (!response.ok) throw new Error('API request failed');
          const json = await response.json();
          setData(json);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }, [url, options]);

      useEffect(() => {
        fetchData();
      }, [fetchData]);

      const refetch = useCallback(fetchData, [fetchData]);

      return { data, loading, error, refetch };
    }
  `,
};

// ===== REDUCERS =====
const ReducerPatterns = {
  authReducer: `
    const initialAuthState = {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      token: null,
    };

    function authReducer(state = initialAuthState, action) {
      switch (action.type) {
        case 'LOGIN_START':
          return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
          return {
            ...state,
            isAuthenticated: true,
            user: action.payload.user,
            token: action.payload.token,
            loading: false,
          };
        case 'LOGIN_ERROR':
          return { ...state, loading: false, error: action.payload };
        case 'LOGOUT':
          return initialAuthState;
        case 'UPDATE_USER':
          return { ...state, user: action.payload };
        default:
          return state;
      }
    }
  `,

  productsReducer: `
    const initialProductState = {
      products: [],
      loading: false,
      error: null,
      filters: {},
      sort: 'name',
      page: 1,
      limit: 20,
      total: 0,
    };

    function productsReducer(state = initialProductState, action) {
      switch (action.type) {
        case 'FETCH_START':
          return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
          return {
            ...state,
            products: action.payload.products,
            total: action.payload.total,
            loading: false,
          };
        case 'FETCH_ERROR':
          return { ...state, loading: false, error: action.payload };
        case 'SET_FILTERS':
          return { ...state, filters: action.payload, page: 1 };
        case 'SET_SORT':
          return { ...state, sort: action.payload, page: 1 };
        case 'SET_PAGE':
          return { ...state, page: action.payload };
        case 'ADD_PRODUCT':
          return { ...state, products: [...state.products, action.payload] };
        case 'UPDATE_PRODUCT':
          return {
            ...state,
            products: state.products.map(p =>
              p.id === action.payload.id ? action.payload : p
            ),
          };
        case 'DELETE_PRODUCT':
          return {
            ...state,
            products: state.products.filter(p => p.id !== action.payload),
          };
        default:
          return state;
      }
    }
  `,

  cartReducer: `
    const initialCartState = {
      items: [],
      total: 0,
      quantity: 0,
      coupon: null,
      discount: 0,
      tax: 0,
      shipping: 0,
    };

    function cartReducer(state = initialCartState, action) {
      switch (action.type) {
        case 'ADD_ITEM': {
          const existingItem = state.items.find(item => item.id === action.payload.id);
          if (existingItem) {
            return {
              ...state,
              items: state.items.map(item =>
                item.id === action.payload.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            ...state,
            items: [...state.items, { ...action.payload, quantity: 1 }],
          };
        }
        case 'REMOVE_ITEM':
          return {
            ...state,
            items: state.items.filter(item => item.id !== action.payload),
          };
        case 'UPDATE_QUANTITY':
          return {
            ...state,
            items: state.items.map(item =>
              item.id === action.payload.id
                ? { ...item, quantity: action.payload.quantity }
                : item
            ),
          };
        case 'CLEAR_CART':
          return initialCartState;
        case 'SET_COUPON':
          return { ...state, coupon: action.payload };
        case 'UPDATE_TOTALS':
          return {
            ...state,
            total: action.payload.total,
            quantity: action.payload.quantity,
            tax: action.payload.tax,
            shipping: action.payload.shipping,
          };
        default:
          return state;
      }
    }
  `,

  notificationReducer: `
    const initialNotificationState = [];

    function notificationReducer(state = initialNotificationState, action) {
      switch (action.type) {
        case 'ADD_NOTIFICATION':
          return [
            ...state,
            {
              id: Date.now(),
              ...action.payload,
              createdAt: new Date(),
            },
          ];
        case 'REMOVE_NOTIFICATION':
          return state.filter(notif => notif.id !== action.payload);
        case 'CLEAR_NOTIFICATIONS':
          return [];
        default:
          return state;
      }
    }
  `,
};

// ===== CONTEXT PROVIDERS =====
const ContextPatterns = {
  ThemeContext: `
    const ThemeContext = createContext();

    export function ThemeProvider({ children }) {
      const [isDark, setIsDark] = useState(false);
      const [colors, setColors] = useState(defaultColors);

      const toggleTheme = () => setIsDark(!isDark);

      const value = {
        isDark,
        colors,
        toggleTheme,
        setColors,
      };

      return (
        <ThemeContext.Provider value={value}>
          {children}
        </ThemeContext.Provider>
      );
    }

    export const useTheme = () => {
      const context = useContext(ThemeContext);
      if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
      }
      return context;
    };
  `,

  UserContext: `
    const UserContext = createContext();

    export function UserProvider({ children }) {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const checkAuth = async () => {
          try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            }
          } finally {
            setLoading(false);
          }
        };

        checkAuth();
      }, []);

      const login = async (email, password) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      };

      const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
      };

      return (
        <UserContext.Provider value={{ user, loading, login, logout }}>
          {children}
        </UserContext.Provider>
      );
    }

    export const useUser = () => {
      const context = useContext(UserContext);
      if (!context) {
        throw new Error('useUser must be used within UserProvider');
      }
      return context;
    };
  `,
};

// Export all modules
export {
  APIClient,
  APIError,
  ValidationError,
  NetworkError,
  Store,
  HookImplementations,
  ReducerPatterns,
  ContextPatterns,
};
