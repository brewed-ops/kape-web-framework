// new-feature.mjs <name> - scaffolds one feature: src/features/<name>/<Name>.astro + src/content/<name>.ts
// Usage: npm run new:feature pricing-table
// Refuses to overwrite. Prints the line to add to src/config/sections.ts.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const raw = process.argv[2];
if (!raw || !/^[a-z][a-z0-9-]*$/.test(raw)) {
  console.error('Usage: npm run new:feature <kebab-name>   (lowercase letters, digits, dashes; e.g. team or pricing-table)');
  process.exit(1);
}
const name = raw;
const Pascal = name.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
const camel = Pascal[0].toLowerCase() + Pascal.slice(1);

const root = fileURLToPath(new URL('../', import.meta.url));
const component = `${root}src/features/${name}/${Pascal}.astro`;
const content = `${root}src/content/${name}.ts`;
for (const f of [component, content]) {
  if (existsSync(f)) {
    console.error(`Refusing to overwrite ${f}`);
    process.exit(1);
  }
}

const contentTs = `// Words for the ${Pascal} feature. Edit text here, never in the component.
// Business facts (phone, address, hours) live in src/config/site.ts.
export const ${camel} = {
  // TODO(owner): replace with real copy
  heading: '${Pascal} heading',
  lead: 'One plain sentence that supports the heading.',
};
`;

const componentAstro = `---
import Section from '@/components/ui/Section.astro';
import { ${camel} } from '@/content/${name}';
---

<Section feature="${name}" heading={${camel}.heading} lead={${camel}.lead}>
  <!-- Markup only. Words come from src/content/${name}.ts, colors from tokens (bg-surface-1, text-muted, border-line). -->
</Section>
`;

mkdirSync(`${root}src/features/${name}`, { recursive: true });
writeFileSync(component, componentAstro);
writeFileSync(content, contentTs);

console.log(`Created src/features/${name}/${Pascal}.astro`);
console.log(`Created src/content/${name}.ts`);
console.log(`\nNext: add '${name}' to the list for your siteType in src/config/sections.ts, for example:`);
console.log(`  website: ['header', 'hero', '${name}', 'services', ..., 'footer'],`);
