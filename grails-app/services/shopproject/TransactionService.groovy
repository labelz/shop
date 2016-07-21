package shopproject

import grails.transaction.Transactional

@Transactional
class TransactionService {

    def serviceMethod() {

    }

    def insert(Long productId,int quantity,int sellPrice,int buyPrice){
        def transaction = new Transaction()
        transaction.product = new Product()
        transaction.product.id = productId
        transaction.datetime = new Date()
        transaction.quantity = quantity
        transaction.buyPrice = buyPrice
        transaction.sellPrice = sellPrice
        transaction.save(flush: true)

        return transaction.id
    }

    def get(){

        def transaction = Transaction.getAll()
        println(transaction.product.name)
        return transaction
    }

    def getTodaySell(){
        def today = new Date().clearTime()
        def transaction = Transaction.findAllByDatetimeGreaterThanAndSellPriceGreaterThan(today,0)
        println(transaction.product.name)
        return transaction
    }

    def getTodayBuy(){
        def today = new Date().clearTime()
        def transaction = Transaction.findAllByDatetimeGreaterThanAndBuyPriceGreaterThan(today,0)
        println(transaction.product.name)
        return transaction
    }

    def getPeriodSell(Date startDate,Date endDate){
        def transaction = Transaction.findAllByDatetimeBetweenAndSellPriceGreaterThan(startDate,endDate,0)
        println(transaction.product.name)
        return transaction
    }

    def getPeriodBuy(Date startDate,Date endDate){
        def transaction = Transaction.findAllByDatetimeBetweenAndBuyPriceGreaterThan(startDate,endDate,0)
        println(transaction.product.name)
        return transaction
    }
}
