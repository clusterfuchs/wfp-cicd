pipeline {
    agent {
        label 'docker-agent-1'
    } 
    environment {
        TEST = credentials('Testvariable')
        // SSH_CREDENTIALS_ID = credentials('ssh-credentials')
        DEPLOY_SERVER = credentials('deploy-server') 
        DEPLOY_PATH = '~'
    }
    stages {
        stage('Initialize'){
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
                sshagent(credentials: ['ssh-credentials']){
                    sh '''
                        ssh ${DEPLOY_SERVER} << EOF
                        echo 'Connected to ${DEPLOY_SERVER}.'

                        docker version
                        ip a

                        exit 0
                        EOF
                    '''
                }
            }
        }
    }
    post{
        always{
            echo 'End of pipeline.'
        }
        failure{
            echo 'Pipeline failed!'
        }
        success{
            echo 'Pipeline succeeded!'
        }
        aborted{
            echo 'Pipeline aborted!'
        }
    }
}

