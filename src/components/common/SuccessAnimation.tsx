import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';

export default function SuccessAnimation() {
  return (
    <View style={styles.wrapper}>
      {/* Outer ring scale in */}
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 100 }}
        style={styles.outerRing}
      >
        {/* Inner circle */}
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 200 }}
          style={styles.innerCircle}
        >
          {/* Checkmark */}
          <MotiView
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 400 }}
          >
            <MaterialIcons name="check" size={48} color={Colors.white} />
          </MotiView>
        </MotiView>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
