// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
    bind,
    BindingScope,
    config,
    ContextTags,
    Provider,
} from '@loopback/core';
import {Request} from '@loopback/rest';
import {RequestHandler} from 'express-serve-static-core';
import multer from 'multer';
import {FILE_UPLOAD_SERVICE} from '../config/key';
/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
@bind({
    scope: BindingScope.TRANSIENT,
    tags: {[ContextTags.KEY]: FILE_UPLOAD_SERVICE},
})
export class FileUploadProvider implements Provider<RequestHandler> {
    constructor(@config() private options: multer.Options = {}) {
        if (!this.options.storage) {
            // Default to in-memory storage
            this.options.storage = multer.memoryStorage();
        }
    }

    value(): RequestHandler {
        return multer(this.options).any();
    }

    public static getFilesAndFields(request: Request) {
        const uploadedFiles = request.files;
        const mapper = (f: globalThis.Express.Multer.File) => ({
            fieldname: f.fieldname,
            originalname: f.originalname,
            encoding: f.encoding,
            mimetype: f.mimetype,
            size: f.size,
        });
        let files: object[] = [];
        if (Array.isArray(uploadedFiles)) {
            files = uploadedFiles.map(mapper);
        } else {
            for (const filename in uploadedFiles) {
                files.push(...uploadedFiles[filename].map(mapper));
            }
        }
        console.log(__dirname);
        console.log({files, fields: request.body});
        return {files, fields: request.body};
    }
}
