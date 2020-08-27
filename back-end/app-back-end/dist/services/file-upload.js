"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadProvider = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const multer_1 = tslib_1.__importDefault(require("multer"));
const key_1 = require("../config/key");
/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
let FileUploadProvider = class FileUploadProvider {
    constructor(options = {}) {
        this.options = options;
        if (!this.options.storage) {
            // Default to in-memory storage
            this.options.storage = multer_1.default.memoryStorage();
        }
    }
    value() {
        return multer_1.default(this.options).any();
    }
    static getFilesAndFields(request) {
        const uploadedFiles = request.files;
        const mapper = (f) => ({
            fieldname: f.fieldname,
            originalname: f.originalname,
            encoding: f.encoding,
            mimetype: f.mimetype,
            size: f.size,
        });
        let files = [];
        if (Array.isArray(uploadedFiles)) {
            files = uploadedFiles.map(mapper);
        }
        else {
            for (const filename in uploadedFiles) {
                files.push(...uploadedFiles[filename].map(mapper));
            }
        }
        console.log(__dirname);
        console.log({ files, fields: request.body });
        return { files, fields: request.body };
    }
};
FileUploadProvider = tslib_1.__decorate([
    core_1.bind({
        scope: core_1.BindingScope.TRANSIENT,
        tags: { [core_1.ContextTags.KEY]: key_1.FILE_UPLOAD_SERVICE },
    }),
    tslib_1.__param(0, core_1.config()),
    tslib_1.__metadata("design:paramtypes", [Object])
], FileUploadProvider);
exports.FileUploadProvider = FileUploadProvider;
//# sourceMappingURL=file-upload.js.map