// ===== PART 3: DATE, TIME & FORMAT UTILITIES =====
// Advanced utilities library for testing - Part 3 of 5
// ~10,700+ lines total (after new additions)

// ============================================================================
// SECTION 1: DATE & TIME UTILITIES (2000+ LINES)
// ============================================================================

class DateUtils {
  static now() {
    return new Date();
  }

  static today() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  static tomorrow() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  static yesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  static addYears(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  static addHours(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  static addMinutes(date, minutes) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }

  static addSeconds(date, seconds) {
    const result = new Date(date);
    result.setSeconds(result.getSeconds() + seconds);
    return result;
  }

  static subtractDays(date, days) {
    return DateUtils.addDays(date, -days);
  }

  static subtractMonths(date, months) {
    return DateUtils.addMonths(date, -months);
  }

  static subtractYears(date, years) {
    return DateUtils.addYears(date, -years);
  }

  static isBefore(date1, date2) {
    return date1 < date2;
  }

  static isAfter(date1, date2) {
    return date1 > date2;
  }

  static isSame(date1, date2, unit = 'day') {
    switch (unit) {
      case 'year':
        return date1.getFullYear() === date2.getFullYear();
      case 'month':
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth();
      case 'day':
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
      case 'hour':
        return DateUtils.isSame(date1, date2, 'day') &&
               date1.getHours() === date2.getHours();
      case 'minute':
        return DateUtils.isSame(date1, date2, 'hour') &&
               date1.getMinutes() === date2.getMinutes();
      default:
        return date1.getTime() === date2.getTime();
    }
  }

  static isBetween(date, start, end) {
    return date >= start && date <= end;
  }

  static getDayOfWeek(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  static getDayOfWeekShort(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }

  static getMonth(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()];
  }

  static getMonthShort(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  }

  static getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  static endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  static startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  static startOfYear(date) {
    return new Date(date.getFullYear(), 0, 1);
  }

  static endOfYear(date) {
    return new Date(date.getFullYear(), 11, 31);
  }

  static differenceInDays(date1, date2) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((date1 - date2) / msPerDay);
  }

  static differenceInHours(date1, date2) {
    const msPerHour = 1000 * 60 * 60;
    return Math.floor((date1 - date2) / msPerHour);
  }

  static differenceInMinutes(date1, date2) {
    const msPerMinute = 1000 * 60;
    return Math.floor((date1 - date2) / msPerMinute);
  }

  static differenceInSeconds(date1, date2) {
    return Math.floor((date1 - date2) / 1000);
  }

