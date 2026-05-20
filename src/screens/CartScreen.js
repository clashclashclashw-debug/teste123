import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { Button, EmptyState, Card, Divider } from '../components/UI';
import { useApp } from '../context/AppContext';
import { useCustomAlert } from '../context/AlertContext';

export default function CartScreen({ navigation }) {
  const { cart, db, updateCartQty, removeFromCart, clearCart, cartTotal, cartCount, checkout } = useApp();
  const { showAlert } = useCustomAlert();

  const handleCheckout = () => {
    showAlert(
      'Confirmar Encomenda',
      `Total: ${cartTotal.toFixed(2)}€\n\nDeseja finalizar a compra?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar', onPress: () => {
            try {
              const orderId = checkout();
              showAlert('✅ Encomenda Confirmada!', `ID: ${orderId}\nTotal: ${cartTotal.toFixed(2)}€`, [
                { text: 'Ver Encomendas', onPress: () => navigation.navigate('Orders') },
                { text: 'Continuar', style: 'cancel' },
              ]);
            } catch (e) {
              showAlert('Erro', e.message);
            }
          }
        },
      ]
    );
  };

  const handleClear = () => {
    showAlert('Esvaziar Carrinho', 'Tem a certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Esvaziar', style: 'destructive', onPress: clearCart },
    ]);
  };

  if (!cart.length) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topbar}>
          <Text style={styles.title}>Carrinho</Text>
        </View>
        <EmptyState emoji="🛒" title="Carrinho vazio" subtitle="Adicione produtos para continuar"
          action="Ver Produtos →" onAction={() => navigation.navigate('HomeTab')} />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => {
    const p = db.products.find(x => x.id === item.product_id);
    if (!p) return null;
    return (
      <View style={styles.cartItem}>
        <Image source={p.imagem} style={styles.itemImage} resizeMode="cover" />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>{p.nome}</Text>
          <Text style={styles.itemPrice}>{p.preco.toFixed(2)}€/un.</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.miniBtn} onPress={() => updateCartQty(p.id, item.quantidade - 1)}>
              <Text style={styles.miniBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNum}>{item.quantidade}</Text>
            <TouchableOpacity style={styles.miniBtn} onPress={() => updateCartQty(p.id, item.quantidade + 1)}>
              <Text style={styles.miniBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.itemTotal}>{(p.preco * item.quantidade).toFixed(2)}€</Text>
          <TouchableOpacity onPress={() => removeFromCart(p.id)} style={{ padding: 4 }}>
            <Text style={{ fontSize: 20 }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const items = cart.reduce((a, c) => a + c.quantidade, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.title}>Carrinho</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={{ color: colors.red, fontSize: 13, fontWeight: '600' }}>Esvaziar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        keyExtractor={item => String(item.product_id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Card style={{ padding: 16, marginTop: 8 }}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Artigos ({items})</Text>
              <Text style={styles.summaryValue}>{cartTotal.toFixed(2)}€</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Portes</Text>
              <Text style={[styles.summaryValue, { color: colors.green }]}>Grátis</Text>
            </View>
            <Divider style={{ marginHorizontal: 0, marginVertical: 12 }} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{cartTotal.toFixed(2)}€</Text>
            </View>
            <Button title="Finalizar Encomenda →" onPress={handleCheckout} style={{ marginTop: 16 }} />
          </Card>
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
  cartItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: 14,
  },
  itemImage: {
    width: 60, height: 60,
    borderRadius: 8,
    backgroundColor: colors.surface2,
  },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  itemPrice: { fontSize: 12, color: colors.accent, fontWeight: '600', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniBtn: {
    width: 28, height: 28,
    backgroundColor: colors.surface2,
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 6, alignItems: 'center', justifyContent: 'center',
  },
  miniBtnText: { fontSize: 16, fontWeight: '700', color: colors.text },
  qtyNum: { fontSize: 15, fontWeight: '700', color: colors.text, minWidth: 20, textAlign: 'center' },
  itemRight: { alignItems: 'flex-end', gap: 4 },
  itemTotal: { fontSize: 15, fontWeight: '800', color: colors.text },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: colors.text2 },
  summaryValue: { fontSize: 14, color: colors.text, fontWeight: '600' },
  totalLabel: { fontSize: 18, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '900', color: colors.accent },
});
