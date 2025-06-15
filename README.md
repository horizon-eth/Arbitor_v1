# Arbitor V1

## Author: [Horizon](https://www.linkedin.com/in/ufukyldrm/)

## Prerequisities

-   Node.js v18 or above

## Installation

```bash
	1. npm install
```

```bash
	2. cd Scripts/Dependencies && npm install
```

## Environment Configuration

-   Put HOT_WALLET_PHRASE into .env file. (you can encode this wallet to enhance security)
-   Add HTTPS & WSS RPC Provider URLs for each chain you want to work this arbitrage bot on.
-   Create Scripts/ProviderChanger/ProviderLists/>Chain<.js and put Back-up providers that will have been run once a provider fails or stuck at rate limit.
-   Create Scripts/Common/Common/>Chain.js< file for network settings.
-   Rest... is your problem from now on :-)

## Run

```bash
	npm start
```
