pipeline {
    agent {
        label 'agent1'
    } 
    environment {
        TEST = credentials('Testvariable')
    }
    stages {
        stage('Initialize'){
            tools {
                docker 'docker'
                // def dockerHome = tool 'docker'
                // env.PATH = "${dockerHome}/bin:${env.PATH}"
            }
            steps{
                echo 'Initializing docker...'
                sh 'docker --version'
            }
        }
        stage('Checkout'){
            steps{
                echo 'Checking out...'
                checkout scm
            }
        }
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'docker compose build --pull'
            }
        }
        stage('Test') {
            steps {
                echo 'Starting Testing..'
                script{
                    try{
                        echo 'Starting docker compose...'
                        sh 'docker compose up -d'
                    }
                    catch (err){
                        echo 'Caught: ${err}'
                        currentBuild.result = 'FAILURE'
                    }
                    finally{
                        echo 'Stopping docker compose...'
                        sh 'docker compose down -v'
                    }
                }
            }
            post{
                success{
                    echo 'Testing successfull!'
                }
                unsuccessful{
                    echo 'Testing not successfull!'
                    echo 'Preventing deployment...'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}