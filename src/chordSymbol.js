// [VexFlow](http://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
//
// ## Description
//
// This file implements text annotations as modifiers that can be attached to
// notes.
//
// See `tests/annotation_tests.js` for usage examples.

import { Vex } from './vex';
import { Flow } from './tables';
import { Glyph } from './glyph';
import { Modifier } from './modifier';

// To enable logging for this class. Set `Vex.Flow.Annotation.DEBUG` to `true`.
function L(...args) { if (ChordSymbol.DEBUG) Vex.L('Vex.Flow.ChordSymbol', args); }

export class ChordSymbol extends Modifier {
  static get CATEGORY() { return 'chordSymbol'; }

  // Text annotations can be positioned and justified relative to the note.
  static get HorizontalJustify() {
    return {
      LEFT: 1,
      CENTER: 2,
      RIGHT: 3,
      CENTER_STEM: 4,
    };
  }

  static get HorizontalJustifyString() {
    return {
      left: ChordSymbol.HorizontalJustify.LEFT,
      right: ChordSymbol.HorizontalJustify.RIGHT,
      center: ChordSymbol.HorizontalJustify.CENTER,
      centerStem: ChordSymbol.HorizontalJustify.CENTER_STEM,
    };
  }


  static get VerticalJustify() {
    return {
      TOP: 1,
      BOTTOM: 2,
    };
  }

  static get VerticalJustifyString() {
    return {
      top: ChordSymbol.VerticalJustify.TOP,
      above: ChordSymbol.VerticalJustify.TOP,
      below: ChordSymbol.VerticalJustify.BOTTOM,
      bottom: ChordSymbol.VerticalJustify.BOTTOM
    };
  }

  // Glyph data
  static get GLYPHS() {
    return {
      'diminished': {
        code: 'csymDiminished'
      },
      'halfDiminished': {
        code: 'csymHalfDiminished'
      },
      'augmented': {
        code: 'csymAugmented'
      },
      'majorSeventh': {
        code: 'csymMajorSeventh'
      },
      'minor': {
        code: 'csymMinor'
      },
      '-': {
        code: 'csymMinor'
      },
      '(': {
        code: 'csymParensLeftTall'
      },
      'leftParen': {
        code: 'csymParensLeftTall'
      },
      ')': {
        code: 'csymParensRightTall'
      },
      'rightParen': {
        code: 'csymParensRightTall'
      },
      'leftBracket': {
        code: 'csymBracketLeftTall'
      },
      'rightBracket': {
        code: 'csymBracketRightTall'
      },
      'leftParenTall': {
        code: 'csymBracketLeftTall'
      },
      'rightParentTall': {
        code: 'csymParensRightVeryTall'
      },
      'over': {
        code: 'csymDiagonalArrangementSlash'
      },
      '#': {
        code: 'accidentalSharp'
      },
      'b': {
        code: 'accidentalFlat'
      }
    };
  }

  static get SymbolTypes() {
    return {
      GLYPH: 1,
      TEXT: 2,
      LINE: 3
    };
  }

  static get SymbolModifiers() {
    return {
      NONE: 1,
      SUBSCRIPT: 2,
      SUPERSCRIPT: 3
    };
  }

  static get SymbolPositions() {
    return {
      CENTER: 1,
      ABOVE: 2,
      BELOW: 3,
      EXTENT: 4
    };
  }

  // Arrange annotations within a `ModifierContext`
  static format(instances, state) {
    if (!instances || instances.length === 0) return false;

    let width = 0;
    for (let i = 0; i < instances.length; ++i) {
      const instance = instances[i];

      // todo: fix this, consider whole shape
      if (instance.getPosition() === Modifier.Position.ABOVE) {
        instance.setTextLine(state.top_text_line);
        state.top_text_line++;
      } else {
        instance.setTextLine(state.text_line);
        state.text_line++;
      }

      for (let j = 0; j < instance.symbolBlocks.length; ++j) {
        const symbol = instance.symbolBlocks[j];
        width += symbol.width;
      }
    }

    state.left_shift += width / 2;
    state.right_shift += width / 2;
    return true;
  }

