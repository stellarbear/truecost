'use strict';
var path = require('path');

module.exports = {
	plugins: [
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

	modify(config, {target, dev}, webpack) {
		const appConfig = config

		//	resolve absolute paths
		const srcPath = path.resolve("./src")
		appConfig.resolve.modules.push(srcPath);

		/*
				appConfig.module.rules.push({
					test: /\.(ts|tsx)?$/,
					include: path.resolve(__dirname, '../shared'),
					loader: 'ts-loader'
				});*/

		//	import fonts
		appConfig.module.rules.push(
			{
				test: /\.(gif|jpe?g|png|ico)$/,
				loader: 'url-loader?limit=10000',
			},
			{
				test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
				loader: 'url-loader?limit=10000',
			});
		return appConfig;
	}
};
