const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const entryPath = path.resolve(__dirname, "src/index.js");
const outputPath = path.resolve(__dirname, "dist");

module.exports = {
	entry: entryPath,
	output: {
		path: outputPath,
		filename: "bundle.js",
		hotUpdateChunkFilename: "hot/hot-update.js",
		hotUpdateMainFilename: "hot/hot-update.json"
	},
	devServer: { compress: true },
	plugins: [
		new webpack.ProgressPlugin(),
		new webpack.ProvidePlugin({ classNames: "classnames" }),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src/Template/index.html"),
			filename: "index.html",
			inlineSource: ".(js|css)$",
			alwaysWriteToDisk: true
		}),
		new CompressionPlugin(),
		new HtmlWebpackInlineSourcePlugin(),
		new HtmlWebpackHarddiskPlugin()
		// new webpack.HotModuleReplacementPlugin()
	],
	resolve: {
		alias: {
			// Preact compatability layer for existing React libraries
			"react": "preact/compat",
			"react-dom": "preact/compat",

			// Top level resolves  
			Components: path.resolve(__dirname, "src/Components"),
			App: path.resolve(__dirname, "src/App"),
			Hooks: path.resolve(__dirname, "src/Hooks"),
			M: path.resolve(__dirname, "src/Libraries/Materialize"),
			Util: path.resolve(__dirname, "src/Util"),
			Theme: path.resolve(__dirname, "src/Sass/theme.scss"),
			Sass: path.resolve(__dirname, "src/Sass")
		}
	  },
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: [path.resolve(__dirname, "node_modules")],
				loader: "babel-loader"
			},
			{
				test: /\.css$/,
				exclude: [path.resolve(__dirname, "node_modules")],
				loaders: ["style-loader", "css-loader"]
			},
			{
				test: /\.scss$/,
				exclude: [path.resolve(__dirname, "node_modules")],
				loaders: ["style-loader", "css-loader", {
					loader: "postcss-loader",
					options: {
					  sourceMap: true,
					  config: { path: "postcss.config.js" }
					}
				  }, "sass-loader"]
			}
		]
	}
};
