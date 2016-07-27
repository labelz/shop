package shopproject

import grails.transaction.Transactional

@Transactional
class ExpenseService {

    def serviceMethod() {

    }

    def getToday(){
        def today = new Date().clearTime()
        def expense = Expense.findAllByDatetimeGreaterThan(today)
        return expense
    }
}
