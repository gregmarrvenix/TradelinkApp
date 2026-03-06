import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  StyleSheet,
} from 'react-native';
import { MotiView } from 'moti';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

import { useThemeStore } from '../../store/themeStore';
import { useLists } from '../../hooks/useLists';
import ListCard from '../../components/lists/ListCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Button from '../../components/common/Button';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';
import type { ListsScreenProps } from '../../navigation/types';
import type { SavedList } from '../../types';

export default function ListsScreen({ navigation }: ListsScreenProps) {
  const colors = useThemeStore((s) => s.colors)();
  const { data: lists, isLoading, refetch } = useLists();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleCreateList = useCallback(() => {
    if (!newListName.trim()) return;
    Toast.show({ type: 'success', text1: 'List Created', text2: `"${newListName.trim()}" has been created` });
    setNewListName('');
    setModalVisible(false);
  }, [newListName]);

  const renderItem = useCallback(
    ({ item, index }: { item: SavedList; index: number }) => (
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 350, delay: index * 60 }}
      >
        <ListCard
          list={item}
          onPress={() => navigation.navigate('ListDetail', { listId: item.id })}
        />
      </MotiView>
    ),
    [navigation],
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.content}>
          <LoadingSkeleton variant="listItem" count={5} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, marginRight: 12 }}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[Typography.h2, { color: colors.textPrimary, flex: 1 }]}>My Lists</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: Colors.brand.blue }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brand.blue}
            colors={[Colors.brand.blue]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="list-alt"
            title="No Lists Yet"
            subtitle="Create a list to save your frequently ordered products"
            action={
              <Button label="Create a List" onPress={() => setModalVisible(true)} />
            }
          />
        }
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        backdropOpacity={0.6}
        style={styles.modal}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[Typography.h3, { color: colors.textPrimary, marginBottom: Spacing.lg }]}>
            Create New List
          </Text>
          <TextInput
            value={newListName}
            onChangeText={setNewListName}
            placeholder="List name"
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface2,
                color: colors.textPrimary,
                borderColor: colors.border,
              },
            ]}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreateList}
          />
          <View style={styles.modalButtons}>
            <Button
              label="Cancel"
              variant="ghost"
              onPress={() => {
                setNewListName('');
                setModalVisible(false);
              }}
            />
            <Button
              label="Create"
              onPress={handleCreateList}
              disabled={!newListName.trim()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.screen, paddingTop: Spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.huge,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xxl,
  },
  input: {
    ...Typography.bodyLg,
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
});
