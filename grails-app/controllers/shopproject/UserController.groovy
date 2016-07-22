package shopproject

import grails.converters.JSON

class UserController {

    def index() { }
    def login(){
        def username = request.JSON.username
        def password = request.JSON.password

        def user = [id:1,name:"admin",role:"admin"]
        def adminMap = [user:[id:1,name:"admin",role:"admin"] , id:1234]
        def userMap = [user:[id:1,name:"user",role:"user"] , id:1234]
        if(username == 'admin')
            render adminMap as JSON
        else if (username =='user')
            render userMap as JSON
    }
}
