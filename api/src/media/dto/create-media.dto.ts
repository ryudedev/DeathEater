import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  capsule_id: string; // Capsuleモデルの関連ID

  @IsNotEmpty()
  @IsString()
  file_path: string; // ファイルの保存パス

  @IsNotEmpty()
  @IsString()
  file_type: string; // ファイルタイプ ("video", "image"など)
}
