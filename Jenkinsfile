pipeline {
    agent {
        label 'agent1'
    } 
    environment {
        TEST = credentials('Testvariable')
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                echo "Variable: $TEST"
                sh 'echo "Variable: $TEST"'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}