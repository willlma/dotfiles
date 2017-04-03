# Your init script
#
# Atom will evaluate this file each time a new window is opened. It is run
# after packages are loaded/activated and after the previous editor state
# has been restored.
#
# An example hack to log to the console when each text editor is saved.
#
# atom.workspace.observeTextEditors (editor) ->
#   editor.onDidSave ->
#     console.log "Saved! #{editor.getPath()}"

atom.workspace.observeTextEditors (editor) ->
  original = editor.getGrammar()
  if original? and original is atom.grammars.grammarForScopeName('text.plain.null-grammar')
    editor.setGrammar(atom.grammars.grammarForScopeName('source.shell'))
