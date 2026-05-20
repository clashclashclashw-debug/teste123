import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors, radius } from '../theme';
import { Button } from '../components/UI';

const AlertContext = createContext({});

export const useCustomAlert = () => useContext(AlertContext);

export function AlertProvider({ children }) {
  const [alertConfig, setAlertConfig] = useState(null);

  const showAlert = (title, message, buttons) => {
    setAlertConfig({
      title,
      message,
      buttons: buttons || [{ text: 'OK', onPress: () => {} }],
    });
  };

  const closeAlert = () => {
    setAlertConfig(null);
  };

  const handlePress = (onPress) => {
    closeAlert();
    if (onPress) {
      setTimeout(() => {
        onPress();
      }, 50); // slight delay to allow modal close animation to begin
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        visible={!!alertConfig}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.alertBox}>
            {alertConfig?.title ? (
              <Text style={styles.title}>{alertConfig.title}</Text>
            ) : null}
            {alertConfig?.message ? (
              <Text style={styles.message}>{alertConfig.message}</Text>
            ) : null}
            
            <View style={styles.buttonsRow}>
              {alertConfig?.buttons?.map((btn, index) => {
                const isDestructive = btn.style === 'destructive';
                const isCancel = btn.style === 'cancel';
                const variant = isDestructive ? 'danger' : (isCancel ? 'secondary' : 'primary');
                
                return (
                  <Button
                    key={index}
                    title={btn.text}
                    variant={variant}
                    style={[{ flex: 1 }, index > 0 && { marginLeft: 8 }]}
                    onPress={() => handlePress(btn.onPress)}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.text2,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
