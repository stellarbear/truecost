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
						vendor: {
							test: /[\\/]node_modules[\\/]/,
							name: 'vendor',
							chunks: 'all',
						},
						default: {
							priority: -20,
							reuseExistingChunk: true,
						},
						name: false,
						chunks: 'all',
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
