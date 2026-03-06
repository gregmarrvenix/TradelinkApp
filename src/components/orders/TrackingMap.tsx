import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

interface Props {
  driverName?: string;
  eta?: string;
  destination?: string;
}

export default function TrackingMap({ driverName, eta, destination }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <MaterialIcons name="map" size={48} color={Colors.text.tertiary} />
        <Text style={[Typography.body, styles.mapText]}>Map View</Text>
      </View>
      <View style={styles.overlay}>
        {driverName && (
          <View style={styles.infoRow}>
            <MaterialIcons name="local-shipping" size={18} color={Colors.brand.red} />
            <Text style={[Typography.body, styles.infoText]}>
              Driver: <Text style={styles.infoValue}>{driverName}</Text>
            </Text>
          </View>
        )}
        {eta && (
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={18} color={Colors.success} />
            <Text style={[Typography.body, styles.infoText]}>
              ETA: <Text style={[styles.infoValue, { color: Colors.success }]}>{eta}</Text>
            </Text>
          </View>
        )}
        {destination && (
          <View style={styles.infoRow}>
            <MaterialIcons name="place" size={18} color={Colors.info} />
            <Text style={[Typography.body, styles.infoText]} numberOfLines={1}>
              {destination}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: Colors.dark.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    color: Colors.text.tertiary,
    marginTop: Spacing.sm,
  },
  overlay: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: { color: Colors.text.secondary },
  infoValue: { color: Colors.text.primary, fontWeight: '600' },
});
