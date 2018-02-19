webpackJsonp([4],{91:function(e,t,r){try{(function(){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),u=function(e,t,r){for(var a=!0;a;){var l=e,n=t,o=r;a=!1,null===l&&(l=Function.prototype);var u=Object.getOwnPropertyDescriptor(l,n);if(void 0!==u){if("value"in u)return u.value;var c=u.get;if(void 0===c)return;return c.call(o)}var i=Object.getPrototypeOf(l);if(null===i)return;e=i,t=n,r=o,a=!0,u=i=void 0}},c=r(1),i=a(c),s=r(58),f=(a(s),r(32)),d=r(129),p=a(d),m=r(128),b=a(m),h=r(39),v=function(e){function t(e){l(this,t),u(Object.getPrototypeOf(t.prototype),"constructor",this).call(this,e),this.state={projShow:!1,teamShow:!1}}return n(t,e),o(t,[{key:"handleClose",value:function(e){switch(e){case"team":this.setState({teamShow:!1});break;case"proj":this.setState({projShow:!1})}}},{key:"handleShow",value:function(e){switch(e){case"team":this.setState({teamShow:!0});break;case"proj":this.setState({projShow:!0})}}},{key:"render",value:function(){return i.default.createElement("div",null,i.default.createElement(f.Link,{to:"/dashboard/reports",className:"pull-right btn btn-primary btn-outline btn-rounded"},"View Reports"),i.default.createElement("button",{className:"pull-right btn btn-primary btn-outline btn-rounded",onClick:this.handleShow.bind(this,"team")},"Create Team"),i.default.createElement("button",{className:"pull-right btn btn-primary btn-outline btn-rounded",onClick:this.handleShow.bind(this,"proj")},"Create Project"),i.default.createElement(h.Modal,{show:this.state.teamShow,onHide:this.handleClose.bind(this,"team")},i.default.createElement(h.Modal.Header,{closeButton:!0},i.default.createElement(h.Modal.Title,null,"Create Team")),i.default.createElement(h.Modal.Body,null,i.default.createElement(p.default,null)),i.default.createElement(h.Modal.Footer,null,i.default.createElement(h.Button,{onClick:this.handleClose.bind(this,"team")},"Close"))),i.default.createElement(h.Modal,{show:this.state.projShow,onHide:this.handleClose.bind(this,"proj")},i.default.createElement(h.Modal.Header,{closeButton:!0},i.default.createElement(h.Modal.Title,null,"Create Project")),i.default.createElement(h.Modal.Body,null,i.default.createElement(b.default,null)),i.default.createElement(h.Modal.Footer,null,i.default.createElement(h.Button,{onClick:this.handleClose.bind(this,"proj")},"Close"))))}}]),t}(i.default.Component);t.default=v,e.exports=t.default}).call(this)}finally{}},772:function(e,t,r){try{(function(){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}(),u=function(e,t,r){for(var a=!0;a;){var l=e,n=t,o=r;a=!1,null===l&&(l=Function.prototype);var u=Object.getOwnPropertyDescriptor(l,n);if(void 0!==u){if("value"in u)return u.value;var c=u.get;if(void 0===c)return;return c.call(o)}var i=Object.getPrototypeOf(l);if(null===i)return;e=i,t=n,r=o,a=!0,u=i=void 0}},c=r(1),i=a(c),s=r(32),f=r(39),d=r(91),p=a(d),m=function(e){function t(){l(this,t),u(Object.getPrototypeOf(t.prototype),"constructor",this).apply(this,arguments)}return n(t,e),o(t,[{key:"render",value:function(){return i.default.createElement("div",{className:"overview-page",key:"overview"},i.default.createElement(p.default,null),i.default.createElement("h2",null,"My Projects:"),i.default.createElement(f.Jumbotron,null,i.default.createElement("div",{className:"btn-toolbar pull-right"},i.default.createElement("button",{className:"btn btn-info"},"Update Project"),i.default.createElement("button",{className:"btn btn-danger"},"Delete Project")),i.default.createElement(s.Link,{to:"/dashboard/project"},i.default.createElement("h1",null,"Project BlueFox")," "),"Description: Moving on-prem databases to Microsoft Azure.",i.default.createElement("br",null),"Due: December 2017",i.default.createElement("br",null)," ",i.default.createElement("br",null),i.default.createElement("div",{className:"progress"},i.default.createElement("div",{className:"progress-bar progress-bar-success",role:"progressbar","aria-valuenow":"40","aria-valuemin":"0","aria-valuemax":"100",style:{width:"90%"}},"90% Complete (on track)")),i.default.createElement("hr",null),i.default.createElement("div",{className:"btn-toolbar pull-right"},i.default.createElement("button",{className:"btn btn-info"},"Update Project"),i.default.createElement("button",{className:"btn btn-danger"},"Delete Project")),i.default.createElement(s.Link,{to:"/dashboard/project"},i.default.createElement("h1",null,"Project RedTiger")," "),"Description: Convert 1996 VB Project to Windows 10 C# App.",i.default.createElement("br",null),"Due: January 2018",i.default.createElement("br",null)," ",i.default.createElement("br",null),i.default.createElement("div",{className:"progress"},i.default.createElement("div",{className:"progress-bar progress-bar-danger",role:"progressbar","aria-valuenow":"40","aria-valuemin":"0","aria-valuemax":"100",style:{width:"20%"}},"20% Complete (off track)")),i.default.createElement("hr",null)))}}]),t}(i.default.Component);t.default=m,e.exports=t.default}).call(this)}finally{}}});