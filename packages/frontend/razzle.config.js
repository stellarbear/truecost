'use strict';

module.exports = {
	modify(defaultConfig, {target, dev}, webpack) {
		const config = defaultConfig; // stay immutable here
		if (target === 'web') {

			config.output.filename = dev
				? 'static/js/[name].js'
				: 'static/js/[name].[hash:8].js';

			config.optimization = {
				...config.optimization,
				splitChunks: {
					cacheGroups: {
						mui: {
							test: /[\\/]node_modules[\\/](@material-ui|popper|jss|mdi-material-ui)[\\/]/,
							name: 'mui',
							chunks: 'all',
						},
						vendor: {
							test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|react-transition-groudp|@apollo|graphql|react-hook-form|react-helmet|react-lazyload|markdown-to-jsx)[\\/]/,
							name: 'vendor',
							chunks: 'all',
						},
						default: {
							priority: -20,
							reuseExistingChunk: true,
						},
					},
				},
			};
		}

		return config;
	},

	plugins: [
		{
			name: 'bundle-analyzer',
		},
		{
			//	swap from tslint to eslint
			name: "typescript",
			options: {
				useBabel: true,
				useEslint: true,
				forkTsChecker: {
					tsconfig: "./tsconfig.json",
					tslint: undefined,
					watch: "./src",
					typeCheck: true,
				},
			},
		},
	],
};
