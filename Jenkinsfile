pipeline {
  agent any

  environment {
    EC2_USER = 'ubuntu'
    EC2_HOST = '54.235.3.176'
    PROJECT_DIR = '/home/ubuntu/portfolio-backend'
    BACKUP_DIR = '/home/ubuntu/portfolio-backups'
    ENV_SECRET = credentials('portfolio-env')  // 🔐 this is the Secret Text ID
  }

  stages {
    stage('Deploy Backend to EC2') {
      steps {
        sshagent(['jenkins-ec2-ssh']) {
          sh """
            # Sync code excluding .env
            rsync -avz -e "ssh -o StrictHostKeyChecking=no" --delete \\
              --exclude=node_modules --exclude=.git --exclude=.env ./ \\
              $EC2_USER@$EC2_HOST:$PROJECT_DIR

            # SSH into EC2 to recreate .env and deploy
            ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
              echo "$ENV_SECRET" > $PROJECT_DIR/.env
              chmod 600 $PROJECT_DIR/.env

              mkdir -p $BACKUP_DIR
              TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
              if [ -d "$PROJECT_DIR" ]; then
                tar czf $BACKUP_DIR/portfolio-backup-\$TIMESTAMP.tar.gz -C /home/ubuntu portfolio-backend
              fi

              find $BACKUP_DIR -name "*.tar.gz" -type f -mtime +2 -delete

              cd $PROJECT_DIR &&
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
