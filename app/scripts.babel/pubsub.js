'use strict';

const PubSub = (function(){
  return function PubSub() {
    this.listeners = {};

    this.on = function(eventName, fn) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }

      this.listeners[eventName].push(fn);
    };

    this.off = function(eventName, fn) {
      if (!this.listeners[eventName]) return;

      if (typeof fn === 'function') {
        let index = this.listeners[eventName].indexOf(fn);
        if (index !== -1) {
          this.listeners[eventName].splice(index, 1);
        }
      }
      else {
        delete this.listeners[eventName];
      }
    };

    this.emit = function(eventName, ...args) {
      const listeners = this.listeners[eventName];
      if (listeners) {
        for (var i = 0; i < listeners.length; i++) {
          listeners[i].apply(this, args);
        }
      }
    };
  }
}());
