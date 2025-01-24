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
