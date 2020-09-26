// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Request, Response} from '@loopback/rest';
import * as fs from 'fs';
import multer from 'multer';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid';
/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
const storagePath = path.join(__dirname, '../../storage');
const allowedImageType = ['jpg', 'jpeg', 'png', 'tiff'];

export async function parseRequest(request: Request, response: Response) {
    const storage = multer.memoryStorage();
    const upload = multer({storage});
    let requestBody = await new Promise<object>((resolve, reject) => {
        upload.any()(request, response, (err: unknown) => {
            if (err) reject(err);
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

export const checkExistStorage = () => {
    if (fs.existsSync(storagePath)) {
    } else {
        fs.mkdirSync(storagePath);
    }
};

export async function saveFiles(files: any[]) {
    let listFileName = [];
    for (let f of files) {
        const ext = f.originalname.substring(f.originalname.indexOf('.') + 1);
        if (!allowedImageType.includes(ext)) {
            return {error: true, message: 'Invalid image'};
        }

        let newName = `/data/${uuidv4()}.${ext}`;
        listFileName.push(newName);
        let filePath = path.join(storagePath, newName);
        fs.writeFileSync(filePath, f.buffer);
    }
    return listFileName;
}

export async function deleteFiles(files: Array<any>) {
    for (let f of files) {
        const filePath = path.join(storagePath, f);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
