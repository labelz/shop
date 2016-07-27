package shopproject

import grails.transaction.Transactional

@Transactional
class StockService {

    def serviceMethod() {

    }

    def updateStock(){
        def today = new Date().clearTime()
        def latestStock = getLatestStock()
        def products = Product.findAll()
        products.each {product ->
            def stock = Stock.findByProduct(product,[sort:"date",order:"desc"])
            if(stock){
                def transactions = Transaction.findAllByProductAndDatetimeGreaterThan(product,stock.date.clearTime())
                updateStockFromTransaction(product,stock.quantity,transactions)
            }
            else{
                def transactions = Transaction.findAllByProduct(product)
                updateStockFromTransaction(product,0,transactions)
            }
        }
    }

    def updateStockFromTransaction(Product product,int quantity,def transactions){
        if(transactions){
            def newStock = new Stock()
            newStock.quantity = quantity
            newStock.date = new Date().clearTime()
            newStock.product = product
            transactions.each {transaction ->
                if(transaction.sellPrice>0){
                    newStock.quantity = newStock.quantity - transaction.quantity
                }else if(transaction.buyPrice>0){
                    newStock.quantity = newStock.quantity + transaction.quantity
                }
            }
            newStock.save()
        }
    }

    def getLatestStock(){
        def c = Stock.createCriteria()
        return results = c {
            projections {
                groupProperty("product")
                max("date")
            }
        }
    }

    def getLatestStockDate(){

        return  Stock.createCriteria().get(){
            projections {
                max "date"
            }
        }as Date

    }
}
