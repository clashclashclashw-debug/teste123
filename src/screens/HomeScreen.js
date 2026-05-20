import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, Alert, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { Badge, Card, EmptyState, StockTag, Tag } from '../components/UI';
import { useApp } from '../context/AppContext';
import { useCustomAlert } from '../context/AlertContext';

const CATEGORIES = ['Todos', 'Kits Domiciliares', 'Kits Empresariais', 'Kits Outdoor', 'Produtos Individuais'];

export default function HomeScreen({ navigation }) {
  const { db, addToCart, cartCount, currentUser } = useApp();
  const { showAlert } = useCustomAlert();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredProducts = useMemo(() => {
    return db.products.filter(p => {
      const matchCat = activeCategory === 'Todos' || p.categoria === activeCategory;
      const q = search.toLowerCase();
      const matchQ = !q || p.nome.toLowerCase().includes(q) || p.descricao.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [db.products, activeCategory, search]);

  const handleAddToCart = (product) => {
    if (product.stock === 0) return;
    try {
      addToCart(product.id, 1);
      showAlert('✓ Adicionado!', `${product.nome} adicionado ao carrinho.`);
    } catch (e) {
      showAlert('Erro', e.message);
    }
  };

  const renderProduct = ({ item: p }) => {
    const stockColor = p.stock === 0 ? colors.red : p.stock <= 5 ? colors.yellow : colors.text2;
    const stockLabel = p.stock === 0 ? 'Esgotado' : p.stock <= 5 ? `Só ${p.stock} restantes` : `${p.stock} em stock`;
    return (
      <Card style={styles.productCard} onPress={() => navigation.navigate('ProductDetail', { productId: p.id })}>
        <View style={styles.productImageContainer}>
          <Image source={p.imagem} style={styles.productImage} resizeMode="cover" />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{p.nome}</Text>
          <Text style={styles.productPrice}>{p.preco.toFixed(2)}€</Text>
          <Text style={[styles.productStock, { color: stockColor }]}>{stockLabel}</Text>
          <TouchableOpacity
            style={[styles.addBtn, p.stock === 0 && styles.addBtnDisabled]}
            onPress={() => handleAddToCart(p)}
            disabled={p.stock === 0}
            activeOpacity={0.75}
          >
            <Text style={[styles.addBtnText, p.stock === 0 && { color: colors.text2 }]}>
              {p.stock === 0 ? 'Esgotado' : '+ Carrinho'}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <Image
          source={{ uri: 'https://d1yei2z3i6k35z.cloudfront.net/16629453/69a435d052ad6_2.png' }}
          style={styles.topbarLogo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
          <Text style={{ fontSize: 22 }}>🛒</Text>
          {cartCount > 0 && <Badge count={cartCount} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={<EmptyState emoji="🔍" title="Sem resultados" subtitle="Tente outra pesquisa ou categoria" />}
        ListHeaderComponent={
          <>
            {/* Hero */}
            <View style={styles.hero}>
              <Text style={styles.heroGreeting}>Olá, {currentUser?.nome?.split(' ')[0]}! 👋</Text>
              <Text style={styles.heroTitle}>Preparado para qualquer emergência?</Text>
              <Text style={styles.heroSub}>Kits profissionais de sobrevivência.</Text>
            </View>

            {/* Search */}
            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Pesquisar produtos..."
                placeholderTextColor={colors.text2}
              />
              {search ? (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Text style={{ color: colors.text2, fontSize: 18, marginRight: 4 }}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catsRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Produtos</Text>
              <Text style={styles.sectionCount}>{filteredProducts.length} artigos</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <View style={{ padding: 20, alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 12, color: colors.text2, textAlign: 'center' }}>
              Este projeto é um trabalho académico e não tem fins comerciais.
            </Text>
          </View>
        }
        renderItem={renderProduct}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  topbarLogo: { height: 32, width: 140 },
  cartBtn: { position: 'relative', padding: 8 },
  listContent: { paddingBottom: 16 },
  columnWrapper: { paddingHorizontal: 16, gap: 12 },
  hero: {
    margin: 16, marginBottom: 0,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    padding: 20,
  },
  heroGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.sm, paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, color: colors.text, fontSize: 14 },
  catsRow: { marginTop: 12, marginBottom: 4 },
  catPill: {
    paddingHorizontal: 14, height: 36, justifyContent: 'center',
    borderRadius: 20, backgroundColor: colors.surface2,
    flexShrink: 0,
  },
  catPillActive: { backgroundColor: colors.accent },
  catText: { fontSize: 12, fontWeight: '600', color: colors.text2 },
  catTextActive: { color: '#fff' },
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  sectionCount: { fontSize: 13, color: colors.text2 },
  productCard: { flex: 1, marginBottom: 12 },
  productImageContainer: {
    height: 120, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface2,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: { padding: 10 },
  productName: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 4, lineHeight: 18 },
  productPrice: { fontSize: 16, fontWeight: '800', color: colors.accent, marginBottom: 4 },
  productStock: { fontSize: 11, marginBottom: 8 },
  addBtn: {
    backgroundColor: colors.accent,
    borderRadius: 6, paddingVertical: 7,
    alignItems: 'center',
  },
  addBtnDisabled: { backgroundColor: colors.surface2 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
