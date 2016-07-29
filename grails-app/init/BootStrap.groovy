import shopproject.Role
import shopproject.User
import shopproject.UserRole

class BootStrap {

    def init = { servletContext ->
        User user = new User(username: "user", password: "user")
        user.save()
//
        Role roleUser = new Role(authority: "ROLE_USER")
        roleUser.save()

//        def userRole = new UserRole(user: user, role: roleUser)

        def role = new Role('ROLE_ADMIN').save()

        def me = new User('admin', 'testadmin').save()

//        UserRole.create me, role

//        UserRole.withSession {
//            it.flush()
//            it.clear()
//        }
    }
    def destroy = {
    }
}
