import subprocess
import os
import boto3
import datetime

DB_FILE = os.getenv('PROJECT_DIR') + '/backend/db/db.sqlite'
BACKUP_DIR = os.getenv('LLMTRIVIA_BACKUP_DIR')
S3_BUCKET_NAME = os.getenv('LLMTRIVIA_AWS_BUCKET_NAME')

timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
backup_file_name = f'llmtrivia_db_backup_{timestamp}.tar.gz'

subprocess.run(['tar', '-zcvf', os.path.join(BACKUP_DIR, backup_file_name), DB_FILE], check=True)

# Upload to S3
s3 = boto3.client('s3')
s3.upload_file(os.path.join(BACKUP_DIR, backup_file_name), S3_BUCKET_NAME, backup_file_name)

print(f'Backup completed and uploaded to {S3_BUCKET_NAME}')