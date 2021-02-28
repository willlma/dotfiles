'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  darkProfile: {
    order: 1,
    description: 'Specify ui and syntax theme in the right order',
    type: 'string',
    'default': 'one-dark-ui one-dark-syntax'
  },

  lightProfile: {
    order: 2,
    description: 'Specify ui and syntax theme in the right order',
    type: 'string',
    'default': 'one-light-ui one-light-syntax'
  },

  autoMode: {
    order: 3,
    description: 'Determine if themes should be automatically changed by selected sensors',
    type: 'boolean',
    'default': true
  },

  ambientLightSensor: {
    order: 4,
    description: 'Determine if themes should be automatically changed by your ambient light sensor',
    type: 'boolean',
    'default': false
  },

  ambientLightThreshold: {
    order: 5,
    description: 'Determine threshold of Ambient Light Sensor (lower is darker)',
    type: 'integer',
    'default': '10'
  },

  sunSensor: {
    order: 6,
    description: 'Determine if themes should be automatically changed based on your sunset time',
    type: 'boolean',
    'default': true
  },

  systemThemeSensor: {
    order: 7,
    description: 'Determine if themes should be automatically changed when the system theme changes',
    type: 'boolean',
    'default': true
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7cUJBRUc7QUFDYixhQUFXLEVBQUU7QUFDWCxTQUFLLEVBQUUsQ0FBQztBQUNSLGVBQVcsRUFBRSxnREFBZ0Q7QUFDN0QsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLDZCQUE2QjtHQUN2Qzs7QUFFRCxjQUFZLEVBQUU7QUFDWixTQUFLLEVBQUUsQ0FBQztBQUNSLGVBQVcsRUFBRSxnREFBZ0Q7QUFDN0QsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLCtCQUErQjtHQUN6Qzs7QUFFRCxVQUFRLEVBQUU7QUFDUixTQUFLLEVBQUUsQ0FBQztBQUNSLGVBQVcsRUFBRSx5RUFBeUU7QUFDdEYsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDs7QUFFRCxvQkFBa0IsRUFBRTtBQUNsQixTQUFLLEVBQUUsQ0FBQztBQUNSLGVBQVcsRUFBRSxrRkFBa0Y7QUFDL0YsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7R0FDZjs7QUFFRCx1QkFBcUIsRUFBRTtBQUNyQixTQUFLLEVBQUUsQ0FBQztBQUNSLGVBQVcsRUFBRSwrREFBK0Q7QUFDNUUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDs7QUFFRCxXQUFTLEVBQUU7QUFDVCxTQUFLLEVBQUUsQ0FBQztBQUNSLGVBQVcsRUFBRSwrRUFBK0U7QUFDNUYsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDs7QUFFRCxtQkFBaUIsRUFBRTtBQUNqQixTQUFLLEVBQUUsQ0FBQztBQUNSLGVBQVcsRUFBRSxtRkFBbUY7QUFDaEcsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7R0FDZDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy93aWxsL2RvdGZpbGVzLy5hdG9tL3BhY2thZ2VzL2RhcmstbW9kZS9saWIvY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZGFya1Byb2ZpbGU6IHtcbiAgICBvcmRlcjogMSxcbiAgICBkZXNjcmlwdGlvbjogJ1NwZWNpZnkgdWkgYW5kIHN5bnRheCB0aGVtZSBpbiB0aGUgcmlnaHQgb3JkZXInLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdvbmUtZGFyay11aSBvbmUtZGFyay1zeW50YXgnXG4gIH0sXG5cbiAgbGlnaHRQcm9maWxlOiB7XG4gICAgb3JkZXI6IDIsXG4gICAgZGVzY3JpcHRpb246ICdTcGVjaWZ5IHVpIGFuZCBzeW50YXggdGhlbWUgaW4gdGhlIHJpZ2h0IG9yZGVyJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnb25lLWxpZ2h0LXVpIG9uZS1saWdodC1zeW50YXgnXG4gIH0sXG5cbiAgYXV0b01vZGU6IHtcbiAgICBvcmRlcjogMyxcbiAgICBkZXNjcmlwdGlvbjogJ0RldGVybWluZSBpZiB0aGVtZXMgc2hvdWxkIGJlIGF1dG9tYXRpY2FsbHkgY2hhbmdlZCBieSBzZWxlY3RlZCBzZW5zb3JzJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZVxuICB9LFxuXG4gIGFtYmllbnRMaWdodFNlbnNvcjoge1xuICAgIG9yZGVyOiA0LFxuICAgIGRlc2NyaXB0aW9uOiAnRGV0ZXJtaW5lIGlmIHRoZW1lcyBzaG91bGQgYmUgYXV0b21hdGljYWxseSBjaGFuZ2VkIGJ5IHlvdXIgYW1iaWVudCBsaWdodCBzZW5zb3InLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZVxuICB9LFxuXG4gIGFtYmllbnRMaWdodFRocmVzaG9sZDoge1xuICAgIG9yZGVyOiA1LFxuICAgIGRlc2NyaXB0aW9uOiAnRGV0ZXJtaW5lIHRocmVzaG9sZCBvZiBBbWJpZW50IExpZ2h0IFNlbnNvciAobG93ZXIgaXMgZGFya2VyKScsXG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6ICcxMCdcbiAgfSxcblxuICBzdW5TZW5zb3I6IHtcbiAgICBvcmRlcjogNixcbiAgICBkZXNjcmlwdGlvbjogJ0RldGVybWluZSBpZiB0aGVtZXMgc2hvdWxkIGJlIGF1dG9tYXRpY2FsbHkgY2hhbmdlZCBiYXNlZCBvbiB5b3VyIHN1bnNldCB0aW1lJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZVxuICB9LFxuXG4gIHN5c3RlbVRoZW1lU2Vuc29yOiB7XG4gICAgb3JkZXI6IDcsXG4gICAgZGVzY3JpcHRpb246ICdEZXRlcm1pbmUgaWYgdGhlbWVzIHNob3VsZCBiZSBhdXRvbWF0aWNhbGx5IGNoYW5nZWQgd2hlbiB0aGUgc3lzdGVtIHRoZW1lIGNoYW5nZXMnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlXG4gIH1cbn07XG4iXX0=