export const MediaData = [
  {
    label: '画像',
    value: 4,
    color: '#00ff00',
  },
  {
    label: '動画',
    value: 2.3,
    color: '#002bff',
  },
  {
    label: '音声',
    value: 1.1,
    color: '#800080',
  },
  {
    label: 'テキスト',
    value: 1.2,
    color: '#000000',
  },
]

export const valueFormatter = (item: { value: number }) => `${item.value}MB`

export type MediaTypeProps = {
  id?: number
  name: string
  type: string
  uploadedAt: string
  category?: string
}
export const MediaItem: MediaTypeProps[] = [
  {
    id: 0,
    name: 'Text1',
    type: 'jpeg',
    uploadedAt: '2024-11-26 20:49:39',
    category: '画像',
  },
  {
    id: 1,
    name: 'Text2',
    type: 'mp3',
    uploadedAt: '2024-12-05 20:49:39',
    category: '音声',
  },
  {
    id: 2,
    name: 'Image2',
    type: 'jpeg',
    uploadedAt: '2024-12-01 20:49:39',
    category: '画像',
  },
  {
    id: 3,
    name: 'Image1',
    type: 'mov',
    uploadedAt: '2024-11-22 20:49:39',
    category: '動画',
  },
  {
    id: 4,
    name: 'Video2',
    type: 'txt',
    uploadedAt: '2024-12-10 20:49:39',
    category: 'テキスト',
  },
  {
    id: 5,
    name: 'Image1',
    type: 'wav',
    uploadedAt: '2024-11-27 20:49:39',
    category: '音声',
  },
  {
    id: 6,
    name: 'Video2',
    type: 'png',
    uploadedAt: '2024-11-23 20:49:39',
    category: '画像',
  },
  {
    id: 7,
    name: 'Audio1',
    type: 'png',
    uploadedAt: '2024-11-27 20:49:39',
    category: '画像',
  },
  {
    id: 8,
    name: 'Image3',
    type: 'wav',
    uploadedAt: '2024-12-17 20:49:39',
    category: '音声',
  },
  {
    id: 9,
    name: 'Audio2',
    type: 'jpg',
    uploadedAt: '2024-12-03 20:49:39',
    category: '画像',
  },
  {
    id: 10,
    name: 'Text1',
    type: 'jpeg',
    uploadedAt: '2024-11-26 20:49:39',
    category: '画像',
  },
  {
    id: 11,
    name: 'Text2',
    type: 'mp3',
    uploadedAt: '2024-12-05 20:49:39',
    category: '音声',
  },
  {
    id: 12,
    name: 'Image2',
    type: 'jpeg',
    uploadedAt: '2024-12-01 20:49:39',
    category: '画像',
  },
  {
    id: 13,
    name: 'Image1',
    type: 'mov',
    uploadedAt: '2024-11-22 20:49:39',
    category: '動画',
  },
  {
    id: 14,
    name: 'Video2',
    type: 'txt',
    uploadedAt: '2024-12-10 20:49:39',
    category: 'テキスト',
  },
  {
    id: 15,
    name: 'Image1',
    type: 'wav',
    uploadedAt: '2024-11-27 20:49:39',
    category: '音声',
  },
  {
    id: 16,
    name: 'Video2',
    type: 'png',
    uploadedAt: '2024-11-23 20:49:39',
    category: '画像',
  },
  {
    id: 17,
    name: 'Audio1',
    type: 'png',
    uploadedAt: '2024-11-27 20:49:39',
    category: '画像',
  },
  {
    id: 18,
    name: 'Image3',
    type: 'wav',
    uploadedAt: '2024-12-17 20:49:39',
    category: '音声',
  },
  {
    id: 19,
    name: 'Audio2',
    type: 'jpg',
    uploadedAt: '2024-12-03 20:49:39',
    category: '画像',
  },
]
