require("react-native-url-polyfill/auto");
require("./src/polyfills/nativeWindowLocation");

const registerRootComponent = require("expo/src/launch/registerRootComponent").default;
const App = require("./App").default;

registerRootComponent(App);
