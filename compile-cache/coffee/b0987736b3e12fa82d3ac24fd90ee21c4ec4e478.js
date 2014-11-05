(function() {
  var activate;

  activate = function() {
    return console.log('activate linter-harbour');
  };

  module.exports = {
    configDefaults: {
      harbourExecutablePath: null,
      harbourOptions: '-n -s -w3 -es1 -q0',
      harbourIncludes: null
    },
    activate: activate
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsU0FBQSxHQUFBO1dBQ1QsT0FBTyxDQUFDLEdBQVIsQ0FBWSx5QkFBWixFQURTO0VBQUEsQ0FBWCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxxQkFBQSxFQUF1QixJQUF2QjtBQUFBLE1BQ0EsY0FBQSxFQUFnQixvQkFEaEI7QUFBQSxNQUVBLGVBQUEsRUFBaUIsSUFGakI7S0FERjtBQUFBLElBSUEsUUFBQSxFQUFVLFFBSlY7R0FKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/bringout/.atom/packages/linter-harbour/lib/init.coffee