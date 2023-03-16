// App.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { Header } from '../../components';

const TermsAndConditions: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    async function loadHtmlFile() {
      try {
        const asset = Asset.fromModule(
          require('../../assets/html/content.html'),
        );
        await asset.downloadAsync();

        if (asset.localUri) {
          const content = await FileSystem.readAsStringAsync(asset.localUri);
          setHtmlContent(content);
        } else {
          console.error('Error loading HTML file: localUri is null');
        }
      } catch (error) {
        console.error('Error loading HTML file:', error);
      }
    }

    loadHtmlFile();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Terms & Conditions" />

      {htmlContent ? (
        <WebView
          originWhitelist={['*']}
          source={{
            html: htmlContent,
            baseUrl:
              Asset.fromModule(require('../../assets/html/content.html'))
                .localUri ?? undefined,
          }}
          style={styles.webView}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  webView: {
    flex: 1,
  },
});

export default TermsAndConditions;
