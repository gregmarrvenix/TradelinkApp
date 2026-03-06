import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCartStore } from '../../store/cartStore';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Shadows } from '../../theme/shadows';

interface Props {
  onPress: () => void;
  hidden?: boolean;
}

export default function FloatingCartButton({ onPress, hidden }: Props) {
  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (itemCount === 0 || hidden) return null;

  const subtotal = items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0);

  // On web, use a plain div with onClick for reliable click handling
  if (Platform.OS === 'web') {
    return React.createElement('div', {
      onClick: onPress,
      style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.brand.accent,
        borderRadius: 12,
        padding: '12px 20px',
        margin: '0 12px 4px 12px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(232, 68, 58, 0.3)',
        userSelect: 'none',
      },
    },
      React.createElement('span', {
        className: 'material-icons',
        style: { fontSize: 22, color: '#fff', marginRight: 12, width: 22, height: 22, lineHeight: '22px' },
      }, 'shopping_cart'),
      React.createElement('span', {
        style: {
          color: '#fff',
          fontSize: 13,
          fontWeight: '600',
          flex: 1,
        },
      }, `View Cart (${itemCount})`),
      React.createElement('span', {
        style: {
          color: '#fff',
          fontSize: 13,
          fontWeight: '700',
        },
      }, `$${subtotal.toFixed(2)}`),
    );
  }

  // Native: use TouchableOpacity with absolute positioning
  const { TouchableOpacity } = require('react-native');
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="shopping-cart" size={22} color={Colors.white} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
        </View>
      </View>
      <Text style={[Typography.label, styles.label]}>View Cart</Text>
      <Text style={[Typography.label, styles.price]}>
        ${subtotal.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: Colors.brand.accent,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    ...Shadows.blue,
    shadowColor: Colors.brand.accent,
    shadowOpacity: 0.3,
    elevation: 6,
    zIndex: 999,
  },
  iconWrap: {
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: Colors.white,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.brand.accent,
    fontSize: 10,
    fontWeight: '800',
  },
  label: {
    color: Colors.white,
    flex: 1,
  },
  price: {
    color: Colors.white,
    fontWeight: '700',
  },
});
