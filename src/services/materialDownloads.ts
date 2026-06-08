import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Linking } from "react-native";

type DownloadMaterialInput = {
  fileName: string;
  mimeType?: string;
  title?: string;
  url: string;
};

const MATERIAL_DOWNLOAD_DIR = "eduverse-materials";

function sanitizeFileName(fileName: string) {
  const cleanName = fileName
    .trim()
    .replace(/[\\/:*?"<>|#%{}^~[\]`;\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleanName || `material-${Date.now()}`;
}

export async function downloadAndShareMaterial({ fileName, mimeType, title, url }: DownloadMaterialInput) {
  if (!url) {
    throw new Error("This material does not have a valid download URL.");
  }

  const baseDirectory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;

  if (!baseDirectory) {
    throw new Error("File downloads are unavailable on this device.");
  }

  const downloadDirectory = `${baseDirectory}${MATERIAL_DOWNLOAD_DIR}/`;
  await FileSystem.makeDirectoryAsync(downloadDirectory, { intermediates: true });

  const destination = `${downloadDirectory}${Date.now()}-${sanitizeFileName(fileName)}`;
  const result = await FileSystem.downloadAsync(url, destination);

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Download failed with status ${result.status}.`);
  }

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(result.uri, {
      dialogTitle: title ? `Save ${title}` : "Save material",
      mimeType
    });

    return result.uri;
  }

  const canOpenLocalFile = await Linking.canOpenURL(result.uri);
  if (!canOpenLocalFile) {
    throw new Error("Material downloaded, but this device cannot open the saved file.");
  }

  await Linking.openURL(result.uri);

  return result.uri;
}
