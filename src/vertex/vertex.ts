import { transformFileAsync } from '@babel/core';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function md5(data: string): string {
    return crypto.createHash('md5').update(data).digest('hex');
}

const includeRe = /(?:(const|var|let)\s+)*(\w+)\s*=\s*include\((.+)\);*/;

export class Vertex {

    private viewLocation: string;
    private cacheLocation: string;

    constructor(viewLocation: string, cacheLocation: string) {
        this.viewLocation = viewLocation;
        this.cacheLocation = cacheLocation;
    }

    /**
     * Try to compile a view if it's expired
     * @param view
     */
    async compileIfNeeded(view: string): Promise<void> {

        view = this.normalizeName(view);

        if (!(await this.expired(view))) {
            return;
        }

        await this.compile(view);

    }

    async compile(view: string): Promise<void> {
        view = this.normalizeName(view);

        let code = await this._transform(this.resolvePath(view));

        await this.compileIncludes(code);

        code = this.replaceIncludes(code);

        await this._write(this.resolveCompiledPath(view), code);
    }

    /**
     * Render the view
     * @param view
     * @param data
     */
    async render(view: string, data?: any) {

        view = this.normalizeName(view);

        await this.compileIfNeeded(view);

        const path = this.resolveCompiledPath(view);

        const fn = require(path);

        return fn(data);

    }

    /**
     * Check wether the view is expired, so we need to compile a new one.
     * @param view
     */
    async expired(view: string): Promise<boolean> {

        // no compiled version so create one
        if (!(await this.compiledExists(view))) {
            return Promise.resolve(true);
        }

        const compiledStat = await this._stat(this.resolveCompiledPath(view));
        const originalStat = await this._stat(this.resolvePath(view));

        return originalStat.mtimeMs > compiledStat.mtimeMs;

    }

    /**
     * Resolve the full path
     * @param view
     */
    resolvePath(view: string) {
        return path.join(this.viewLocation, view);
    }

    /**
     * Resolve the compiled path
     * @param view
     */
    resolveCompiledPath(view: string) {
        return path.join(this.cacheLocation, this.compiledName(view));
    }

    /**
     * Resolve the compiled name
     * @param view
     */
    compiledName(view: string) {
        const name = view.substring(0, view.lastIndexOf('.'));
        return md5(name) + '.js';
    }

    /**
     * Find include directives
     * @param code
     */
    findIncludeDirectives(code: string) {
        return code.split(/\n/)
            .filter(l => includeRe.test(l))
            .map(l => l.match(includeRe))
            .map(matches => this.normalizeName(matches[3].slice(1, -1)));
    }

    /**
     * Compile included partials
     * @param code
     */
    async compileIncludes(code: string) {
        const files = this.findIncludeDirectives(code);
        await Promise.all(files.map(async file => this.compileIfNeeded(file)));
    }

    /**
     * Replace include directives with the native require
     * @param code
     */
    replaceIncludes(code: string) {

        const replacer = (match: string, p1: string, p2: string, p3: string) => {
            // remove the surrounding quotation
            const included = this.normalizeName(p3.slice(1, -1));
            const compiled = this.compiledName(included);
            console.log(`${p3} => ${included} => ${compiled}`)
            return `const ${p2} = require('./${compiled}');`;
        };

        return code.split(/\n/).map(l => {

            if (includeRe.test(l)) {
                return l.replace(includeRe, replacer);
            }

            return l;

        }).join('\n');
    }

    /**
     * Check wether the view exists
     * @param view
     */
    async exists(view: string) {
        return await this._exists(this.resolvePath(view));
    }

    /**
     * Check wether the view has a compiled version
     * @param view
     */
    async compiledExists(view: string) {
        return await this._exists(this.resolveCompiledPath(view));
    }

    private normalizeName(view: string) {
        return /\.jsx$/.test(view) ? view : view + '.jsx';
    }

    private async _exists(file: string): Promise<boolean> {
        return new Promise<boolean>(resolve => fs.exists(file, result => {
            return resolve(result);
        }));
    }

    private async _stat(file: string): Promise<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => {
            fs.stat(file, (err, stat) => {
                if (err) return reject(err);

                return resolve(stat);
            })
        });
    }

    private async _write(file: string, content: string) {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(
                file,
                content,
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            )
        })
    }

    private async _transform(file: string): Promise<string> {
        const result = await transformFileAsync(file, {
            presets: [['@babel/preset-react', { pragma: 'h' }]],
        });

        return "const h = require('vhtml');\n" + result.code;
    }
}
