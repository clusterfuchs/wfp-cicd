pipeline {
    agent {
        label 'docker-agent-1'
    } 
    options{
        ansiColor('xterm')
    }
    environment {
        TEST = credentials('Testvariable')
        DEPLOY_SERVER = credentials('deploy-server') 
        DEPLOY_PATH = '~/wfp-cicd'
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
    }
    stages {
        stage('Initialize'){
            steps{
                echo '\033[92mInitializing docker...\033[0m'
                sh 'docker --version'
            }
        }
        stage('Checkout'){
            steps{
                echo '\033[92mChecking out...\033[0m'
                checkout scm
            }
        }
        stage('Test') {
            steps {
                echo '\033[92mStarting Testing..\033[0m'
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
                    echo '\033[92mTesting successfull!\033[0m'
                }
                unsuccessful{
                    echo '\033[31mTesting not successfull!\033[0m'
                    echo '\033[31mPreventing deployment...\033[0m'
                }
            }
        }
        stage('Build') {
            steps {
                echo '\033[92mBuilding...\033[0m'
                sh 'docker compose build --pull'

                sh 'echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin'

                sh 'docker build -f ./frontend/Dockerfile -t clandar-fe'
                sh 'docker build -f ./backend/nodejs/Dockerfile -t clandar-fe'

                sh 'docker push itron1x/calendar-fe:${GIT_REVISION,length=8}'
                sh 'docker push itron1x/calendar-be:${GIT_REVISION,length=8}'
            }
            post{
                success{
                    echo '\033[92mBuilding successfull!\033[0m'
                }
                unsuccessful{
                    echo '\033[31mBuilding not successfull!\033[0m'
                    echo '\033[31mPreventing deployment...\033[0m'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo '\033[92mDeploying....\033[0m'
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
                    echo "\033[31mDeployment failed!\033[0m"
                }
                success{
                    echo "\033[92mDeployment succeeded!\033[0m"
                }
            }
        }
    }
    post{
        always{
            echo '\033[92mEnd of pipeline.\033[0m'
        }
        failure{
            echo '\033[31mPipeline failed!\033[0m'
        }
        success{
            echo '\033[92mPipeline succeeded!\033[0m'
        }
        aborted{
            echo '\033[31mPipeline aborted!\033[0m'
        }
    }
}

