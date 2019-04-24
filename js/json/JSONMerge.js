(function(g, f) {
  if (typeof define === "function" && define.amd) {
    define([], f);
  } else if (typeof module === "object") {
    module.exports = f();
  } else {
    g.JSONMerge = f();
  }
}(window, function() {
  var JSONMerge = function() {
    this.update = false;
    this.result = null;
    this.isArray = false;
    this.newItems = null;
    this.removedItems = null;
    this.updatedItems = null;
    this.uncahngedItems = null;
  };

  JSONMerge.flat = function(oNode) {
    var aResult = [];

    var aList = [
      {
        source: oNode,
        path: [],
        type: []
      }
    ];

    while (aList.length > 0) {
      var oItem = aList.shift();
      for (var sKey in oItem.source) {
        var vValue = oItem.source[sKey];
        if (typeof vValue === "object") {
          aList.push({
            source: vValue,
            path: oItem.path.concat(sKey),
            type: oItem.type.concat(Array.isArray(vValue))
          });
        } else {
          aResult.push({
            value: vValue,
            key: sKey,
            path: oItem.path,
            type: oItem.type
          });
        }
      }
    }

    return aResult;
  };

  JSONMerge.flatInfoEquals = function(oAFlat, oBFlat) {
    if (oAFlat.path.length !== oBFlat.path.length || oAFlat.key !== oBFlat.key) {
      return false;
    }

    for (var i = 0; i < oAFlat.path.length; ++i) {
      if (oAFlat.path[i] !== oBFlat.path[i] || oAFlat.type[i] !== oBFlat.type[i]) {
        return false;
      }
    }

    return true;
  };

  JSONMerge.prototype.compare = function(oSource, oTarget) {
    var aSFlat = JSONMerge.flat(oSource);
    var aTFlat = JSONMerge.flat(oTarget);

    this.update = true;
    this.isArray = Array.isArray(oTarget);
    this.newItems = [ ];
    this.removedItems = [ ];
    this.updatedItems = [ ];
    this.uncahngedItems = [ ];

    if (Array.isArray(oSource) !== this.isArray) {
      this.newItems = aTFlat;
      this.removedItems = aSFlat;
      return;
    }

    for (var i = 0, j; i < aSFlat.length; ++i) {
      var oSFlat = aSFlat[i];
      for (j = 0; j < aTFlat.length; ++j) {
        var oTFlat = aTFlat[j];
        if (JSONMerge.flatInfoEquals(oSFlat, oTFlat)) {
          if (oSFlat.value === oTFlat.value) {
            this.uncahngedItems.push(oSFlat);
          } else {
            this.updatedItems.push(oTFlat);
          }
          aTFlat.splice(j, 1);
          break;
        }
      }
      if (j === aTFlat.length) {
        this.removedItems.push(oSFlat);
      }
    }

    this.newItems = aTFlat;
  };

  JSONMerge.prototype.execute = function() {
    if (this.update === false) {
      return this.result;
    } else {
      this.update = false;
      this.result = this.isArray ? [] : {};
    }

    var vTarget;
    var aPath = null;

    [].concat(this.newItems, this.updatedItems, this.uncahngedItems).forEach(function(oFlatInfo) {
      if (aPath !== oFlatInfo.path) {
        aPath = oFlatInfo.path;
        vTarget = this.result
        oFlatInfo.path.forEach(function(sPath, iIndex) {
          if (sPath in vTarget === false) {
            vTarget[sPath] = oFlatInfo.type[iIndex] ? [] : {};
          }
          vTarget = vTarget[sPath];
        }, this);
      }

      vTarget[oFlatInfo.key] = oFlatInfo.value;
    }, this);

    return this.result;
  };

  return JSONMerge;
}));