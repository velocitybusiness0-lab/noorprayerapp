import type { ShieldActions, ShieldConfiguration } from "react-native-device-activity";



const MIRAJ_GREEN = { red: 107, green: 158, blue: 136 };

const INK = { red: 61, green: 56, blue: 50 };

const MUTED = { red: 107, green: 101, blue: 96 };



/** Motivational Screen Time shield shown when a blocked app is opened. */

export const PRAYER_BLOCK_SHIELD: ShieldConfiguration = {

  title: "Time for salah",

  subtitle:

    "Put the phone down. Verily, prayer keeps you from shameful and unjust deeds.",

  iconSystemName: "moon.stars.fill",

  iconTint: MIRAJ_GREEN,

  backgroundBlurStyle: 1,

  titleColor: INK,

  subtitleColor: MUTED,

  primaryButtonLabel: "Stay focused",

  primaryButtonLabelColor: { red: 255, green: 255, blue: 255 },

  primaryButtonBackgroundColor: MIRAJ_GREEN,

};



/** Dismisses the shield — user returns home; unblock happens via scan in Miraj. */

export const PRAYER_BLOCK_SHIELD_ACTIONS: ShieldActions = {

  primary: {

    behavior: "close",

  },

};



type DeviceActivityModule = typeof import("react-native-device-activity");



function getDeviceActivity(): DeviceActivityModule | null {

  try {

    // eslint-disable-next-line @typescript-eslint/no-require-imports

    return require("react-native-device-activity");

  } catch {

    return null;

  }

}



/** Writes shield UI + actions to the app group for the native extensions. */

export class BlockingShieldConfigurator {

  apply(triggeredBy = "miraj"): void {

    const da = getDeviceActivity();

    if (!da?.isAvailable()) return;

    da.updateShield(PRAYER_BLOCK_SHIELD, PRAYER_BLOCK_SHIELD_ACTIONS, triggeredBy);

  }

}



export const blockingShieldConfigurator = new BlockingShieldConfigurator();

