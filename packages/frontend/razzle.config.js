'use strict';
var path = require('path');

module.exports = {
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
