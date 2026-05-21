import { Platform } from 'react-native';

/**
 * Physical Android (USB): keep USE_PC_LAN_IP false, plug in USB, run:
 *   npm run reverse
 * then use 127.0.0.1 below.
 *
 * Physical Android (Wi‑Fi only, no USB): set USE_PC_LAN_IP true and fill PC_LAN_IP
 * from `ipconfig` (Wi‑Fi IPv4, e.g. 192.168.1.5). Phone and PC must be on same Wi‑Fi.
 */
const USE_PC_LAN_IP = false;
const PC_LAN_IP = '192.168.1.5';

export const API_HOST =
  USE_PC_LAN_IP && PC_LAN_IP
    ? PC_LAN_IP
    : Platform.OS === 'android'
      ? '127.0.0.1'
      : '127.0.0.1';

export const API_ORIGIN = `http://${API_HOST}:8000`;
export const API_BASE_URL = `${API_ORIGIN}/api`;
