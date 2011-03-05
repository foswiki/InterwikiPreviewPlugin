/***

 InterwikiPreviewPlugin for TWiki Collaboration Platform, http://TWiki.org/

 Copyright (C) 2007 Ian Bygrave, ian@bygrave.me.uk

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details, published at 
 http://www.gnu.org/copyleft/gpl.html

***/

InterwikiPreviewPlugin = {};


InterwikiPreviewPlugin.BaseQuery = {};

InterwikiPreviewPlugin.BaseQuery.prototype = {
  _reqlock : new DeferredLock(),

  go : function() {
    this._reqlock.acquire().addCallback(bind(this._golocked,this));
  },

  _golocked : function(lock) {
    this.d = this.doreq(this.url);
    this.d.addCallbacks(bind(this.gotdata, this), bind(this.err, this));
    log("IWPPQ requested", this.url);
  },

  gotdata : function(s) {
    log("IWPPQ got", this.url);
    this._reqlock.release();
    extract = bind(this.extract, this);
    forEach( this.show, function(d) {
      swapDOM( d[0], SPAN( { 'id': d[0], 'class': 'iwppFieldFull' }, extract(s,d[1]) ) );
    });
    if ( this.reload > 0 ) {
      callLater(this.reload, bind(this.go, this));
    };
  },

  err : function(err) {
    log("IWPPQ request failed", this.url, err);
    this._reqlock.release();
    forEach( this.show, function(d) {
      swapDOM( d[0], SPAN( { 'id': d[0], 'class': 'iwppFieldFailed' }, '?' ) );
    });
  }
};


InterwikiPreviewPlugin.Query = {};


InterwikiPreviewPlugin.Query.XML = function (url, reload, show) {
  log("Creating iwppq_XML", url);
  this.url = url;
  this.reload = reload;
  this.show = show;
};

update(InterwikiPreviewPlugin.Query.XML.prototype,
       InterwikiPreviewPlugin.BaseQuery.prototype);

update(InterwikiPreviewPlugin.Query.XML.prototype, {
  doreq : doSimpleXMLHttpRequest,
  extract : function(s,f) {
    try {
      return scrapeText( getFirstElementByTagAndClassName(f, null, s.responseXML) );
    } catch(e) {
      return s.responseXML.getElementsByTagName(f)[0]; }
  }
});


InterwikiPreviewPlugin.Query.JSON = function (url, reload, show) {
  log("Creating iwppq_JSON", url);
  this.url = url;
  this.reload = reload;
  this.show = show;
};

update(InterwikiPreviewPlugin.Query.JSON.prototype,
       InterwikiPreviewPlugin.BaseQuery.prototype);

update(InterwikiPreviewPlugin.Query.JSON.prototype, {
  doreq : loadJSONDoc,
  extract : function(s,f) {
    return s[f];
  }
});
