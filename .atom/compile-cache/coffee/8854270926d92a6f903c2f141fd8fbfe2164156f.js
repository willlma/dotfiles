(function() {
  var StatusMessage;

  module.exports = StatusMessage = (function() {
    function StatusMessage(message) {
      this.statusBar = document.querySelector('status-bar');
      if (this.statusBar) {
        this.item = document.createElement('div');
        this.item.classList.add('inline-block');
        this.setText(message);
        this.tile = this.statusBar.addLeftTile({
          item: this.item
        });
      }
    }

    StatusMessage.prototype.remove = function() {
      var ref;
      return (ref = this.tile) != null ? ref.destroy() : void 0;
    };

    StatusMessage.prototype.setText = function(text) {
      if (this.statusBar) {
        return this.item.innerHTML = text;
      }
    };

    return StatusMessage;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3dpbGwvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGFja2FnZS1zeW5jL2xpYi9zdGF0dXMtbWVzc2FnZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFPUyx1QkFBQyxPQUFEO01BQ1gsSUFBQyxDQUFBLFNBQUQsR0FBYSxRQUFRLENBQUMsYUFBVCxDQUF1QixZQUF2QjtNQUNiLElBQUcsSUFBQyxDQUFBLFNBQUo7UUFDRSxJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO1FBQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsY0FBcEI7UUFDQSxJQUFDLENBQUEsT0FBRCxDQUFTLE9BQVQ7UUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxDQUF1QjtVQUFFLE1BQUQsSUFBQyxDQUFBLElBQUY7U0FBdkIsRUFMVjs7SUFGVzs7NEJBVWIsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBOzRDQUFLLENBQUUsT0FBUCxDQUFBO0lBRE07OzRCQU1SLE9BQUEsR0FBUyxTQUFDLElBQUQ7TUFDUCxJQUEwQixJQUFDLENBQUEsU0FBM0I7ZUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0IsS0FBbEI7O0lBRE87Ozs7O0FBeEJYIiwic291cmNlc0NvbnRlbnQiOlsiIyBQdWJsaWM6IERpc3BsYXlzIGEgbWVzc2FnZSBpbiB0aGUgc3RhdHVzIGJhci5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFN0YXR1c01lc3NhZ2VcbiAgIyBQdWJsaWM6IERpc3BsYXlzIGBtZXNzYWdlYCBpbiB0aGUgc3RhdHVzIGJhci5cbiAgI1xuICAjIElmIHRoZSBzdGF0dXMgYmFyIGRvZXMgbm90IGV4aXN0IGZvciB3aGF0ZXZlciByZWFzb24sIG5vIG1lc3NhZ2UgaXMgZGlzcGxheWVkIGFuZCBubyBlcnJvclxuICAjIG9jY3Vycy5cbiAgI1xuICAjIG1lc3NhZ2UgLSBBIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIG1lc3NhZ2UgdG8gZGlzcGxheS5cbiAgY29uc3RydWN0b3I6IChtZXNzYWdlKSAtPlxuICAgIEBzdGF0dXNCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdGF0dXMtYmFyJylcbiAgICBpZiBAc3RhdHVzQmFyXG4gICAgICBAaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBAaXRlbS5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKVxuICAgICAgQHNldFRleHQobWVzc2FnZSlcblxuICAgICAgQHRpbGUgPSBAc3RhdHVzQmFyLmFkZExlZnRUaWxlKHtAaXRlbX0pXG5cbiAgIyBQdWJsaWM6IFJlbW92ZXMgdGhlIG1lc3NhZ2UgZnJvbSB0aGUgc3RhdHVzIGJhci5cbiAgcmVtb3ZlOiAtPlxuICAgIEB0aWxlPy5kZXN0cm95KClcblxuICAjIFB1YmxpYzogVXBkYXRlcyB0aGUgdGV4dCBvZiB0aGUgbWVzc2FnZS5cbiAgI1xuICAjIHRleHQgLSBBIHtTdHJpbmd9IGNvbnRhaW5pbmcgdGhlIG5ldyBtZXNzYWdlIHRvIGRpc3BsYXkuXG4gIHNldFRleHQ6ICh0ZXh0KSAtPlxuICAgIEBpdGVtLmlubmVySFRNTCA9IHRleHQgaWYgQHN0YXR1c0JhclxuIl19
