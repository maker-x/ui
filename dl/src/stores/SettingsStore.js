var alt = require("../alt-instance");
var SettingsActions = require("../actions/SettingsActions");
var IntlActions = require("../actions/IntlActions");
var Immutable = require("immutable");
var _ =require("lodash");

const CORE_ASSET = "BTS"; // Setting this to BTS to prevent loading issues when used with BTS chain which is the most usual case currently

import ls from "common/localStorage";
const STORAGE_KEY = "__graphene__";
let ss = new ls(STORAGE_KEY);

class SettingsStore {
    constructor() {
        this.exportPublicMethods({getSetting: this.getSetting.bind(this)});

        this.settings = Immutable.Map({
        });

        this.defaultSettings = Immutable.Map({
            locale: "en",
            connection: "wss://x.makerdao.com/ws",
            faucet_address: "https://x.makerdao.com",
            unit: "USD",
            showSettles: false,
            walletLockTimeout: 60 * 10,
            themes: "lightTheme"
        });

        this.viewSettings =  Immutable.Map({
            cardView: true
        });

        this.marketDirections = Immutable.Map({

        });

        this.hiddenAssets = Immutable.List([]);

        this.preferredBases = Immutable.List(["OPEN.BTC", "OPEN.ETH", "CNY", "DAI", "MKR"]);
        this.baseOptions = ["OPEN.BTC", "OPEN.ETH", "CNY", "DAI", "MKR"];

        this.starredMarkets = Immutable.Map([

            // OPEN.BTC BASE
            ["MKR_OPEN.BTC", {"quote":"MKR","base": "OPEN.BTC"} ],
            ["OPEN.DGD_OPEN.BTC", {"quote":"OPEN.DGD","base": "OPEN.BTC"} ],
            ["OPEN.DAO_OPEN.BTC", {"quote":"OPEN.DAO","base": "OPEN.BTC"} ],

            // OPEN.ETH BASE
            ["MKR_OPEN.ETH", {"quote":"MKR","base": "OPEN.ETH"} ],
            ["OPEN.DGD_OPEN.ETH", {"quote":"OPEN.DGD","base": "OPEN.ETH"} ],
            ["OPEN.DAO_OPEN.ETH", {"quote":"OPEN.DAO","base": "OPEN.ETH"} ],

            // DAI BASE
            ["MKR_DAI", {"quote":"MKR","base": "DAI"} ],
            ["OPEN.DGD_DAI", {"quote":"OPEN.DGD","base": "DAI"} ],
            ["OPEN.DAO_DAI", {"quote":"OPEN.DAO","base": "DAI"} ],
            ["OPEN.DASH_DAI", {"quote":"OPEN.DASH","base": "DAI"} ],
            ["OPEN.LTC_DAI", {"quote":"OPEN.LTC","base": "DAI"} ],
            ["BTS_DAI", {"quote":"BTS","base": "DAI"} ],
            ["OPEN.BTC_DAI", {"quote":"OPEN.BTC","base": "DAI"} ],
            ["OPEN.ETH_DAI", {"quote":"OPEN.ETH","base": "DAI"} ],
            ["OPEN.DOGE_DAI", {"quote":"OPEN.DOGE","base": "DAI"} ],
            ["CNY_DAI", {"quote":"CNY","base": "DAI"} ],

        ]);

        this.starredAccounts = Immutable.Map();

        // If you want a default value to be translated, add the translation to settings in locale-xx.js
        // and use an object {translate: key} in the defaults array
        this.defaults = {
            locale: [
                "en",
                "es",
                "cn",
                "fr",
                "ko",
                "de",
                "tr"
            ],
            connection: [
                "wss://x.makerdao.com/ws",
                "wss://dele-puppy.com/ws",
                "wss://bitshares.dacplay.org:8089/ws"
            ],
            unit: [
                "USD",
                "OPEN.BTC",
                "MKR",
                "CNY",
                "EUR",
                "GBP"
            ],
            showSettles: [
                {translate: "yes"},
                {translate: "no"}
            ],
            themes: [
                "makerxTheme",
                "olDarkTheme",
                "darkTheme",
                "lightTheme"
            ]
            // confirmMarketOrder: [
            //     {translate: "confirm_yes"},
            //     {translate: "confirm_no"}
            // ]
        };

        this.bindListeners({
            onChangeSetting: SettingsActions.changeSetting,
            onChangeViewSetting: SettingsActions.changeViewSetting,
            onChangeMarketDirection: SettingsActions.changeMarketDirection,
            onAddStarMarket: SettingsActions.addStarMarket,
            onRemoveStarMarket: SettingsActions.removeStarMarket,
            onAddStarAccount: SettingsActions.addStarAccount,
            onRemoveStarAccount: SettingsActions.removeStarAccount,
            onAddWS: SettingsActions.addWS,
            onRemoveWS: SettingsActions.removeWS,
            onHideAsset: SettingsActions.hideAsset,
            onClearSettings: SettingsActions.clearSettings,
            onSwitchLocale: IntlActions.switchLocale
        });

        if (ss.get("settings_v3")) {
            this.settings = Immutable.Map(_.merge(this.defaultSettings.toJS(), ss.get("settings_v3")));
        }

        if (ss.get("starredMarkets")) {
            this.starredMarkets = Immutable.Map(ss.get("starredMarkets"));
        }

        if (ss.get("starredAccounts")) {
            this.starredAccounts = Immutable.Map(ss.get("starredAccounts"));
        }

        if (ss.get("defaults_v1")) {
            this.defaults = _.merge(this.defaults, ss.get("defaults_v1"));
        }

        if (ss.get("viewSettings_v1")) {
            this.viewSettings = Immutable.Map(ss.get("viewSettings_v1"));
        }

        if (ss.get("marketDirections")) {
            this.marketDirections = Immutable.Map(ss.get("marketDirections"));
        }

        if (ss.get("hiddenAssets")) {
            this.hiddenAssets = Immutable.List(ss.get("hiddenAssets"));
        }

        if (ss.get("preferredBases")) {
            this.preferredBases = Immutable.List(ss.get("preferredBases"));
        }


    }

