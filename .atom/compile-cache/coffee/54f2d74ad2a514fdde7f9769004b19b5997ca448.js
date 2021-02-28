(function() {
  var provider;

  provider = require('./provider');

  module.exports = {
    activate: function() {
      return provider.loadCompletions();
    },
    getProvider: function() {
      return provider;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWh0bWwtZW50aXRpZXMvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBRVgsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQUcsUUFBUSxDQUFDLGVBQVQsQ0FBQTtJQUFILENBQVY7SUFFQSxXQUFBLEVBQWEsU0FBQTthQUFHO0lBQUgsQ0FGYjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbInByb3ZpZGVyID0gcmVxdWlyZSAnLi9wcm92aWRlcidcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogLT4gcHJvdmlkZXIubG9hZENvbXBsZXRpb25zKClcblxuICBnZXRQcm92aWRlcjogLT4gcHJvdmlkZXJcbiJdfQ==
