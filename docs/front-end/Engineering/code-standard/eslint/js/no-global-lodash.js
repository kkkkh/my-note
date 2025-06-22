/**
 * @fileoverview Lodash should not be loaded globally. If a lodash method is needed only the package for that method should be loaded in the file
 * @author Adalberto Teixeira
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
        description: "Lodash should not be loaded globally. If a lodash method is needed only the package for that method should be loaded in the file",
        category: "Fill me in",
        recommended: false
    },
    fixable: 'code',
    schema: []
  },

  create: function(context) {

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const getLocation = (node, defs) => {
      const loc = {
        line: node.loc.end.line,
        column: node.loc.start.column,
      }
      if (!defs || !defs.length) return loc;
      loc.line = defs[0].name.loc.start.line;
      loc.column = defs[0].name.loc.start.column;
      return loc;
    };

    const getErrorMessage = (declaredVariableName) => {
      if (!declaredVariableName || declaredVariableName === '_') {
        return 'Expected global "lodash" not to be imported.';
      }

      return `Expected ${declaredVariableName} to be imported as "import ${declaredVariableName} from 'lodash.${declaredVariableName.toLowerCase()}'".`
    };
    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ImportDeclaration: function (node) {
        if (node.source.value === 'lodash') {
          const declaredVariables = context.getDeclaredVariables(node);
          if (declaredVariables && declaredVariables.length) {
            declaredVariables.forEach(declaredVariable => {
              const loc = getLocation(node, declaredVariable.defs);
              const errorMessage = getErrorMessage(declaredVariable.name);
              context.report({
                node,
                loc,
                message: errorMessage,
              })
            })
          }
        }
      }
    };
  }
};
