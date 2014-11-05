(function() {
  var Harbour, fs, os, path, _;

  fs = require('fs-plus');

  path = require('path');

  os = require('os');

  _ = require('underscore-plus');

  module.exports = Harbour = (function() {
    Harbour.prototype.name = '';

    Harbour.prototype.exe = '';

    Harbour.prototype.version = '';

    Harbour.prototype.hbroot = '';

    Harbour.prototype.env = false;

    function Harbour(executable, pathexpander, options) {
      this.executable = executable;
      this.pathexpander = pathexpander;
      if ((options != null ? options.name : void 0) != null) {
        this.name = options.name;
      }
      if (os.platform() === 'win32') {
        console.log("win32 exe");
        this.exe = ".exe";
      }
      if ((options != null ? options.version : void 0) != null) {
        this.version = options.version;
      }
      if ((options != null ? options.hbroot : void 0) != null) {
        this.hbroot = options.hbroot;
      }
    }

    Harbour.prototype.description = function() {
      return this.name + ' (@ ' + this.hbroot + ')';
    };

    Harbour.prototype.harbour = function() {
      console.log("harbour executable", this.executable);
      if (!((this.executable != null) && this.executable !== '')) {
        return false;
      }
      if (!fs.existsSync(this.executable)) {
        return false;
      }
      return fs.realpathSync(this.executable);
    };

    Harbour.prototype.hbformat = function() {
      var result;
      result = atom.config.get('harbour-plus.harbourFormatExe');
      if ((result != null) && result !== '') {
        console.log("hbformat defined", result);
        return result;
      }
      console.log("hbroot", this.hbroot);
      if (!((this.hbroot != null) && this.hbroot !== '')) {
        return false;
      }
      result = path.join(this.hbroot, 'bin', 'hbformat' + this.exe);
      console.log("hbformat exec? :", result);
      if (!fs.existsSync(result)) {
        return false;
      }
      return fs.realpathSync(result);
    };

    return Harbour;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUhKLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0JBQUEsSUFBQSxHQUFNLEVBQU4sQ0FBQTs7QUFBQSxzQkFDQSxHQUFBLEdBQUssRUFETCxDQUFBOztBQUFBLHNCQUVBLE9BQUEsR0FBUyxFQUZULENBQUE7O0FBQUEsc0JBR0EsTUFBQSxHQUFRLEVBSFIsQ0FBQTs7QUFBQSxzQkFJQSxHQUFBLEdBQUssS0FKTCxDQUFBOztBQU1hLElBQUEsaUJBQUUsVUFBRixFQUFlLFlBQWYsRUFBNkIsT0FBN0IsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLGVBQUEsWUFDMUIsQ0FBQTtBQUFBLE1BQUEsSUFBd0IsaURBQXhCO0FBQUEsUUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLE9BQU8sQ0FBQyxJQUFoQixDQUFBO09BQUE7QUFDQSxNQUFBLElBQUcsRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUFBLEtBQWlCLE9BQXBCO0FBQ0UsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFhLFdBQWIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsR0FBRCxHQUFPLE1BRFAsQ0FERjtPQURBO0FBS0EsTUFBQSxJQUE4QixvREFBOUI7QUFBQSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBTyxDQUFDLE9BQW5CLENBQUE7T0FMQTtBQU1BLE1BQUEsSUFBNEIsbURBQTVCO0FBQUEsUUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE9BQU8sQ0FBQyxNQUFsQixDQUFBO09BUFc7SUFBQSxDQU5iOztBQUFBLHNCQWdCQSxXQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsYUFBTyxJQUFDLENBQUEsSUFBRCxHQUFRLE1BQVIsR0FBaUIsSUFBQyxDQUFBLE1BQWxCLEdBQTJCLEdBQWxDLENBRFc7SUFBQSxDQWhCYixDQUFBOztBQUFBLHNCQW1CQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFhLG9CQUFiLEVBQW1DLElBQUMsQ0FBQSxVQUFwQyxDQUFBLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxDQUFvQix5QkFBQSxJQUFpQixJQUFDLENBQUEsVUFBRCxLQUFpQixFQUF0RCxDQUFBO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBQSxDQUFBLEVBQXNCLENBQUMsVUFBSCxDQUFjLElBQUMsQ0FBQSxVQUFmLENBQXBCO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FGQTtBQUdBLGFBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBQyxDQUFBLFVBQWpCLENBQVAsQ0FKTztJQUFBLENBbkJULENBQUE7O0FBQUEsc0JBeUJBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsK0JBQWhCLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxnQkFBQSxJQUFZLE1BQUEsS0FBWSxFQUEzQjtBQUNFLFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBWixFQUFnQyxNQUFoQyxDQUFBLENBQUE7QUFDQSxlQUFPLE1BQVAsQ0FGRjtPQURBO0FBQUEsTUFJQSxPQUFPLENBQUMsR0FBUixDQUFZLFFBQVosRUFBc0IsSUFBQyxDQUFBLE1BQXZCLENBSkEsQ0FBQTtBQUtBLE1BQUEsSUFBQSxDQUFBLENBQW9CLHFCQUFBLElBQWEsSUFBQyxDQUFBLE1BQUQsS0FBYSxFQUE5QyxDQUFBO0FBQUEsZUFBTyxLQUFQLENBQUE7T0FMQTtBQUFBLE1BTUEsTUFBQSxHQUFTLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLE1BQVgsRUFBbUIsS0FBbkIsRUFBMEIsVUFBQSxHQUFhLElBQUMsQ0FBQSxHQUF4QyxDQU5ULENBQUE7QUFBQSxNQU9BLE9BQU8sQ0FBQyxHQUFSLENBQVksa0JBQVosRUFBZ0MsTUFBaEMsQ0FQQSxDQUFBO0FBUUEsTUFBQSxJQUFBLENBQUEsRUFBc0IsQ0FBQyxVQUFILENBQWMsTUFBZCxDQUFwQjtBQUFBLGVBQU8sS0FBUCxDQUFBO09BUkE7QUFTQSxhQUFPLEVBQUUsQ0FBQyxZQUFILENBQWdCLE1BQWhCLENBQVAsQ0FWUTtJQUFBLENBekJWLENBQUE7O21CQUFBOztNQVBGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/bringout/.atom/packages/harbour-plus/lib/harbour.coffee