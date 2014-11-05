(function() {
  var Emitter, HbFormat, Subscriber, path, spawn, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  spawn = require('child_process').spawn;

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = HbFormat = (function() {
    Subscriber.includeInto(HbFormat);

    Emitter.includeInto(HbFormat);

    function HbFormat(dispatch) {
      this.mapMessages = __bind(this.mapMessages, this);
      atom.workspaceView.command('harbourlang:hbformat', (function(_this) {
        return function() {
          return _this.formatCurrentBuffer();
        };
      })(this));
      this.dispatch = dispatch;
      this.name = 'hbformat';
    }

    HbFormat.prototype.destroy = function() {
      this.unsubscribe();
      return this.dispatch = null;
    };

    HbFormat.prototype.reset = function(editorView) {
      return this.emit('reset', editorView);
    };

    HbFormat.prototype.formatCurrentBuffer = function() {
      var done, editorView, _ref1;
      editorView = typeof atom !== "undefined" && atom !== null ? (_ref1 = atom.workspaceView) != null ? _ref1.getActiveView() : void 0 : void 0;
      if (!this.dispatch.isValidEditorView(editorView)) {
        return;
      }
      this.reset(editorView);
      done = (function(_this) {
        return function(err, messages) {
          return _this.dispatch.resetAndDisplayMessages(editorView, messages);
        };
      })(this);
      return this.formatBuffer(editorView, false, done);
    };

    HbFormat.prototype.formatBuffer = function(editorView, saving, callback) {
      var args, buffer, cmd, configArgs, currentFile, cwd, done, harbour, message, _ref1, _ref2;
      if (callback == null) {
        callback = function() {};
      }
      if (!this.dispatch.isValidEditorView(editorView)) {
        this.emit(this.name + '-complete', editorView, saving);
        callback(null);
        return;
      }
      if (saving && !atom.config.get('harbour-plus.formatOnSave')) {
        this.emit(this.name + '-complete', editorView, saving);
        callback(null);
        return;
      }
      buffer = editorView != null ? (_ref1 = editorView.getEditor()) != null ? _ref1.getBuffer() : void 0 : void 0;
      if (buffer == null) {
        this.emit(this.name + '-complete', editorView, saving);
        callback(null);
        return;
      }
      cwd = path.dirname(buffer.getPath());
      console.log("cwd:", cwd);
      args = [];
      configArgs = this.dispatch.splicersplitter.splitAndSquashToArray(' ', atom.config.get('harbour-plus.hbformatArgs'));
      if ((configArgs != null) && _.size(configArgs) > 0) {
        args = _.union(args, configArgs);
      }
      currentFile = buffer.getPath().split('\\').pop().split('/').pop();
      args = _.union(args, [currentFile]);
      harbour = this.dispatch.harbourexecutable.current();
      console.log("formatBuffer args:", args);
      cmd = harbour.hbformat();
      console.log("hbformat cmd:", cmd);
      if (cmd === false) {
        message = {
          line: false,
          column: false,
          msg: 'Harbour Format Tool Missing',
          type: 'error',
          source: this.name
        };
        callback(null, [message]);
        return;
      }
      done = (function(_this) {
        return function(exitcode, stdout, stderr, messages) {
          if ((stdout != null) && stdout.trim() !== '') {
            console.log(_this.name + ' - stdout: ' + stdout);
          }
          if ((stderr != null) && stderr.trim() !== '') {
            messages = _this.mapMessages(editorView, stderr, cwd);
          }
          _this.emit(_this.name + '-complete', editorView, saving);
          return callback(null, messages);
        };
      })(this);
      return this.dispatch.executor.exec(cmd, cwd, (_ref2 = this.dispatch) != null ? _ref2.env() : void 0, done, args);
    };

    HbFormat.prototype.mapMessages = function(editorView, data, cwd) {
      var extract, match, messages, pattern;
      pattern = /^(.*?):(\d*?):((\d*?):)?\s(.*)$/img;
      messages = [];
      if (!((data != null) && data !== '')) {
        return messages;
      }
      extract = (function(_this) {
        return function(matchLine) {
          var file, message;
          if (matchLine == null) {
            return;
          }
          file = (matchLine[1] != null) && matchLine[1] !== '' ? matchLine[1] : null;
          message = (function() {
            switch (false) {
              case matchLine[4] == null:
                return {
                  file: file,
                  line: matchLine[2],
                  column: matchLine[4],
                  msg: matchLine[5],
                  type: 'error',
                  source: this.name
                };
              default:
                return {
                  file: file,
                  line: matchLine[2],
                  column: false,
                  msg: matchLine[5],
                  type: 'error',
                  source: this.name
                };
            }
          }).call(_this);
          return messages.push(message);
        };
      })(this);
      while (true) {
        match = pattern.exec(data);
        extract(match);
        if (match == null) {
          break;
        }
      }
      return messages;
    };

    return HbFormat;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxlQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBd0IsT0FBQSxDQUFRLFVBQVIsQ0FBeEIsRUFBQyxrQkFBQSxVQUFELEVBQWEsZUFBQSxPQURiLENBQUE7O0FBQUEsRUFFQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBRkosQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixRQUF2QixDQUFBLENBQUE7O0FBQUEsSUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixRQUFwQixDQURBLENBQUE7O0FBR2EsSUFBQSxrQkFBQyxRQUFELEdBQUE7QUFDWCx1REFBQSxDQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHNCQUEzQixFQUFtRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuRCxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksUUFEWixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLFVBRlIsQ0FEVztJQUFBLENBSGI7O0FBQUEsdUJBUUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBRkw7SUFBQSxDQVJULENB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
//# sourceURL=/home/bringout/.atom/packages/harbour-plus/lib/hbformat.coffee