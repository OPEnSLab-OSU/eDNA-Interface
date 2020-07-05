const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackBundleSizeAnalyzerPlugin } = require("webpack-bundle-size-analyzer");
const BrotliWebpackPlugin = require("brotli-webpack-plugin");

const entryPath = path.resolve(__dirname, "src/index");
const outputPath = path.resolve(__dirname, "dist");
const nodeModules = path.resolve(__dirname, "node_modules");
module.exports = {
	entry: entryPath,
	output: {
		path: outputPath,
		filename: "bundle.js",
		hotUpdateChunkFilename: "hot/hot-update.js",
		hotUpdateMainFilename: "hot/hot-update.json",
	},
	devServer: { compress: true },
	devtool: "source-map",
	plugins: [
		new WebpackBundleSizeAnalyzerPlugin(path.resolve(__dirname, "bundle_size.txt")),
		new webpack.ProgressPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src/Template/index.html"),
			filename: "index.html",
			inlineSource: ".(js|css)$",
			alwaysWriteToDisk: true,
		}),
		new CompressionPlugin(),
		new HtmlWebpackInlineSourcePlugin(),
		new HtmlWebpackHarddiskPlugin(),
		new ForkTsCheckerWebpackPlugin(),
		// new webpack.HotModuleReplacementPlugin()
	],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			// Preact compatability layer
			react: "preact/compat",
			"react-dom": "preact/compat",

			// Top level resolves
			Components: path.resolve(__dirname, "src/Components"),
			App: path.resolve(__dirname, "src/App"),
			Hooks: path.resolve(__dirname, "src/Hooks"),
			M: path.resolve(__dirname, "src/Libraries/Materialize"),
			Util: path.resolve(__dirname, "src/Util"),
			Theme: path.resolve(__dirname, "src/Sass/theme.scss"),
			Sass: path.resolve(__dirname, "src/Sass"),
		},
	},
	module: {
		rules: [
			{
				// Run TS files through TS compiler
				test: /\.(ts|js)x?$/,
				exclude: [nodeModules],
				loader: "ts-loader",
				options: {
					// disable type checker - we will use it in fork plugin
					transpileOnly: true,
				},
			},
			{
				test: /\.css$/,
				exclude: [nodeModules],
				loaders: ["style-loader", "css-loader"],
			},
			{
				test: /\.scss$/,
				exclude: [nodeModules],
				loaders: [
					"style-loader",
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							sourceMap: true,
							config: { path: "postcss.config.js" },
						},
					},
					"sass-loader",
				],
			},
		],
	},
};
