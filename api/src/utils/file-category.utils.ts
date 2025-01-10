// src/utils/file-category.utils.ts
export function getFileCategory(extension: string): string {
  const imageExtensions = ['png', 'jpg', 'jpeg', 'svg', 'gif', 'bmp'];
  const videoExtensions = ['mov', 'mp4', 'avi', 'mkv', 'webm'];
  const audioExtensions = ['mp3', 'm4a', 'wav', 'flac', 'aac'];
  const textExtensions = ['txt', 'md', 'pdf'];

  const lowerExtension = extension.toLowerCase();

  if (imageExtensions.includes(lowerExtension)) {
    return '画像';
  } else if (videoExtensions.includes(lowerExtension)) {
    return '動画';
  } else if (audioExtensions.includes(lowerExtension)) {
    return '音声';
  } else if (textExtensions.includes(lowerExtension)) {
    return 'テキスト';
  } else {
    return 'その他';
  }
}
