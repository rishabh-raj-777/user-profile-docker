pipeline {
  agent any

  environment {
    IMAGE_NAME = 'yourdockerhubusername/user-signup-app'
  }

  stages {
    stage('Clone Repo') {
      steps {
        // For Windows-based Jenkins, use `bat` instead of `sh`
        bat 'git --version'
        bat 'git clone https://github.com/rishabh-raj-777/user-profile-docker.git'
        dir('user-profile-docker') {
          bat 'dir'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        dir('user-profile-docker') {
          bat "docker build -t %IMAGE_NAME% ."
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          dir('user-profile-docker') {
            bat """
              echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
              docker tag user-signup-app %IMAGE_NAME%
              docker push %IMAGE_NAME%
            """
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Build and push successful!'
    }
    failure {
      echo '❌ Build failed.'
    }
  }
}
