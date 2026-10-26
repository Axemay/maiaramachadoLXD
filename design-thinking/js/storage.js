/* Persistência do progresso no navegador (localStorage).
   Se o armazenamento estiver bloqueado, o curso funciona só em memória e avisa o participante. */
(function (DT) {
  "use strict";

  var KEY = "mm-dt-m1-v1";
  var VERSION = 1;

  function blank() {
    return {
      v: VERSION,
      current: "inicio",
      last: null,
      visited: {},
      opening: null,
      checks: {},
      sim: {},
      simTries: {},
      simIndex: 0,
      cards: {},
      cardIndex: 0,
      cardFilter: false
    };
  }

  function probe() {
    try {
      localStorage.setItem(KEY + "-t", "1");
      localStorage.removeItem(KEY + "-t");
      return true;
    } catch (e) {
      return false;
    }
  }

  var Storage = {
    available: probe(),

    blank: blank,

    load: function () {
      try {
        var raw = localStorage.getItem(KEY);
        if (raw) {
          var saved = JSON.parse(raw);
          if (saved && saved.v === VERSION) return Object.assign(blank(), saved);
        }
      } catch (e) {
        Storage.available = false;
      }
      return blank();
    },

    save: function (state) {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
        Storage.available = true;
      } catch (e) {
        Storage.available = false;
      }
    },

    clear: function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* sem armazenamento: nada a apagar */ }
    }
  };

  DT.Storage = Storage;

  /* Estado persistente (respostas) e estado de interface (não salvo). */
  DT.state = Storage.load();
  DT.ui = { revealed: {}, flipped: false, confirmReset: false, errors: {} };
  DT.save = function () { Storage.save(DT.state); };
})(window.DT = window.DT || {});
