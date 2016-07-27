package shopproject

import grails.converters.JSON
import grails.rest.RestfulController
import groovy.time.TimeCategory

class TransactionController extends RestfulController{
    def transactionService
    static responseFormats = ['json', 'xml']
    TransactionController() {
        super(Transaction)
    }

    def index() { }

    def insert(){
        def productId = request.JSON.productId
        def buyPrice = request.JSON.buyPrice
        def quantity = request.JSON.quantity
        def sellPrice = request.JSON.sellPrice
        render transactionService.insert(productId,quantity,sellPrice,buyPrice)
    }

    def get(){
        JSON.use('deep'){
            render transactionService.get() as JSON
        }

    }
    def getTodaySell(){
        JSON.use('deep'){
            render transactionService.getTodaySell() as JSON
        }
    }

    def getSellByDate(){
        def stringDate = request.JSON.date
        def newdate = new Date().parse("MM/dd/yyyy", stringDate)
        use(TimeCategory) {
            def tomorrowDate = newdate + 1.days
        }
        JSON.use('deep'){
            render transactionService.getPeriodSell(newdate,tomorrowDate) as JSON
        }
    }

    def getSellByDatePeriod(){
        def sdate = request.JSON.sdate
        def edate = request.JSON.edate
        def startDate = new Date().parse("MM/dd/yyyy", sdate)
        def endDate = new Date().parse("MM/dd/yyyy", edate)
        JSON.use('deep'){
            render transactionService.getPeriodSell(startDate,endDate) as JSON
        }
    }


}
