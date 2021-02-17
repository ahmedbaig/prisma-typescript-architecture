def buildApp(){
    echo "Building my-dummy app"
}

def testApp(){
     echo 'Test application...'
}

def deployApp(){
     echo 'development stage'
     echo "building version ${params.VERSION}"
}
return this