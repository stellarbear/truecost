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
};
