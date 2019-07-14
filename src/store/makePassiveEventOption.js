// We want to make event listeners non-passive, and to do so have to check
// that browsers support EventListenerOptions in the first place.
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
let passiveSupported = false;
// try {
//   const options = {
//     get passive() {
//       passiveSupported = true;
//     },
//   };
//   window.addEventListener("test", options, options);
//   window.removeEventListener("test", options, options);
// } catch {
//   passiveSupported = false;
// }

function makePassiveEventOption(passive) {
  return passiveSupported ? { passive } : passive;
}

export default makePassiveEventOption;