    getSetting(setting) {
        return this.settings.get(setting);
    }

    onChangeSetting(payload) {
        this.settings = this.settings.set(
            payload.setting,
            payload.value
        );

        ss.set("settings_v3", this.settings.toJS());
        if (payload.setting === "walletLockTimeout") {
            ss.set("lockTimeout", payload.value);
        }
    }

    onChangeViewSetting(payload) {
        for (key in payload) {
            this.viewSettings = this.viewSettings.set(key, payload[key]);
        }

        ss.set("viewSettings_v1", this.viewSettings.toJS());
    }

    onChangeMarketDirection(payload) {
        for (key in payload) {
            this.marketDirections = this.marketDirections.set(key, payload[key]);
        }

        ss.set("marketDirections", this.marketDirections.toJS());
    }

    onHideAsset(payload) {
        if (payload.id) {
            if (!payload.status) {
                this.hiddenAssets = this.hiddenAssets.delete(this.hiddenAssets.indexOf(payload.id));
            } else {
                this.hiddenAssets = this.hiddenAssets.push(payload.id);
            }
        }

        ss.set("hiddenAssets", this.hiddenAssets.toJS());
    }

    onAddStarMarket(market) {
        let marketID = market.quote + "_" + market.base;

        if (!this.starredMarkets.has(marketID)) {
            this.starredMarkets = this.starredMarkets.set(marketID, {quote: market.quote, base: market.base});

            ss.set("starredMarkets", this.starredMarkets.toJS());
        } else {
            return false;
        }
    }

    onRemoveStarMarket(market) {
        let marketID = market.quote + "_" + market.base;

        this.starredMarkets = this.starredMarkets.delete(marketID);

        ss.set("starredMarkets", this.starredMarkets.toJS());
    }

    onAddStarAccount(account) {
        if (!this.starredAccounts.has(account)) {
            this.starredAccounts = this.starredAccounts.set(account, {name: account});

            ss.set("starredAccounts", this.starredAccounts.toJS());
        } else {
            return false;
        }
    }

    onRemoveStarAccount(account) {

        this.starredAccounts = this.starredAccounts.delete(account);

        ss.set("starredAccounts", this.starredAccounts.toJS());
    }

    onAddWS(ws) {
        this.defaults.connection.push(ws);
        ss.set("defaults_v1", this.defaults);
    }

    onRemoveWS(index) {
        if (index !== 0) { // Prevent removing the default connection
            this.defaults.connection.splice(index, 1);
            ss.set("defaults_v1", this.defaults);
        }
    }

    onClearSettings() {
        ss.remove("settings_v3");
        this.settings = this.defaultSettings;

        ss.set("settings_v3", this.settings.toJS());

        if (window && window.location) {
            // window.location.reload();
        }
    }

    onSwitchLocale(locale) {
        console.log("onSwitchLocale:", locale);

        this.onChangeSetting({setting: "locale", value: locale});
    }

    // onChangeBase(payload) {
    //     if (payload.index && payload.value) {
    //         this.preferredBases = this.preferredBases.set(payload.index, payload.value);
    //         ss.set("preferredBases", this.preferredBases.toArray);                    
    //     }
    // }
}

module.exports = alt.createStore(SettingsStore, "SettingsStore");
