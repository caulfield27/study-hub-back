import { Upload } from "@aws-sdk/lib-storage";
import { r2 } from "../aws";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";


export async function uploadBuffer(
  bucket: string,
  folder: string,
  fileName: string,
  buffer: Buffer,
  contentType: string,
) : Promise<Upload> {
  try {
    const upload = new Upload({
      client: r2,
      params: {
        Bucket: bucket,
        Key: folder + fileName,
        Body: buffer,
        ContentType: contentType,
      },
    });
    return upload;
  } catch (e) {
    throw e;
  }
}


export async function deleteFile(
  bucket: string,
  folder: string,
  fileName: string,
): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: folder + fileName,
    }),
  );
}