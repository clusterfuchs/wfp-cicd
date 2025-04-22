pipeline {
    agent {
        label 'docker-agent-1'
    } 
    environment {
        TEST = credentials('Testvariable')
        DEPLOY_SERVER = credentials('deploy-server') 
        DEPLOY_PATH = '~/wfp-cicd'
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
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
        stage('Test') {
            steps {
                echo 'Starting Testing..'
                script{
                    try{
                        echo 'Starting unit testing...'
                        sh 'docker build -f ./frontend/testing.Dockerfile -t calendar-test ./frontend'
                        sh 'docker run --cap-add=SYS_ADMIN calendar-test'

                        echo 'Starting docker compose...'
                        sh 'docker compose up -d'
                    }
                    catch (err){
                        echo "Caught: ${err}"
                        currentBuild.result = 'FAILURE'
                        error("An error has occured: ${err}")
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
        stage('Build') {
            steps {
                echo 'Building...'
                sh 'docker compose build --pull'

                sh 'echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin'

                sh 'docker build -f ./frontend/Dockerfile -t clandar-fe'
                sh 'docker build -f ./backend/nodejs/Dockerfile -t clandar-fe'

                sh 'docker push itron1x/calendar-fe:${GIT_REVISION,length=8}'
                sh 'docker push itron1x/calendar-be:${GIT_REVISION,length=8}'
            }
            post{
                success{
                    echo 'Building successfull!'
                }
                unsuccessful{
                    echo 'Building not successfull!'
                    echo 'Preventing deployment...'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sshagent(credentials: ['ssh-credentials']){
                    script{
                        try{
                            sh '''
                                ssh ${DEPLOY_SERVER} << EOF
                                echo 'Connected to ${DEPLOY_SERVER}.'

                                docker version

                                cd ${DEPLOY_PATH}
                                git fetch || exit 1
                                git merge || exit 1

                                docker compose up -d --build --remove-orphans || exit 1

                                echo 'Deployment complete.'

                                exit 0
                                EOF
                            '''
                        } catch(err){
                            echo "Caught: ${err}"
                            currentBuild.result = 'FAILURE'
                            error("An error has occured: ${err}")
                        }
                    }
                }
            }
            post{
                unsuccessful{
                    echo "Deployment failed!"
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

