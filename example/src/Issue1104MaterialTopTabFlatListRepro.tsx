import React from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

/**
 * Reproduces https://github.com/callstack/react-native-pager-view/issues/1104
 *
 * Same navigation shape as Issue1103MaterialTopTabRepro (Material Top Tabs
 * pushed under another Stack screen and back), but this time the tab holds
 * a scrollable FlatList. Scroll it, cover the screen, come back: if the
 * pager rebuilds the page's AndroidView host from scratch on reattach, the
 * FlatList's native scroll position is lost.
 */

const DATA = Array.from({ length: 60 }, (_, i) => `Row ${i}`);

function Tab1() {
  return (
    <FlatList
      testID="issue-1104-flatlist"
      data={DATA}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <View testID={`issue-1104-row-${item}`} style={styles.row}>
          <Text style={styles.rowText}>{item}</Text>
        </View>
      )}
    />
  );
}

function Tab2() {
  return (
    <View testID="issue-1104-tab-2-content" style={styles.tabContent}>
      <Text style={styles.tabText}>Tab 2 content</Text>
    </View>
  );
}

const TopTabs = createMaterialTopTabNavigator();

function TabsScreen({ navigation }: any) {
  return (
    <View style={styles.flex}>
      <Button
        title="Push detail screen"
        testID="issue-1104-push-detail"
        onPress={() => navigation.navigate('Issue1104Detail')}
      />
      <TopTabs.Navigator>
        <TopTabs.Screen name="Tab1" component={Tab1} />
        <TopTabs.Screen name="Tab2" component={Tab2} />
      </TopTabs.Navigator>
    </View>
  );
}

function DetailScreen({ navigation }: any) {
  return (
    <View
      style={[styles.flex, styles.detail]}
      testID="issue-1104-detail-screen"
    >
      <Text>Detail screen</Text>
      <Button
        title="Go back"
        testID="issue-1104-go-back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export function Issue1104MaterialTopTabFlatListRepro() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Issue1104Tabs"
        component={TabsScreen}
        options={{ title: 'Tabs' }}
      />
      <Stack.Screen
        name="Issue1104Detail"
        component={DetailScreen}
        options={{ title: 'Detail' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rowText: {
    fontSize: 16,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  tabText: {
    fontSize: 18,
    fontWeight: '600',
  },
  detail: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d7f9e9',
  },
});
