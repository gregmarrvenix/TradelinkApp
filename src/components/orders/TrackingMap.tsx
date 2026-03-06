import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

// Static map tile from OpenStreetMap centered on Parramatta
const MAP_IMAGE = 'https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:151.005,-33.814&zoom=14&marker=lonlat:151.005,-33.810;type:awesome;color:%231B4F7C;size:large|lonlat:151.008,-33.814;type:awesome;color:%23E8443A;size:large&apiKey=demo';

interface Props {
  driverName?: string;
  eta?: string;
  destination?: string;
}

export default function TrackingMap({ driverName, eta, destination }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Image
          source={{ uri: `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/151.005,-33.814,14,0/600x400?access_token=pk.placeholder` }}
          style={styles.mapImage}
          resizeMode="cover"
          defaultSource={undefined}
        />
        {/* Fallback if image doesn't load */}
        <View style={styles.mapFallback}>
          <View style={styles.mapGrid}>
            {/* Simulated street grid */}
            <View style={[styles.road, styles.roadH, { top: '30%' }]} />
            <View style={[styles.road, styles.roadH, { top: '55%' }]} />
            <View style={[styles.road, styles.roadH, { top: '80%' }]} />
            <View style={[styles.road, styles.roadV, { left: '25%' }]} />
            <View style={[styles.road, styles.roadV, { left: '50%' }]} />
            <View style={[styles.road, styles.roadV, { left: '75%' }]} />
            {/* Route line */}
            <View style={styles.routeLine} />
          </View>
          {/* Driver marker */}
          <View style={[styles.marker, { top: '35%', left: '40%' }]}>
            <MaterialIcons name="local-shipping" size={20} color={Colors.white} />
          </View>
          {/* Destination marker */}
          <View style={[styles.marker, styles.destMarker, { top: '65%', left: '65%' }]}>
            <MaterialIcons name="place" size={20} color={Colors.white} />
          </View>
        </View>
      </View>
      <View style={styles.overlay}>
        {driverName && (
          <View style={styles.infoRow}>
            <MaterialIcons name="local-shipping" size={18} color={Colors.brand.blue} />
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
    borderColor: Colors.light.border,
  },
  mapPlaceholder: {
    height: 240,
    backgroundColor: '#E8EDF3',
    position: 'relative',
    overflow: 'hidden',
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  mapFallback: {
    ...StyleSheet.absoluteFillObject,
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  road: {
    position: 'absolute',
    backgroundColor: '#D0D8E2',
  },
  roadH: {
    left: 0,
    right: 0,
    height: 3,
  },
  roadV: {
    top: 0,
    bottom: 0,
    width: 3,
  },
  routeLine: {
    position: 'absolute',
    top: '35%',
    left: '40%',
    width: '30%',
    height: 3,
    backgroundColor: Colors.brand.blue,
    transform: [{ rotate: '35deg' }],
    borderRadius: 2,
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brand.blue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  destMarker: {
    backgroundColor: Colors.brand.accent,
  },
  overlay: {
    backgroundColor: Colors.white,
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