  // ## Prototype Methods
  //
  // Annotations inherit from `Modifier` and is positioned correctly when
  // in a `ModifierContext`.
  // Create a new `Annotation` with the string `text`.
  constructor() {
    super();
    this.setAttribute('type', 'ChordSymbol');

    this.note = null;
    this.index = null;
    this.symbolBlocks = [];
    this.horizontal = ChordSymbol.HorizontalJustify.CENTER;
    this.vertical = ChordSymbol.VerticalJustify.TOP;

    let fontFamily = 'Arial';
    if (this.musicFont.name === 'Petaluma') {
      fontFamily = 'Cursive';
    }
    this.font = {
      family: fontFamily,
      size: 10,
      weight: '',
    };
  }

  getSymbolBlock(parameters) {
    parameters = parameters == null ? {} : parameters;
    const symbolType = (parameters.symbolType ? parameters.symbolType : ChordSymbol.SymbolTypes.TEXT);
    const text = parameters.text ? parameters.text : '';
    const symbolPosition = parameters.symbolPosition ? parameters.symbolPosition : ChordSymbol.SymbolPositions.CENTER;
    const symbolModifier = parameters.symbolModifier ? parameters.symbolModifier : ChordSymbol.SymbolModifiers.NONE;

    const rv = {
      text, symbolType, symbolPosition, symbolModifier
    };

    rv.width = 0;
    if (symbolType === ChordSymbol.SymbolTypes.GLYPH && typeof(parameters.glyph) === 'string') {
      const glyphArgs = ChordSymbol.GLYPHS[parameters.glyph];
      let glyphPoints = 20;
      if (symbolModifier !== ChordSymbol.SymbolModifiers.NONE) {
        glyphPoints = glyphPoints / 1.3;
      }
      rv.glyph = new Glyph(glyphArgs.code, glyphPoints, { category: 'chordSymbol' });
      rv.width = (rv.glyph.getMetrics().width * 3) / 2;
    } else if (symbolType === ChordSymbol.SymbolTypes.TEXT) {
      rv.width = Flow.textWidth(text);
    } else if (symbolType === ChordSymbol.SymbolTypes.LINE) {
      rv.width = parameters.width;
    }

    return rv;
  }

  addSymbolBlock(parameters) {
    this.symbolBlocks.push(this.getSymbolBlock(parameters));
    return this;
  }

  addText(text, parameters) {
    parameters = parameters == null ? {} : parameters;
    parameters.text = text;
    parameters.symbolType = ChordSymbol.SymbolTypes.TEXT;
    return this.addSymbolBlock(parameters);
  }

  addGlyph(glyph, parameters) {
    parameters = parameters == null ? {} : parameters;
    parameters.glyph = glyph;
    parameters.symbolType = ChordSymbol.SymbolTypes.GLYPH;
    return this.addSymbolBlock(parameters);
  }

  addGlyphOrText(text, parameters) {
    parameters = parameters == null ? {} : parameters;
    let str = '';
    for (let i = 0; i < text.length; ++i) {
      if (ChordSymbol.GLYPHS[text[i]]) {
        if (str.length > 0) {
          this.addText(str, parameters);
          str = '';
        }
        this.addGlyph(text[i], parameters);
      } else {
        str += text[i];
      }
    }
    if (str.length > 0) {
      this.addText(str, parameters);
    }
    return this;
  }

  addLine(width, parameters) {
    parameters = parameters == null ? {} : parameters;
    parameters.symbolType = ChordSymbol.SymbolTypes.LINE;
    parameters.line = width;
  }

  getCategory() { return ChordSymbol.CATEGORY; }

  // Set font family, size, and weight. E.g., `Arial`, `10pt`, `Bold`.
  setFont(family, size, weight) {
    this.font = { family, size, weight };
    return this;
  }

  // Set vertical position of text (above or below stave). `just` must be
  // a value in `Annotation.VerticalJustify`.
  setVerticalJustification(just) {
    this.vertical = typeof (just) === 'string'
      ? ChordSymbol.VerticalJustifyString[just]
      : just;
    return this;
  }

