import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import StatusPill from '../common/StatusPill';

interface Props {
  orderNumber: string;
  status: string;
  eta?: string;
  deliveryMethod: 'delivery' | 'pickup';
  onPress: () => void;
  onTrack: () => void;
}

export default function ActiveDeliveryCard({
  orderNumber, status, eta, deliveryMethod, onPress, onTrack,
}: Props) {
  const isPickup = deliveryMethod === 'pickup';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={['#0A1F0A', '#0F0F0F']}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={[Typography.overline, { color: Colors.success }]}>
              {isPickup ? 'CLICK & COLLECT' : 'DELIVERY'}
            </Text>
            <Text style={[Typography.h3, { color: Colors.text.primary, marginTop: 4 }]}>
              {orderNumber}
            </Text>
          </View>
          <StatusPill status={status} size="md" />
        </View>
        <View style={styles.bottomRow}>
          {eta && (
            <>
              <MaterialIcons name="schedule" size={14} color={Colors.text.secondary} />
              <Text style={[Typography.body, { color: Colors.text.secondary, marginLeft: 4 }]}>
                ETA: <Text style={{ color: Colors.success, fontWeight: '600' }}>{eta}</Text>
              </Text>
            </>
          )}
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={onTrack}>
            <Text style={[Typography.label, { color: Colors.brand.red }]}>Track &rarr;</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.success + '33',
    marginBottom: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
