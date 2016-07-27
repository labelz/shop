package shopproject

import grails.converters.JSON
import grails.rest.RestfulController

class ExpenseController extends RestfulController{
    def expenseService
    static responseFormats = ['json', 'xml']
    ExpenseController() {
        super(Expense)
    }

    def index() { }

    def getToday(){

        render expenseService.getToday() as JSON

    }
}
