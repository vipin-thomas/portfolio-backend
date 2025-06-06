pipeline {
  agent any

  environment {
    EC2_USER = 'ubuntu'
    EC2_HOST = '18.234.64.100'
    PROJECT_DIR = '/home/ubuntu/portfolio-backend'
    BACKUP_DIR = '/home/ubuntu/portfolio-backups'
  }

  stages {
    stage('Deploy Backend to EC2') {
      steps {
        sshagent(['jenkins-ec2-ssh']) {  // Use credential ID directly here
          sh """
            ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
              mkdir -p $BACKUP_DIR
              TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
              if [ -d "$PROJECT_DIR" ]; then
                tar czf $BACKUP_DIR/portfolio-backup-\$TIMESTAMP.tar.gz -C /home/ubuntu portfolio-backend
              fi

              find $BACKUP_DIR -name "*.tar.gz" -type f -mtime +2 -delete

              cd $PROJECT_DIR &&
              git pull origin main &&
              docker stop backend-api || true &&
              sleep 2 &&
              docker rm -f backend-api || true &&
              docker build -t portfolio-backend . &&
              docker run -d --env-file .env -p 5001:5000 --name backend-api portfolio-backend
            '
          """
        }
      }
    }
  }
}
