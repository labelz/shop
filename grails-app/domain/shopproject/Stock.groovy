package shopproject

class Stock {
//    static belongsTo = [product: Product]
//    static hasMany = [product: Product]
    Product product
    int quantity
    Date date
    static constraints = {
    }
    static mapping = {
        sort date: "desc"
    }
}
