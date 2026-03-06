import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface TimelineStep {
  label: string;
  description?: string;
  timestamp?: string;
  state: 'completed' | 'current' | 'pending';
}

interface Props {
  steps: TimelineStep[];
}

const STATE_COLORS = {
  completed: Colors.success,
  current: Colors.info,
  pending: Colors.light.surface3,
};

const STATE_ICONS: Record<string, string> = {
  completed: 'check-circle',
  current: 'radio-button-checked',
  pending: 'radio-button-unchecked',
};

export default function OrderTimeline({ steps }: Props) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const color = STATE_COLORS[step.state];
        const icon = STATE_ICONS[step.state];
        const isLast = index === steps.length - 1;

        return (
          <View key={index} style={styles.stepRow}>
            <View style={styles.indicatorCol}>
              <MaterialIcons name={icon} size={20} color={color} />
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: step.state === 'completed' ? Colors.success : Colors.light.surface3 },
                  ]}
                />
              )}
            </View>
            <View style={[styles.content, !isLast && styles.contentWithLine]}>
              <Text
                style={[
                  Typography.h4,
                  { color: step.state === 'pending' ? Colors.text.tertiary : Colors.text.primary },
                ]}
              >
                {step.label}
              </Text>
              {step.description && (
                <Text style={[Typography.caption, styles.description]}>{step.description}</Text>
              )}
              {step.timestamp && (
                <Text style={[Typography.caption, styles.timestamp]}>{step.timestamp}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
  },
  indicatorCol: {
    width: 28,
    alignItems: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  contentWithLine: {
    paddingBottom: Spacing.xl,
  },
  description: {
    color: Colors.text.secondary,
    marginTop: 2,
  },
  timestamp: {
    color: Colors.text.tertiary,
    marginTop: 2,
  },
});
