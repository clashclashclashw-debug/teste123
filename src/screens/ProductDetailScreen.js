import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { Button, Tag, StockTag, Badge } from '../components/UI';
import { useApp } from '../context/AppContext';
import { useCustomAlert } from '../context/AlertContext';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const { db, addToCart, cartCount, cart } = useApp();
  const { showAlert } = useCustomAlert();
  const [qty, setQty] = useState(1);

  const product = db.products.find(p => p.id === productId);
  const inCart = cart.find(i => i.product_id === productId);
  if (!product) return null;

  const changeQty = (delta) => {
    setQty(q => Math.max(1, Math.min(product.stock, q + delta)));
  };

  const handleAddToCart = () => {
    try {
      addToCart(product.id, qty);
      showAlert('✓ Adicionado!', `${qty}× ${product.nome} adicionado ao carrinho.`, [
        { text: 'Ver Carrinho', onPress: () => navigation.navigate('Cart') },
        { text: 'Continuar', style: 'cancel' },
      ]);
    } catch (e) {
      showAlert('Erro', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'relative', padding: 8 }} onPress={() => navigation.navigate('Cart')}>
          <Text style={{ fontSize: 22 }}>🛒</Text>
          {cartCount > 0 && <Badge count={cartCount} />}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Big emoji */}
        <View style={styles.imageArea}>
          <Image source={product.imagem} style={styles.detailImage} resizeMode="cover" />
        </View>

        <View style={styles.body}>
          <Tag label={product.categoria} />
          <Text style={styles.name}>{product.nome}</Text>
          <Text style={styles.desc}>{product.descricao}</Text>

          <Text style={styles.price}>{product.preco.toFixed(2)}€</Text>
          <StockTag stock={product.stock} />

          {inCart && (
            <View style={styles.inCartNote}>
              <Text style={{ color: colors.green, fontSize: 13, fontWeight: '600' }}>
                ✓ Já tem {inCart.quantidade} no carrinho
              </Text>
            </View>
          )}

          {product.stock > 0 && (
            <>
              <Text style={styles.qtyLabel}>Quantidade</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(-1)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => changeQty(1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.qtySubtotal}>= {(product.preco * qty).toFixed(2)}€</Text>
              </View>

              <Button title="Adicionar ao Carrinho 🛒" onPress={handleAddToCart} style={{ marginTop: 12 }} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 15, color: colors.accent, fontWeight: '600' },
  imageArea: {
    height: 300,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  body: { padding: 20 },
  name: { fontSize: 26, fontWeight: '900', color: colors.text, marginTop: 10, marginBottom: 10, lineHeight: 32 },
  desc: { fontSize: 15, color: colors.text2, lineHeight: 22, marginBottom: 20 },
  price: { fontSize: 32, fontWeight: '900', color: colors.accent, marginBottom: 10 },
  inCartNote: {
    backgroundColor: 'rgba(63,185,80,0.1)', borderWidth: 1, borderColor: 'rgba(63,185,80,0.3)',
    borderRadius: radius.sm, padding: 12, marginTop: 12,
  },
  qtyLabel: { fontSize: 12, fontWeight: '600', color: colors.text2, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 20, marginBottom: 10 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 40, height: 40,
    backgroundColor: colors.surface2,
    borderWidth: 1.5, borderColor: colors.border,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 20, fontWeight: '700', color: colors.text },
  qtyNum: { fontSize: 22, fontWeight: '800', color: colors.text, minWidth: 30, textAlign: 'center' },
  qtySubtotal: { fontSize: 16, color: colors.text2, fontWeight: '600' },
});
