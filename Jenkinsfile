pipeline {
    agent {
        label 'agent-1'
    } 
    options{
        ansiColor('xterm')
    }
    environment {
        DEPLOY_SERVER = credentials('deploy-server') 
        DEPLOY_PATH = '~/wfp-cicd'
        DOCKER_CREDENTIALS = credentials('dockerhub-credentials')
        GIT_COMMIT = sh(returnStdout: true, script: "git rev-parse --short=8 HEAD").trim()
    }
    stages {
        stage('Initialize'){
            steps{
                echo '\033[1;36mInitializing docker...\033[0m'
                sh 'docker --version'
            }
        }
        stage('Checkout'){
            steps{
                echo '\033[1;36mChecking out...\033[0m'
                checkout scm
            }
        }
        stage('Test') {
            steps {
                echo '\033[1;36mStarting Testing..\033[0m'
                script{
                    try{
                        echo 'Starting unit testing...'
                        sh 'docker build -f ./frontend/testing.Dockerfile -t calendar-test ./frontend'
                        sh 'docker run --cap-add=SYS_ADMIN calendar-test'
                    }
                    catch (err){
                        echo "Caught: ${err}"
                        currentBuild.result = 'FAILURE'
                        error("An error has occured: ${err}")
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
                echo '\033[1;36mBuilding...\033[0m'

                sh 'echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin'

                echo 'Building frontend...'
                sh 'docker build -f ./frontend/Dockerfile -t itron1x/calendar-fe:${GIT_COMMIT} -t itron1x/calendar-fe:latest ./frontend'
                sh 'docker push -a itron1x/calendar-fe'

                echo 'Building backend...'
                sh 'docker build -f ./backend/nodejs/Dockerfile -t itron1x/calendar-be:${GIT_COMMIT} -t itron1x/calendar-be:latest ./backend/nodejs'
                sh 'docker push -a itron1x/calendar-be'

                sh 'docker compose build --pull'
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
                echo '\033[1;36mDeploying....\033[0m'
                sshagent(credentials: ['ssh-credentials']){
                    script{
                        try{
                            sh '''
                                ssh prod@${DEPLOY_SERVER} << EOF
                                echo 'Connected to ${DEPLOY_SERVER}.'

                                docker version
                                export TAG=${GIT_COMMIT}

                                cd ${DEPLOY_PATH}

                                docker compose pull || exit 1

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
            echo '\033[1;36mEnd of pipeline.\033[0m'

            emailext body: '''$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS:

Check console output at $BUILD_URL to view the results.''',
            subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!',
            to: 'clusterfuchs.net@gmail.com'
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

