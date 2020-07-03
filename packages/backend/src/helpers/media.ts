import * as fs from "fs";
import * as path from "path";
import {promisify} from 'util';
import {FileUpload} from "graphql-upload";

const dir = path.resolve(fs.realpathSync(process.cwd()), "static");
const rmdir = promisify(fs.rmdir);
const mkdir = promisify(fs.mkdir);

export class Media {
    static async removeDir(...id: string[]) {
        await rmdir(path.resolve(dir, path.join(...id)), {recursive: true});
    }

    static async upload(
        upload: FileUpload,
        ...id: string[]
    ) {
        const uploadPath = path.resolve(dir, path.join(...id));
        await mkdir(uploadPath, {recursive: true});

        const {createReadStream, filename} = await upload;
        const stream = createReadStream();

        const name = 'u' + filename.slice(filename.lastIndexOf('.'));
        try {
            const result = await new Promise((resolve, reject) =>
                stream
                    .on("error", error => reject(error))
                    .pipe(fs.createWriteStream(path.resolve(uploadPath, name)))
                    .on("error", error => reject(error))
                    .on("finish", () => resolve(name)));

            return result;
        } catch (e) {
            return null;
        }
    }
}
