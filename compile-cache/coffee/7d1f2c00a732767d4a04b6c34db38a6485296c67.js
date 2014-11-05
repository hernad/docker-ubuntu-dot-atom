(function() {
  var SplicerSplitter, _,
    __slice = [].slice;

  _ = require('underscore-plus');

  module.exports = SplicerSplitter = (function() {
    function SplicerSplitter() {}

    SplicerSplitter.prototype.splitAndSquashToArray = function(delimeter, arg) {
      var result;
      if (!((arg != null) && arg.length > 0)) {
        return [];
      }
      if (!((delimeter != null) && delimeter.length > 0)) {
        return [];
      }
      result = (function() {
        switch (delimeter) {
          case ' ':
            return arg.split(/[\s]+/);
          case ':':
            return arg.split(/[:]+/);
          case ';':
            return arg.split(/[;]+/);
          default:
            return [];
        }
      })();
      result = _.map(result, function(item) {
        if (item == null) {
          return '';
        }
        return item.trim();
      });
      return result = _.filter(result, function(item) {
        return (item != null) && item.length > 0 && item !== '';
      });
    };

    SplicerSplitter.prototype.spliceAndSquash = function() {
      var args, result;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!((args != null) && args.length > 0)) {
        return '';
      }
      args = _.map.apply(_, __slice.call(args).concat([function(item) {
        if (item == null) {
          return '';
        }
        return item.trim();
      }]));
      args = _.filter(args, function(item) {
        return (item != null) && item.length > 0 && item.trim() !== '';
      });
      return result = args.join(' ');
    };

    return SplicerSplitter;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007aUNBQ0o7O0FBQUEsOEJBQUEscUJBQUEsR0FBdUIsU0FBQyxTQUFELEVBQVksR0FBWixHQUFBO0FBQ3JCLFVBQUEsTUFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLENBQWlCLGFBQUEsSUFBUyxHQUFHLENBQUMsTUFBSixHQUFhLENBQXZDLENBQUE7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsQ0FBaUIsbUJBQUEsSUFBZSxTQUFTLENBQUMsTUFBVixHQUFtQixDQUFuRCxDQUFBO0FBQUEsZUFBTyxFQUFQLENBQUE7T0FEQTtBQUFBLE1BRUEsTUFBQTtBQUFTLGdCQUFPLFNBQVA7QUFBQSxlQUNGLEdBREU7bUJBQ08sR0FBRyxDQUFDLEtBQUosQ0FBVSxPQUFWLEVBRFA7QUFBQSxlQUVGLEdBRkU7bUJBRU8sR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFWLEVBRlA7QUFBQSxlQUdGLEdBSEU7bUJBR08sR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFWLEVBSFA7QUFBQTttQkFJRixHQUpFO0FBQUE7VUFGVCxDQUFBO0FBQUEsTUFPQSxNQUFBLEdBQVMsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxNQUFOLEVBQWMsU0FBQyxJQUFELEdBQUE7QUFDckIsUUFBQSxJQUFpQixZQUFqQjtBQUFBLGlCQUFPLEVBQVAsQ0FBQTtTQUFBO0FBQ0EsZUFBTyxJQUFJLENBQUMsSUFBTCxDQUFBLENBQVAsQ0FGcUI7TUFBQSxDQUFkLENBUFQsQ0FBQTthQVVBLE1BQUEsR0FBUyxDQUFDLENBQUMsTUFBRixDQUFTLE1BQVQsRUFBaUIsU0FBQyxJQUFELEdBQUE7ZUFBVSxjQUFBLElBQVUsSUFBSSxDQUFDLE1BQUwsR0FBYyxDQUF4QixJQUE4QixJQUFBLEtBQVUsR0FBbEQ7TUFBQSxDQUFqQixFQVhZO0lBQUEsQ0FBdkIsQ0FBQTs7QUFBQSw4QkFhQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsWUFBQTtBQUFBLE1BRGdCLDhEQUNoQixDQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBaUIsY0FBQSxJQUFVLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBekMsQ0FBQTtBQUFBLGVBQU8sRUFBUCxDQUFBO09BQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxDQUFDLENBQUMsR0FBRixVQUFNLGFBQUEsSUFBQSxDQUFBLFFBQVMsQ0FBQSxTQUFDLElBQUQsR0FBQTtBQUNwQixRQUFBLElBQWlCLFlBQWpCO0FBQUEsaUJBQU8sRUFBUCxDQUFBO1NBQUE7QUFDQSxlQUFPLElBQUksQ0FBQyxJQUFMLENBQUEsQ0FBUCxDQUZvQjtNQUFBLENBQUEsQ0FBVCxDQUFOLENBRFAsQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxFQUFlLFNBQUMsSUFBRCxHQUFBO2VBQVUsY0FBQSxJQUFVLElBQUksQ0FBQyxNQUFMLEdBQWMsQ0FBeEIsSUFBOEIsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFBLEtBQWlCLEdBQXpEO01BQUEsQ0FBZixDQUpQLENBQUE7YUFLQSxNQUFBLEdBQVMsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLEVBTk07SUFBQSxDQWJqQixDQUFBOzsyQkFBQTs7TUFKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/bringout/.atom/packages/harbour-plus/lib/util/splicersplitter.coffee