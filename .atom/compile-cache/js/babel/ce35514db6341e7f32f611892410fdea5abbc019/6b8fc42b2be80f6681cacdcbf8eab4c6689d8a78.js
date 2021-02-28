Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

'use babel';
exports['default'] = {
  getScrollDistance: function getScrollDistance($child, $parent) {
    var viewTop = $parent.offset().top,
        viewBottom = viewTop + $parent.height(),
        scrollTop = $parent.scrollTop(),
        scrollBottom = scrollTop + $parent.height(),
        elemTop = $child.offset().top,
        elemBottom = elemTop + $child.height();

    var ret = {
      needScroll: true,
      distance: 0
    };
    // Element is upon or under the view
    if (elemTop < viewTop || elemBottom > viewBottom) ret.distance = scrollTop + elemTop - viewTop;else ret.needScroll = false;

    return ret;
  },

  selectTreeNode: function selectTreeNode($target, vm, opts) {
    if ($target.is('span')) $target = $target.parent();
    if ($target.is('div')) $target = $target.parent();
    if ($target.is('li')) {
      // ".toggle" would be TRUE if it's double click
      if (opts && opts.toggle) {
        $target.hasClass('list-nested-item') && $target[$target.hasClass('collapsed') ? 'removeClass' : 'addClass']('collapsed');
      }
      var oldVal = vm.treeNodeId,
          val = $target.attr('node-id');

      // Same node
      if (oldVal === val) return;

      oldVal && (0, _jquery2['default'])('div.structure-view>div.tree-panel>ol').find('li.selected').removeClass('selected');
      $target.addClass('selected');
      vm.treeNodeId = val;
    }
  },

  notify: function notify(title, msg) {
    atom.notifications.addInfo(title, { detail: msg, dismissable: true });
  },

  alert: function alert(title, msg) {
    atom.confirm({
      message: title,
      detailedMessage: msg,
      buttons: {
        Close: function Close() {
          return;
        }
      }
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL3N0cnVjdHVyZS12aWV3L2xpYi91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQkFDYyxRQUFROzs7O0FBRHRCLFdBQVcsQ0FBQztxQkFHRztBQUNiLG1CQUFpQixFQUFBLDJCQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7QUFDakMsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUc7UUFDbEMsVUFBVSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFO1FBQ3ZDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFO1FBQy9CLFlBQVksR0FBRyxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUMzQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUc7UUFDN0IsVUFBVSxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRXpDLFFBQU0sR0FBRyxHQUFHO0FBQ1YsZ0JBQVUsRUFBRSxJQUFJO0FBQ2hCLGNBQVEsRUFBRSxDQUFDO0tBQ1osQ0FBQzs7QUFFRixRQUFJLEFBQUMsT0FBTyxHQUFHLE9BQU8sSUFBTSxVQUFVLEdBQUcsVUFBVSxBQUFDLEVBQUUsR0FBRyxDQUFDLFFBQVEsR0FBRyxTQUFTLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUM5RixHQUFHLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQzs7QUFFNUIsV0FBTyxHQUFHLENBQUM7R0FDWjs7QUFFRCxnQkFBYyxFQUFBLHdCQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ2hDLFFBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25ELFFBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2xELFFBQUksT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTs7QUFFcEIsVUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUN2QixlQUFPLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsYUFBYSxHQUFHLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQzFIO0FBQ0QsVUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLFVBQVU7VUFDeEIsR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7OztBQUdoQyxVQUFJLE1BQU0sS0FBSyxHQUFHLEVBQUUsT0FBTzs7QUFFM0IsWUFBTSxJQUFJLHlCQUFFLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRyxhQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzdCLFFBQUUsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0tBQ3JCO0dBQ0Y7O0FBRUQsUUFBTSxFQUFBLGdCQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7QUFDakIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztHQUN2RTs7QUFFRCxPQUFLLEVBQUEsZUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO0FBQ2hCLFFBQUksQ0FBQyxPQUFPLENBQUM7QUFDWCxhQUFPLEVBQUUsS0FBSztBQUNkLHFCQUFlLEVBQUUsR0FBRztBQUNwQixhQUFPLEVBQUU7QUFDUCxhQUFLLEVBQUUsaUJBQVc7QUFDaEIsaUJBQU87U0FDUjtPQUNGO0tBQ0YsQ0FBQyxDQUFDO0dBQ0o7Q0FDRiIsImZpbGUiOiIvVXNlcnMvd2lsbC9kb3RmaWxlcy8uYXRvbS9wYWNrYWdlcy9zdHJ1Y3R1cmUtdmlldy9saWIvdXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBnZXRTY3JvbGxEaXN0YW5jZSgkY2hpbGQsICRwYXJlbnQpIHtcbiAgICBjb25zdCB2aWV3VG9wID0gJHBhcmVudC5vZmZzZXQoKS50b3AsXG4gICAgICB2aWV3Qm90dG9tID0gdmlld1RvcCArICRwYXJlbnQuaGVpZ2h0KCksXG4gICAgICBzY3JvbGxUb3AgPSAkcGFyZW50LnNjcm9sbFRvcCgpLFxuICAgICAgc2Nyb2xsQm90dG9tID0gc2Nyb2xsVG9wICsgJHBhcmVudC5oZWlnaHQoKSxcbiAgICAgIGVsZW1Ub3AgPSAkY2hpbGQub2Zmc2V0KCkudG9wLFxuICAgICAgZWxlbUJvdHRvbSA9IGVsZW1Ub3AgKyAkY2hpbGQuaGVpZ2h0KCk7XG5cbiAgICBjb25zdCByZXQgPSB7XG4gICAgICBuZWVkU2Nyb2xsOiB0cnVlLFxuICAgICAgZGlzdGFuY2U6IDBcbiAgICB9O1xuICAgIC8vIEVsZW1lbnQgaXMgdXBvbiBvciB1bmRlciB0aGUgdmlld1xuICAgIGlmICgoZWxlbVRvcCA8IHZpZXdUb3ApIHx8IChlbGVtQm90dG9tID4gdmlld0JvdHRvbSkpIHJldC5kaXN0YW5jZSA9IHNjcm9sbFRvcCArIGVsZW1Ub3AgLSB2aWV3VG9wO1xuICAgIGVsc2UgcmV0Lm5lZWRTY3JvbGwgPSBmYWxzZTtcblxuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgc2VsZWN0VHJlZU5vZGUoJHRhcmdldCwgdm0sIG9wdHMpIHtcbiAgICBpZiAoJHRhcmdldC5pcygnc3BhbicpKSAkdGFyZ2V0ID0gJHRhcmdldC5wYXJlbnQoKTtcbiAgICBpZiAoJHRhcmdldC5pcygnZGl2JykpICR0YXJnZXQgPSAkdGFyZ2V0LnBhcmVudCgpO1xuICAgIGlmICgkdGFyZ2V0LmlzKCdsaScpKSB7XG4gICAgICAvLyBcIi50b2dnbGVcIiB3b3VsZCBiZSBUUlVFIGlmIGl0J3MgZG91YmxlIGNsaWNrXG4gICAgICBpZiAob3B0cyAmJiBvcHRzLnRvZ2dsZSkge1xuICAgICAgICAkdGFyZ2V0Lmhhc0NsYXNzKCdsaXN0LW5lc3RlZC1pdGVtJykgJiYgJHRhcmdldFskdGFyZ2V0Lmhhc0NsYXNzKCdjb2xsYXBzZWQnKSA/ICdyZW1vdmVDbGFzcycgOiAnYWRkQ2xhc3MnXSgnY29sbGFwc2VkJyk7XG4gICAgICB9XG4gICAgICBsZXQgb2xkVmFsID0gdm0udHJlZU5vZGVJZCxcbiAgICAgICAgdmFsID0gJHRhcmdldC5hdHRyKCdub2RlLWlkJyk7XG5cbiAgICAgIC8vIFNhbWUgbm9kZVxuICAgICAgaWYgKG9sZFZhbCA9PT0gdmFsKSByZXR1cm47XG5cbiAgICAgIG9sZFZhbCAmJiAkKCdkaXYuc3RydWN0dXJlLXZpZXc+ZGl2LnRyZWUtcGFuZWw+b2wnKS5maW5kKCdsaS5zZWxlY3RlZCcpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpO1xuICAgICAgJHRhcmdldC5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcbiAgICAgIHZtLnRyZWVOb2RlSWQgPSB2YWw7XG4gICAgfVxuICB9LFxuXG4gIG5vdGlmeSh0aXRsZSwgbXNnKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8odGl0bGUsIHsgZGV0YWlsOiBtc2csIGRpc21pc3NhYmxlOiB0cnVlIH0pO1xuICB9LFxuXG4gIGFsZXJ0KHRpdGxlLCBtc2cpIHtcbiAgICBhdG9tLmNvbmZpcm0oe1xuICAgICAgbWVzc2FnZTogdGl0bGUsXG4gICAgICBkZXRhaWxlZE1lc3NhZ2U6IG1zZyxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgQ2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuIl19