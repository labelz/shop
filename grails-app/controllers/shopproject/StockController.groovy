package shopproject

import grails.converters.JSON

class StockController {
    def stockService
    def index() { }

    def updateStock(){
        def today = new Date().clearTime()
        def stockDate = stockService.getLatestStockDate()
        if(today == stockDate.clearTime()){
            render "Stock already Updated"
        }else{
            stockService.updateStock()
            render "Success"
        }
    }

    def getLatest(){
        JSON.use('deep'){
            render stockService.getLatestStock() as JSON
        }
    }
}
