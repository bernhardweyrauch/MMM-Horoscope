/* Magic Mirror
 * Module: MMM-Horoscope
 *
 * By Bernhard Weyrauch
 * info@bernhardweyrauch.de
 *
 * MIT Licensed.
 */

Module.register("MMM-Horoscope", {
  defaults: {
    title: "Horoskop Widder",
    requestURL: "https://www.sat1.de/ratgeber/horoskop/tageshoroskop",
    sign: "widder",
    refreshInterval: 60*60*4 // 4 hours
  },

  getStyles: function() {
    return ["MMM-Horoscope.css"]
  },

  start: function() {
    this.mmmHoroscopeData = null;
    this.sendSocketNotification("MMM_Horoscope_Config", this.config)
  },

  socketNotificationReceived: function(notification, payload) {
    var self = this;
    if (notification === "MMM_Horoscope_Data" && payload) {
      this.mmmHoroscopeData = payload;
      this.updateDom(1000);

      setTimeout(function() {
        self.sendSocketNotification("MMM_Horoscope_Update", {})
      }, 1000*self.config.refreshInterval);
    }
  },

  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.className = "MMM-Horoscope-Container";
    var title = document.createElement("h1");
    title.className = "MMM-Horoscope-Title";
    title.innerHTML = this.config.title;
    wrapper.appendChild(title);
    var container = document.createElement("div");
    if(this.mmmHoroscopeData) {
      container.innerHTML = this.mmmHoroscopeData;
    } else {
      container.innerHTML = "Loading ...";
    }
    wrapper.appendChild(container)
    return wrapper;
  },
})
