import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { ShoppingBag, Plus, Trash2, Printer, CheckCircle2, X, Store, Upload } from 'lucide-react';
import Pagination from '../Pagination';

export default function POSTab() {
  const { data, user, createInvoice, addProduct, updateProduct, deleteProduct } = useGym();
  const [cart, setCart] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(data.members[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [lastReceipt, setLastReceipt] = useState(null);

  // Pagination for POS Products
  const [pageProducts, setPageProducts] = useState(1);
  const [perPageProducts, setPerPageProducts] = useState(6);

  // Add Product Modal State
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    brand: '',
    category: 'Supplements',
    price: '',
    costPrice: '',
    stock: '',
    sku: '',
    lowStockLevel: '5',
    images: [],
    description: ''
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const gymName = user?.gymName || data.gymInfo?.name || "Gym";

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > 800) { height = Math.round((height * 800) / width); width = 800; }
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', 0.7));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const allProducts = data.posProducts || [];
  const totalProductPages = Math.ceil(allProducts.length / perPageProducts) || 1;
  const paginatedProducts = allProducts.slice((pageProducts - 1) * perPageProducts, pageProducts * perPageProducts);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gstTax = Math.round(subtotal * 0.18); // 18% GST
  const grandTotal = subtotal + gstTax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const selectedMember = data.members.find(m => m.id === selectedMemberId);
    const memberName = selectedMember ? selectedMember.name : "Walk-in Guest";
    const itemsDescription = cart.map(i => `${i.name} x${i.qty}`).join(', ');

    const invData = {
      memberId: selectedMemberId || "GUEST",
      member: memberName,
      items: itemsDescription,
      amount: subtotal,
      gst: gstTax,
      total: grandTotal,
      method: paymentMethod
    };

    createInvoice(invData);
    setLastReceipt({ id: `INV-${Math.floor(8000 + Math.random() * 1000)}`, total: grandTotal, member: memberName, method: paymentMethod });
    setCart([]);
  };

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    if (newProd.id) {
      updateProduct(newProd.id, newProd);
    } else {
      addProduct(newProd);
    }

    setNewProd({ name: '', brand: '', category: 'Supplements', price: '', costPrice: '', stock: '', sku: '', lowStockLevel: '5', images: [], description: '' });
    setShowAddProdModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem' }}>{gymName} POS & Store Inventory</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Sell supplements, gear, accessories with automatic GST billing</p>
        </div>
        <button onClick={() => setShowAddProdModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Store Product
        </button>
      </div>

      <div className="pos-grid">
        {/* Products Roster */}
        <div>
          {allProducts.length > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                {paginatedProducts.map(prod => (
                  <div key={prod.id} className="product-card" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setSelectedProduct(prod)}>
                    <img
                      src={(prod.images && prod.images.length > 0) ? prod.images[0] : (prod.image && !prod.image.includes('1579722821273') ? prod.image : 'https://placehold.co/400x400/1e293b/9ca3af?text=No+Image')}
                      alt={prod.name}
                      className="product-img"
                    />
                    <div>
                      <span className="badge badge-active" style={{ fontSize: '0.65rem' }}>{prod.category}</span>
                      <h4 style={{ fontSize: '1rem', marginTop: '10px', color: '#f9fafb', lineHeight: '1.4', wordBreak: 'break-word' }} title={prod.name}>{prod.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Stock: {prod.stock} units</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#10b981' }}>₹{prod.price.toLocaleString()}</strong>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProductToDelete(prod);
                          }}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: '6px 8px', color: '#ef4444' }}
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); addToCart(prod); }} className="btn btn-primary btn-sm">
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="data-table-container" style={{ marginTop: '20px' }}>
                <Pagination
                  currentPage={pageProducts}
                  totalPages={totalProductPages}
                  onPageChange={setPageProducts}
                  totalItems={allProducts.length}
                  itemsPerPage={perPageProducts}
                  onItemsPerPageChange={(num) => {
                    setPerPageProducts(num);
                    setPageProducts(1);
                  }}
                  itemLabel="products"
                />
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
              <Store size={48} color="#4b5563" style={{ marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.1rem', color: '#f9fafb' }}>No Products Added to Gym Store Yet</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Add supplements, shakers, wrist wraps, or drinks to sell to your gym members.</p>
              <button onClick={() => setShowAddProdModal(true)} className="btn btn-primary">
                <Plus size={16} /> Add First Product
              </button>
            </div>
          )}
        </div>


        {/* Shopping Cart & Billing Sidebar */}
        <div className="glass-card" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#10b981" /> Billing Counter
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Customer / Member:</label>
            <select value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)} className="search-input" style={{ width: '100%' }}>
              <option value="">-- Select Member or Walk-in --</option>
              {(data.members || []).map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
              ))}
            </select>
          </div>

          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto', marginBottom: '20px' }}>
            {cart.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>Cart is empty. Click &quot;+ Add&quot; on items.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>{item.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>₹{item.price} x {item.qty}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#34d399' }}>₹{item.price * item.qty}</strong>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Breakdown */}
          <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
              <span>GST (18%):</span>
              <span>₹{gstTax.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '800', color: '#10b981', paddingTop: '8px', borderTop: '1px dashed var(--border-dark)' }}>
              <span>Grand Total:</span>
              <span>₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method & Checkout */}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Payment Mode:</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="search-input" style={{ width: '100%', marginBottom: '16px' }}>
              <option value="UPI">UPI / QR Code</option>
              <option value="Credit Card">Credit / Debit Card</option>
              <option value="Cash">Cash Counter</option>
            </select>

            <button onClick={handleCheckout} disabled={cart.length === 0} className="btn btn-primary" style={{ width: '100%' }}>
              <Printer size={16} /> Checkout & Generate GST Invoice
            </button>
          </div>

          {/* Last Receipt Notification */}
          {lastReceipt && (
            <div style={{ marginTop: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem' }}>
              <strong style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Receipt Generated: #{lastReceipt.id}
              </strong>
              <p style={{ color: '#9ca3af', marginTop: '2px' }}>Total ₹{lastReceipt.total} paid by {lastReceipt.member} via {lastReceipt.method}</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Details Drawer */}
      {selectedProduct && (
        <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '100vh', width: '100%', maxWidth: '600px', margin: 0, borderRadius: 0, animation: 'slideInRight 0.3s ease-out', display: 'flex', flexDirection: 'column', padding: 0 }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#f9fafb' }}>Product Details</h3>
              <button onClick={() => setSelectedProduct(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto' }}>
              {/* Images Carousel */}
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', minHeight: '260px', alignItems: 'center' }}>
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  selectedProduct.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`${selectedProduct.name} ${idx+1}`} style={{ height: '240px', width: '240px', minWidth: '240px', flexShrink: 0, objectFit: 'contain', background: '#fff', borderRadius: '12px', padding: '12px', border: '1px solid var(--border-dark)' }} />
                  ))
                ) : (
                  <img src={(selectedProduct.image && !selectedProduct.image.includes('1579722821273')) ? selectedProduct.image : 'https://placehold.co/400x400/1e293b/9ca3af?text=No+Image'} alt={selectedProduct.name} style={{ width: '100%', height: '240px', flexShrink: 0, objectFit: 'contain', background: '#1e293b', borderRadius: '12px', padding: '12px', border: '1px solid var(--border-dark)' }} />
                )}
              </div>
              
              {/* Title & Price */}
              <div>
                <h2 style={{ fontSize: '1.4rem', color: '#f9fafb', marginBottom: '8px', lineHeight: '1.3' }}>{selectedProduct.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '1.4rem', color: '#10b981', fontWeight: 'bold' }}>₹{selectedProduct.price.toLocaleString()}</span>
                  <span className="badge badge-active">{selectedProduct.category}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-dark)' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Brand</p>
                  <p style={{ fontSize: '1rem', color: '#f9fafb' }}>{selectedProduct.brand || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>SKU / Barcode</p>
                  <p style={{ fontSize: '1rem', color: '#f9fafb' }}>{selectedProduct.sku || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>In Stock Quantity</p>
                  <p style={{ fontSize: '1rem', color: '#f9fafb' }}>{selectedProduct.stock} units {selectedProduct.stock <= Number(selectedProduct.lowStockLevel) && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>(Low Stock)</span>}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '4px' }}>Cost Price</p>
                  <p style={{ fontSize: '1rem', color: '#f9fafb' }}>{selectedProduct.costPrice ? `₹${Number(selectedProduct.costPrice).toLocaleString()}` : 'N/A'}</p>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '8px', fontWeight: '600' }}>Description</p>
                <p style={{ fontSize: '0.95rem', color: '#d1d5db', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedProduct.description || 'No description provided for this product.'}
                </p>
              </div>
            </div>
            
            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-dark)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => {
                setNewProd({ ...selectedProduct });
                setSelectedProduct(null);
                setShowAddProdModal(true);
              }} className="btn btn-secondary">
                Edit Product
              </button>
              <button onClick={() => setSelectedProduct(null)} className="btn btn-secondary">Close</button>
              <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="btn btn-primary">
                <Plus size={16} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Drawer */}
      {showAddProdModal && (
        <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={() => {
          setShowAddProdModal(false);
          setNewProd({ name: '', brand: '', category: 'Supplements', price: '', costPrice: '', stock: '', sku: '', lowStockLevel: '5', images: [], description: '' });
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '100vh', width: '100%', maxWidth: '650px', margin: 0, borderRadius: 0, animation: 'slideInRight 0.3s ease-out', display: 'flex', flexDirection: 'column', padding: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid var(--border-dark)' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#f9fafb' }}>{newProd.id ? 'Edit Store Product' : 'Add New Store Product'}</h3>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{newProd.id ? 'Update product details in inventory' : `Add product details to inventory for ${gymName}`}</p>
              </div>
              <button onClick={() => {
                setShowAddProdModal(false);
                setNewProd({ name: '', brand: '', category: 'Supplements', price: '', costPrice: '', stock: '', sku: '', lowStockLevel: '5', images: [], description: '' });
              }} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', alignSelf: 'flex-start' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'hidden' }}>
              
              <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              {/* Image Upload Box */}
              <div>
                <label style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>Product Images</label>
                <div style={{ border: '1px dashed rgba(56, 189, 248, 0.4)', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'rgba(56, 189, 248, 0.02)', transition: 'all 0.2s', position: 'relative' }}>
                  {newProd.images && newProd.images.length > 0 && (
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
                       {newProd.images.map((img, idx) => (
                         <div key={idx} style={{ position: 'relative' }}>
                           <img src={img} alt={`Preview ${idx}`} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                           <button type="button" onClick={() => setNewProd(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <X size={12} />
                           </button>
                         </div>
                       ))}
                     </div>
                  )}
                  <label style={{ cursor: 'pointer', display: 'block', width: '100%' }}>
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp" 
                      multiple
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files);
                        for (const file of files) {
                          if (file.type.startsWith('image/')) {
                            const compressed = await compressImage(file);
                            setNewProd(prev => ({...prev, images: [...(prev.images || []), compressed]}));
                          }
                        }
                      }} 
                    />
                    <Upload size={32} color="#38bdf8" style={{ margin: '0 auto 10px', opacity: 0.8 }} />
                    <p style={{ color: '#38bdf8', fontSize: '0.9rem', margin: 0, fontWeight: '500' }}>Click to select images from your computer</p>
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>Select multiple PNG, JPG, WEBP up to 5MB</p>
                  </label>
                </div>
              </div>

              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Product Name *</label>
                  <input type="text" className="search-input" placeholder="e.g. Optimum Nutrition Gold Standard Whey" style={{ width: '100%' }} value={newProd.name} onChange={e => setNewProd({ ...newProd, name: e.target.value })} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Brand (Optional)</label>
                  <input type="text" className="search-input" placeholder="e.g. MuscleBlaze" style={{ width: '100%' }} value={newProd.brand} onChange={e => setNewProd({ ...newProd, brand: e.target.value })} />
                </div>
              </div>

              {/* Classification */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Category *</label>
                  <select className="search-input" style={{ width: '100%' }} value={newProd.category} onChange={e => setNewProd({ ...newProd, category: e.target.value })}>
                    <option value="Supplements">Supplements & Protein</option>
                    <option value="Pre-Workout">Pre-Workout & Aminos</option>
                    <option value="Vitamins">Health & Wellness (Vitamins)</option>
                    <option value="Snacks">Meals & Snacks (Protein Bars)</option>
                    <option value="Beverages">Energy Drinks & Water</option>
                    <option value="Gear">Gym Gear & Belts</option>
                    <option value="Accessories">Accessories (Shakers, Bags)</option>
                    <option value="Apparel">Apparel (T-Shirts, Lowers)</option>
                    <option value="Recovery">Recovery & Therapy</option>
                    <option value="Hygiene">Towels & Hygiene</option>
                    <option value="Tech">Fitness Tech</option>
                    <option value="Merchandise">Gym Merchandise</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Barcode / SKU</label>
                  <input type="text" className="search-input" placeholder="e.g. MB-WHEY-001" style={{ width: '100%' }} value={newProd.sku} onChange={e => setNewProd({ ...newProd, sku: e.target.value })} />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#f9fafb', marginBottom: '12px' }}>Inventory & Pricing</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Selling Price (₹) *</label>
                    <input type="number" className="search-input" placeholder="0" style={{ width: '100%', borderColor: '#10b981' }} value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Cost Price (₹)</label>
                    <input type="number" className="search-input" placeholder="0" style={{ width: '100%' }} value={newProd.costPrice} onChange={e => setNewProd({ ...newProd, costPrice: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>In-Stock Qty *</label>
                    <input type="number" className="search-input" placeholder="0" style={{ width: '100%' }} value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: e.target.value })} required />
                  </div>
                </div>
                
                <div style={{ marginTop: '12px' }}>
                   <label style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Low Stock Alert Threshold</label>
                   <input type="number" className="search-input" placeholder="e.g. 5" style={{ width: '100%' }} value={newProd.lowStockLevel} onChange={e => setNewProd({ ...newProd, lowStockLevel: e.target.value })} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '4px' }}>Product Description</label>
                <textarea 
                  className="search-input" 
                  style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} 
                  placeholder="Enter details about flavors, ingredients, sizes..."
                  value={newProd.description}
                  onChange={e => setNewProd({...newProd, description: e.target.value})}
                ></textarea>
              </div>

              </div>
              
              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-dark)', background: 'rgba(0,0,0,0.2)' }}>
                <button type="button" onClick={() => {
                  setShowAddProdModal(false);
                  setNewProd({ name: '', brand: '', category: 'Supplements', price: '', costPrice: '', stock: '', sku: '', lowStockLevel: '5', images: [], description: '' });
                }} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                  <Plus size={16} /> {newProd.id ? 'Save Changes' : 'Save Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Drawer */}
      {productToDelete && (
        <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={() => setProductToDelete(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ height: '100vh', width: '100%', maxWidth: '400px', margin: 0, borderRadius: 0, animation: 'slideInRight 0.25s ease-out', display: 'flex', flexDirection: 'column', padding: 0 }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-dark)' }}>
              <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px' }}><Trash2 size={22} /> Delete Product</h3>
            </div>
            
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              <p style={{ color: '#f9fafb', fontSize: '1.05rem', marginBottom: '20px' }}>Are you sure you want to delete this product? This action cannot be undone.</p>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-dark)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img src={(productToDelete.images && productToDelete.images.length > 0) ? productToDelete.images[0] : (productToDelete.image && !productToDelete.image.includes('1579722821273') ? productToDelete.image : 'https://placehold.co/400x400/1e293b/9ca3af?text=No+Image')} alt="Preview" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'contain', background: '#fff' }} />
                  <div>
                    <h4 style={{ color: '#f9fafb', fontSize: '1rem', lineHeight: '1.3', marginBottom: '4px' }}>{productToDelete.name}</h4>
                    <span className="badge badge-active">{productToDelete.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-dark)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '12px' }}>
              <button onClick={() => setProductToDelete(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => {
                deleteProduct(productToDelete.id);
                setProductToDelete(null);
              }} className="btn btn-primary" style={{ flex: 1, background: '#ef4444', color: 'white', borderColor: '#ef4444' }}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
