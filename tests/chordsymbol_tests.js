/**
 * VexFlow - Annotation Tests
 * Copyright Mohit Muthanna 2010 <mohit@muthanna.com>
 */

VF.Test.ChordSymbol = (function() {
  var runTests = VF.Test.runTests;
  var ChordSymbol = {
    Start: function() {
      QUnit.module('ChordSymbol');
      runTests('Bottom Chord Symbols', ChordSymbol.bottom);
      runTests('Top Chord Symbols', ChordSymbol.top);
    },

    bottom: function(options, contextBuilder) {
      var ctx = contextBuilder(options.elementId, 500, 240);
      ctx.scale(1.5, 1.5); ctx.fillStyle = '#221'; ctx.strokeStyle = '#221';
      var stave = new VF.Stave(10, 10, 450)
        .addClef('treble').setContext(ctx).draw();

      function newNote(note_struct) { return new VF.StaveNote(note_struct); }

      var notes = [
        newNote({ keys: ['c/4', 'e/4'], duration: 'h' })
          .addAnnotation(0, new VF.ChordSymbol().addText('F7')
            .addGlyphOrText('(#11b9)', { symbolModifier: VF.ChordSymbol.SymbolModifiers.SUPERSCRIPT })),
        newNote({ keys: ['c/4', 'e/4', 'c/5'], duration: 'h' })
          .addAnnotation(2, new VF.ChordSymbol().addText('C')
            .addGlyph('majorSeventh', { symbolModifier: VF.ChordSymbol.SymbolModifiers.SUPERSCRIPT })),
      ];

      VF.Formatter.FormatAndDraw(ctx, stave, notes, 200);
      ok(true, 'Bottom Chord Symbol');
    },

    top: function(options, contextBuilder) {
      var ctx = contextBuilder(options.elementId, 500, 240);
      ctx.scale(1.5, 1.5); ctx.fillStyle = '#221'; ctx.strokeStyle = '#221';
      var stave = new VF.Stave(10, 10, 300)
        .addClef('treble').setContext(ctx).draw();

      function newNote(note_struct) { return new VF.StaveNote(note_struct); }
      function newChordSymbol(text) {
        return (
          new VF.ChordSymbol().addText(text).addGlyph('#'));
      }

      var notes = [
        newNote({ keys: ['f/4'], duration: 'w' })
          .addAnnotation(0, newChordSymbol('F')),
        newNote({ keys: ['a/4'], duration: 'w' })
          .addAnnotation(0, newChordSymbol('A')),
        newNote({ keys: ['c/5'], duration: 'w' })
          .addAnnotation(0, newChordSymbol('C')),
        newNote({ keys: ['e/5'], duration: 'w' })
          .addAnnotation(0, newChordSymbol('E')),
      ];

      VF.Formatter.FormatAndDraw(ctx, stave, notes, 100);
      ok(true, 'Top Chord Symbol');
    },
  };

  return ChordSymbol;
})();
