pipeline {
    agent {
        label 'docker-agent-1'
    } 
    environment {
        TEST = credentials('Testvariable')
        DEPLOY_SERVER = credentials('deploy-server') 
        DEPLOY_PATH = '~/wfp-cicd'
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

                        cd ${DEPLOY_PATH}
                        git fetch || exit 1
                        git merge || exit 1

                        docker compose up -d --build --remove-orphans

                        echo 'Deployment complete.'

                        exit 0
                        EOF
                    '''
                }
            }
            post{
                unsuccessful{
                    echo "Deployment failed!"
                    currentBuild.result = 'FAILURE'
                }
                success{
                    echo "Deployment succeeded!"
                }
            }
        }
    }
    post{
        always{
            echo 'End of pipeline.'
        }
        failure{
            currentBuild.result = 'FAILURE'
            echo 'Pipeline failed!'
        }
        success{
            echo 'Pipeline succeeded!'
        }
        aborted{
            currentBuild.result = 'FAILURE'
            echo 'Pipeline aborted!'
        }
    }
}

