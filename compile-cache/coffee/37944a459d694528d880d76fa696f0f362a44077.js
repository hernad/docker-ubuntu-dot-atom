(function() {
  var BufferedProcess, Executor, fs, spawnSync,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  spawnSync = require('child_process').spawnSync;

  BufferedProcess = require('atom').BufferedProcess;

  fs = require('fs-plus');

  module.exports = Executor = (function() {
    function Executor(environment) {
      this.environment = environment;
      this.exec = __bind(this.exec, this);
      this.execSync = __bind(this.execSync, this);
    }

    Executor.prototype.execSync = function(command, cwd, env, args) {
      var done, message, options, result;
      options = {
        cwd: null,
        env: null,
        encoding: 'utf8'
      };
      if ((cwd != null) && cwd !== '' && cwd !== false && fs.existsSync(cwd)) {
        options.cwd = fs.realpathSync(cwd);
      }
      options.env = env != null ? env : this.environment;
      if (args == null) {
        args = [];
      }
      done = spawnSync(command, args, options);
      result = {
        code: done.status,
        stdout: (done != null ? done.stdout : void 0) != null ? done.stdout : '',
        stderr: (done != null ? done.stderr : void 0) != null ? done.stderr : '',
        messages: []
      };
      if (done.error != null) {
        if (done.error.code === 'ENOENT') {
          message = {
            line: false,
            column: false,
            msg: 'No file or directory: [' + command + ']',
            type: 'error',
            source: 'executor'
          };
          result.messages.push(message);
          result.code = 127;
        }
      }
      return result;
    };

    Executor.prototype.exec = function(command, cwd, env, callback, args) {
      var bufferedprocess, code, error, exit, messages, options, output, stderr, stdout;
      output = '';
      error = '';
      code = 0;
      messages = [];
      options = {
        cwd: null,
        env: null
      };
      if ((cwd != null) && cwd !== '' && cwd !== false && fs.existsSync(cwd)) {
        options.cwd = fs.realpathSync(cwd);
      }
      options.env = env != null ? env : this.environment;
      stdout = function(data) {
        return output += data;
      };
      stderr = function(data) {
        return error += data;
      };
      exit = function(data) {
        var message;
        if ((error != null) && error !== '' && error.replace(/\r?\n|\r/g, '') === "\'" + command + "\' is not recognized as an internal or external command,operable program or batch file.") {
          message = {
            line: false,
            column: false,
            msg: 'No file or directory: [' + command + ']',
            type: 'error',
            source: 'executor'
          };
          messages.push(message);
          callback(127, output, error, messages);
          return;
        }
        code = data;
        return callback(code, output, error, messages);
      };
      if (args == null) {
        args = [];
      }
      console.log("Executor.exec:", command, args, options);
      bufferedprocess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      return bufferedprocess.process.once('error', (function(_this) {
        return function(err) {
          var message;
          if (err.code === 'ENOENT') {
            message = {
              line: false,
              column: false,
              msg: 'No file or directory: [' + command + ']',
              type: 'error',
              source: 'executor'
            };
            messages.push(message);
          } else {
            console.log(err);
          }
          return callback(127, output, error, messages);
        };
      })(this));
    };

    return Executor;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxZQUFhLE9BQUEsQ0FBUSxlQUFSLEVBQWIsU0FBRCxDQUFBOztBQUFBLEVBQ0Msa0JBQW1CLE9BQUEsQ0FBUSxNQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUZMLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxrQkFBRSxXQUFGLEdBQUE7QUFBZ0IsTUFBZixJQUFDLENBQUEsY0FBQSxXQUFjLENBQUE7QUFBQSx5Q0FBQSxDQUFBO0FBQUEsaURBQUEsQ0FBaEI7SUFBQSxDQUFiOztBQUFBLHVCQUVBLFFBQUEsR0FBVSxTQUFDLE9BQUQsRUFBVSxHQUFWLEVBQWUsR0FBZixFQUFvQixJQUFwQixHQUFBO0FBQ1IsVUFBQSw4QkFBQTtBQUFBLE1BQUEsT0FBQSxHQUNFO0FBQUEsUUFBQSxHQUFBLEVBQUssSUFBTDtBQUFBLFFBQ0EsR0FBQSxFQUFLLElBREw7QUFBQSxRQUVBLFFBQUEsRUFBVSxNQUZWO09BREYsQ0FBQTtBQUlBLE1BQUEsSUFBc0MsYUFBQSxJQUFTLEdBQUEsS0FBUyxFQUFsQixJQUF5QixHQUFBLEtBQVMsS0FBbEMsSUFBNEMsRUFBRSxDQUFDLFVBQUgsQ0FBYyxHQUFkLENBQWxGO0FBQUEsUUFBQSxPQUFPLENBQUMsR0FBUixHQUFjLEVBQUUsQ0FBQyxZQUFILENBQWdCLEdBQWhCLENBQWQsQ0FBQTtPQUpBO0FBQUEsTUFLQSxPQUFPLENBQUMsR0FBUixHQUFpQixXQUFILEdBQWEsR0FBYixHQUFzQixJQUFDLENBQUEsV0FMckMsQ0FBQTtBQU1BLE1BQUEsSUFBaUIsWUFBakI7QUFBQSxRQUFBLElBQUEsR0FBTyxFQUFQ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
//# sourceURL=/home/bringout/.atom/packages/harbour-plus/lib/executor.coffee