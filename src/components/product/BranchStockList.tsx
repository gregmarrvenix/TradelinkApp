import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import StockBadge from './StockBadge';

interface BranchStock {
  branchId: string;
  branchName: string;
  status: string;
  qty: number;
}

interface Props {
  branches: BranchStock[];
  homeBranchId?: string;
}

export default function BranchStockList({ branches, homeBranchId }: Props) {
  return (
    <View>
      <Text style={[Typography.label, styles.header]}>BRANCH AVAILABILITY</Text>
      <FlatList
        data={branches}
        scrollEnabled={false}
        keyExtractor={(item) => item.branchId}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const isHome = item.branchId === homeBranchId;
          return (
            <View style={styles.row}>
              <View style={styles.branchInfo}>
                <View style={styles.nameRow}>
                  <MaterialIcons name="store" size={16} color={Colors.text.secondary} />
                  <Text style={[Typography.body, styles.branchName]}>{item.branchName}</Text>
                  {isHome && (
                    <View style={styles.homeBadge}>
                      <Text style={[Typography.overline, { color: Colors.brand.red }]}>HOME</Text>
                    </View>
                  )}
                </View>
              </View>
              <StockBadge status={item.status} qty={item.qty} />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  branchInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  branchName: { color: Colors.text.primary },
  homeBadge: {
    backgroundColor: Colors.brand.redFaded,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.dark.borderFaint,
  },
});
