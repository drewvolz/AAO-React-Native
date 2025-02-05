module.exports = {
	presets: [
		'module:metro-react-native-babel-preset',
		'@babel/preset-typescript',
	],
	plugins: [
		'@babel/plugin-proposal-export-namespace-from',
		// the react-native-reanimated plugin must come last
		'react-native-reanimated/plugin',
	],
}
