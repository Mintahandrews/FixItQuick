import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'keyboard',
    name: 'Keyboard Issues',
    icon: 'Keyboard',
    description: 'Solutions for function keys, special keys, and keyboard shortcuts'
  },
  {
    id: 'display',
    name: 'Display Problems',
    icon: 'Monitor',
    description: 'Screen resolution, brightness, and connection issues'
  },
  {
    id: 'audio',
    name: 'Audio Fixes',
    icon: 'Volume2',
    description: 'Sound not working, microphone issues, and volume controls'
  },
  {
    id: 'wifi',
    name: 'Wi-Fi & Internet',
    icon: 'Wifi',
    description: 'Connection problems, slow internet, and networking issues'
  },
  {
    id: 'battery',
    name: 'Battery & Power',
    icon: 'Battery',
    description: 'Battery life, charging problems, and power settings'
  },
  {
    id: 'software',
    name: 'Software Issues',
    icon: 'AppWindow',
    description: 'Applications not working, updates, and installation help'
  }
];
