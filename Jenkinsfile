pipeline {
    agent {
        label 'agent1'
    } 
    environment {
        VARIABLE= credentials('Testvariable')
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                echo 'Variable: $VARIABLE'
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