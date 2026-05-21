import { Platform } from 'react-native';

/**
 * Physical Android (USB): keep USE_PC_LAN_IP false, plug in USB, run:
 *   npm run reverse
 * then use 127.0.0.1 below.
 *
 * Physical Android (Wi‑Fi only, no USB): set USE_PC_LAN_IP true and fill PC_LAN_IP
 * from `ipconfig` (Wi‑Fi IPv4, e.g. 192.168.1.5). Phone and PC must be on same Wi‑Fi.
 *
 * Android emulator only: set host to 10.0.0.2 (not needed for physical devices).
 */
const USE_PC_LAN_IP = false;
const PC_LAN_IP = '192.168.1.5'; // your PC Wi‑Fi IPv4 from ipconfig

const host =
  USE_PC_LAN_IP && PC_LAN_IP
    ? PC_LAN_IP
    : Platform.OS === 'android'
      ? '127.0.0.1'
      : '127.0.0.1';

export const API_BASE_URL = `http://127.0.0.1:8000/api`;
