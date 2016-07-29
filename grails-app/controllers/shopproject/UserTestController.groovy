package shopproject

import grails.converters.JSON

class UserTestController {

    def index() { }
    def login(){
        def username = request.JSON.username
        def password = request.JSON.password

        def user = [id:1,name:"admin",role:"admin"]
        def adminMap = [user:[id:1,name:"admin",role:"admin"] , id:1234]
        def userMap = [user:[id:1,name:"userTest",role:"userTest"] , id:1234]
        if ('admin'.equalsIgnoreCase(username) && password.equals('testadmin'))
            render adminMap as JSON
        else if (username.equalsIgnoreCase('userTest'))
            render userMap as JSON
    }
}
