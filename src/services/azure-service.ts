import azure from 'azure-storage/browser/azure-storage.blob.export';

/** Interfaces */
import { IFile } from '../interfaces';

/** Configuration */
import { AZURE_TOKENS } from '../config';

/** Creates Azure Blobservice with restricted access */
export const blobService = azure.createBlobService(process.env
  .CONNECTION_STRING as string);

/**
 * Uploads file to Azure Blob Storage.
 * Returns promise that returns the uploaded file's URL inside object of type IFile - See interfaces/IFile.
 * The blob storage works as a virtual file system.
 * */
export const uploadFileToAzureBlobStorage = async (
  share: string,
  directory: string,
  file,
) => {
  return new Promise<IFile>((resolve, reject) => {
    blobService.createContainerIfNotExists(share, function() {
      blobService.createBlockBlobFromBrowserFile(
        share,
        directory + '/' + file.name,
        file,
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
  });
};

/**
 * Deletes single file from Blob (folder).
 * Folder gets deleted when empty (aka when last file gets deleted)
 * */
export const deleteFileFromBlob = async (
  share: string,
  directory: string,
  fileName: string,
) => {
  return new Promise<string>((resolve, reject) => {
    blobService.deleteBlobIfExists(share, directory + '/' + fileName, function(
      error,
    ) {
      if (!error) {
        resolve('Deleted' + fileName);
      } else {
        reject();
      }
    });
  });
};
