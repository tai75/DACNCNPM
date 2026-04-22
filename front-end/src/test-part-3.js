// ===== PART 3: REACT COMPONENTS =====
// Generated code for testing - Part 3 of 5
// ~3,500 lines

// ===== COMPONENT EXAMPLES =====

// User Components
const UserListComponent = `
  export function UserList({ users, onUserClick, onDeleteUser, loading }) {
    return (
      <div className="user-list">
        {loading && <div className="spinner">Loading...</div>}
        <div className="user-grid">
          {users.map(user => (
            <div
              key={user.id}
              className="user-card"
              onClick={() => onUserClick(user)}
            >
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <h3>{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <p className="user-status" data-status={user.status}>
                {user.status}
              </p>
              <div className="user-actions">
                <button 
                  className="btn-edit"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteUser(user.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
`;

const UserProfileComponent = `
  export function UserProfile({ userId, user, onEdit, onDelete, onFollow }) {
    if (!user) return <div>Loading...</div>;

    return (
      <div className="user-profile">
        <div className="profile-banner">
          <img src={user.banner} alt="banner" className="banner-image" />
        </div>
        <div className="profile-content">
          <div className="profile-header">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              <p className="profile-phone">{user.phone}</p>
              <p className="profile-address">{user.address}</p>
            </div>
            <div className="profile-meta">
              <div className="meta-item">
                <span className="meta-label">Joined</span>
                <span className="meta-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className="meta-value" data-status={user.status}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={onEdit} className="btn-primary">
              Edit Profile
            </button>
            <button onClick={onFollow} className="btn-secondary">
              Follow
            </button>
            <button onClick={onDelete} className="btn-danger">
              Delete Profile
            </button>
          </div>

          <div className="profile-tabs">
            <div className="tab-content">
              <h3>About</h3>
              <p>{user.bio || 'No bio provided'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
`;

const UserFormComponent = `
  export function UserForm({ initialData, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState(initialData || {
      name: '',
      email: '',
      phone: '',
      address: '',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email';
      }
      if (!formData.phone) newErrors.phone = 'Phone is required';
      return newErrors;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newErrors = validateForm();
      if (Object.keys(newErrors).length === 0) {
        onSubmit(formData);
      } else {
        setErrors(newErrors);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    return (
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            disabled={loading}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            disabled={loading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            disabled={loading}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            disabled={loading}
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    );
  }
`;

// Product Components
const ProductCardComponent = `
  export function ProductCard({
    product,
    onAddToCart,
    onViewDetails,
    onAddToWishlist,
    onRemoveFromWishlist,
    isWishlisted,
  }) {
    const [quantity, setQuantity] = useState(1);
    const [showOptions, setShowOptions] = useState(false);

    const handleAddToCart = () => {
      onAddToCart(product, quantity);
      setQuantity(1);
    };

    return (
      <div className="product-card">
        <div className="product-image-wrapper">
          <img src={product.image} alt={product.name} className="product-image" />
          {product.discountPrice && (
            <div className="discount-badge">
              -
              {(
                ((product.price - product.discountPrice) / product.price) *
                100
              ).toFixed(0)}
              %
            </div>
          )}
          <button
            className="wishlist-btn"
            onClick={() =>
              isWishlisted
                ? onRemoveFromWishlist(product.id)
                : onAddToWishlist(product)
            }
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>

          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-value">{product.rating}</span>
            <span className="review-count">({product.reviews} reviews)</span>
          </div>

          <div className="product-price">
            {product.discountPrice ? (
              <>
                <span className="original-price">\${product.price}</span>
                <span className="sale-price">\${product.discountPrice}</span>
              </>
            ) : (
              <span className="price">\${product.price}</span>
            )}
          </div>

          <div className="product-stock">
            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
              {product.stock > 0 ? \`In stock (\${product.stock})\` : 'Out of stock'}
            </span>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value))))
                }
              />
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                +
              </button>
            </div>

            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>

            <button
              className="btn-view-details"
              onClick={() => onViewDetails(product)}
            >
              View Details
            </button>
          </div>

          <div className="product-tags">
            {product.tags && product.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
`;

