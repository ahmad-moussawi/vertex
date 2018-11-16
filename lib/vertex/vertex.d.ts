export declare class Vertex {
    private viewLocation;
    private cacheLocation;
    constructor(viewLocation?: string, cacheLocation?: string);
    /**
     * Try to compile a view if it's expired
     * @param view
     */
    compileIfNeeded(view: string): Promise<void>;
    compile(view: string): Promise<void>;
    /**
     * Render the view
     * @param view
     * @param data
     */
    render(view: string, data?: any): Promise<any>;
    /**
     * Check wether the view is expired, so we need to compile a new one.
     * @param view
     */
    expired(view: string): Promise<boolean>;
    /**
     * Resolve the full path
     * @param view
     */
    resolvePath(view: string): string;
    /**
     * Resolve the compiled path
     * @param view
     */
    resolveCompiledPath(view: string): string;
    /**
     * Resolve the compiled name
     * @param view
     */
    compiledName(view: string): string;
    /**
     * Find include directives
     * @param code
     */
    findIncludeDirectives(code: string): string[];
    /**
     * Compile included partials
     * @param code
     */
    compileIncludes(code: string): Promise<void>;
    /**
     * Replace include directives with the native require
     * @param code
     */
    replaceIncludes(code: string): string;
    /**
     * Check wether the view exists
     * @param view
     */
    exists(view: string): Promise<boolean>;
    /**
     * Check wether the view has a compiled version
     * @param view
     */
    compiledExists(view: string): Promise<boolean>;
    private normalizeName;
    private _exists;
    private _stat;
    private _write;
    private _transform;
}
