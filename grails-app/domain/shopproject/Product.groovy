package shopproject

class Product {

    String name
    int sellPrice


    static constraints = {
        name unique: true
    }
}
