(function() {
  var $, Dispatch, Emitter, Environment, Executor, HarbourExecutable, HbFormat, LineMessageView, MessagePanelView, PlainMessageView, SettingsView, SplicerSplitter, Subscriber, async, os, path, _, _ref, _ref1, _ref2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  HbFormat = require('./hbformat');

  Executor = require('./executor');

  Environment = require('./environment');

  HarbourExecutable = require('./harbourexecutable');

  SplicerSplitter = require('./util/splicersplitter');

  _ = require('underscore-plus');

  _ref1 = require('atom-message-panel'), MessagePanelView = _ref1.MessagePanelView, LineMessageView = _ref1.LineMessageView, PlainMessageView = _ref1.PlainMessageView;

  _ref2 = require('atom'), $ = _ref2.$, SettingsView = _ref2.SettingsView;

  path = require('path');

  os = require('os');

  async = require('async');

  module.exports = Dispatch = (function() {
    Subscriber.includeInto(Dispatch);

    Emitter.includeInto(Dispatch);

    function Dispatch() {
      this.displayHarbourInfo = __bind(this.displayHarbourInfo, this);
      this.emitReady = __bind(this.emitReady, this);
      this.displayMessages = __bind(this.displayMessages, this);
      this.resetAndDisplayMessages = __bind(this.resetAndDisplayMessages, this);
      this.detect = __bind(this.detect, this);
      this.unsubscribeFromAtomEvents = __bind(this.unsubscribeFromAtomEvents, this);
      this.handleEvents = __bind(this.handleEvents, this);
      this.subscribeToAtomEvents = __bind(this.subscribeToAtomEvents, this);
      this.destroy = __bind(this.destroy, this);
      var hbformatsubscription;
      this.activated = false;
      this.dispatching = false;
      this.ready = false;
      this.messages = [];
      this.environment = new Environment(process.env);
      this.executor = new Executor(this.environment.Clone());
      this.splicersplitter = new SplicerSplitter();
      this.harbourexecutable = new HarbourExecutable(this.env());
      this.hbformat = new HbFormat(this);
      if (this.messagepanel == null) {
        this.messagepanel = new MessagePanelView({
          title: '<span class="icon-diff-added"></span> harbour-plus',
          rawTitle: true
        });
      }
      this.on('run-detect', (function(_this) {
        return function() {
          return _this.detect();
        };
      })(this));
      hbformatsubscription = this.hbformat.on('reset', (function(_this) {
        return function(editorView) {
          return _this.resetState(editorView);
        };
      })(this));
      this.subscribe(hbformatsubscription);
      this.on('dispatch-complete', (function(_this) {
        return function(editorView) {
          return _this.displayMessages(editorView);
        };
      })(this));
      this.subscribeToAtomEvents();
      this.emit('run-detect');
    }

    Dispatch.prototype.destroy = function() {
      var _ref3;
      this.unsubscribeFromAtomEvents();
      this.unsubscribe();
      this.resetPanel();
      if ((_ref3 = this.messagepanel) != null) {
        _ref3.remove();
      }
      this.messagepanel = null;
      this.hbformat.destroy();
      this.hbformat = null;
      this.ready = false;
      this.activated = false;
      return this.emit('destroyed');
    };

    Dispatch.prototype.subscribeToAtomEvents = function() {
      this.editorViewSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          return _this.handleEvents(editorView);
        };
      })(this));
      this.workspaceViewSubscription = atom.workspaceView.on('pane-container:active-pane-item-changed', (function(_this) {
        return function() {
          return _this.resetPanel();
        };
      })(this));
      return this.activated = true;
    };

    Dispatch.prototype.handleEvents = function(editorView) {
      var buffer, destroyedsubscription, modifiedsubscription, savedsubscription, _ref3;
      buffer = editorView != null ? (_ref3 = editorView.getEditor()) != null ? _ref3.getBuffer() : void 0 : void 0;
      if (buffer == null) {
        return;
      }
      this.updateGutter(editorView, this.messages);
      modifiedsubscription = buffer.on('contents-modified', (function(_this) {
        return function() {
          if (!_this.activated) {
            return;
          }
          return _this.handleBufferChanged(editorView);
        };
      })(this));
      savedsubscription = buffer.on('saved', (function(_this) {
        return function() {
          if (!_this.activated) {
            return;
          }
          if (!!_this.dispatching) {
            return;
          }
          return _this.handleBufferSave(editorView, true);
        };
      })(this));
      destroyedsubscription = buffer.once('destroyed', (function(_this) {
        return function() {
          if (savedsubscription != null) {
            savedsubscription.off();
          }
          return modifiedsubscription != null ? modifiedsubscription.off() : void 0;
        };
      })(this));
      this.subscribe(modifiedsubscription);
      this.subscribe(savedsubscription);
      return this.subscribe(destroyedsubscription);
    };

    Dispatch.prototype.unsubscribeFromAtomEvents = function() {
      var _ref3;
      return (_ref3 = this.editorViewSubscription) != null ? _ref3.off() : void 0;
    };

    Dispatch.prototype.detect = function() {
      this.ready = false;
      this.harbourexecutable.once('detect-complete', (function(_this) {
        return function() {
          return _this.emitReady();
        };
      })(this));
      return this.harbourexecutable.detect();
    };

    Dispatch.prototype.resetAndDisplayMessages = function(editorView, msgs) {
      if (!this.isValidEditorView(editorView)) {
        return;
      }
      this.resetState(editorView);
      this.collectMessages(msgs);
      return this.displayMessages(editorView);
    };

    Dispatch.prototype.displayMessages = function(editorView) {
      this.updatePane(editorView, this.messages);
      this.updateGutter(editorView, this.messages);
      this.dispatching = false;
      return this.emit('display-complete');
    };

    Dispatch.prototype.emitReady = function() {
      this.ready = true;
      return this.emit('ready');
    };

    Dispatch.prototype.displayHarbourInfo = function(force) {
      var editorView, harbour, thepath, _ref3, _ref4, _ref5;
      editorView = atom.workspaceView.getActiveView();
      if (!force) {
        if ((editorView != null ? editorView.constructor : void 0) == null) {
          return;
        }
        if (!(((_ref3 = editorView.constructor) != null ? _ref3.name : void 0) === 'SettingsView' || this.isValidEditorView(editorView))) {
          return;
        }
      }
      this.resetPanel();
      harbour = this.harbourexecutable.current();
      if ((harbour != null) && (harbour.executable != null) && harbour.executable.trim() !== '') {
        this.messagepanel.add(new PlainMessageView({
          message: 'Using Harbour: ' + harbour.name + ' (@' + harbour.executable + ')',
          className: 'text-success'
        }));
        if ((harbour.hbformat() != null) && go.hbformat() !== false) {
          this.messagepanel.add(new PlainMessageView({
            message: 'Format Tool: ' + harbour.hbformat(),
            className: 'text-success'
          }));
        } else {
          if (!atom.config.get('harbour-plus.formatWithHarbourImports')) {
            this.messagepanel.add(new PlainMessageView({
              message: 'Format Tool (hbformat): Not Found',
              className: 'text-error'
            }));
          }
        }
        thepath = os.platform() === 'win32' ? (_ref4 = this.env()) != null ? _ref4.Path : void 0 : (_ref5 = this.env()) != null ? _ref5.PATH : void 0;
        if ((thepath != null) && thepath.trim() !== '') {
          this.messagepanel.add(new PlainMessageView({
            message: 'PATH: ' + thepath,
            className: 'text-success'
          }));
        } else {
          this.messagepanel.add(new PlainMessageView({
            message: 'PATH: Not Set',
            className: 'text-error'
          }));
        }
      } else {
        this.messagepanel.add(new PlainMessageView({
          message: 'No Harbour Installations Were Found',
          className: 'text-error'
        }));
      }
      this.messagepanel.attach();
      return this.resetPanel();
    };

    Dispatch.prototype.collectMessages = function(messages) {
      if ((messages != null) && _.size(messages) > 0) {
        messages = _.flatten(messages);
      }
      messages = _.filter(messages, function(element, index, list) {
        return element != null;
      });
      if (messages == null) {
        return;
      }
      messages = _.filter(messages, function(message) {
        return message != null;
      });
      this.messages = _.union(this.messages, messages);
      this.messages = _.uniq(this.messages, function(element, index, list) {
        return (element != null ? element.line : void 0) + ':' + (element != null ? element.column : void 0) + ':' + (element != null ? element.msg : void 0);
      });
      return this.emit('messages-collected', _.size(this.messages));
    };

    Dispatch.prototype.triggerPipeline = function(editorView, saving) {
      var harbour;
      this.dispatching = true;
      harbour = this.harbourexecutable.current();
      if (!((harbour != null) && (harbour.executable != null) && harbour.executable.trim() !== '')) {
        this.displayHarbourInfo(false);
        this.dispatching = false;
        return;
      }
      return async.series([
        (function(_this) {
          return function(callback) {
            return _this.hbformat.formatBuffer(editorView, saving, callback);
          };
        })(this)
      ], (function(_this) {
        return function(err, modifymessages) {
          _this.collectMessages(modifymessages);
          return _this.emit('dispatch-complete', editorView);
        };
      })(this));
    };

    Dispatch.prototype.handleBufferSave = function(editorView, saving) {
      if (!(this.ready && this.activated)) {
        return;
      }
      if (!this.isValidEditorView(editorView)) {
        return;
      }
      this.resetState(editorView);
      return this.triggerPipeline(editorView, saving);
    };

    Dispatch.prototype.handleBufferChanged = function(editorView) {
      if (!(this.ready && this.activated)) {
        return;
      }
      if (!this.isValidEditorView(editorView)) {

      }
    };

    Dispatch.prototype.resetState = function(editorView) {
      this.messages = [];
      this.resetGutter(editorView);
      return this.resetPanel();
    };

    Dispatch.prototype.resetGutter = function(editorView) {
      var marker, markers, _i, _len, _ref3, _results;
      if (!this.isValidEditorView(editorView)) {
        return;
      }
      if (atom.config.get('core.useReactEditor')) {
        if (editorView.getEditor() == null) {
          return;
        }
        markers = (_ref3 = editorView.getEditor().getBuffer()) != null ? _ref3.findMarkers({
          "class": 'harbour-plus'
        }) : void 0;
        if (!((markers != null) && _.size(markers) > 0)) {
          return;
        }
        _results = [];
        for (_i = 0, _len = markers.length; _i < _len; _i++) {
          marker = markers[_i];
          _results.push(marker.destroy());
        }
        return _results;
      }
    };

    Dispatch.prototype.updateGutter = function(editorView, messages) {
      var buffer, marker, message, skip, _i, _len, _ref3, _results;
      this.resetGutter(editorView);
      if (!((messages != null) && messages.length > 0)) {
        return;
      }
      if (atom.config.get('core.useReactEditor')) {
        buffer = editorView != null ? (_ref3 = editorView.getEditor()) != null ? _ref3.getBuffer() : void 0 : void 0;
        if (buffer == null) {
          return;
        }
        _results = [];
        for (_i = 0, _len = messages.length; _i < _len; _i++) {
          message = messages[_i];
          skip = false;
          if (((message != null ? message.file : void 0) != null) && message.file !== '') {
            skip = message.file !== buffer.getPath();
          }
          if (!skip) {
            if (((message != null ? message.line : void 0) != null) && message.line !== false && message.line >= 0) {
              marker = buffer.markPosition([message.line - 1, 0], {
                "class": 'harbour-plus',
                invalidate: 'touch'
              });
              _results.push(editorView.getEditor().decorateMarker(marker, {
                type: 'gutter',
                "class": 'hbplus-' + message.type
              }));
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    Dispatch.prototype.resetPanel = function() {
      var _ref3, _ref4;
      if ((_ref3 = this.messagepanel) != null) {
        _ref3.close();
      }
      return (_ref4 = this.messagepanel) != null ? _ref4.clear() : void 0;
    };

    Dispatch.prototype.updatePane = function(editorView, messages) {
      var className, column, file, line, message, sortedMessages, _i, _len;
      this.resetPanel;
      if (messages == null) {
        return;
      }
      if (messages.length <= 0 && atom.config.get('harbour-plus.showPanelWhenNoIssuesExist')) {
        this.messagepanel.add(new PlainMessageView({
          message: 'No Issues',
          className: 'text-success'
        }));
        this.messagepanel.attach();
        return;
      }
      if (!(messages.length > 0)) {
        return;
      }
      if (!atom.config.get('harbour-plus.showPanel')) {
        return;
      }
      sortedMessages = _.sortBy(this.messages, function(element, index, list) {
        return parseInt(element.line, 10);
      });
      for (_i = 0, _len = sortedMessages.length; _i < _len; _i++) {
        message = sortedMessages[_i];
        className = (function() {
          switch (message.type) {
            case 'error':
              return 'text-error';
            case 'warning':
              return 'text-warning';
            default:
              return 'text-info';
          }
        })();
        file = (message.file != null) && message.file.trim() !== '' ? message.file : null;
        if ((file != null) && file !== '' && ((typeof atom !== "undefined" && atom !== null ? atom.project : void 0) != null)) {
          file = atom.project.relativize(file);
        }
        column = (message.column != null) && message.column !== '' && message.column !== false ? message.column : null;
        line = (message.line != null) && message.line !== '' && message.line !== false ? message.line : null;
        if (file === null && column === null && line === null) {
          this.messagepanel.add(new PlainMessageView({
            message: message.msg,
            className: className
          }));
        } else {
          this.messagepanel.add(new LineMessageView({
            file: file,
            line: line,
            character: column,
            message: message.msg,
            className: className
          }));
        }
      }
      if ((typeof atom !== "undefined" && atom !== null ? atom.workspaceView : void 0) != null) {
        return this.messagepanel.attach();
      }
    };

    Dispatch.prototype.isValidEditorView = function(editorView) {
      var _ref3, _ref4;
      return (editorView != null ? (_ref3 = editorView.getEditor()) != null ? (_ref4 = _ref3.getGrammar()) != null ? _ref4.scopeName : void 0 : void 0 : void 0) === 'source.harbour';
    };

    Dispatch.prototype.env = function() {
      return this.environment.Clone();
    };

    return Dispatch;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdOQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxlQUFBLE9BQWIsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQURYLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FIWCxDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxlQUFSLENBSmQsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSxxQkFBUixDQUxwQixDQUFBOztBQUFBLEVBTUEsZUFBQSxHQUFrQixPQUFBLENBQVEsd0JBQVIsQ0FObEIsQ0FBQTs7QUFBQSxFQVFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FSSixDQUFBOztBQUFBLEVBU0EsUUFBd0QsT0FBQSxDQUFRLG9CQUFSLENBQXhELEVBQUMseUJBQUEsZ0JBQUQsRUFBbUIsd0JBQUEsZUFBbkIsRUFBb0MseUJBQUEsZ0JBVHBDLENBQUE7O0FBQUEsRUFVQSxRQUFvQixPQUFBLENBQVEsTUFBUixDQUFwQixFQUFDLFVBQUEsQ0FBRCxFQUFJLHFCQUFBLFlBVkosQ0FBQTs7QUFBQSxFQVdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQVhQLENBQUE7O0FBQUEsRUFZQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FaTCxDQUFBOztBQUFBLEVBYUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBYlIsQ0FBQTs7QUFBQSxFQWVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLFFBQXZCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLE9B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
//# sourceURL=/home/bringout/.atom/packages/harbour-plus/lib/dispatch.coffee