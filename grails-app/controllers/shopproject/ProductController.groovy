package shopproject

import grails.converters.JSON

class ProductController {
    def productService
    def index() { }
    def insert(){
        def name = request.JSON.name
        def sellPrice = request.JSON.sellPrice
        productService.insertProduct(name,sellPrice)
        render name +"_"+sellPrice

    }

    def get(){
        render productService.getData() as JSON
    }
    def login(){
        def user = [id:1,name:"Test",role:"admin"]
        def map = [user:user , id:1234]
        render map as JSON
    }
}
