const { VueLoaderPlugin } = require("vue-loader")
const path = require("path")

module.exports = {
	mode: "production",
	entry: {
		main: "./src/main.ts",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
		],
	},
	optimization: {
		nodeEnv: "production",
		minimize: true,
	},
	plugins: [
		new VueLoaderPlugin(),
	],
	resolve: {
		alias: {
			vue$: "vue/dist/vue.runtime.esm.js",
		},
		extensions: ["*", ".js", ".vue", ".json"],
	},
}