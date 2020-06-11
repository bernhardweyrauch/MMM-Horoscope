'use strict';

/* Magic Mirror
 * Module: MMM-Horoscope
 *
 * By Bernhard Weyrauch
 * info@bernhardweyrauch.de
 *
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var request = require('request');
var HTMLParser = require('node-html-parser');

module.exports = NodeHelper.create({

	start: function() {
		this.config = null;
	},

	getData: function() {
		var self = this;
		var url = this.config.requestURL + '/' + this.config.sign;
		request({
			url: url,
			method: 'GET',
			headers: {}
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				// parse response
				var root = HTMLParser.parse(body);
				var text = root.querySelector('div.formatted-text');
				self.sendSocketNotification("MMM_Horoscope_Data", text.toString());
			}
		});
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === 'MMM_Horoscope_Config' && payload) {
			self.config = payload;
			self.getData();
		} else if(notification === 'MMM_Horoscope_Update') {
			self.getData();
		}
	},
});
