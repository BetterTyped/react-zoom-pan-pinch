// We want to make event listeners non-passive, and to do so have to check
// that browsers support EventListenerOptions in the first place.

import { DeviceType } from "models";

// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
let passiveSupported = false;

export function makePassiveEventOption(): any {
  try {
    const options = {
      get passive() {
        // This function will be called when the browser
        //   attempts to access the passive property.
        passiveSupported = true;
        return false;
      },
    };

    return options;
  } catch (err) {
    passiveSupported = false;
    return passiveSupported;
  }
}

export function isTrackPad(
  event: WheelEvent & { wheelDeltaY: number },
): DeviceType.TRACK_PAD | DeviceType.MOUSE {
  if (event.wheelDeltaY) {
    if (Math.abs(event.wheelDeltaY) !== 120) {
      return DeviceType.TRACK_PAD;
    }
  } else if (event.deltaMode === 0) {
    return DeviceType.TRACK_PAD;
  }
  return DeviceType.MOUSE;
}
