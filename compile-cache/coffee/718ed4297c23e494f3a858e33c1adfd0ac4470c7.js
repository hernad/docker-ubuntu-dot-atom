(function() {
  module.exports = {
    configDefaults: {
      environmentOverridesConfiguration: true,
      formatOnSave: false,
      harbourFormatExe: '',
      harbourExe: '',
      showPanel: true,
      showPanelWhenNoIssuesExist: false
    },
    activate: function(state) {
      return this.dispatch = this.createDispatch();
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.dispatch) != null) {
        _ref.destroy();
      }
      return this.dispatch = null;
    },
    createDispatch: function() {
      var Dispatch;
      if (this.dispatch == null) {
        Dispatch = require('./dispatch');
        return this.dispatch = new Dispatch();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsaUNBQUEsRUFBbUMsSUFBbkM7QUFBQSxNQUNBLFlBQUEsRUFBYyxLQURkO0FBQUEsTUFFQSxnQkFBQSxFQUFrQixFQUZsQjtBQUFBLE1BR0EsVUFBQSxFQUFZLEVBSFo7QUFBQSxNQUlBLFNBQUEsRUFBVyxJQUpYO0FBQUEsTUFLQSwwQkFBQSxFQUE0QixLQUw1QjtLQURGO0FBQUEsSUFTQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxjQUFELENBQUEsRUFESjtJQUFBLENBVFY7QUFBQSxJQVlBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQVMsQ0FBRSxPQUFYLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FGRjtJQUFBLENBWlo7QUFBQSxJQWdCQSxjQUFBLEVBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBTyxxQkFBUDtBQUNFLFFBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBQVgsQ0FBQTtlQUNBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsUUFBQSxDQUFBLEVBRmxCO09BRGM7SUFBQSxDQWhCaEI7R0FERixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/bringout/.atom/packages/harbour-plus/lib/harbour-plus.coffee