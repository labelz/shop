package shopproject

import grails.converters.JSON

class UserController {

    def index() { }
    def login(){
        def user = [id:1,name:"Test",role:"admin"]
        def map = [user:user , id:1234]
        render map as JSON
    }
}
