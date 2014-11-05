(function() {
  var Environment, Executor, fs, os, _;

  _ = require('underscore-plus');

  os = require('os');

  fs = require('fs-plus');

  Executor = require('./executor');

  module.exports = Environment = (function() {
    function Environment(environment) {
      this.environment = environment;
    }

    Environment.prototype.Clone = function() {
      var env, executor, match, matcher, pathhelper, result;
      env = _.clone(this.environment);
      if (!(os.platform() === 'darwin' && env.PATH === '/usr/bin:/bin:/usr/sbin:/sbin')) {
        return env;
      }
      pathhelper = '/usr/libexec/path_helper';
      if (!fs.existsSync(pathhelper)) {
        return env;
      }
      executor = new Executor(env);
      result = executor.execSync(pathhelper);
      if (result.code !== 0) {
        return env;
      }
      if ((result.stderr != null) && result.stderr !== '') {
        return env;
      }
      matcher = /^PATH="(.*?)";/img;
      match = matcher.exec(result.stdout);
      if (match == null) {
        return env;
      }
      env.PATH = match[1];
      return env;
    };

    return Environment;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBRkwsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUhYLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxxQkFBRSxXQUFGLEdBQUE7QUFBZ0IsTUFBZixJQUFDLENBQUEsY0FBQSxXQUFjLENBQWhCO0lBQUEsQ0FBYjs7QUFBQSwwQkFFQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxpREFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBQyxDQUFBLFdBQVQsQ0FBTixDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsQ0FBa0IsRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUFBLEtBQWlCLFFBQWpCLElBQThCLEdBQUcsQ0FBQyxJQUFKLEtBQVksK0JBQTVELENBQUE7QUFBQSxlQUFPLEdBQVAsQ0FBQTtPQURBO0FBQUEsTUFFQSxVQUFBLEdBQWEsMEJBRmIsQ0FBQTtBQUdBLE1BQUEsSUFBQSxDQUFBLEVBQW9CLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBbEI7QUFBQSxlQUFPLEdBQVAsQ0FBQTtPQUhBO0FBQUEsTUFJQSxRQUFBLEdBQWUsSUFBQSxRQUFBLENBQVMsR0FBVCxDQUpmLENBQUE7QUFBQSxNQUtBLE1BQUEsR0FBUyxRQUFRLENBQUMsUUFBVCxDQUFrQixVQUFsQixDQUxULENBQUE7QUFNQSxNQUFBLElBQWMsTUFBTSxDQUFDLElBQVAsS0FBaUIsQ0FBL0I7QUFBQSxlQUFPLEdBQVAsQ0FBQTtPQU5BO0FBT0EsTUFBQSxJQUFjLHVCQUFBLElBQW1CLE1BQU0sQ0FBQyxNQUFQLEtBQW1CLEVBQXBEO0FBQUEsZUFBTyxHQUFQLENBQUE7T0FQQTtBQUFBLE1BUUEsT0FBQSxHQUFVLG1CQVJWLENBQUE7QUFBQSxNQVNBLEtBQUEsR0FBUSxPQUFPLENBQUMsSUFBUixDQUFhLE1BQU0sQ0FBQyxNQUFwQixDQVRSLENBQUE7QUFVQSxNQUFBLElBQWtCLGFBQWxCO0FBQUEsZUFBTyxHQUFQLENBQUE7T0FWQTtBQUFBLE1BV0EsR0FBRyxDQUFDLElBQUosR0FBVyxLQUFNLENBQUEsQ0FBQSxDQVhqQixDQUFBO0FBWUEsYUFBTyxHQUFQLENBYks7SUFBQSxDQUZQLENBQUE7O3VCQUFBOztNQVBGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/bringout/.atom/packages/harbour-plus/lib/environment.coffee