package shopproject

class Transaction {
    Date datetime
    Product product
//    static belongsTo = [product: Product]
    int sellPrice
    int buyPrice
    int quantity
    boolean isStocked
    static constraints = {
    }
    static mapping = {
        isStocked defaultValue: false
    }


}
