import { Module } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AwsS3Service } from './aws-s3.service';

@Module({
  providers: [
    AwsS3Service,
    {
      provide: 'S3',
      useFactory: () => {
        return new S3({
          region: process.env.AWS_REGION,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
      },
    },
  ],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
