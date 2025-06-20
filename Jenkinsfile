pipeline {
  agent any

  environment {
    IMAGE_NAME = 'rishabhraj7/user-profile-docker-app'
  }

  stages {
    stage('Build Docker Image') {
      steps {
        bat "docker build -t %IMAGE_NAME% ."
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          bat """
            echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
            docker push %IMAGE_NAME%
          """
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
