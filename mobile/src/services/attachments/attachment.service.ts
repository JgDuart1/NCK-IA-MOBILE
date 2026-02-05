import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { apiClient } from '../api';
import { Attachment } from '../../types';

interface UploadResult {
  success: boolean;
  attachment?: Attachment;
  error?: string;
}

export const attachmentService = {
  async pickImage(): Promise<ImagePicker.ImagePickerResult> {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Permissao negada para acessar galeria');
    }

    return ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
  },

  async pickDocument(): Promise<DocumentPicker.DocumentPickerResult> {
    return DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'text/*'],
      copyToCacheDirectory: true,
    });
  },

  async upload(
    uri: string,
    entityType: 'task' | 'note' | 'project',
    entityId: string
  ): Promise<UploadResult> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        return { success: false, error: 'Arquivo nao encontrado' };
      }

      const formData = new FormData();
      const filename = uri.split('/').pop() || 'file';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `application/${match[1]}` : 'application/octet-stream';

      formData.append('file', {
        uri,
        name: filename,
        type,
      } as any);
      formData.append('entity_type', entityType);
      formData.append('entity_id', entityId);

      const response = await apiClient.post<{ data: Attachment }>('/attachments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, attachment: response.data.data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Erro ao fazer upload' };
    }
  },

  async download(attachment: Attachment): Promise<string> {
    const localUri = `${FileSystem.Paths.document.uri}${attachment.filename}`;

    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      return localUri;
    }

    const downloadResult = await FileSystem.downloadAsync(attachment.url, localUri);
    return downloadResult.uri;
  },

  async delete(attachmentId: string): Promise<void> {
    await apiClient.delete(`/attachments/${attachmentId}`);
  },
};