const ProductGridComponent = `
  export function ProductGrid({
    products,
    onProductClick,
    onAddToCart,
    columns = 4,
    loading,
  }) {
    return (
      <div className="product-grid-wrapper">
        {loading && <div className="grid-loader">Loading products...</div>}
        <div 
          className="product-grid" 
          style={{
            gridTemplateColumns: \`repeat(auto-fill, minmax(250px, 1fr))\`,
          }}
        >
          {products.map(product => (
            <div key={product.id} className="grid-item">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onProductClick}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
`;

// Cart Components
const CartComponent = `
  export function Cart({ items, onRemoveItem, onUpdateQuantity, onCheckout, loading }) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    if (items.length === 0) {
      return (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <a href="/products" className="btn-continue-shopping">
            Continue Shopping
          </a>
        </div>
      );
    }

    return (
      <div className="cart-container">
        <div className="cart-items">
          <h2>Shopping Cart</h2>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="cart-item-row">
                  <td className="item-name">{item.name}</td>
                  <td className="item-price">\${item.price.toFixed(2)}</td>
                  <td className="item-quantity">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="quantity-input"
                    />
                  </td>
                  <td className="item-subtotal">
                    \${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="item-actions">
                    <button
                      className="btn-remove"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>\${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>\${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>\${shipping.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>\${total.toFixed(2)}</span>
          </div>

          <button
            className="btn-checkout"
            onClick={onCheckout}
            disabled={loading || items.length === 0}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>

          <a href="/products" className="continue-shopping-link">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }
`;

// Modal Component
const ModalComponent = `
  export function Modal({
    title,
    isOpen,
    onClose,
    children,
    size = 'medium',
    closeOnBackdropClick = true,
  }) {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        className="modal-overlay"
        onClick={closeOnBackdropClick ? onClose : undefined}
      >
        <div
          className=\`modal-content modal-\${size}\`
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }
`;

// Toast Component
const ToastComponent = `
  export function Toast({ message, type = 'info', onClose, duration = 3000 }) {
    useEffect(() => {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
      <div className=\`toast toast-\${type}\`>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          ✕
        </button>
      </div>
    );
  }
`;

// Loading Spinner
const SpinnerComponent = `
  export function Spinner({ size = 'medium', color = '#3498db' }) {
    return (
      <div className=\`spinner spinner-\${size}\` style={{ borderTopColor: color }}>
        <div></div>
      </div>
    );
  }
`;

// Pagination Component
const PaginationComponent = `
  export function Pagination({ current, total, onPageChange, maxVisible = 5 }) {
    const pages = [];
    let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
    let endPage = Math.min(total, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button
          disabled={current === 1}
          onClick={() => onPageChange(1)}
          className="pagination-btn"
        >
          First
        </button>
        <button
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
          className="pagination-btn"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <span className="pagination-ellipsis">...</span>
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className=\`pagination-btn \${current === page ? 'active' : ''}\`
          >
            {page}
          </button>
        ))}

        {endPage < total && (
          <>
            <span className="pagination-ellipsis">...</span>
          </>
        )}

        <button
          disabled={current === total}
          onClick={() => onPageChange(current + 1)}
          className="pagination-btn"
        >
          Next
        </button>
        <button
          disabled={current === total}
          onClick={() => onPageChange(total)}
          className="pagination-btn"
        >
          Last
        </button>
      </div>
    );
  }
`;

// Badge Component
const BadgeComponent = `
  export function Badge({ children, variant = 'default', size = 'md' }) {
    return (
      <span className=\`badge badge-\${variant} badge-\${size}\`>
        {children}
      </span>
    );
  }
`;

// Alert Component
const AlertComponent = `
  export function Alert({ type = 'info', title, message, onClose, closeable = true }) {
    return (
      <div className=\`alert alert-\${type}\` role="alert">
        <div className="alert-content">
          {title && <h4 className="alert-title">{title}</h4>}
          {message && <p className="alert-message">{message}</p>}
        </div>
        {closeable && (
          <button className="alert-close" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
    );
  }
`;

// Export all components
export {
  UserListComponent,
  UserProfileComponent,
  UserFormComponent,
  ProductCardComponent,
  ProductGridComponent,
  CartComponent,
  ModalComponent,
  ToastComponent,
  SpinnerComponent,
  PaginationComponent,
  BadgeComponent,
  AlertComponent,
};
