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

    top: function(options, contextBuilder) {
      var ctx = contextBuilder(options.elementId, 500, 280);
      ctx.scale(1.5, 1.5); ctx.fillStyle = '#221'; ctx.strokeStyle = '#221';
      var stave = new VF.Stave(10, 40, 450)
        .addClef('treble').setContext(ctx).draw();

      function newNote(note_struct) { return new VF.StaveNote(note_struct); }

      var notes = [
        newNote({ keys: ['eb/4', 'a/4', 'd/5'], duration: 'h' })
          .addModifier(0, new VF.ChordSymbol().addText('F7').setHorizontal('left')
            .addGlyphOrText('(#11b9)', { symbolModifier: VF.ChordSymbol.SymbolModifiers.SUPERSCRIPT }))
          .addModifier(0, new VF.ChordSymbol().addText('B7').setHorizontal('left'))
          .addAccidental(0, new VF.Accidental('b')),
        newNote({ keys: ['c/4', 'e/4', 'B/4'], duration: 'h' })
          .addModifier(0, new VF.ChordSymbol().addText('C')
            .addGlyph('majorSeventh', { symbolModifier: VF.ChordSymbol.SymbolModifiers.SUPERSCRIPT })),
      ];

      VF.Formatter.FormatAndDraw(ctx, stave, notes, 200);
      ok(true, 'Bottom Chord Symbol');
    },

    bottom: function(options, contextBuilder) {
      var ctx = contextBuilder(options.elementId, 500, 240);
      ctx.scale(1.5, 1.5); ctx.fillStyle = '#221'; ctx.strokeStyle = '#221';
      var stave = new VF.Stave(10, 10, 300)
        .addClef('treble').setContext(ctx).draw();

      function newNote(note_struct) { return new VF.StaveNote(note_struct); }

      var notes = [
        newNote({ keys: ['c/4', 'f/4', 'a/4'], duration: 'q' })
          .addModifier(0, new VF.ChordSymbol()
            .setVertical('bottom')
            .setFont('serif', 12)
            .addText('I')
            .addText('6', { symbolModifier: VF.ChordSymbol.SymbolModifiers.SUPERSCRIPT })
            .addText('4', { symbolModifier: VF.ChordSymbol.SymbolModifiers.SUBSCRIPT })),
        newNote({ keys: ['c/4', 'e/4', 'b/4'], duration: 'q' })
          .addAccidental(2, new VF.Accidental('b'))
          .addModifier(0, new VF.ChordSymbol()
            .setVertical('bottom')
            .addGlyphOrText('V')
            .setFont('serif', 12)),
        newNote({ keys: ['c/4', 'e/4', 'g/4'], duration: 'q' })
          .addModifier(0, new VF.ChordSymbol()
            .addLine(12)
            .setVertical('bottom')),
        newNote({ keys: ['c/4', 'f/4', 'a/4'], duration: 'q' })
          .addModifier(0, new VF.ChordSymbol()
            .addGlyphOrText('V/V')
            .setVertical('bottom')
            .setFont('serif', 12))
      ];

      VF.Formatter.FormatAndDraw(ctx, stave, notes, 100);
      ok(true, 'Top Chord Symbol');
    },
  };

  return ChordSymbol;
})();
