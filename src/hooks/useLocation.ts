import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

interface Location {
  lat: number;
  lng: number;
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError('Location permission denied');
        return;
      }
      // Mock location: Parramatta, NSW
      setLocation({ lat: -33.8151, lng: 151.0011 });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  return { location, error, loading, getCurrentLocation };
}
