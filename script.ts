import * as fs from "fs";
import * as path from "path";

/**
 * copy package.json in dist folder
 */
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
	console.error('no dist directory generated');
	process.exit(1);
}
const packageJSONFileName = 'package.json';
const srcFile = path.join(__dirname, 'lib', packageJSONFileName);
const destFile = path.join(distPath, packageJSONFileName);
fs.copyFileSync(srcFile, destFile);
