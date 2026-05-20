import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { Card, EmptyState, Input } from '../components/UI';
import { useApp } from '../context/AppContext';

export default function OrdersScreen() {
  const { db, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recentes');

  const myOrders = db.orders
    .filter(o => o.user_id === currentUser.id)
    .filter(o => !search || o.id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'preco_maior') return b.valor_total - a.valor_total;
      if (sort === 'preco_menor') return a.valor_total - b.valor_total;
      if (sort === 'antigas') return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id);
    });

  const renderOrder = ({ item: order }) => {
    const items = db.order_items.filter(i => i.order_id === order.id);

    return (
      <Card style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View style={styles.statusTag}>
            <Text style={styles.statusText}>✓ {order.status}</Text>
          </View>
        </View>
        <Text style={styles.orderDate}>📅 {order.data}</Text>
        <View style={styles.productsList}>
          {items.map((i, idx) => {
            const p = db.products.find(x => x.id === i.product_id);
            return (
              <View key={idx} style={styles.productRow}>
                <Image source={p?.imagem} style={styles.miniImage} resizeMode="cover" />
                <Text style={styles.productLine}>
                  {p?.nome || 'Produto'} <Text style={{ fontWeight: '700' }}>×{i.quantidade}</Text>
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>{order.valor_total.toFixed(2)}€</Text>
          <Text style={styles.itemCount}>{items.length} produto{items.length !== 1 ? 's' : ''}</Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.title}>Encomendas</Text>
        <Text style={styles.sub}>{myOrders.length} total</Text>
      </View>
      <FlatList
        data={myOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: 4 }}>
            <Input
              placeholder="🔍 Pesquisar Encomenda..."
              value={search}
              onChangeText={setSearch}
              inputStyle={{ paddingVertical: 10 }}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: -4 }} contentContainerStyle={{ gap: 8 }}>
              {[
                { id: 'recentes', icon: '📅', label: 'Recentes' },
                { id: 'antigas', icon: '⏳', label: 'Antigas' },
                { id: 'preco_maior', icon: '💰', label: 'Maior Valor' },
                { id: 'preco_menor', icon: '📉', label: 'Menor Valor' }
              ].map(s => (
                <TouchableOpacity key={s.id} style={[styles.catChip, sort === s.id && styles.catChipActive]} onPress={() => setSort(s.id)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 12 }}>{s.icon}</Text>
                    <Text style={[styles.catChipText, sort === s.id && { color: '#fff' }]}>{s.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <EmptyState emoji="📦" title="Nenhuma encomenda" subtitle="As suas compras aparecerão aqui" />
        }
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
  sub: { fontSize: 13, color: colors.text2 },
  orderCard: { padding: 16 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontSize: 14, fontWeight: '800', color: colors.text2 },
  statusTag: {
    backgroundColor: 'rgba(63,185,80,0.15)',
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: '700', color: colors.green },
  orderDate: { fontSize: 13, color: colors.text2, marginBottom: 10 },
  productsList: { marginBottom: 12, gap: 8 },
  productRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniImage: { width: 30, height: 30, borderRadius: 4, backgroundColor: colors.surface2 },
  productLine: { fontSize: 13, color: colors.text3, flex: 1 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTotal: { fontSize: 20, fontWeight: '900', color: colors.accent },
  itemCount: { fontSize: 12, color: colors.text2 },
  catChip: {
    paddingHorizontal: 12, height: 36, justifyContent: 'center', borderRadius: 8,
    backgroundColor: colors.surface2,
    flexShrink: 0,
  },
  catChipActive: { backgroundColor: colors.accent },
  catChipText: { fontSize: 12, fontWeight: '700', color: colors.text2 },
});
