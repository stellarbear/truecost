import * as fs from "fs";
import * as path from "path";
import * as sharp from 'sharp';
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

        const {createReadStream, filename} = await (upload as any).promise;
        const stream = createReadStream();

        const baseName = 'u';
        const name = baseName + filename.slice(filename.lastIndexOf('.'));
        try {
            const result = await new Promise((resolve, reject) =>
                stream
                    .on("error", (error: any) => reject(error))
                    .pipe(fs.createWriteStream(path.resolve(uploadPath, name)))
                    .on("error", (error: any) => reject(error))
                    .on("finish", () => resolve(name)));

            await this.resize(uploadPath, baseName, name);
            
            return result;
        } catch (e) {
            return null;
        }
    }

    static async resize(
        uploadPath: string,
        baseName: string,
        fullName: string,
        width?: number,
    ) {
        const handle = await sharp(path.resolve(uploadPath, fullName));
        const resized = width ? (await handle.resize(width)) : handle;

        await resized.toFile(path.resolve(uploadPath,
            width
                ? `${baseName}x${width}.webp`
                : `${baseName}.webp`));
    }
}
