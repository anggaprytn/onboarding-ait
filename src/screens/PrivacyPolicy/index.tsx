import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from '../../components';
import { WebView } from 'react-native-webview';

const url = 'https://onboardingait.tiiny.site/';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <Header title="Privacy Police" />
      <View style={styles.webView}>
        <WebView source={{ uri: url }} />
      </View>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  webView: { flex: 1, backgroundColor: 'transparent' },
});
