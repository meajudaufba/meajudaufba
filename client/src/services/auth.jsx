module.exports = {
    login(cpf, pass, cb) {
        cb = arguments[arguments.length - 1]
        if (localStorage.token) {
            if (cb) cb(true)
            this.onChange(true); 
            return
        }

        $.ajax({
            type: 'post',
            url: '/api/login',
            data: {cpf: cpf, password: pass},
            success: (res) => {
                console.log(res);
                if (res.success) {
                    localStorage.token = res.token
                    if (cb) cb(true)
                    this.onChange(true);
                } else {
                    if (cb) cb(false) 
                    this.onChange(false);
                }
            },
            error: (xhr, status, err) => {
                if (cb) cb(false)
                this.onChange(false);
            }
        });
    },

    getToken() {
        return localStorage.token
    },

    logout(cb) {
        delete localStorage.token
        if (cb) cb()
        this.onChange(false)
    },

    loggedIn() {
        return !!localStorage.token
    },

    onChange() {}
}
