export const fetchAndEncodeImage = async (url: File) => {
  try {
    // 画像データを URL から fetch
    const response = await fetch(url)
    const blob = await response.blob()

    // FileReader を使って Blob を Base64 に変換
    const reader = new FileReader()

    reader.onloadend = () => {
      const base64String = reader.result // Base64 形式の文字列
      console.log('Base64 Encoded:', base64String)
    }

    // Blob を Base64 に変換
    reader.readAsDataURL(blob)
  } catch (error) {
    console.error('Error fetching or encoding image:', error)
  }
}
