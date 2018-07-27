
def image_tag = "caicloud/node-project:${params.imageTag}"
def registry = "cargo.caicloudprivatetest.com"

podTemplate(
    cloud: 'dev-cluster',
    namespace: 'kube-system',
    name: 'node-project',
    label: 'node-project',
    containers: [
        // jnlp with kubectl
        containerTemplate(
            name: 'jnlp',
            alwaysPullImage: true,
            image: 'cargo.caicloudprivatetest.com/caicloud/jenkins/jnlp-slave:3.14-1-alpine',
            command: '',
            args: '${computer.jnlpmac} ${computer.name}',
        ),
        containerTemplate(
            name: 'dind',
            image: 'cargo.caicloudprivatetest.com/caicloud/docker:17.09-dind',
            ttyEnabled: true,
            command: '',
            args: '--host=unix:///home/jenkins/docker.sock',
            privileged: true,
        ),
        containerTemplate(
            name: 'nodejs',
            image: 'cargo.caicloudprivatetest.com/caicloud/node:9.8.0-slim',
            ttyEnabled: true,
            command: 'cat',
            args: '',
        ),
    ]
) {
    node('node-project') {
        stage('Checkout') {
            checkout scm
        }
        container('nodejs') {
            ansiColor('xterm') {
                stage("Install") {
                    sh('''
                        set -ex
                        npm set registry http://npm.caicloud.xyz
                        npm install
                    ''')
                }
                stage("ESLint") {
                    sh('''
                        set -ex
                        yarn eslint .
                    ''')
                }
            }
        }
        container('dind') {
            ansiColor('xterm') {
                stage("Complie") {
                    sh("make container")
                }
                stage("Build image and Publish") {
                    if (params.publish) {
                        sh "docker build -t ${image_tag} -f build/node-project/Dockerfile ."
                        docker.withRegistry("https://${registry}", "cargo-private-admin") {
                            docker.image(image_tag).push()
                        }
                        if (params.autoGitTag) {
                            echo "auto git tag: " + params.imageTag
                            withCredentials ([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'caicloud-bot', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD']]) {
                                sh("git config --global user.email \"info@caicloud.io\"")
                                sh("git tag -a $imageTag -m \\\"\"$tagDescribe\"\\\" || true")
                                sh("git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/caicloud/node-project $imageTag || true")
                            }
                        }
                    } else {
                        echo "skip publish"
                    }
                }
            }
        }
    }
}
