import { Solution } from '../types';

export const solutions: Solution[] = [
  {
    id: 'function-keys-locked',
    title: 'Function Keys Not Working (Fn Lock)',
    category: 'keyboard',
    shortDescription: 'Fix function keys that are performing special actions instead of F1-F12 functions',
    difficulty: 'easy',
    steps: [
      {
        title: 'Identify your function lock key',
        description: 'Look for the "Fn Lock" or "FnLk" key on your keyboard. It\'s often the Escape key or F1-F12 key with a lock symbol.'
      },
      {
        title: 'Toggle function lock',
        description: 'Press and hold the Fn key, then press the Fn Lock key (often Esc or a function key). This toggles between standard F1-F12 behavior and special functions.'
      },
      {
        title: 'Check function key behavior',
        description: 'Try using a function key. If it now performs its standard F1-F12 function, you\'ve successfully unlocked the function keys.'
      },
      {
        title: 'Alternative method',
        description: 'On some laptops, you may need to press Fn + Ctrl, Fn + Caps Lock, or Fn + Shift to toggle function lock.'
      }
    ],
    relatedSolutions: ['keyboard-shortcuts', 'keyboard-not-typing']
  },
  {
    id: 'keyboard-shortcuts',
    title: 'Essential Keyboard Shortcuts',
    category: 'keyboard',
    shortDescription: 'Learn the most useful keyboard shortcuts to boost productivity',
    difficulty: 'easy',
    steps: [
      {
        title: 'Copy, Cut, and Paste',
        description: 'Copy: Ctrl+C (Cmd+C on Mac)\nCut: Ctrl+X (Cmd+X on Mac)\nPaste: Ctrl+V (Cmd+V on Mac)'
      },
      {
        title: 'Undo and Redo',
        description: 'Undo: Ctrl+Z (Cmd+Z on Mac)\nRedo: Ctrl+Y or Ctrl+Shift+Z (Cmd+Shift+Z on Mac)'
      },
      {
        title: 'Select All',
        description: 'Ctrl+A (Cmd+A on Mac) selects all content in the current document or window'
      },
      {
        title: 'Switch between applications',
        description: 'Alt+Tab (Cmd+Tab on Mac) lets you quickly switch between open applications'
      }
    ]
  },
  {
    id: 'wifi-not-connecting',
    title: 'Wi-Fi Not Connecting',
    category: 'wifi',
    shortDescription: 'Troubleshoot when your device won\'t connect to Wi-Fi networks',
    difficulty: 'medium',
    steps: [
      {
        title: 'Check Wi-Fi is turned on',
        description: 'Ensure the Wi-Fi switch or function key is enabled. Look for the Wi-Fi icon in your system tray or menu bar.'
      },
      {
        title: 'Restart your device',
        description: 'Sometimes simply restarting your laptop or phone can resolve connection issues.'
      },
      {
        title: 'Forget and reconnect to network',
        description: 'Go to Wi-Fi settings, find your network, select "Forget" or "Remove", then reconnect with the password.'
      },
      {
        title: 'Reset network settings',
        description: 'If all else fails, you can reset your network settings (this will remove all saved networks).'
      }
    ],
    relatedSolutions: ['slow-internet']
  },
  {
    id: 'keyboard-not-typing',
    title: 'Keyboard Not Typing Correctly',
    category: 'keyboard',
    shortDescription: 'Fix issues when your keyboard is typing wrong characters or not responding',
    difficulty: 'medium',
    steps: [
      {
        title: 'Check for physical obstructions',
        description: 'Ensure there are no crumbs, dust or debris under the keys. Gently clean if necessary.'
      },
      {
        title: 'Check keyboard language',
        description: 'Make sure your keyboard language is set correctly. You can check this in your system settings.'
      },
      {
        title: 'Restart your computer',
        description: 'Sometimes a simple restart can resolve keyboard input issues.'
      },
      {
        title: 'Update keyboard drivers',
        description: 'Check for keyboard driver updates in your device manager or system settings.'
      }
    ],
    relatedSolutions: ['function-keys-locked']
  },
  {
    id: 'battery-draining',
    title: 'Battery Draining Too Quickly',
    category: 'battery',
    shortDescription: 'Extend your laptop battery life with these solutions',
    difficulty: 'medium',
    steps: [
      {
        title: 'Check power-hungry applications',
        description: 'Use Task Manager (Windows) or Activity Monitor (Mac) to identify apps using excessive power.'
      },
      {
        title: 'Adjust screen brightness',
        description: 'Lower your screen brightness to significantly extend battery life.'
      },
      {
        title: 'Enable power saving mode',
        description: 'Use Battery Saver (Windows) or Low Power Mode (Mac) to extend battery life.'
      },
      {
        title: 'Close background applications',
        description: 'Make sure to properly close apps you\'re not using, as they may continue running in the background.'
      }
    ]
  },
  {
    id: 'slow-internet',
    title: 'Slow Internet Connection',
    category: 'wifi',
    shortDescription: 'Troubleshoot and fix slow internet speeds on your devices',
    difficulty: 'medium',
    steps: [
      {
        title: 'Check your internet speed',
        description: 'Use a speed test website like Speedtest.net to check your current connection speed.'
      },
      {
        title: 'Move closer to your router',
        description: 'Wi-Fi signal weakens with distance and obstacles. Move closer to your router for better performance.'
      },
      {
        title: 'Restart your router',
        description: 'Unplug your router, wait 30 seconds, then plug it back in. Wait 2-3 minutes for it to fully restart.'
      },
      {
        title: 'Check for bandwidth-heavy applications',
        description: 'Close applications that might be using a lot of bandwidth, like video streaming services or large downloads.'
      },
      {
        title: 'Use a wired connection',
        description: 'If possible, connect your device directly to the router using an Ethernet cable for faster, more stable speeds.'
      }
    ],
    relatedSolutions: ['wifi-not-connecting']
  },
  {
    id: 'blue-screen',
    title: 'Fix Blue Screen of Death (BSOD)',
    category: 'software',
    shortDescription: 'Troubleshoot and resolve Windows blue screen crashes',
    difficulty: 'hard',
    steps: [
      {
        title: 'Note the error code',
        description: 'When you see a blue screen, look for an error code or message (like MEMORY_MANAGEMENT or SYSTEM_SERVICE_EXCEPTION).'
      },
      {
        title: 'Boot in Safe Mode',
        description: 'Restart your computer and press F8 during startup to enter Safe Mode, which loads only essential drivers.'
      },
      {
        title: 'Check for recent changes',
        description: 'Did you recently install new hardware or software? Try uninstalling it to see if it resolves the issue.'
      },
      {
        title: 'Update drivers',
        description: 'Outdated or corrupt drivers are a common cause of BSODs. Update your graphics, network, and chipset drivers.'
      },
      {
        title: 'Run system diagnostics',
        description: 'Use Windows Memory Diagnostic tool to check for RAM issues. Run "mdsched.exe" from the Start menu search.'
      }
    ]
  },
  {
    id: 'frozen-screen',
    title: 'Fix Frozen or Unresponsive Screen',
    category: 'software',
    shortDescription: 'Solutions for when your computer screen freezes or becomes unresponsive',
    difficulty: 'medium',
    steps: [
      {
        title: 'Wait briefly',
        description: 'Sometimes the system is just processing a heavy task. Wait 2-3 minutes to see if it responds.'
      },
      {
        title: 'Force quit applications',
        description: 'Windows: Press Ctrl+Alt+Del and select Task Manager\nMac: Press Command+Option+Esc\nThen select the unresponsive application and click "End Task" or "Force Quit"'
      },
      {
        title: 'Hard restart if necessary',
        description: 'Press and hold the power button for 5-10 seconds until the device shuts down. Wait a moment, then turn it back on.'
      },
      {
        title: 'Check for overheating',
        description: 'If your computer feels hot, shut it down, ensure vents aren\'t blocked, and give it time to cool down before restarting.'
      }
    ],
    relatedSolutions: ['blue-screen']
  },
  {
    id: 'no-sound',
    title: 'No Audio or Sound Issues',
    category: 'audio',
    shortDescription: 'Troubleshoot when your device has no sound or audio problems',
    difficulty: 'easy',
    steps: [
      {
        title: 'Check physical connections',
        description: 'Ensure headphones or speakers are properly connected to the correct audio port.'
      },
      {
        title: 'Check volume and mute settings',
        description: 'Make sure your volume is turned up and not muted. Check both system volume and application volume.'
      },
      {
        title: 'Verify correct output device',
        description: 'Right-click the speaker icon (Windows) or check Sound preferences (Mac) to ensure the correct audio output device is selected.'
      },
      {
        title: 'Restart audio services',
        description: 'Windows: Open Services app, find "Windows Audio" service, right-click and select "Restart"\nMac: Open Terminal and type: sudo killall coreaudiod'
      },
      {
        title: 'Update audio drivers',
        description: 'Check for and install updates for your audio drivers through Device Manager (Windows) or Software Update (Mac).'
      }
    ]
  },
  {
    id: 'webcam-not-working',
    title: 'Webcam Not Working',
    category: 'software',
    shortDescription: 'Fix issues with your webcam in video calls and applications',
    difficulty: 'medium',
    steps: [
      {
        title: 'Check privacy settings',
        description: 'Ensure your operating system and browser have permission to access the camera. Check settings > privacy > camera.'
      },
      {
        title: 'Check if other apps are using the camera',
        description: 'Most webcams can only be used by one application at a time. Close other apps that might be using the camera.'
      },
      {
        title: 'Restart your application',
        description: 'Close and reopen the application trying to use the webcam (like Zoom, Teams, or your browser).'
      },
      {
        title: 'Update webcam drivers',
        description: 'Check for and install updates for your webcam drivers through Device Manager (Windows) or Software Update (Mac).'
      }
    ]
  }
];
