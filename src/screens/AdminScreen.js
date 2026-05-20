import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert, Modal, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { Card, Button, Input, Tag, EmptyState } from '../components/UI';
import { useApp } from '../context/AppContext';
import { useCustomAlert } from '../context/AlertContext';

const ADMIN_TABS = [
  { id: 'stats', icon: '📊', label: 'Resumo' },
  { id: 'products', icon: '📦', label: 'Produtos' },
  { id: 'users', icon: '👥', label: 'Users' },
  { id: 'orders', icon: '🧾', label: 'Encomendas' },
];

const CATEGORIES = ['Kits Domiciliares', 'Kits Empresariais', 'Kits Outdoor', 'Produtos Individuais'];

// ── Product Modal ─────────────────────────────────────────
function ProductModal({ visible, product, onClose, onSave, showAlert }) {
  const [nome, setNome] = useState(product?.nome || '');
  const [desc, setDesc] = useState(product?.descricao || '');
  const [preco, setPreco] = useState(product ? String(product.preco) : '');
  const [stock, setStock] = useState(product ? String(product.stock) : '');
  const [imagem, setImagem] = useState(product?.imagem || '📦');
  const [categoria, setCategoria] = useState(product?.categoria || 'Kits');

  React.useEffect(() => {
    if (product) {
      setNome(product.nome); setDesc(product.descricao);
      setPreco(String(product.preco)); setStock(String(product.stock));
      setImagem(product.imagem); setCategoria(product.categoria);
    } else {
      setNome(''); setDesc(''); setPreco(''); setStock(''); setImagem('📦'); setCategoria('Kits');
    }
  }, [product, visible]);

  const handleSave = () => {
    if (!nome || !preco || !stock) {
      showAlert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    onSave({ nome, descricao: desc, preco: parseFloat(preco), stock: parseInt(stock), imagem, categoria });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{product ? 'Editar Produto' : 'Novo Produto'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: colors.text2, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Input label="Nome *" value={nome} onChangeText={setNome} placeholder="Nome do produto" />
            <Input label="Descrição" value={desc} onChangeText={setDesc} placeholder="Descrição..." multiline numberOfLines={3}
              inputStyle={{ height: 80, textAlignVertical: 'top', paddingTop: 10 }} />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input label="Preço (€) *" value={preco} onChangeText={setPreco} keyboardType="decimal-pad" placeholder="0.00" />
              </View>
              <View style={{ flex: 1 }}>
                <Input label="Stock *" value={stock} onChangeText={setStock} keyboardType="number-pad" placeholder="0" />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Input label="Emoji" value={imagem} onChangeText={setImagem} placeholder="📦" />
              </View>
            </View>
            <Text style={styles.label}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, categoria === cat && styles.catChipActive]}
                    onPress={() => setCategoria(cat)}
                  >
                    <Text style={[styles.catChipText, categoria === cat && { color: '#fff' }]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Button title="Guardar" onPress={handleSave} style={{ marginBottom: 8 }} />
            <Button title="Cancelar" onPress={onClose} variant="secondary" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ── Main Admin Screen ─────────────────────────────────────
export default function AdminScreen() {
  const { db, addProduct, updateProduct, deleteProduct, resetDb } = useApp();
  const { showAlert } = useCustomAlert();
  const [activeTab, setActiveTab] = useState('stats');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [productSort, setProductSort] = useState('nome');
  const [orderSort, setOrderSort] = useState('recentes');

  const totalRevenue = db.orders.reduce((a, o) => a + o.valor_total, 0);

  const openAdd = () => { setEditingProduct(null); setModalVisible(true); };
  const openEdit = (p) => { setEditingProduct(p); setModalVisible(true); };
  const handleSave = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      showAlert('✓', 'Produto atualizado!');
    } else {
      addProduct(data);
      showAlert('✓', 'Produto criado!');
    }
    setModalVisible(false);
  };
  const handleDelete = (p) => {
    showAlert('Apagar Produto', `Apagar "${p.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Apagar', style: 'destructive', onPress: () => { deleteProduct(p.id); } },
    ]);
  };

  const handleResetDb = () => {
    showAlert('Repor Base de Dados', 'Isto vai apagar todos os dados guardados e recarregar do ficheiro db.js. Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Repor DB', style: 'destructive', onPress: async () => {
          await resetDb();
          showAlert('✓', 'Base de dados reposta e recarregada do ficheiro!');
      }},
    ]);
  };

  const renderStats = () => {
    const lowStockProducts = db.products.filter(p => p.stock <= 5).sort((a,b) => a.stock - b.stock);

    const productSales = {};
    db.order_items.forEach(item => {
        productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantidade;
    });
    const topSellingIds = Object.keys(productSales).sort((a, b) => productSales[b] - productSales[a]).slice(0, 3);
    const topProducts = topSellingIds.map(id => ({
      ...db.products.find(p => p.id === parseInt(id)),
      sold: productSales[id]
    })).filter(p => p.id);

    const categoryRevenue = {};
    db.order_items.forEach(item => {
        const product = db.products.find(p => p.id === item.product_id);
        if(product) {
            categoryRevenue[product.categoria] = (categoryRevenue[product.categoria] || 0) + (item.quantidade * item.preco_unitario);
        }
    });
    const sortedCategories = Object.entries(categoryRevenue)
        .map(([cat, rev]) => ({ category: cat, revenue: rev }))
        .sort((a, b) => b.revenue - a.revenue);
    const maxCategoryRevenue = sortedCategories.length ? sortedCategories[0].revenue : 1;

    return (
      <View style={{ paddingBottom: 20 }}>
        {/* Encomendas Metrics & Quick Highlights */}
        <View style={styles.statGrid}>
          {[
            { label: 'Total Vendas', value: totalRevenue.toFixed(2) + '€', color: colors.accent, icon: '📈' },
            { label: 'Encomendas', value: db.orders.length, color: colors.blue, icon: '📦' },
            { label: 'Utilizadores', value: db.users.length, color: colors.text, icon: '👥' },
            { label: 'Produtos', value: db.products.length, color: colors.green, icon: '🏷️' },
          ].map(s => (
            <Card key={s.label} style={styles.statCard}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={{fontSize: 16}}>{s.icon}</Text>
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            </Card>
          ))}
        </View>

        {/* Low Stock Watch */}
        {lowStockProducts.length > 0 && (
          <Card style={[styles.alertCard, {borderColor: 'rgba(248,81,73,0.3)', borderWidth: 1}]}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: colors.red, marginBottom: 8 }}>
              ⚠️ {lowStockProducts.length} Produtos com Stock Baixo
            </Text>
            {lowStockProducts.map(p => (
              <View key={p.id} style={styles.lowStockRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Image source={p.imagem} style={{ width: 24, height: 24, borderRadius: 4 }} resizeMode="cover" />
                  <Text style={{ fontWeight: '700', color: colors.text }}>{p.nome}</Text>
                </View>
                <Text style={{color: colors.red, fontWeight: '800'}}>Restam: {p.stock}</Text>
              </View>
            ))}
            <TouchableOpacity onPress={() => setActiveTab('products')} style={{marginTop: 10}}>
              <Text style={{color: colors.blue, fontWeight: '700', fontSize: 13}}>Gerir Produtos →</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Categories Revenue Horizontal Bars */}
        <Text style={styles.sectionTitle}>Desempenho por Categoria</Text>
        <Card style={{padding: 16, marginBottom: 16}}>
          {sortedCategories.length > 0 ? sortedCategories.map(cat => (
            <View key={cat.category} style={{marginBottom: 12}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6}}>
                <Text style={{fontSize: 13, fontWeight: '700', color: colors.text}}>{cat.category}</Text>
                <Text style={{fontSize: 13, fontWeight: '800', color: colors.accent}}>{cat.revenue.toFixed(2)}€</Text>
              </View>
              <View style={{height: 8, backgroundColor: colors.surface2, borderRadius: 4, overflow: 'hidden'}}>
                <View style={{
                  width: `${(cat.revenue / maxCategoryRevenue) * 100}%`,
                  height: '100%',
                  backgroundColor: colors.accent,
                  borderRadius: 4
                }} />
              </View>
            </View>
          )) : <Text style={{color: colors.text2}}>Sem dados até ao momento.</Text>}
        </Card>

        {/* Top Selling Products Leaderboard */}
        <Text style={styles.sectionTitle}>Top Mais Vendidos</Text>
        {topProducts.map((p, index) => (
          <Card key={p.id} style={styles.topProductCard}>
            <Text style={{fontSize: 20, width: 32, textAlign: 'center', fontWeight: '900', color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}>
              #{index + 1}
            </Text>
            <Image source={p.imagem} style={{ width: 44, height: 44, borderRadius: 8, marginHorizontal: 6 }} resizeMode="cover" />
            <View style={{flex: 1}}>
              <Text style={{fontSize: 14, fontWeight: '700', color: colors.text}} numberOfLines={1}>{p.nome}</Text>
              <Text style={{fontSize: 12, color: colors.text2, marginTop: 2}}>{p.categoria} • {p.preco.toFixed(2)}€</Text>
            </View>
            <View style={{backgroundColor: 'rgba(56,139,253,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12}}>
              <Text style={{color: colors.blue, fontWeight: '800', fontSize: 12}}>{p.sold} uds</Text>
            </View>
          </Card>
        ))}

        {/* Recent Orders Timeline */}
        <Text style={[styles.sectionTitle, {marginTop: 6}]}>Atividade Recente (Encomendas)</Text>
        {db.orders.slice(-4).reverse().map(o => {
          const u = db.users.find(x => x.id === o.user_id);
          return (
            <Card key={o.id} style={styles.miniOrder}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text2 }}>{o.id}</Text>
                  <Text style={{ fontSize: 13, color: colors.text, marginTop: 4, fontWeight: '700' }}>👤 {u?.nome}</Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: colors.accent }}>+{o.valor_total.toFixed(2)}€</Text>
                  <Text style={{ fontSize: 11, color: colors.text3, marginTop: 4 }}>{o.data}</Text>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    );
  };

  const renderProducts = () => {
    const sortedProducts = [...db.products].sort((a, b) => {
      if (productSort === 'preco_maior') return b.preco - a.preco;
      if (productSort === 'preco_menor') return a.preco - b.preco;
      if (productSort === 'stock_menor') return a.stock - b.stock;
      return a.nome.localeCompare(b.nome);
    });

    return (
      <>
        <View style={styles.actionRow}>
          <Button title="+ Novo Produto" onPress={openAdd} style={{ flex: 1 }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
          {[
            { id: 'nome', icon: '🔤', label: 'Nome' },
            { id: 'preco_maior', icon: '💰', label: 'Preço +' },
            { id: 'preco_menor', icon: '🏷️', label: 'Preço -' },
            { id: 'stock_menor', icon: '⚠️', label: 'Stock Baixo' }
          ].map(s => (
            <TouchableOpacity key={s.id} style={[styles.catChip, productSort === s.id && styles.catChipActive]} onPress={() => setProductSort(s.id)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 12 }}>{s.icon}</Text>
                <Text style={[styles.catChipText, productSort === s.id && { color: '#fff' }]}>{s.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {sortedProducts.map(p => (
          <Card key={p.id} style={styles.productRow}>
            <Image source={p.imagem} style={{ width: 50, height: 50, borderRadius: 8 }} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.productName} numberOfLines={1}>{p.nome}</Text>
              <Text style={{ fontSize: 12, color: colors.text2 }}>
                {p.preco.toFixed(2)}€ • Stock: <Text style={{ color: p.stock <= 5 ? colors.yellow : colors.text2 }}>{p.stock}</Text> • {p.categoria}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(p)}>
                <Text style={{ fontSize: 14 }}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(p)}>
                <Text style={{ fontSize: 14 }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </>
    );
  };

  const renderUsers = () => {
    const filteredUsers = db.users.filter(u => {
      const q = userSearch.toLowerCase();
      return !q || u.nome.toLowerCase().includes(q) || String(u.id).toLowerCase().includes(q);
    });

    return (
      <>
        <Input 
          placeholder="🔍 Pesquisar por nome ou ID..." 
          value={userSearch} 
          onChangeText={setUserSearch}
          inputStyle={{ paddingVertical: 10 }}
        />
        <Text style={styles.subLabel}>{filteredUsers.length} utilizadores encontrados</Text>
        {filteredUsers.map(u => (
          <Card key={u.id} style={styles.userRow}>
            <View style={[styles.userAvatar, u.role === 'admin' && { backgroundColor: colors.blue }]}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>{u.nome[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
                {u.nome} <Text style={{ fontSize: 12, color: colors.text2 }}>#{u.id}</Text>
              </Text>
              <Text style={{ fontSize: 12, color: colors.text2 }}>{u.email}</Text>
            </View>
            <View style={[styles.roleTag, u.role === 'admin' ? styles.roleAdmin : styles.roleUser]}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: u.role === 'admin' ? colors.blue : colors.green }}>
                {u.role.toUpperCase()}
              </Text>
            </View>
          </Card>
        ))}
      </>
    );
  };

  const renderOrders = () => {
    const filteredOrders = db.orders.filter(o => {
      const u = db.users.find(x => x.id === o.user_id);
      const q = orderSearch.toLowerCase();
      return !q || o.id.toLowerCase().includes(q) || (u && u.nome.toLowerCase().includes(q));
    }).sort((a, b) => {
      if (orderSort === 'preco_maior') return b.valor_total - a.valor_total;
      if (orderSort === 'preco_menor') return a.valor_total - b.valor_total;
      if (orderSort === 'antigas') return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id);
    });

    return (
      <>
        <Input 
          placeholder="🔍 Pesquisar por Encomenda (ID) ou Cliente..." 
          value={orderSearch} 
          onChangeText={setOrderSearch}
          inputStyle={{ paddingVertical: 10 }}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14, marginTop: -4 }} contentContainerStyle={{ gap: 8 }}>
            {[
              { id: 'recentes', icon: '📅', label: 'Recentes' },
              { id: 'antigas', icon: '⏳', label: 'Antigas' },
              { id: 'preco_maior', icon: '💰', label: 'Maior Valor' },
              { id: 'preco_menor', icon: '📉', label: 'Menor Valor' }
            ].map(s => (
            <TouchableOpacity key={s.id} style={[styles.catChip, orderSort === s.id && styles.catChipActive]} onPress={() => setOrderSort(s.id)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 12 }}>{s.icon}</Text>
                <Text style={[styles.catChipText, orderSort === s.id && { color: '#fff' }]}>{s.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.subLabel}>{filteredOrders.length} encomendas encontradas</Text>
        {filteredOrders.map(o => {
          const u = db.users.find(x => x.id === o.user_id);
          const items = db.order_items.filter(i => i.order_id === o.id);
          return (
            <Card key={o.id} style={styles.orderCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '800', color: colors.text2 }}>{o.id}</Text>
                <View style={styles.statusTag}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: colors.green }}>✓ {o.status}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: colors.text2, marginBottom: 8 }}>👤 {u?.nome} (#{o.user_id}) • 📅 {o.data}</Text>
              {items.map((i, idx) => {
                const p = db.products.find(x => x.id === i.product_id);
                return (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Image source={p?.imagem} style={{ width: 20, height: 20, borderRadius: 3 }} resizeMode="cover" />
                    <Text style={{ fontSize: 12, color: colors.text3 }}>{p?.nome || '?'} ×{i.quantidade}</Text>
                  </View>
                );
              })}
              <Text style={{ fontSize: 18, fontWeight: '900', color: colors.accent, marginTop: 8 }}>{o.valor_total.toFixed(2)}€</Text>
            </Card>
          );
        })}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      {/* Admin Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}>
        {ADMIN_TABS.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.adminTab, activeTab === t.id && styles.adminTabActive]}
            onPress={() => setActiveTab(t.id)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 13 }}>{t.icon}</Text>
              <Text style={[styles.adminTabText, activeTab === t.id && styles.adminTabTextActive]}>{t.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'orders' && renderOrders()}
        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.text2, textAlign: 'center' }}>
            Este projeto é um trabalho académico e não tem fins comerciais.
          </Text>
        </View>
      </ScrollView>

      <ProductModal
        visible={modalVisible}
        product={editingProduct}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        showAlert={showAlert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.text },
  adminBadge: {
    fontSize: 11, fontWeight: '800', color: colors.blue,
    backgroundColor: 'rgba(56,139,253,0.15)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, letterSpacing: 0.8,
  },
  tabsRow: { paddingVertical: 12, flexGrow: 0 },
  adminTab: {
    paddingHorizontal: 14, height: 38, justifyContent: 'center',
    borderRadius: 8, backgroundColor: colors.surface2,
    flexShrink: 0,
  },
  adminTabActive: { backgroundColor: colors.accent },
  adminTabText: { fontSize: 13, fontWeight: '700', color: colors.text2 },
  adminTabTextActive: { color: '#fff' },
  content: { padding: 16, gap: 10, paddingBottom: 32 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 6 },
  statCard: { width: '47.5%', padding: 16 },
  statLabel: { fontSize: 11, color: colors.text2, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 },
  statValue: { fontSize: 26, fontWeight: '900' },
  alertCard: { padding: 16, backgroundColor: 'rgba(248,81,73,0.05)', marginBottom: 16 },
  lowStockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(248,81,73,0.1)' },
  topProductCard: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 4, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 6, marginBottom: 8 },
  miniOrder: { padding: 14 },
  actionRow: { flexDirection: 'row', marginBottom: 4 },
  productRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  productName: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 3 },
  editBtn: {
    width: 34, height: 34, backgroundColor: colors.surface2, borderWidth: 1.5,
    borderColor: colors.border, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  deleteBtn: {
    width: 34, height: 34, backgroundColor: 'rgba(248,81,73,0.1)', borderWidth: 1.5,
    borderColor: 'rgba(248,81,73,0.3)', borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  subLabel: { fontSize: 13, color: colors.text2, marginBottom: 4 },
  userRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  userAvatar: {
    width: 40, height: 40, backgroundColor: colors.accent, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  roleTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  roleAdmin: { backgroundColor: 'rgba(56,139,253,0.12)' },
  roleUser: { backgroundColor: 'rgba(63,185,80,0.12)' },
  orderCard: { padding: 16 },
  statusTag: {
    backgroundColor: 'rgba(63,185,80,0.15)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '90%',
    borderWidth: 1, borderColor: colors.border,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: colors.text },
  closeBtn: {
    width: 32, height: 32, backgroundColor: colors.surface2,
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  label: { fontSize: 11, fontWeight: '600', color: colors.text2, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  catChip: {
    paddingHorizontal: 12, height: 36, justifyContent: 'center',
    borderRadius: 8, backgroundColor: colors.surface2,
    flexShrink: 0,
  },
  catChipActive: { backgroundColor: colors.accent },
  catChipText: { fontSize: 12, fontWeight: '700', color: colors.text2 },
});