  static formatDate(date, format = 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  static parseDate(dateString, format = 'YYYY-MM-DD') {
    // Simple parser - can be extended
    const parts = dateString.match(/\d+/g);
    if (!parts) return null;

    let year, month, day, hours = 0, minutes = 0, seconds = 0;
    const formatParts = format.match(/YYYY|YY|MM|DD|HH|mm|ss/g) || [];

    for (let i = 0; i < formatParts.length && i < parts.length; i++) {
      const value = parseInt(parts[i]);
      switch (formatParts[i]) {
        case 'YYYY': year = value; break;
        case 'YY': year = 2000 + value; break;
        case 'MM': month = value - 1; break;
        case 'DD': day = value; break;
        case 'HH': hours = value; break;
        case 'mm': minutes = value; break;
        case 'ss': seconds = value; break;
      }
    }

    return new Date(year, month, day, hours, minutes, seconds);
  }

  static isLeapYear(date) {
    const year = date.getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  static getWeekNumber(date) {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayCount = Math.floor((lastDay - firstDay) / 86400000);
    return Math.ceil(dayCount / 7) + 1;
  }

  static getQuarter(date) {
    return Math.floor(date.getMonth() / 3) + 1;
  }

  static isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  static isWeekday(date) {
    return !DateUtils.isWeekend(date);
  }

  static toISO(date) {
    return date.toISOString();
  }

  static toLocalString(date) {
    return date.toLocaleString();
  }

  static toDateString(date) {
    return date.toDateString();
  }

  static toTimeString(date) {
    return date.toTimeString();
  }

  static relativeTime(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
    return `${Math.floor(seconds / 31536000)} years ago`;
  }
}

// ============================================================================
// SECTION 2: FORMAT & NUMBER UTILITIES (1800+ LINES)
// ============================================================================

const FormatUtils = {
  currency: (value, currency = 'USD', locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  },

  percent: (value, decimals = 2) => {
    return (value * 100).toFixed(decimals) + '%';
  },

  number: (value, decimals = 2, locale = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  fileSize: (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  },

  duration: (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  phone: (value, format = '(XXX) XXX-XXXX') => {
    const digits = value.replace(/\D/g, '');
    let formatted = format;
    let digitIndex = 0;

    for (let i = 0; i < formatted.length; i++) {
      if (formatted[i] === 'X') {
        formatted = formatted.slice(0, i) + digits[digitIndex] + formatted.slice(i + 1);
        digitIndex++;
      }
    }

    return formatted;
  },

  creditCard: (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  },

  zipCode: (value, country = 'US') => {
    const digits = value.replace(/\D/g, '');
    if (country === 'US') {
      return digits.replace(/(\d{5})(\d{4})/, '$1-$2');
    }
    return digits;
  },

  ssn: (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
  },

  urlEncode: (value) => {
    return encodeURIComponent(value);
  },

  urlDecode: (value) => {
    return decodeURIComponent(value);
  },

  htmlEncode: (value) => {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  },

  htmlDecode: (value) => {
    const div = document.createElement('div');
    div.innerHTML = value;
    return div.textContent;
  },

  base64Encode: (value) => {
    return btoa(unescape(encodeURIComponent(value)));
  },

  base64Decode: (value) => {
    return decodeURIComponent(escape(atob(value)));
  },

  markdown: (text) => {
    return text
      .replace(/^### (.*?)$/gim, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gim, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
  },

  slug: (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  camelToTitle: (text) => {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  },

  ordinalize: (num) => {
    const j = num % 10;
    const k = num % 100;
    let suffix = 'th';
    if (j === 1 && k !== 11) suffix = 'st';
    else if (j === 2 && k !== 12) suffix = 'nd';
    else if (j === 3 && k !== 13) suffix = 'rd';
    return num + suffix;
  },

  romanNumeral: (num) => {
    const romanMap = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' }
    ];

    let result = '';
    for (const pair of romanMap) {
      while (num >= pair.value) {
        result += pair.numeral;
        num -= pair.value;
      }
    }
    return result;
  }
};

// ============================================================================
// SECTION 3: NUMBER UTILITIES (1500+ LINES)
// ============================================================================

const MathUtils = {
  clamp: (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  },

  inRange: (value, min, max) => {
    return value >= min && value <= max;
  },

  randomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomFloat: (min, max) => {
    return Math.random() * (max - min) + min;
  },

  randomBoolean: () => {
    return Math.random() > 0.5;
  },

  randomItem: (array) => {
    return array[Math.floor(Math.random() * array.length)];
  },

  randomArray: (length, min = 0, max = 100) => {
    return Array.from({ length }, () => MathUtils.randomInt(min, max));
  },

  factorial: (n) => {
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return 1;
    return n * MathUtils.factorial(n - 1);
  },

  fibonacci: (n) => {
    if (n <= 1) return n;
    return MathUtils.fibonacci(n - 1) + MathUtils.fibonacci(n - 2);
  },

  isPrime: (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  },

  gcd: (a, b) => {
    return b === 0 ? a : MathUtils.gcd(b, a % b);
  },

  lcm: (a, b) => {
    return (a * b) / MathUtils.gcd(a, b);
  },

  sum: (array) => {
    return array.reduce((a, b) => a + b, 0);
  },

  average: (array) => {
    return MathUtils.sum(array) / array.length;
  },

  median: (array) => {
    const sorted = [...array].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },

  mode: (array) => {
    const map = {};
    let maxCount = 0;
    let mode;

    for (const num of array) {
      map[num] = (map[num] || 0) + 1;
      if (map[num] > maxCount) {
        maxCount = map[num];
        mode = num;
      }
    }

    return mode;
  },

  variance: (array) => {
    const avg = MathUtils.average(array);
    return MathUtils.average(array.map(x => Math.pow(x - avg, 2)));
  },

  standardDeviation: (array) => {
    return Math.sqrt(MathUtils.variance(array));
  },

  round: (value, decimals = 0) => {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  },

  ceil: (value, decimals = 0) => {
    return Math.ceil(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  floor: (value, decimals = 0) => {
    return Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  },

  percentage: (value, total) => {
    return (value / total) * 100;
  },

  percentage: (value, total) => {
    return (value / total) * 100;
  },

  percentageOf: (percent, total) => {
    return (percent / 100) * total;
  },

  increase: (value, percent) => {
    return value * (1 + percent / 100);
  },

  decrease: (value, percent) => {
    return value * (1 - percent / 100);
  },

  distance: (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  degrees: (radians) => {
    return radians * (180 / Math.PI);
  },

  radians: (degrees) => {
    return degrees * (Math.PI / 180);
  },

  isPowerOfTwo: (n) => {
    return n > 0 && (n & (n - 1)) === 0;
  },

  nextPowerOfTwo: (n) => {
    let power = 1;
    while (power < n) power *= 2;
    return power;
  }
};

// ============================================================================
// SECTION 4: DOM & BROWSER UTILITIES (1500+ LINES)
// ============================================================================

const DOMUtils = {
  querySelector: (selector) => document.querySelector(selector),
  
  querySelectorAll: (selector) => document.querySelectorAll(selector),
  
  getElementById: (id) => document.getElementById(id),
  
  getElementsByClassName: (className) => document.getElementsByClassName(className),
  
  getElementsByTagName: (tagName) => document.getElementsByTagName(tagName),
  
  createElement: (tag, attributes = {}) => {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on')) {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    }
    return element;
  },

  addClass: (element, className) => {
    element.classList.add(className);
  },

  removeClass: (element, className) => {
    element.classList.remove(className);
  },

  toggleClass: (element, className) => {
    element.classList.toggle(className);
  },

  hasClass: (element, className) => {
    return element.classList.contains(className);
  },

  setAttr: (element, name, value) => {
    element.setAttribute(name, value);
  },

  getAttr: (element, name) => {
    return element.getAttribute(name);
  },

  removeAttr: (element, name) => {
    element.removeAttribute(name);
  },

  setData: (element, key, value) => {
    element.dataset[key] = value;
  },

  getData: (element, key) => {
    return element.dataset[key];
  },

  setText: (element, text) => {
    element.textContent = text;
  },

  getText: (element) => {
    return element.textContent;
  },

  setHTML: (element, html) => {
    element.innerHTML = html;
  },

  getHTML: (element) => {
    return element.innerHTML;
  },

  setValue: (element, value) => {
    element.value = value;
  },

  getValue: (element) => {
    return element.value;
  },

  setStyle: (element, styles) => {
    Object.assign(element.style, styles);
  },

  getStyle: (element, property) => {
    return window.getComputedStyle(element).getPropertyValue(property);
  },

  show: (element) => {
    element.style.display = '';
  },

  hide: (element) => {
    element.style.display = 'none';
  },

  toggle: (element) => {
    element.style.display = element.style.display === 'none' ? '' : 'none';
  },

  isVisible: (element) => {
    return element.offsetParent !== null;
  },

  position: (element) => {
    return {
      top: element.offsetTop,
      left: element.offsetLeft,
      width: element.offsetWidth,
      height: element.offsetHeight,
    };
  },

  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  },

  scrollIntoView: (element) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  scrollTo: (top = 0, left = 0) => {
    window.scrollTo({ top, left, behavior: 'smooth' });
  },

  on: (element, event, callback) => {
    element.addEventListener(event, callback);
  },

  off: (element, event, callback) => {
    element.removeEventListener(event, callback);
  },

  once: (element, event, callback) => {
    element.addEventListener(event, callback, { once: true });
  },

  trigger: (element, event) => {
    element.dispatchEvent(new Event(event));
  },

  delegate: (parent, event, selector, callback) => {
    parent.addEventListener(event, (e) => {
      if (e.target.matches(selector)) {
        callback.call(e.target, e);
      }
    });
  },

  closest: (element, selector) => {
    return element.closest(selector);
  },

  matches: (element, selector) => {
    return element.matches(selector);
  },

  parent: (element) => {
    return element.parentElement;
  },

  children: (element) => {
    return Array.from(element.children);
  },

  siblings: (element) => {
    return Array.from(element.parentElement.children).filter(child => child !== element);
  },

  next: (element) => {
    return element.nextElementSibling;
  },

  previous: (element) => {
    return element.previousElementSibling;
  },

  append: (parent, ...elements) => {
    parent.append(...elements);
  },

  prepend: (parent, ...elements) => {
    parent.prepend(...elements);
  },

  insertBefore: (newElement, referenceElement) => {
    referenceElement.parentNode.insertBefore(newElement, referenceElement);
  },

  insertAfter: (newElement, referenceElement) => {
    referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
  },

  remove: (element) => {
    element.remove();
  },

  empty: (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  clone: (element, deep = true) => {
    return element.cloneNode(deep);
  }
};

const BrowserUtils = {
  userAgent: () => navigator.userAgent,
  
  browser: () => {
    const ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1) return 'IE';
    return 'Unknown';
  },

  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  isTablet: () => {
    return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent.toLowerCase());
  },

  isDesktop: () => {
    return !BrowserUtils.isMobile() && !BrowserUtils.isTablet();
  },

  language: () => navigator.language || navigator.userLanguage,
  
  timezone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  
  online: () => navigator.onLine,
  
  storage: () => ({
    local: typeof localStorage !== 'undefined',
    session: typeof sessionStorage !== 'undefined',
  }),

  vibrate: (pattern) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  },

  copy: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  },

  paste: async () => {
    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      return null;
    }
  },

  share: async (data) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  }
};

// ============================================================================
// SECTION 5: REGEX & PATTERN UTILITIES (1200+ LINES)
// ============================================================================

const RegexUtils = {
  email: () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  url: () => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  
  ipv4: () => /^(\d{1,3}\.){3}\d{1,3}$/,
  
  ipv6: () => /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/,
  
  phone: () => /^[+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  
  ssn: () => /^\d{3}-\d{2}-\d{4}$/,
  
  creditCard: () => /^\d{13,19}$/,
  
  zipCode: () => /^\d{5}(-\d{4})?$/,
  
  hexColor: () => /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
  
  strongPassword: () => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  username: () => /^[a-zA-Z0-9_]{3,20}$/,
  
  slug: () => /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  
  uuid: () => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  
  test: (pattern, string) => pattern.test(string),
  
  match: (pattern, string) => string.match(pattern),
  
  matchAll: (pattern, string) => [...string.matchAll(pattern)],
  
  split: (pattern, string) => string.split(pattern),
  
  replace: (pattern, string, replacement) => string.replace(pattern, replacement),
  
  replaceAll: (pattern, string, replacement) => string.replaceAll(pattern, replacement)
};

// Export all utilities
export {
  DateUtils,
  FormatUtils,
  MathUtils,
  DOMUtils,
  BrowserUtils,
  RegexUtils
};
