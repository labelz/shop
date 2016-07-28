package shopproject

import grails.converters.JSON

class StockController {
    def stockService
    def index() { }

    def updateStock(){
        stockService.updateStock()
    }

    def getLatest(){
//        render "test"

        JSON.use('deep'){
            render stockService.getLatestStock() as JSON
        }
    }

    def addStock() {
        def stock = new Stock()
        stock.product = new Product()
        stock.product.id = request.JSON.product.id
        stock.quantity = request.JSON.quantity
        stockService.addStock(stock)
    }
}
