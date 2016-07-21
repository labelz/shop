package shopproject

import grails.transaction.Transactional

@Transactional
class ProductService {

    def serviceMethod() {

    }
    def insertProduct(String name,int sellPrice){
        def product = new Product()
        product.name = name
        product.sellPrice = sellPrice
//        product.save(flush: true)
        if( !product.save(flush: true) ) {
            println "Validation errors on save"
            newItem.errors.each {
                println it
            }
        }
        println(product.id)

    }

    def getData(){
        def product = new Product()
        return product.getAll()
    }
}
