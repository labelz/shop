package shopproject

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/"(view:"/index")
        "500"(view:'/error')
        "404"(view:'/notFound')
//        "/"(uri: "/static/app/index.html")
        "/"(redirect: [uri: "/static/app/index.html"])
    }
}
