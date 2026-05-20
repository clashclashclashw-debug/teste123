import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { Button, Input } from '../components/UI';
import { useApp } from '../context/AppContext';
import { useCustomAlert } from '../context/AlertContext';

export default function AuthScreen() {
  const { login, register } = useApp();
  const { showAlert } = useCustomAlert();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [email, setEmail] = useState('admin@emergencia.pt');
  const [password, setPassword] = useState('admin123');

  // Register fields
  const [rNome, setRNome] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPassword, setRPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { showAlert('Erro', 'Preencha todos os campos.'); return; }
    setLoading(true);
    try {
      login(email.trim(), password);
    } catch (e) {
      showAlert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!rNome || !rEmail || !rPassword) { showAlert('Erro', 'Preencha todos os campos.'); return; }
    if (rPassword.length < 6) { showAlert('Erro', 'A password deve ter mínimo 6 caracteres.'); return; }
    setLoading(true);
    try {
      register(rNome.trim(), rEmail.trim(), rPassword);
    } catch (e) {
      showAlert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Logo Area */}
          <View style={styles.logoArea}>
            <Image
              source={{ uri: 'https://d1yei2z3i6k35z.cloudfront.net/16629453/69a435d052ad6_2.png' }}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
                onPress={() => setTab('login')}
              >
                <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, tab === 'register' && styles.tabBtnActive]}
                onPress={() => setTab('register')}
              >
                <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>Registar</Text>
              </TouchableOpacity>
            </View>

            {tab === 'login' ? (
              <>
                <Input label="Email" value={email} onChangeText={setEmail}
                  keyboardType="email-address" autoCapitalize="none" placeholder="email@exemplo.pt" />
                <Input label="Password" value={password} onChangeText={setPassword}
                  secureTextEntry placeholder="••••••••" />
                <Button title="Entrar →" onPress={handleLogin} loading={loading} />
                <View style={styles.hintBox}>
                  <Text style={styles.hintText}>Demo Admin: <Text style={{ color: colors.accent }}>admin@emergencia.pt</Text> / admin123</Text>
                  <Text style={styles.hintText}>Demo User: <Text style={{ color: colors.accent }}>joao@email.com</Text> / user123</Text>
                </View>
              </>
            ) : (
              <>
                <Input label="Nome Completo" value={rNome} onChangeText={setRNome} placeholder="João Silva" autoCapitalize="words" />
                <Input label="Email" value={rEmail} onChangeText={setREmail}
                  keyboardType="email-address" autoCapitalize="none" placeholder="email@exemplo.pt" />
                <Input label="Password" value={rPassword} onChangeText={setRPassword}
                  secureTextEntry placeholder="Mínimo 6 caracteres" />
                <Button title="Criar Conta →" onPress={handleRegister} loading={loading} />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  logoArea: { padding: 40, paddingBottom: 28, alignItems: 'center' },
  logoImage: { width: '100%', height: 80 },
  formCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
  },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 7, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.accent },
  tabText: { fontSize: 14, fontWeight: '700', color: colors.text2 },
  tabTextActive: { color: '#fff' },
  hintBox: {
    marginTop: 16,
    backgroundColor: colors.surface2,
    borderRadius: radius.sm,
    padding: 12,
    gap: 4,
  },
  hintText: { fontSize: 12, color: colors.text2, textAlign: 'center' },
});
