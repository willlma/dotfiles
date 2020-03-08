require 'irb/ext/save-history'
IRB.conf[:SAVE_HISTORY] = 5000
IRB.conf[:HISTORY_FILE] = '~/.irb_history'
require 'awesome_print'
AwesomePrint.irb!
ActiveRecord::Base.logger = Logger.new(STDOUT)
