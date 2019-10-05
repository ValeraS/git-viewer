const template = require('@babel/template');
const t = require('@babel/types');

module.exports = function lazyComponentBabelPlugin() {
  return {
    visitor: {
      CallExpression({ node }) {
        if (
          !t.isIdentifier(node.callee) ||
          node.callee.name !== 'lazyComponentBabel'
        ) {
          return;
        }

        let arrow = node.arguments[0];

        if (!t.isArrowFunctionExpression(arrow)) {
          return;
        }
        let body = arrow.body;

        if (
          !t.isCallExpression(body) ||
          !t.isIdentifier(body.callee, { name: 'dynamicImport' })
        ) {
          return;
        }

        body.callee.name = 'import';
        let options = template.expression`{
                    asyncLoader() {
                        if (typeof window === 'object') {
                            return IMPORT;
                        }
                    },
                    syncLoader() {
                        if (typeof window === 'undefined') {
                            return require(PATH);
                        }
                    },
                    id: require.resolveWeak(PATH),
                }`;

        node.arguments[0] = options({
          IMPORT: body,
          PATH: body.arguments[0],
        });
      },
    },
  };
};

const LAZY_COMPONENT_PLUGIN = require.resolve(__filename);
module.exports.LAZY_COMPONENT_PLUGIN = LAZY_COMPONENT_PLUGIN;
