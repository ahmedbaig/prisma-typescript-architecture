def gv
pipeline {
    agent any
    parameters{
        choice(name: 'VERSION', choices:['1.1.0', '1.2.0', '1.3.0'], description: '')
        booleanParam(name: 'executeTests', defaultValue: true, description: '')
    }
    // environment {
    //     New_Version = '1.3.0'
    // }
    stages{
         stage('init'){
            steps {
                script {
                    gv = load "script.groovy"
                
		}
            }
        }
        stage('build'){
            steps {
                script {
                    gv.buildApp()
                }
            }
        }
         stage('test'){
             when {
                 expression {
                     params.executeTests
                 }
             }
             steps {
                 script {
                     gv.testApp()
                 }
             }
        }
        stage('development'){
             steps{
                script {
                    gv.deployApp()
                }
             }
        }
    }
}
