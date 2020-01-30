class UserView {
    constructor(user) {
        let { id, avatar, email, location, name, username, time, points } = { ...user }
        this.id = id
        this.avatar = avatar
        this.email = email
        this.location = location
        this.name = name
        this.username = username
        this.time = time
        this.points = points
        //Object.assign(this, user)
    }
    render() {

        const html =
            `<div class = "user">
<img src = "${this.avatar}" alt = "Joined at ${(new Date(this.time)).toDateString()}" />
<div class = "info">
<h3>${this.username}</h3>
<span class = "points">⦿ ${this.points}</span>
</div>
</div>`
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        this.el = wrapper.firstChild;
        return this.el
    }
    update(time) {
    }
}
