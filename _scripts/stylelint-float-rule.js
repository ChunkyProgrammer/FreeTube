const stylelint = require('stylelint')
const { report, ruleMessages, validateOptions } = stylelint.utils;

const ruleName = 'freetube/use-float-var';
const messages = ruleMessages(ruleName, {
   expected: (unfixed, fixed, fixed2 = null) => {
    if (fixed2) {
      return `Expected "${unfixed}" to be "${fixed}" or "${fixed2}`
    } else {
      return `Expected "${unfixed}" to be "${fixed}"`
    }
   }
});

// map ltr float to var
const mappings = {
  left: 'var(--float-left-ltr-rtl-value)',
  right: 'var(--float-right-ltr-rtl-value)'
}

const ruleFunction = (primaryOption, secondaryOptionObject, context) => {
  return (postcssRoot, postcssResult) => {
    const validOptions = validateOptions(
        postcssResult,
        ruleName,
        {
            //No options for now...
        }
    );

    if (!validOptions) { //If the options are invalid, don't lint
        return;
    }

    postcssRoot.walkDecls(decl => { //Iterate CSS declarations
       if (decl.prop != 'float') {
         return
       }
       const isVar = decl.value == mappings.left || decl.value == mappings.right || decl.value === 'none';
       if (isVar || decl.value == 'clear') {
           return; //Nothing to do with this node - continue
       }

       // suggest new value
       let newVal = null
       if (decl.value === 'left') {
         newVal = mappings.left
       } else if (decl.value === 'right') {
         newVal = mappings.right
       }

       const isAutoFixing = Boolean(context.fix);
       if (isAutoFixing) {
         if (decl.raws.value) {
             decl.raws.value.raw = newVal;
         } else {
             decl.value = newVal;
         }
       } else { //We are in “report only”
         const message = newVal ? messages.expected(decl.value, newVal) : messages.expected(decl.value, mappings.left, mappings.right)
         report({
             ruleName,
             result: postcssResult,
             message: message, // Build the reported message
             node: decl, // Specify the reported node
             word: decl.value, // Which exact word caused the error? This positions the error properly
         });
     }
    });
  }
}

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = {
  fixable: true
};

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
