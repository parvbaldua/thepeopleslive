const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const match = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
if (!match) {
  console.log('No script tag found!');
  process.exit(1);
}

fs.writeFileSync('temp_code.jsx', match[1]);

const execSync = require('child_process').execSync;
try {
  const out = execSync('npx @babel/cli temp_code.jsx --presets @babel/preset-react', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  console.log('BABEL TRANSPILATION SUCCESSFUL! Output size:', out.length);
} catch (err) {
  console.error('BABEL ERROR DETECTED:');
  console.error(err.stderr || err.stdout || err.message);
}
