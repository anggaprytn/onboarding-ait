import * as Font from 'expo-font';
import { useEffect, useMemo, useState } from 'react';

interface FontObject {
  fontFamily: string;
  fontWeight: string;
}

interface UseFontResult {
  font: Record<string, FontObject> | null;
  loaded: boolean;
  error: Error | null;
}

export function useFont(): UseFontResult {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFont() {
      try {
        await Font.loadAsync({
          'Satoshi-Regular': require('../../assets/fonts/Satoshi-Regular.otf'),
          'Satoshi-Light': require('../../assets/fonts/Satoshi-Light.otf'),
          'Satoshi-Medium': require('../../assets/fonts/Satoshi-Medium.otf'),
          'Satoshi-Bold': require('../../assets/fonts/Satoshi-Bold.otf'),
        });
        setLoaded(true);
      } catch (e: unknown) {
        // type annotation added here
        if (e instanceof Error) {
          // check if e is an instance of the Error class
          setError(e);
        }
      }
    }

    loadFont();
  }, []);

  const font = useMemo<Record<string, FontObject> | null>(() => {
    if (loaded) {
      return {
        'Satoshi-Regular': {
          fontFamily: 'Satoshi-Regular',
          fontWeight: 'normal',
        },
        'Satoshi-Light': {
          fontFamily: 'Satoshi-Light',
          fontWeight: 'normal',
        },
        'Satoshi-Medium': {
          fontFamily: 'Satoshi-Medium',
          fontWeight: 'normal',
        },
        'Satoshi-Bold': {
          fontFamily: 'Satoshi-Bold',
          fontWeight: 'normal',
        },
      };
    }
    return null;
  }, [loaded]);

  return { font, loaded, error };
}
