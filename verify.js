const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
const code = match[1];

https.get('https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.4/babel.min.js', (res) => {
  let js = '';
  res.on('data', d => js += d);
  res.on('end', () => {
    const vm = require('vm');
    const sandbox = { window: {}, console: console };
    vm.createContext(sandbox);
    vm.runInContext(js, sandbox);

    try {
      const result = sandbox.Babel.transform(code, { presets: ['react'] });
      console.log('🎉 BABEL TRANSPILATION SUCCESSFUL! Size:', result.code.length, 'bytes');
    } catch (e) {
      console.error('❌ BABEL TRANSPIRE ERROR:', e.message);
      if (e.loc) {
        console.error('Error Location: Line', e.loc.line, 'Col', e.loc.column);
        const lines = code.split('\n');
        console.error('Line Content:', lines[e.loc.line - 1]);
      }
    }
  });
});
