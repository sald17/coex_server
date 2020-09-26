"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = exports.saveFiles = exports.checkExistStorage = exports.parseRequest = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const multer_1 = tslib_1.__importDefault(require("multer"));
const path = tslib_1.__importStar(require("path"));
const uuid_1 = require("uuid");
/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
const storagePath = path.join(__dirname, '../../storage');
const allowedImageType = ['jpg', 'jpeg', 'png', 'tiff'];
async function parseRequest(request, response) {
    const storage = multer_1.default.memoryStorage();
    const upload = multer_1.default({ storage });
    let requestBody = await new Promise((resolve, reject) => {
        upload.any()(request, response, (err) => {
            if (err)
                reject(err);
            else {
                resolve({
                    fields: request.body,
                    files: request.files,
                });
            }
        });
    });
    return requestBody;
}
exports.parseRequest = parseRequest;
exports.checkExistStorage = () => {
    if (fs.existsSync(storagePath)) {
    }
    else {
        fs.mkdirSync(storagePath);
    }
};
async function saveFiles(files) {
    let listFileName = [];
    for (let f of files) {
        const ext = f.originalname.substring(f.originalname.indexOf('.') + 1);
        if (!allowedImageType.includes(ext)) {
            return { error: true, message: 'Invalid image' };
        }
        let newName = `/data/${uuid_1.v4()}.${ext}`;
        listFileName.push(newName);
        let filePath = path.join(storagePath, newName);
        fs.writeFileSync(filePath, f.buffer);
    }
    return listFileName;
}
exports.saveFiles = saveFiles;
async function deleteFiles(files) {
    for (let f of files) {
        const filePath = path.join(storagePath, f);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
exports.deleteFiles = deleteFiles;
//# sourceMappingURL=file-upload.js.map