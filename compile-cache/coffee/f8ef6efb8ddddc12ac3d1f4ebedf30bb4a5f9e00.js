(function() {
  var Linter, LinterHarbour, XRegExp, child, exec, fs, linterPath, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('child_process'), exec = _ref.exec, child = _ref.child;

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  path = require('path');

  XRegExp = require("" + linterPath + "/node_modules/xregexp").XRegExp;

  fs = require('fs');

  LinterHarbour = (function(_super) {
    __extends(LinterHarbour, _super);

    LinterHarbour.syntax = 'source.harbour';

    LinterHarbour.prototype.cmd = 'harbour';

    LinterHarbour.prototype.linterName = 'harbour';

    LinterHarbour.prototype.regex = '\\((?<line>\\d+)\\) ((?<error>Error)|(?<warning>Warning)) ((?<message>.+))[\\n\\r]';

    LinterHarbour.prototype.regexFlags = '';

    LinterHarbour.prototype.cwd = null;

    LinterHarbour.prototype.defaultLevel = 'error';

    LinterHarbour.prototype.executablePath = null;

    LinterHarbour.prototype.isNodeExecutable = false;

    function LinterHarbour(editor) {
      LinterHarbour.__super__.constructor.call(this, editor);
      atom.config.observe('linter-harbour.harbourExecutablePath', (function(_this) {
        return function() {
          return _this.executablePath = atom.config.get('linter-harbour.harbourExecutablePath');
        };
      })(this));
      atom.config.observe('linter-harbour.harbourIncludes', (function(_this) {
        return function() {
          return _this.harbourIncludes = atom.config.get('linter-harbour.harbourIncludes');
        };
      })(this));
      atom.config.observe('linter-harbour.harbourOptions', (function(_this) {
        return function() {
          return _this.harbourOptions = atom.config.get('linter-harbour.harbourOptions');
        };
      })(this));
    }

    LinterHarbour.prototype.getConfigFile = function() {
      var config, configObject, e, localFile;
      config = {};
      try {
        localFile = path.join(atom.project.path, 'linter-harbour.json');
        configObject = {};
        if (fs.existsSync(localFile)) {
          configObject = fs.readFileSync(localFile, 'UTF8');
          config = JSON.parse(configObject);
        }
      } catch (_error) {
        e = _error;
        console.log(e);
      }
      return config;
    };

    LinterHarbour.prototype.getCmdAndArgs = function(filePath) {
      var cmd, cmd_list, config, e, hb_includes, hb_includes_config, hb_includes_temp, hb_opt, item, localFolder, self, stats, _i, _len;
      self = this;
      cmd = this.cmd;
      localFolder = path.dirname(this.editor.getPath());
      config = this.getConfigFile();
      cmd_list = Array.isArray(cmd) ? cmd.slice() : cmd.split(' ');
      hb_opt = Array.isArray(this.harbourOptions) ? this.harbourOptions.join(' ') : this.harbourOptions.split(' ');
      cmd_list = cmd_list.concat(hb_opt);
      hb_includes_config = [];
      if (config.include != null) {
        if (Array.isArray(config.include)) {
          hb_includes_config = config.include;
        }
      }
      if (this.harbourIncludes != null) {
        hb_includes_temp = Array.isArray(this.harbourIncludes) ? this.harbourIncludes.join(' ') : this.harbourIncludes.split(' ');
        hb_includes_temp = hb_includes_temp.concat(hb_includes_config);
        hb_includes = [];
        for (_i = 0, _len = hb_includes_temp.length; _i < _len; _i++) {
          item = hb_includes_temp[_i];
          try {
            stats = self._cachedStatSync(item);
            if (stats.isDirectory()) {
              hb_includes.push("-i" + item);
            }
          } catch (_error) {
            e = _error;
          }
        }
        hb_includes.push("-i" + localFolder);
        hb_includes.push("-i" + localFolder + "/inc");
        hb_includes.push("-i" + localFolder + "/include");
        cmd_list = cmd_list.concat(hb_includes);
      }
      cmd_list.push(filePath);
      if (this.executablePath) {
        stats = this._cachedStatSync(this.executablePath);
        if (stats.isDirectory()) {
          cmd_list[0] = path.join(this.executablePath, cmd_list[0]);
        } else {
          cmd_list[0] = this.executablePath;
        }
      }
      if (this.isNodeExecutable) {
        cmd_list.unshift(this.getNodeExecutablePath());
      }
      cmd_list = cmd_list.map(function(cmd_item) {
        if (/@filename/i.test(cmd_item)) {
          return cmd_item.replace(/@filename/gi, filePath);
        } else {
          return cmd_item;
        }
      });
      return {
        command: cmd_list[0],
        args: cmd_list.slice(1)
      };
    };

    LinterHarbour.prototype.verifyRowNumber = function(row) {
      var lastRow;
      lastRow = this.editor.getLastBufferRow();
      if (lastRow < row) {
        row = lastRow;
      }
      return row;
    };

    LinterHarbour.prototype.processMessage = function(message, callback) {
      var messages, regex;
      messages = [];
      regex = XRegExp(this.regex, this.regexFlags);
      XRegExp.forEach(message, regex, (function(_this) {
        return function(match, i) {
          var m, re;
          re = /\((\d+)\)/;
          m = re.exec(match.message);
          if (m) {
            match.line = m[1];
          }
          return messages.push(_this.createMessage(match));
        };
      })(this), this);
      return callback(messages);
    };

    LinterHarbour.prototype.createMessage = function(match) {
      var level, message;
      if (match.error) {
        level = 'error';
      } else if (match.warning) {
        level = 'warning';
      } else {
        level = this.defaultLevel;
      }
      message = this.formatMessage(match);
      return {
        line: this.verifyRowNumber(match.line),
        col: match.col,
        level: level,
        message: message,
        linter: this.linterName,
        range: this.computeRange(match)
      };
    };

    LinterHarbour.prototype.lineLengthForRow = function(row) {
      return this.editor.lineLengthForBufferRow(this.verifyRowNumber(row));
    };

    LinterHarbour.prototype.destroy = function() {
      atom.config.unobserve('linter-harbour.harbourExecutablePath');
      atom.config.unobserve('linter-harbour.harbourOptions');
      return atom.config.unobserve('linter-harbour.harbourIncludes');
    };

    LinterHarbour.prototype.errorStream = 'stderr';

    return LinterHarbour;

  })(Linter);

  module.exports = LinterHarbour;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsZUFBUixDQUFoQixFQUFDLFlBQUEsSUFBRCxFQUFPLGFBQUEsS0FBUCxDQUFBOztBQUFBLEVBQ0EsVUFBQSxHQUFhLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsUUFBL0IsQ0FBd0MsQ0FBQyxJQUR0RCxDQUFBOztBQUFBLEVBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxFQUFBLEdBQUUsVUFBRixHQUFjLGFBQXRCLENBRlQsQ0FBQTs7QUFBQSxFQUdBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUhQLENBQUE7O0FBQUEsRUFJQyxVQUFXLE9BQUEsQ0FBUyxFQUFBLEdBQUUsVUFBRixHQUFjLHVCQUF2QixFQUFYLE9BSkQsQ0FBQTs7QUFBQSxFQUtBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUxMLENBQUE7O0FBQUEsRUFPTTtBQUVKLG9DQUFBLENBQUE7O0FBQUEsSUFBQSxhQUFDLENBQUEsTUFBRCxHQUFTLGdCQUFULENBQUE7O0FBQUEsNEJBRUEsR0FBQSxHQUFLLFNBRkwsQ0FBQTs7QUFBQSw0QkFJQSxVQUFBLEdBQVksU0FKWixDQUFBOztBQUFBLDRCQVFBLEtBQUEsR0FBTyxvRkFSUCxDQUFBOztBQUFBLDRCQVVBLFVBQUEsR0FBWSxFQVZaLENBQUE7O0FBQUEsNEJBYUEsR0FBQSxHQUFLLElBYkwsQ0FBQTs7QUFBQSw0QkFlQSxZQUFBLEdBQWMsT0FmZCxDQUFBOztBQUFBLDRCQWlCQSxjQUFBLEdBQWdCLElBakJoQixDQUFBOztBQUFBLDRCQW1CQSxnQkFBQSxHQUFrQixLQW5CbEIsQ0FBQTs7QUFxQmEsSUFBQSx1QkFBQyxNQUFELEdBQUE7QUFDWCxNQUFBLCtDQUFN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
//# sourceURL=/home/bringout/.atom/packages/linter-harbour/lib/linter-harbour.coffee