  // Get and set horizontal justification. `justification` is a value in
  // `Annotation.Justify`.
  getHorizontalJustification() { return this.horizontal; }
  setHorizontalJustification(just) {
    this.horizontal = typeof (just) === 'string'
      ? ChordSymbol.HorizontalJustifyString[just]
      : just;
    return this;
  }

  getWidth() {
    let rv = 0;
    this.symbolBlocks.forEach((symbol) => {
      rv += symbol.width;
    });
    return rv;
  }

  isSuperscript(symbol) {
    return symbol.symbolModifier !== null && symbol.symbolModifier === ChordSymbol.SymbolModifiers.SUPERSCRIPT;
  }

  // Render text beside the note.
  draw() {
    this.checkContext();

    if (!this.note) {
      throw new Vex.RERR(
        'NoNoteForAnnotation', "Can't draw text annotation without an attached note."
      );
    }

    this.setRendered();
    const start = this.note.getModifierStartXY(Modifier.Position.ABOVE,
      this.index);

    // We're changing context parameters. Save current state.
    this.context.save();
    this.context.setFont(this.font.family, this.font.size, this.font.weight);

    let y;

    let stem_ext;
    let spacing;
    const has_stem = this.note.hasStem();
    const stave = this.note.getStave();

    // The position of the text varies based on whether or not the note
    // has a stem.
    if (has_stem) {
      stem_ext = this.note.getStem().getExtents();
      spacing = stave.getSpacingBetweenLines();
    }

    if (this.vertical === ChordSymbol.VerticalJustify.BOTTOM) {
      // HACK: We need to compensate for the text's height since its origin
      // is bottom-right.
      y = stave.getYForBottomText(this.text_line + Flow.TEXT_HEIGHT_OFFSET_HACK);
      if (has_stem) {
        const stem_base = (this.note.getStemDirection() === 1 ? stem_ext.baseY : stem_ext.topY);
        y = Math.max(y, stem_base + (spacing * (this.text_line + 2)));
      }
    } else  { // (this.vertical === ChordSymbol.VerticalJustify.TOP)
      y = Math.min(stave.getYForTopText(this.text_line), this.note.getYs()[0] - 10);
      if (has_stem) {
        y = Math.min(y, (stem_ext.topY - 5) - (spacing * this.text_line));
      }
    }

    let x = start.x;
    if (this.horizontal === ChordSymbol.HorizontalJustify.LEFT) {
      x = start.x;
    } else if (this.horizontal === ChordSymbol.HorizontalJustify.RIGHT) {
      x = start.x - this.getWidth();
    } else if (this.horizontal === ChordSymbol.HorizontalJustify.CENTER) {
      x = start.x - this.getWidth() / 2;
    } else /* CENTER_STEM */ {
      x = this.note.getStemX() -  this.getWidth() / 2;
    }
    this.symbolBlocks.forEach((symbol) => {
      const sp = this.isSuperscript(symbol);
      let curY = y;

      if (sp) {
        curY -= 10;
      }
      if (symbol.symbolType === ChordSymbol.SymbolTypes.TEXT) {
        if (sp) {
          this.context.save();
          this.context.setFont(this.font.family, this.font.size / 1.3, this.font.weight);
        }
        this.context.fillText(symbol.text, x, curY);
        if (sp) {
          this.context.restore();
        }
      } else if (symbol.symbolType === ChordSymbol.SymbolTypes.GLYPH) {
        curY -= symbol.glyph.bbox.y + symbol.glyph.bbox.h;
        symbol.glyph.render(this.context, x + (symbol.width / 4), curY);
      } else if (symbol.symbolType === ChordSymbol.SymbolTypes.LINE) {
        this.context.beginPath();
        this.context.setLineWidth(1); // ?
        this.context.moveTo(x, y);
        this.context.lineTo(x + symbol.width, curY);
        this.context.stroke();
      }

      x += symbol.width;
    });

    L('Rendering annotation: ', this.text, x, y);
    this.context.restore();
  }
}
