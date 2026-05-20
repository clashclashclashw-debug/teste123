import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius } from '../theme';

// ── Button ────────────────────────────────────────────────
export function Button({ title, onPress, variant = 'primary', style, textStyle, loading, disabled }) {
  const bg = variant === 'primary' ? colors.accent
    : variant === 'danger' ? 'rgba(248,81,73,0.12)'
    : variant === 'ghost' ? 'transparent'
    : colors.surface2;

  const textColor = variant === 'primary' ? '#fff'
    : variant === 'danger' ? colors.red
    : variant === 'ghost' ? colors.text2
    : colors.text3;

  const borderColor = variant === 'secondary' ? colors.border
    : variant === 'danger' ? 'rgba(248,81,73,0.3)'
    : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[styles.btn, { backgroundColor: bg, borderColor, borderWidth: variant !== 'primary' && variant !== 'ghost' ? 1.5 : 0, opacity: disabled ? 0.5 : 1 }, style]}
    >
      {loading
        ? <ActivityIndicator color={textColor} size="small" />
        : <Text style={[styles.btnText, { color: textColor }, textStyle]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

// ── Input ─────────────────────────────────────────────────
export function Input({ label, style, inputStyle, ...props }) {
  return (
    <View style={[styles.inputGroup, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholderTextColor={colors.text2}
        {...props}
      />
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, style, onPress }) {
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.card, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({ count }) {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

// ── Tag ───────────────────────────────────────────────────
export function Tag({ label, color = colors.blue }) {
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

// ── StockTag ──────────────────────────────────────────────
export function StockTag({ stock }) {
  const color = stock === 0 ? colors.red : stock <= 5 ? colors.yellow : colors.green;
  const label = stock === 0 ? '❌ Esgotado' : stock <= 5 ? `⚠️ Só ${stock} em stock` : `✅ ${stock} em stock`;
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Text style={[styles.tagText, { color }]}>{label}</Text>
    </View>
  );
}

// ── Divider ───────────────────────────────────────────────
export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

// ── EmptyState ────────────────────────────────────────────
export function EmptyState({ emoji, title, subtitle, action, onAction }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
      {action ? <Button title={action} onPress={onAction} style={{ marginTop: 16, paddingHorizontal: 24 }} /> : null}
    </View>
  );
}

// ── SectionHeader ─────────────────────────────────────────
export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <TouchableOpacity onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></TouchableOpacity> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text2,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.text,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: -6, right: -6,
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 60 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: colors.text2, textAlign: 'center', lineHeight: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  sectionAction: { fontSize: 13, color: colors.accent },
});
