import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

/**
 * Reproduces https://github.com/callstack/react-native-pager-view/issues/1103
 *
 * Android + Fabric only, pager-view >= 9.0.0 (regression from 8.0.5). A
 * screen using createMaterialTopTabNavigator is pushed with another screen
 * via a stack navigator, covering its Fragment. Going back to the tab
 * screen leaves the tab bar visible but the Compose-hosted page content
 * blank, because it doesn't get a fresh re-composition/re-layout when its
 * Fragment/Activity view is covered and then revealed again.
 */

function TabContent({ label, testID }: { label: string; testID: string }) {
  return (
    <View testID={testID} style={styles.tabContent}>
      <Text style={styles.tabText}>{label}</Text>
    </View>
  );
}

function Tab1() {
  return (
    <TabContent label="Tab 1 content" testID="issue-1103-tab-1-content" />
  );
}

function Tab2() {
  return (
    <TabContent label="Tab 2 content" testID="issue-1103-tab-2-content" />
  );
}

const TopTabs = createMaterialTopTabNavigator();

function TabsScreen({ navigation }: any) {
  return (
    <View style={styles.flex}>
      <Button
        title="Push detail screen"
        testID="issue-1103-push-detail"
        onPress={() => navigation.navigate('Issue1103Detail')}
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
      testID="issue-1103-detail-screen"
    >
      <Text>Detail screen</Text>
      <Button
        title="Go back"
        testID="issue-1103-go-back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export function Issue1103MaterialTopTabRepro() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Issue1103Tabs"
        component={TabsScreen}
        options={{ title: 'Tabs' }}
      />
      <Stack.Screen
        name="Issue1103Detail"
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
