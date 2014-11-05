(function() {
  var Emitter, Executor, Harbour, HarbourExecutable, PathExpander, Subscriber, async, fs, os, path, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  async = require('async');

  path = require('path');

  fs = require('fs-plus');

  os = require('os');

  Harbour = require('./harbour');

  _ = require('underscore-plus');

  Executor = require('./executor');

  PathExpander = require('./util/pathexpander');

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  module.exports = HarbourExecutable = (function() {
    Subscriber.includeInto(HarbourExecutable);

    Emitter.includeInto(HarbourExecutable);

    function HarbourExecutable(env) {
      this.env = env;
      this.current = __bind(this.current, this);
      this.introspect = __bind(this.introspect, this);
      this.detect = __bind(this.detect, this);
      this.harbours = [];
      this.currentharbour = '';
      this.executor = new Executor(this.env);
      this.pathexpander = new PathExpander(this.env);
    }

    HarbourExecutable.prototype.destroy = function() {
      this.unsubscribe();
      this.executor = null;
      this.pathexpander = null;
      this.harbours = [];
      this.currentharbour = '';
      return this.reset();
    };

    HarbourExecutable.prototype.reset = function() {
      this.harbours = [];
      this.currentharbour = '';
      return this.emit('reset');
    };

    HarbourExecutable.prototype.detect = function() {
      var element, elements, executables, harbourExe, _i, _j, _len, _len1;
      executables = [];
      harbourExe = atom.config.get('harbour-plus.harbourExe');
      console.log("os.platform:", os.platform(), "path.separator", path.sep);
      switch (os.platform()) {
        case 'darwin':
        case 'freebsd':
        case 'linux':
        case 'sunos':
          if ((harbourExe != null) && harbourExe.trim() !== '') {
            if (harbourExe.lastIndexOf(path.sep + 'harbour') === harbourExe.length - 8) {
              executables.push(path.normalize(harbourExe));
            }
          }
          if (this.env.PATH != null) {
            elements = this.env.PATH.split(path.delimiter);
            for (_i = 0, _len = elements.length; _i < _len; _i++) {
              element = elements[_i];
              executables.push(path.normalize(path.join(element, 'harbour')));
            }
          }
          executables.push(path.normalize(path.join('/opt', 'harbour', 'bin', 'harbour')));
          executables.push(path.normalize(path.join('/usr', 'local', 'bin', 'harbour')));
          break;
        case 'win32':
          if ((harbourExe != null) && harbourExe.trim() !== '') {
            if (harbourExe.lastIndexOf(path.sep + 'harbour.exe') === harbourExe.length - 12) {
              executables.push(path.normalize(harbourExe));
            }
          }
          if (this.env.Path != null) {
            elements = this.env.Path.split(path.delimiter);
            for (_j = 0, _len1 = elements.length; _j < _len1; _j++) {
              element = elements[_j];
              executables.push(path.normalize(path.join(element, 'harbour.exe')));
            }
          }
          executables.push(path.normalize(path.join('C:', 'harbour', 'bin', 'harbour.exe')));
      }
      executables = _.uniq(executables);
      return async.filter(executables, fs.exists, (function(_this) {
        return function(results) {
          executables = results;
          return async.map(executables, _this.introspect, function(err, results) {
            if (err != null) {
              console.log('Error mapping harbour: ' + err);
            }
            _this.harbours = results;
            return _this.emit('detect-complete', _this.current());
          });
        };
      })(this));
    };

    HarbourExecutable.prototype.introspect = function(executable, outercallback) {
      var absoluteExecutable, harbour;
      absoluteExecutable = path.resolve(executable);
      harbour = new Harbour(absoluteExecutable, this.pathexpander);
      async.series([
        (function(_this) {
          return function(callback) {
            var done, error;
            done = function(exitcode, stdout, stderr) {
              var components;
              if (!((stderr != null) && stderr !== '')) {
                if ((stdout != null) && stdout !== '') {
                  components = stdout.replace(/\r?\n|\r/g, '').split(' ');
                  harbour.name = components[2] + ' ' + components[3];
                  harbour.version = components[2];
                  harbour.env = _this.env;
                }
              }
              if (typeof err !== "undefined" && err !== null) {
                console.log('Error running harbour version: ' + err);
              }
              if ((stderr != null) && stderr !== '') {
                console.log('Error detail (stderr): ' + stderr);
              }
              return callback(null);
            };
            try {
              console.log('starting [' + absoluteExecutable + ' --version ]');
              return _this.executor.exec(absoluteExecutable, false, _this.env, done, ['--version']);
            } catch (_error) {
              error = _error;
              console.log('harbour [' + absoluteExecutable + '] is not a valid harbour');
              return harbour = null;
            }
          };
        })(this)
      ], (function(_this) {
        return function(err, results) {
          return outercallback(err, harbour);
        };
      })(this));
      console.log("introspect HB_ROOT", process.env.HB_ROOT);
      return harbour.hbroot = process.env.HB_ROOT;
    };

    HarbourExecutable.prototype.current = function() {
      var harbour, _i, _len, _ref1;
      if (_.size(this.harbours) === 1) {
        return this.harbours[0];
      }
      _ref1 = this.harbours;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        harbour = _ref1[_i];
        if (harbour.executable === this.currentharbour) {
          return harbour;
        }
      }
      return this.harbours[0];
    };

    return HarbourExecutable;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFHQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBSlYsQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FMSixDQUFBOztBQUFBLEVBTUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBTlgsQ0FBQTs7QUFBQSxFQU9BLFlBQUEsR0FBZSxPQUFBLENBQVEscUJBQVIsQ0FQZixDQUFBOztBQUFBLEVBUUEsT0FBd0IsT0FBQSxDQUFRLFVBQVIsQ0FBeEIsRUFBQyxrQkFBQSxVQUFELEVBQWEsZUFBQSxPQVJiLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixpQkFBdkIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsaUJBQXBCLENBREEsQ0FBQTs7QUFHYSxJQUFBLDJCQUFFLEdBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLE1BQUEsR0FDYixDQUFBO0FBQUEsK0NBQUEsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEVBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0IsRUFEbEIs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
//# sourceURL=/home/bringout/.atom/packages/harbour-plus/lib/harbourexecutable.coffee