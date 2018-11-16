"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babel/core");
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
function md5(data) {
    return crypto_1.default.createHash('md5').update(data).digest('hex');
}
var includeRe = /(?:(const|var|let)\s+)*(\w+)\s*=\s*include\((.+)\);*/;
var Vertex = /** @class */ (function () {
    function Vertex(viewLocation, cacheLocation) {
        if (viewLocation === void 0) { viewLocation = __dirname + '/views'; }
        if (cacheLocation === void 0) { cacheLocation = __dirname + '/cache'; }
        this.viewLocation = viewLocation;
        this.cacheLocation = cacheLocation;
    }
    /**
     * Try to compile a view if it's expired
     * @param view
     */
    Vertex.prototype.compileIfNeeded = function (view) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = this.normalizeName(view);
                        return [4 /*yield*/, this.expired(view)];
                    case 1:
                        if (!(_a.sent())) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.compile(view)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Vertex.prototype.compile = function (view) {
        return __awaiter(this, void 0, void 0, function () {
            var code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = this.normalizeName(view);
                        return [4 /*yield*/, this._transform(this.resolvePath(view))];
                    case 1:
                        code = _a.sent();
                        return [4 /*yield*/, this.compileIncludes(code)];
                    case 2:
                        _a.sent();
                        code = this.replaceIncludes(code);
                        return [4 /*yield*/, this._write(this.resolveCompiledPath(view), code)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Render the view
     * @param view
     * @param data
     */
    Vertex.prototype.render = function (view, data) {
        return __awaiter(this, void 0, void 0, function () {
            var path, fn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = this.normalizeName(view);
                        return [4 /*yield*/, this.compileIfNeeded(view)];
                    case 1:
                        _a.sent();
                        path = this.resolveCompiledPath(view);
                        fn = require(path);
                        return [2 /*return*/, fn(data)];
                }
            });
        });
    };
    /**
     * Check wether the view is expired, so we need to compile a new one.
     * @param view
     */
    Vertex.prototype.expired = function (view) {
        return __awaiter(this, void 0, void 0, function () {
            var compiledStat, originalStat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.compiledExists(view)];
                    case 1:
                        // no compiled version so create one
                        if (!(_a.sent())) {
                            return [2 /*return*/, Promise.resolve(true)];
                        }
                        return [4 /*yield*/, this._stat(this.resolveCompiledPath(view))];
                    case 2:
                        compiledStat = _a.sent();
                        return [4 /*yield*/, this._stat(this.resolvePath(view))];
                    case 3:
                        originalStat = _a.sent();
                        return [2 /*return*/, originalStat.mtimeMs > compiledStat.mtimeMs];
                }
            });
        });
    };
    /**
     * Resolve the full path
     * @param view
     */
    Vertex.prototype.resolvePath = function (view) {
        return path_1.default.join(this.viewLocation, view);
    };
    /**
     * Resolve the compiled path
     * @param view
     */
    Vertex.prototype.resolveCompiledPath = function (view) {
        return path_1.default.join(this.cacheLocation, this.compiledName(view));
    };
    /**
     * Resolve the compiled name
     * @param view
     */
    Vertex.prototype.compiledName = function (view) {
        var name = view.substring(0, view.lastIndexOf('.'));
        return md5(name) + '.js';
    };
    /**
     * Find include directives
     * @param code
     */
    Vertex.prototype.findIncludeDirectives = function (code) {
        var _this = this;
        return code.split(/\n/)
            .filter(function (l) { return includeRe.test(l); })
            .map(function (l) { return l.match(includeRe); })
            .map(function (matches) { return _this.normalizeName(matches[3].slice(1, -1)); });
    };
    /**
     * Compile included partials
     * @param code
     */
    Vertex.prototype.compileIncludes = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = this.findIncludeDirectives(code);
                        return [4 /*yield*/, Promise.all(files.map(function (file) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, this.compileIfNeeded(file)];
                            }); }); }))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Replace include directives with the native require
     * @param code
     */
    Vertex.prototype.replaceIncludes = function (code) {
        var _this = this;
        var replacer = function (match, p1, p2, p3) {
            // remove the surrounding quotation
            var included = _this.normalizeName(p3.slice(1, -1));
            var compiled = _this.compiledName(included);
            console.log(p3 + " => " + included + " => " + compiled);
            return "const " + p2 + " = require('./" + compiled + "');";
        };
        return code.split(/\n/).map(function (l) {
            if (includeRe.test(l)) {
                return l.replace(includeRe, replacer);
            }
            return l;
        }).join('\n');
    };
    /**
     * Check wether the view exists
     * @param view
     */
    Vertex.prototype.exists = function (view) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._exists(this.resolvePath(view))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Check wether the view has a compiled version
     * @param view
     */
    Vertex.prototype.compiledExists = function (view) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._exists(this.resolveCompiledPath(view))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Vertex.prototype.normalizeName = function (view) {
        return /\.jsx$/.test(view) ? view : view + '.jsx';
    };
    Vertex.prototype._exists = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return fs_1.default.exists(file, function (result) {
                        return resolve(result);
                    }); })];
            });
        });
    };
    Vertex.prototype._stat = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs_1.default.stat(file, function (err, stat) {
                            if (err)
                                return reject(err);
                            return resolve(stat);
                        });
                    })];
            });
        });
    };
    Vertex.prototype._write = function (file, content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs_1.default.writeFile(file, content, function (err) {
                            if (err)
                                reject(err);
                            resolve();
                        });
                    })];
            });
        });
    };
    Vertex.prototype._transform = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, core_1.transformFileAsync(file, {
                            presets: [['@babel/preset-react', { pragma: 'h' }]],
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, "const h = require('vhtml');\n" + result.code];
                }
            });
        });
    };
    return Vertex;
}());
exports.Vertex = Vertex;
