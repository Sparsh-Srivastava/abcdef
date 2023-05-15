import aws from 'aws-sdk';
import config from '../config';

aws.config.update({ region: config.aws.region });
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

export default s3;
