(function() {
  var RubocopAutoCorrect;

  RubocopAutoCorrect = require('./rubocop-auto-correct');

  module.exports = {
    activate: function() {
      return this.rubocopAutoCorrect = new RubocopAutoCorrect();
    },
    deactivate: function() {
      var ref;
      if ((ref = this.rubocopAutoCorrect) != null) {
        ref.destroy();
      }
      return this.rubocopAutoCorrect = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcnVib2NvcC1hdXRvLWNvcnJlY3QvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsd0JBQVI7O0VBRXJCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxrQkFBRCxHQUFzQixJQUFJLGtCQUFKLENBQUE7SUFEZCxDQUFWO0lBR0EsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBOztXQUFtQixDQUFFLE9BQXJCLENBQUE7O2FBQ0EsSUFBQyxDQUFBLGtCQUFELEdBQXNCO0lBRlosQ0FIWjs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbIlJ1Ym9jb3BBdXRvQ29ycmVjdCA9IHJlcXVpcmUgJy4vcnVib2NvcC1hdXRvLWNvcnJlY3QnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IC0+XG4gICAgQHJ1Ym9jb3BBdXRvQ29ycmVjdCA9IG5ldyBSdWJvY29wQXV0b0NvcnJlY3QoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHJ1Ym9jb3BBdXRvQ29ycmVjdD8uZGVzdHJveSgpXG4gICAgQHJ1Ym9jb3BBdXRvQ29ycmVjdCA9IG51bGxcbiJdfQ==
