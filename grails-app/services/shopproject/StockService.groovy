package shopproject

import grails.transaction.Transactional

@Transactional
class StockService {

    def serviceMethod() {

    }

    def addStock(Stock stockAdd) {
        def product = Product.findById(stockAdd.product.id)
        def stock = Stock.findByProduct(product, [sort: "date", order: "desc"])
        if (stock) {
            def newStock = new Stock()
            newStock.quantity = stock.quantity + stockAdd.quantity
            newStock.date = new Date()
            newStock.product = product
            newStock.save()

        } else {
            def newStock = new Stock()
            newStock.quantity = stockAdd.quantity
            newStock.date = new Date()
            newStock.product = product
            newStock.save()
        }
    }

    def updateStock(){
        def today = new Date().clearTime()
//        def latestStock = getLatestStock()
        def products = Product.findAll()
        products.each {product ->
            def stock = Stock.findByProduct(product,[sort:"date",order:"desc"])
            if(stock){
                updateStockFromTransaction(product, stock.quantity)
            }
            else{
                updateStockFromTransaction(product, 0)
            }
        }
    }

    def updateStockFromTransaction(Product product, int quantity) {
        def transactions = Transaction.findAllByProductAndIsStocked(product, false)
        if(transactions){
            def newStock = new Stock()
            newStock.quantity = quantity
            newStock.date = new Date()
            newStock.product = product
            transactions.each {transaction ->
                if(transaction.sellPrice>0){
                    newStock.quantity = newStock.quantity - transaction.quantity
                }else if(transaction.buyPrice>0){
                    newStock.quantity = newStock.quantity + transaction.quantity
                }
                transaction.isStocked = true;
                transaction.save()
            }
//            transactions.save()
            newStock.save()
        }
    }

    def getLatestStock(){

        def products = Product.findAll()
        def stocks = new ArrayList<Stock>();
        products.each { product ->
            def stock = Stock.findByProduct(product, [sort: "date", order: "desc"])
            if (stock)
                stocks.add(stock)
        }
        return stocks

    }

    def getLatestStockDate(){

        return  Stock.createCriteria().get(){
            projections {
                max "date"
            }
        }as Date

    }
}
