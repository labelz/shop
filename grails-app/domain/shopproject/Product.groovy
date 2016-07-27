package shopproject

class Product {

    String name
    int sellPrice

    static mapping = {
        sort name: "asc"
    }

    static constraints = {
        name unique: true
    }
}
