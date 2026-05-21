import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/agrinest';
import type { PaymentMethod } from '../types/payment';

type PaymentMethodPickerProps = {
  methods: PaymentMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function PaymentMethodPicker({
  methods,
  selectedId,
  onSelect,
}: PaymentMethodPickerProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Payment method</Text>
      <Text style={styles.hint}>Demo only — tap to select, no real charge.</Text>
      {methods.map(method => {
        const selected = selectedId === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onSelect(method.id)}
            activeOpacity={0.8}
          >
            <View style={styles.optionRow}>
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected ? <View style={styles.radioDot} /> : null}
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{method.label}</Text>
                <Text style={styles.optionDesc}>{method.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.title,
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  option: {
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: colors.brandOrange,
    backgroundColor: colors.mediaBgStart,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.brandBrown,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioSelected: {
    borderColor: colors.brandOrange,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.brandOrange,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.title,
  },
  optionDesc: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
    lineHeight: 18,
  },
});
