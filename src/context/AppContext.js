import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DB as initialDB } from '../data/db';
console.log('DEBUG: initialDB users count:', initialDB.users.length);

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [db, setDb] = useState(initialDB);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Persist & restore cart and db from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const savedCart = await AsyncStorage.getItem('portal_emergencia_cart');
        const savedDb = await AsyncStorage.getItem('portal_emergencia_db');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedDb) {
          const parsedDb = JSON.parse(savedDb);
          // Restore image references from initialDB since JSON stringify/parse breaks them
          parsedDb.products = parsedDb.products.map(p => {
            const initialP = initialDB.products.find(ip => ip.id === p.id);
            return {
              ...p,
              imagem: initialP ? initialP.imagem : p.imagem
            };
          });
          setDb(parsedDb);
        }
      } catch (_) {}
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('portal_emergencia_cart', JSON.stringify(cart)).catch(() => {});
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('portal_emergencia_db', JSON.stringify(db)).catch(() => {});
    }
  }, [db, isLoaded]);

  // ── AUTH ──────────────────────────────────────────
  const login = useCallback((email, password) => {
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Email ou password incorretos.');
    setCurrentUser(user);
    setCart([]);
    return user;
  }, [db.users]);

  const register = useCallback((nome, email, password) => {
    if (db.users.find(u => u.email === email)) throw new Error('Email já está registado.');
    const newUser = {
      id: db.users.length + 1, nome, email, password,
      role: 'user', created_at: new Date().toISOString().split('T')[0],
    };
    setDb(prev => ({ ...prev, users: [...prev.users, newUser] }));
    setCurrentUser(newUser);
    setCart([]);
    return newUser;
  }, [db.users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
  }, []);

  // ── CART ──────────────────────────────────────────
  const addToCart = useCallback((productId, qty = 1) => {
    const product = db.products.find(p => p.id === productId);
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(i => i.product_id === productId);
      const currentQty = existing ? existing.quantidade : 0;
      if (currentQty + qty > product.stock) throw new Error('Stock insuficiente!');
      if (existing) {
        return prev.map(i => i.product_id === productId
          ? { ...i, quantidade: i.quantidade + qty } : i);
      }
      return [...prev, { product_id: productId, quantidade: qty }];
    });
  }, [db.products]);

  const updateCartQty = useCallback((productId, newQty) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(i => i.product_id !== productId));
      return;
    }
    const product = db.products.find(p => p.id === productId);
    if (product && newQty > product.stock) return;
    setCart(prev => prev.map(i => i.product_id === productId
      ? { ...i, quantidade: newQty } : i));
  }, [db.products]);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(i => i.product_id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((acc, item) => {
    const p = db.products.find(x => x.id === item.product_id);
    return acc + (p ? p.preco * item.quantidade : 0);
  }, 0);

  const cartCount = cart.reduce((a, c) => a + c.quantidade, 0);

  // ── CHECKOUT ──────────────────────────────────────
  const checkout = useCallback(() => {
    if (!currentUser) throw new Error('Não autenticado.');
    // Validate stock
    for (const item of cart) {
      const p = db.products.find(x => x.id === item.product_id);
      if (!p || item.quantidade > p.stock) throw new Error(`Stock insuficiente para ${p?.nome}.`);
    }
    const orderId = 'ORD-' + String(db.orders.length + 1).padStart(3, '0');
    const today = new Date().toISOString().split('T')[0];
    const total = parseFloat(cartTotal.toFixed(2));

    setDb(prev => {
      const newOrder = { id: orderId, user_id: currentUser.id, data: today, valor_total: total, status: 'concluída' };
      let itemId = prev.order_items.length + 1;
      const newItems = cart.map(item => {
        const p = prev.products.find(x => x.id === item.product_id);
        return { id: itemId++, order_id: orderId, product_id: item.product_id, quantidade: item.quantidade, preco_unitario: p.preco };
      });
      const updatedProducts = prev.products.map(p => {
        const ci = cart.find(i => i.product_id === p.id);
        return ci ? { ...p, stock: p.stock - ci.quantidade } : p;
      });
      return {
        ...prev,
        orders: [...prev.orders, newOrder],
        order_items: [...prev.order_items, ...newItems],
        products: updatedProducts,
      };
    });
    setCart([]);
    return orderId;
  }, [cart, cartTotal, currentUser, db]);

  // ── ADMIN PRODUCT OPS ─────────────────────────────
  const addProduct = useCallback((data) => {
    setDb(prev => ({ ...prev, products: [...prev.products, { id: prev.products.length + 1, ...data }] }));
  }, []);

  const updateProduct = useCallback((id, data) => {
    setDb(prev => ({ ...prev, products: prev.products.map(p => p.id === id ? { ...p, ...data } : p) }));
  }, []);

  const deleteProduct = useCallback((id) => {
    setDb(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  }, []);

  const resetDb = useCallback(async () => {
    setDb(initialDB);
    setCart([]);
    await AsyncStorage.multiRemove(['portal_emergencia_cart', 'portal_emergencia_db']);
  }, []);

  return (
    <AppContext.Provider value={{
      db, currentUser, cart, cartTotal, cartCount,
      login, register, logout,
      addToCart, updateCartQty, removeFromCart, clearCart, checkout,
      addProduct, updateProduct, deleteProduct, resetDb,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
