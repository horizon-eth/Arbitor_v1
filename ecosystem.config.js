module.exports = {
	apps: [
		{
			name: "arbitrage-bot",
			script: "index.js",
			exec_mode: "fork",
			instances: 1,
			watch: false,
			restart_delay: 5000,
			env: {
				NODE_ENV: "production",
			},
		},
	],
};
