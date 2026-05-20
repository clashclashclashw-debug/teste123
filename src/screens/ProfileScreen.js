import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { Button, Card } from '../components/UI';
import { useApp } from '../context/AppContext';
import { useCustomAlert } from '../context/AlertContext';

export default function ProfileScreen() {
  const { currentUser, db, logout } = useApp();
  const { showAlert } = useCustomAlert();

  const myOrders = db.orders.filter(o => o.user_id === currentUser.id);
  const totalSpent = myOrders.reduce((a, o) => a + o.valor_total, 0);

  const handleLogout = () => {
    showAlert('Terminar Sessão', 'Tem a certeza que quer sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  const InfoRow = ({ label, value, valueStyle }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Text style={styles.title}>Perfil</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Avatar */}
        <View style={styles.avatarArea}>
          <View style={[styles.avatar, currentUser.role === 'admin' && { backgroundColor: colors.blue }]}>
            <Text style={styles.avatarText}>{currentUser.nome[0]}</Text>
          </View>
          <Text style={styles.userName}>{currentUser.nome}</Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
          <View style={[styles.roleTag, currentUser.role === 'admin' ? styles.roleAdmin : styles.roleUser]}>
            <Text style={[styles.roleText, { color: currentUser.role === 'admin' ? colors.blue : colors.green }]}>
              {currentUser.role === 'admin' ? '👑 Administrador' : '👤 Cliente'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        {currentUser.role !== 'admin' && (
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statNum}>{myOrders.length}</Text>
              <Text style={styles.statLabel}>Encomendas</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={[styles.statNum, { color: colors.accent }]}>{totalSpent.toFixed(2)}€</Text>
              <Text style={styles.statLabel}>Total Gasto</Text>
            </Card>
          </View>
        )}

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informação da Conta</Text>
          <Card>
            <InfoRow label="Nome" value={currentUser.nome} />
            <View style={styles.separator} />
            <InfoRow label="Email" value={currentUser.email} />
            <View style={styles.separator} />
            <InfoRow label="Membro desde" value={currentUser.created_at} />
            <View style={styles.separator} />
            <InfoRow label="ID de utilizador" value={`#${currentUser.id}`} />
          </Card>
        </View>

        <View style={styles.section}>
          <Button
            title="Terminar Sessão"
            onPress={handleLogout}
            variant="danger"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topbar: {
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  title: { fontSize: 22, fontWeight: '900', color: colors.text },
  avatarArea: { alignItems: 'center', paddingVertical: 28 },
  avatar: {
    width: 84, height: 84,
    backgroundColor: colors.accent,
    borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
    shadowColor: colors.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8,
  },
  avatarText: { fontSize: 36, fontWeight: '900', color: '#fff' },
  userName: { fontSize: 22, fontWeight: '900', color: colors.text, marginBottom: 4 },
  userEmail: { fontSize: 14, color: colors.text2, marginBottom: 12 },
  roleTag: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  roleAdmin: { backgroundColor: 'rgba(56,139,253,0.12)' },
  roleUser: { backgroundColor: 'rgba(63,185,80,0.12)' },
  roleText: { fontSize: 13, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 20 },
  statCard: { flex: 1, padding: 16, alignItems: 'center' },
  statNum: { fontSize: 24, fontWeight: '900', color: colors.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.text2 },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.text2, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, paddingHorizontal: 16 },
  infoLabel: { fontSize: 14, color: colors.text2 },
  infoValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  separator: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
});
