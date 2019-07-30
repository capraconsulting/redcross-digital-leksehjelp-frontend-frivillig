import azure from 'azure-storage';
import stream from 'stream';

//Interfaces
import { IFile } from '../interfaces';

//Configuration
import { AZURE_TOKENS } from '../config';

//Creates Azure Blobservice with restricted access
export const blobService = azure.createBlobService(
  AZURE_TOKENS.CONNECTION_STRING,
);

/**
 * Uploads file to azure blob storage.
 * Returns promise that returns the uploaded file's URL inside object of type IFile - See interfaces/IFile.
 * The blob storage works as a virtual file system.
 * */
export const uploadFileToAzureBlobStorage = async (
  share: string,
  directory: string,
  file,
) => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  const fileStream = new stream.Readable();
  return new Promise<IFile>((resolve, reject) => {
    fileReader.onload = () => {
      let myFileBuffer: ArrayBuffer = fileReader.result as ArrayBuffer;
      if (myFileBuffer) {
        fileStream.push(myFileBuffer[0]);
        fileStream.push(null);
        blobService.createContainerIfNotExists(share, function() {
          blobService.createBlockBlobFromStream(
            share,
            directory + '/' + file.name,
            fileStream,
            myFileBuffer.byteLength,
            function(error, result) {
              if (!error) {
                const { container, name } = result;
                const fileLink = blobService.getUrl(
                  container,
                  name,
                  AZURE_TOKENS.PUBLIC_SAS_TOKEN,
                );
                let promisedFile: IFile = {
                  share,
                  directory,
                  fileName: file.name,
                  fileUrl: fileLink + '&sr=b&sv=2018-03-28',
                };
                resolve(promisedFile);
              } else {
                reject();
              }
            },
          );
        });
      }
    };
  });
};
