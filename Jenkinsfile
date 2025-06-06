pipeline {
  agent any

  environment {
    SSH_KEY = credentials('jenkins-ec2-ssh')
    EC2_USER = 'ubuntu'
    EC2_HOST = '18.234.64.100'
    PROJECT_DIR = '/home/ubuntu/portfolio-backend'
  }

  stages {
    stage('Backup Existing Backend') {
      steps {
        sshagent(['jenkins-ec2-ssh']) {
          sh """
          ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
            TIMESTAMP=$(date +%Y%m%d_%H%M%S)
            cd $PROJECT_DIR &&
            mkdir -p ../backup/portfolio-backend_backup_\$TIMESTAMP &&
            cp -r . ../backup/portfolio-backend_backup_\$TIMESTAMP || echo "No files to backup"
            docker commit backend-api backend-api-backup:\$TIMESTAMP || echo "No container to commit"
          '
          """
        }
      }
    }

    stage('Deploy Updated Backend') {
      steps {
        sshagent(['jenkins-ec2-ssh']) {
          sh """
          ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
            cd $PROJECT_DIR &&
            git pull origin main &&
            docker stop backend-api || true &&
            docker rm backend-api || true &&
            docker build -t portfolio-backend . &&
            docker run -d --env-file .env -p 5001:5000 --name backend-api portfolio-backend
          '
          """
        }
      }
    }

    stage('Cleanup Old Backups') {
      steps {
        sshagent(['jenkins-ec2-ssh']) {
          sh """
          ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
            # Delete backup folders older than 2 days
            find /home/ubuntu -maxdepth 2 -type d -name "portfolio-backend_backup_*" -mtime +2 -exec rm -rf {} \\;

            # Delete backup Docker images older than 2 days
            docker images --format "{{.Repository}} {{.Tag}} {{.CreatedSince}}" | grep "backend-api-backup" | while read repo tag age unit rest; do
              if [[ "\$unit" == "days" && "\$age" -gt 2 ]]; then
                docker rmi "\$repo:\$tag"
              fi
            done || true
          '
          """
        }
      }
    }
  }
}
