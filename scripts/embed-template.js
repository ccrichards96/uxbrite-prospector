import * as fs from 'fs';
import * as path from 'path';

// This script converts the docx template to base64 for embedding
const templatePath = path.join(process.cwd(), 'src', 'lib', 'templates', 'web-report-template.docx');
const templateFile = fs.readFileSync(templatePath);
const base64Template = templateFile.toString('base64');

console.log('export const TEMPLATE_BASE64 = "' + base64Template + '";');