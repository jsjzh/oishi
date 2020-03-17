export interface Template {
    type: 'core' | 'eslintrc' | 'gitignore' | 'prettierrc' | 'global.d.ts' | 'package' | 'readme' | 'tsconfig.dev' | 'tsconfig';
    path: string;
    value: string;
}
declare const templates: Template[];
export default templates;
