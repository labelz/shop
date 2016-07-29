

// Added by the Spring Security Core plugin:
grails.plugin.springsecurity.userLookup.userDomainClassName = 'shopproject.User'
grails.plugin.springsecurity.userLookup.authorityJoinClassName = 'shopproject.UserRole'
grails.plugin.springsecurity.authority.className = 'shopproject.Role'
grails.plugin.springsecurity.securityConfigType = grails.plugin.springsecurity.SecurityConfigType.InterceptUrlMap
grails.plugin.springsecurity.interceptUrlMap = [
		[pattern: '/static/app/**',          access: ['permitAll']],
		[pattern: '/',               access: ['permitAll']],
		[pattern: '/assets/**',          access: ['permitAll']],
		[pattern: '/**',      access: ['permitAll']]
]


grails.plugin.springsecurity.rememberMe.persistent = false
grails.plugin.springsecurity.rest.login.useJsonCredentials = true
grails.plugin.springsecurity.rest.login.failureStatusCode = 401
grails.plugin.springsecurity.rest.token.storage.useGorm = true
grails.plugin.springsecurity.rest.token.storage.gorm.tokenDomainClassName = 'shopproject.AuthenticationToken'
grails.plugin.springsecurity.rest.token.storage.gorm.tokenValuePropertyName = 'token'
grails.plugin.springsecurity.rest.token.storage.gorm.usernamePropertyName = 'username'
grails.plugin.springsecurity.auth.loginFormUrl = '/static/app/index.html'