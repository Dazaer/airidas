const path = require('path')

module.exports = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
  },
	configureWebpack: {
		module: {
			/*
			rules: [
				{
					include: path.resolve('node_modules', 'primeflex'),
					sideEffects: false,
				}
			]
			*/
		},
		optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
	}
	/*
	*/
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/styles/base.scss'),
      ],
    })
}