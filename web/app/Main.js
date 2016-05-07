require("./assets/loader");
<<<<<<< HEAD
if (!window.Intl) {
    require(['intl'], Intl => {
        Intl.__addLocaleData(require("./assets/intl-data/en.json"));
        window.Intl = Intl;
=======
if (!window.Intl) { // Safari polyfill
    	require.ensure(['intl'], require => {
    	window.Intl = require('intl');
        Intl.__addLocaleData(require("./assets/intl-data/en.json"));
>>>>>>> cnx/master
        require("App.jsx");
    });
} else {
    require("App.jsx");
}
